import { usesAlchemyManagedDatabase, type ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

export function processAlchemyPlugins(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { webDeploy, frontend } = config;

  processManagedPrismaMigrations(vfs, config);

  if (webDeploy !== "cloudflare") return;

  if (frontend.includes("next")) {
    processNextAlchemy(vfs, config);
  } else if (frontend.includes("react-router")) {
    processReactRouterAlchemy(vfs);
  }
}

function processManagedPrismaMigrations(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (config.orm !== "prisma" || !["postgres", "mysql"].includes(config.database)) return;

  const migrationRoot = "packages/db/prisma/migrations";
  const generatedMigration = `${migrationRoot}/0000_init/migration.sql`;
  const migrationLock = `${migrationRoot}/migration_lock.toml`;
  const hasInitialModels = config.auth === "better-auth" || config.examples.includes("todo");

  if (!usesAlchemyManagedDatabase(config) || !hasInitialModels) {
    vfs.deleteFile(generatedMigration);
    vfs.deleteFile(migrationLock);
    return;
  }

  vfs.deleteFile(`${migrationRoot}/.gitkeep`);
}

function d1DatabasesBlock(config: ProjectConfig): string {
  if (config.dbSetup !== "d1") return "";
  const isPrisma = config.orm === "prisma";
  const migrationsDir = isPrisma
    ? "../../packages/db/prisma/migrations"
    : "../../packages/db/src/migrations";
  // prisma nests migrations as <timestamp>_<name>/migration.sql
  const pattern = isPrisma
    ? `,\n      "migrations_pattern": "${migrationsDir}/*/migration.sql"`
    : "";
  return `,
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "${config.projectName}-db-local",
      "database_id": "local",
      "migrations_dir": "${migrationsDir}"${pattern}
    }
  ]`;
}

// React Router's ssr build is a manifest, not a worker; these two files wrap it
// into a fetch handler (workers/app.ts, wired as the ssr rollup input by the
// vite config template) and render with web streams instead of node streams.
function processReactRouterAlchemy(vfs: VirtualFileSystem) {
  const webAppDir = "apps/web";

  const workerEntryPath = `${webAppDir}/workers/app.ts`;
  if (!vfs.exists(workerEntryPath)) {
    vfs.writeFile(
      workerEntryPath,
      `import { createRequestHandler } from "react-router";

const requestHandler = createRequestHandler(
	// @ts-expect-error - virtual module provided by React Router at build time
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

export default {
	fetch(request: Request) {
		return requestHandler(request);
	},
};
`,
    );
  }

  const entryServerPath = `${webAppDir}/src/entry.server.tsx`;
  if (!vfs.exists(entryServerPath)) {
    vfs.writeFile(
      entryServerPath,
      `import type { EntryContext, RouterContextProvider } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";

export const streamTimeout = 5_000;

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	routerContext: EntryContext,
	_loadContext: RouterContextProvider,
) {
	// https://httpwg.org/specs/rfc9110.html#HEAD
	if (request.method.toUpperCase() === "HEAD") {
		return new Response(null, {
			status: responseStatusCode,
			headers: responseHeaders,
		});
	}

	let shellRendered = false;
	let userAgent = request.headers.get("user-agent");

	const body = await renderToReadableStream(
		<ServerRouter context={routerContext} url={request.url} />,
		{
			signal: AbortSignal.timeout(streamTimeout + 1000),
			onError(error: unknown) {
				responseStatusCode = 500;
				// Log streaming rendering errors from inside the shell. Don't log
				// errors encountered during initial shell rendering since they'll
				// reject and get logged in handleDocumentRequest.
				if (shellRendered) {
					console.error(error);
				}
			},
		},
	);
	shellRendered = true;

	// Ensure requests from bots and SPA Mode renders wait for all content to load before responding
	// https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
	if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
		await body.allReady;
	}

	responseHeaders.set("Content-Type", "text/html");
	return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
`,
    );
  }
}

// OpenNext builds the Worker artifact that packages/infra deploys with
// `bundle: false`; it reads wrangler.jsonc for the worker/assets layout.
function processNextAlchemy(vfs: VirtualFileSystem, config: ProjectConfig) {
  const webAppDir = "apps/web";

  const openNextConfigPath = `${webAppDir}/open-next.config.ts`;
  if (!vfs.exists(openNextConfigPath)) {
    const openNextConfigContent = `import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
`;
    vfs.writeFile(openNextConfigPath, openNextConfigContent);
  }

  const wranglerConfigPath = `${webAppDir}/wrangler.jsonc`;
  if (!vfs.exists(wranglerConfigPath)) {
    const wranglerConfigContent = `{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "${config.projectName}-web",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-05-05",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "images": {
    "binding": "IMAGES"
  }${config.backend === "self" ? d1DatabasesBlock(config) : ""}
}
`;
    vfs.writeFile(wranglerConfigPath, wranglerConfigContent);
    if (config.backend === "self" && config.dbSetup === "d1") {
      addLocalD1MigrateScript(vfs);
    }
  }

  const webPkgPath = `${webAppDir}/package.json`;
  if (vfs.exists(webPkgPath)) {
    const raw = vfs.readFile(webPkgPath);
    if (raw) {
      const pkg = JSON.parse(raw);
      pkg.scripts = pkg.scripts ?? {};
      if (!pkg.scripts["build:cloudflare"]) {
        pkg.scripts["build:cloudflare"] = "opennextjs-cloudflare build";
      }
      vfs.writeFile(webPkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    }
  }
}

function addLocalD1MigrateScript(vfs: VirtualFileSystem) {
  const webPkgPath = "apps/web/package.json";
  if (!vfs.exists(webPkgPath)) return;
  const raw = vfs.readFile(webPkgPath);
  if (!raw) return;
  const pkg = JSON.parse(raw);
  pkg.scripts = pkg.scripts ?? {};
  if (!pkg.scripts["db:migrate:local"]) {
    pkg.scripts["db:migrate:local"] = "wrangler d1 migrations apply DB --local";
    vfs.writeFile(webPkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  }
}
