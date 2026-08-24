import path from "node:path";

import { Result } from "better-result";
import fs from "fs-extra";

import type { Backend, Frontend, ProjectConfig } from "../../types";
import { AddonSetupError } from "../../utils/errors";

type EvlogBackend = Extract<Backend, "hono">;
type EvlogWebFrontend = Extract<Frontend, "next" | "tanstack-start">;

const evlogBackends = ["hono"] as const;
const evlogWebFrontends = ["next", "tanstack-start"] as const;
const NODE_DEV_FS_DRAIN_EXPRESSION =
  'process.env.NODE_ENV === "production" ? undefined : createFsDrain()';

function isEvlogBackend(backend: Backend): backend is EvlogBackend {
  return (evlogBackends as readonly Backend[]).includes(backend);
}

function getEvlogWebFrontend(frontends: Frontend[]): EvlogWebFrontend | undefined {
  return frontends.find((frontend): frontend is EvlogWebFrontend =>
    (evlogWebFrontends as readonly Frontend[]).includes(frontend),
  );
}

function shouldWireEvlogServerFsDrain(config: ProjectConfig) {
  return (
    isEvlogBackend(config.backend) &&
    config.runtime !== "workers" &&
    config.serverDeploy !== "cloudflare"
  );
}

function shouldWireEvlogWebFsDrain(config: ProjectConfig) {
  return getEvlogWebFrontend(config.frontend) !== undefined && config.webDeploy !== "cloudflare";
}

export function supportsEvlogLocalLogs(config: ProjectConfig) {
  return shouldWireEvlogServerFsDrain(config) || shouldWireEvlogWebFsDrain(config);
}

function shouldIdentifyWebAuth(config: ProjectConfig) {
  return config.auth === "better-auth" && config.backend === "self";
}

function getEvlogServerMiddlewareMarker(_backend: EvlogBackend, fsDrain: boolean) {
  const options = fsDrain ? `{ drain: ${NODE_DEV_FS_DRAIN_EXPRESSION} }` : "";

  return `app.use(evlog(${options}));`;
}

function findEvlogServerMiddlewareMarker(content: string, backend: EvlogBackend) {
  const fsDrainMarker = getEvlogServerMiddlewareMarker(backend, true);
  return content.includes(fsDrainMarker)
    ? fsDrainMarker
    : getEvlogServerMiddlewareMarker(backend, false);
}

function prependMissingImports(content: string, imports: string[]) {
  const missingImports = imports.filter((line) => !content.includes(line));
  if (missingImports.length === 0) return content;

  const importBlock = `${missingImports.join("\n")}\n`;
  const referenceMatch = content.match(/^(?:\/\/\/ <reference[^\n]*>\n)+/);
  if (referenceMatch) {
    return `${referenceMatch[0]}${importBlock}${content.slice(referenceMatch[0].length)}`;
  }

  return `${importBlock}${content}`;
}

function addNamedImport(content: string, moduleName: string, names: string[]) {
  const importRegex = new RegExp(
    `import \\{([^}]+)\\} from "${moduleName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}";`,
  );
  const match = content.match(importRegex);

  if (!match) {
    return prependMissingImports(content, [`import { ${names.join(", ")} } from "${moduleName}";`]);
  }

  const existingNames = match[1]
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  const nextNames = [...existingNames];

  for (const name of names) {
    if (!nextNames.includes(name)) {
      nextNames.push(name);
    }
  }

  return content.replace(match[0], `import { ${nextNames.join(", ")} } from "${moduleName}";`);
}

function insertBeforeOnce(
  content: string,
  marker: string,
  snippet: string,
  alreadyPresent: string,
) {
  if (content.includes(alreadyPresent)) return content;
  if (!content.includes(marker)) return content;
  return content.replace(marker, `${snippet}${marker}`);
}

function insertAfterOnce(content: string, marker: string, snippet: string, alreadyPresent: string) {
  if (content.includes(alreadyPresent)) return content;
  if (!content.includes(marker)) return content;
  return content.replace(marker, `${marker}${snippet}`);
}

async function writeFileIfChanged(filePath: string, content: string) {
  const existing = (await fs.pathExists(filePath))
    ? await fs.readFile(filePath, "utf-8")
    : undefined;
  if (existing === content) return;
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content);
}

async function updateFileIfExists(filePath: string, update: (content: string) => string) {
  if (!(await fs.pathExists(filePath))) return;
  const content = await fs.readFile(filePath, "utf-8");
  const nextContent = update(content);
  if (nextContent !== content) {
    await fs.writeFile(filePath, nextContent);
  }
}

function usesCreateAuthFactory(config: ProjectConfig) {
  return (
    config.runtime === "workers" ||
    config.serverDeploy === "cloudflare" ||
    (config.backend === "self" && config.webDeploy === "cloudflare")
  );
}

function getAuthImportLine(config: ProjectConfig) {
  return usesCreateAuthFactory(config)
    ? `import { createAuth } from "@${config.projectName}/auth";`
    : `import { auth } from "@${config.projectName}/auth";`;
}

function getAuthExpression(config: ProjectConfig) {
  return usesCreateAuthFactory(config) ? "createAuth()" : "auth";
}

function addAiSdkEvlogTelemetry(content: string, loggerExpression: string) {
  let nextContent = addNamedImport(content, "evlog/ai", [
    "createAILogger",
    "createEvlogIntegration",
  ]);

  if (!nextContent.includes("const ai = createAILogger(")) {
    nextContent = nextContent.replace(
      /^(\s*)const model = wrapLanguageModel\({/m,
      (_match, indent: string) =>
        `${indent}const ai = createAILogger(${loggerExpression});\n${indent}const model = wrapLanguageModel({`,
    );
  }

  if (!nextContent.includes("model: ai.wrap(model)")) {
    nextContent = nextContent.replace(
      /(const result = streamText\({\n\s*)model,/,
      "$1model: ai.wrap(model),",
    );
  }

  if (!nextContent.includes("createEvlogIntegration(ai)")) {
    nextContent = nextContent.replace(
      /^(\s*)(messages:\s*await convertToModelMessages\([^)]+\),?)/m,
      (_match, indent: string, messages: string) =>
        `${indent}${messages.endsWith(",") ? messages : `${messages},`}\n${indent}telemetry: {\n${indent}\tisEnabled: true,\n${indent}\tintegrations: [createEvlogIntegration(ai)],\n${indent}},`,
    );
  }

  return nextContent;
}

function addEvlogBetterAuthServerSetup(
  content: string,
  backend: EvlogBackend,
  authExpression: string,
) {
  let nextContent = addNamedImport(content, "evlog/better-auth", [
    "createAuthMiddleware",
    "type BetterAuthInstance",
  ]);
  const usesAuthFactory = authExpression.endsWith("()");
  const evlogAuthExpression = `${authExpression} as BetterAuthInstance`;
  const authOptions = '{ exclude: ["/api/auth/**"], maskEmail: true }';
  const identifySnippet = usesAuthFactory
    ? ""
    : `const identifyUser = createAuthMiddleware(${evlogAuthExpression}, ${authOptions});\n\n`;
  const identifyUserSetup = usesAuthFactory
    ? `\n\tconst identifyUser = createAuthMiddleware(${evlogAuthExpression}, ${authOptions});`
    : "";

  if (backend === "hono") {
    const evlogMarker = findEvlogServerMiddlewareMarker(nextContent, backend);
    nextContent = insertBeforeOnce(
      nextContent,
      "const app = new Hono",
      identifySnippet,
      "createAuthMiddleware(",
    );
    return insertAfterOnce(
      nextContent,
      evlogMarker,
      `\napp.use("*", async (c, next) => {${identifyUserSetup}\n\tawait identifyUser(c.get("log"), c.req.raw.headers, c.req.path);\n\tawait next();\n});`,
      'identifyUser(c.get("log")',
    );
  }

  return nextContent;
}

export function addEvlogServerSetup(
  content: string,
  backend: EvlogBackend,
  serviceName: string,
  fsDrain: boolean,
) {
  const initSnippet = `initLogger({\n\tenv: { service: "${serviceName}" },\n});\n\n`;
  const evlogMarker = getEvlogServerMiddlewareMarker(backend, fsDrain);
  const legacyEvlogMarker = getEvlogServerMiddlewareMarker(backend, false);

  if (backend === "hono") {
    let nextContent = prependMissingImports(content, [
      'import { initLogger } from "evlog";',
      'import { evlog, type EvlogVariables } from "evlog/hono";',
      ...(fsDrain ? ['import { createFsDrain } from "evlog/fs";'] : []),
    ]);
    nextContent = insertBeforeOnce(
      nextContent,
      "const app = new Hono",
      initSnippet,
      "initLogger({",
    );
    nextContent = nextContent.replace(
      "const app = new Hono();",
      "const app = new Hono<EvlogVariables>();",
    );
    nextContent = nextContent
      .replace('import { logger } from "hono/logger";\n', "")
      .replace(/\napp\.use\(logger\(\)\);/, "");
    if (fsDrain) {
      nextContent = nextContent.replace(legacyEvlogMarker, evlogMarker);
    }
    return insertAfterOnce(
      nextContent,
      "const app = new Hono<EvlogVariables>();",
      `\n\n${evlogMarker}`,
      evlogMarker,
    );
  }

  return content;
}

function addTanstackStartRootEvlogSetup(content: string) {
  let nextContent = prependMissingImports(content, [
    'import { createMiddleware } from "@tanstack/react-start";',
    'import { evlogErrorHandler } from "evlog/nitro/v3";',
  ]);

  const middlewareEntry = "createMiddleware().server(evlogErrorHandler)";
  if (nextContent.includes(`middleware: [${middlewareEntry}]`)) {
    return nextContent;
  }

  if (nextContent.includes("middleware: [")) {
    return nextContent.replace("middleware: [", `middleware: [${middlewareEntry}, `);
  }

  if (/server:\s*{/.test(nextContent)) {
    return nextContent.replace(
      /server:\s*{\n/,
      `server: {\n    middleware: [${middlewareEntry}],\n`,
    );
  }

  return nextContent.replace(
    "head: () => ({",
    `server: {\n    middleware: [${middlewareEntry}],\n  },\n\n  head: () => ({`,
  );
}

function addNextRouteWrappers(content: string) {
  let nextContent = prependMissingImports(content, ['import { withEvlog } from "@/lib/evlog";']);
  if (
    nextContent.includes("withEvlog(handler)") ||
    nextContent.includes("withEvlog(handleRequest)")
  ) {
    return nextContent;
  }

  nextContent = nextContent.replace(
    "export { handler as GET, handler as POST };",
    "export const GET = withEvlog(handler);\nexport const POST = withEvlog(handler);",
  );

  for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE"]) {
    nextContent = nextContent.replace(
      `export const ${method} = handleRequest;`,
      `export const ${method} = withEvlog(handleRequest);`,
    );
  }

  return nextContent;
}

function addNextAiEvlogSetup(content: string) {
  let nextContent = addNamedImport(content, "@/lib/evlog", ["withEvlog", "useLogger"]);

  if (!nextContent.includes("withEvlog(async (req: Request)")) {
    nextContent = nextContent.replace(
      "export async function POST(req: Request) {",
      "export const POST = withEvlog(async (req: Request) => {",
    );
    if (nextContent.includes("export const POST = withEvlog(async (req: Request) => {")) {
      nextContent = nextContent.replace(/\n}\s*$/, "\n});\n");
    }
  }

  return addAiSdkEvlogTelemetry(nextContent, "useLogger()");
}

function addTanstackStartAiEvlogSetup(content: string) {
  const nextContent = prependMissingImports(content, [
    'import type { RequestLogger } from "evlog";',
    'import { useRequest } from "nitro/context";',
  ]);

  return addAiSdkEvlogTelemetry(nextContent, "useRequest().context.log as RequestLogger");
}

function addBackendAiEvlogSetup(content: string, backend: EvlogBackend) {
  if (backend === "hono") {
    return addAiSdkEvlogTelemetry(content, 'c.get("log")');
  }

  return content;
}

function addNextBetterAuthToRoute(content: string) {
  let nextContent = addNamedImport(content, "@/lib/evlog-auth", ["identifyEvlogUser"]);

  nextContent = nextContent.replace("function handler(req:", "async function handler(req:");

  for (const marker of [
    "async function handler(req: NextRequest) {",
    "async function handleRequest(req: NextRequest) {",
    "export const POST = withEvlog(async (req: Request) => {",
  ]) {
    nextContent = insertAfterOnce(
      nextContent,
      marker,
      "\n\tawait identifyEvlogUser(req);",
      "identifyEvlogUser(req)",
    );
  }

  return nextContent;
}

function getNextEvlogFile(serviceName: string, fsDrain: boolean) {
  return `import { createEvlog } from "evlog/next";
import { createInstrumentation } from "evlog/next/instrumentation/create";
${fsDrain ? 'import { createFsDrain } from "evlog/fs";\n' : ""}

export const { withEvlog, useLogger, log, createError } = createEvlog({
  service: "${serviceName}",
${fsDrain ? `  drain: ${NODE_DEV_FS_DRAIN_EXPRESSION},\n` : ""}});

export const { register, onRequestError } = createInstrumentation({
  service: "${serviceName}",
});
`;
}

function getNitroEvlogDrainFile() {
  return `import { createFsDrain } from "evlog/fs";

export default defineNitroPlugin((nitroApp) => {
  if (!import.meta.dev) return;
  nitroApp.hooks.hook("evlog:drain", createFsDrain());
});
`;
}

function getNextInstrumentationFile() {
  return `import { defineNodeInstrumentation } from "evlog/next/instrumentation";

export const { register, onRequestError } = defineNodeInstrumentation(() => import("./src/lib/evlog"));
`;
}

function getNextProxyFile() {
  return `import { evlogMiddleware } from "evlog/next";

export const proxy = evlogMiddleware();

export const config = {
  matcher: ["/api/:path*"],
};
`;
}

function getNextEvlogAuthFile(config: ProjectConfig) {
  if (usesCreateAuthFactory(config)) {
    return `${getAuthImportLine(config)}
import { createAuthMiddleware, type BetterAuthInstance } from "evlog/better-auth";
import { useLogger } from "@/lib/evlog";

export async function identifyEvlogUser(request: Request) {
  const identifyUser = createAuthMiddleware(${getAuthExpression(config)} as BetterAuthInstance, {
    exclude: ["/api/auth/**"],
    maskEmail: true,
  });
  await identifyUser(useLogger(), request.headers, new URL(request.url).pathname);
}
`;
  }

  return `${getAuthImportLine(config)}
import { createAuthMiddleware, type BetterAuthInstance } from "evlog/better-auth";
import { useLogger } from "@/lib/evlog";

const identifyUser = createAuthMiddleware(${getAuthExpression(config)} as BetterAuthInstance, {
  exclude: ["/api/auth/**"],
  maskEmail: true,
});

export async function identifyEvlogUser(request: Request) {
  await identifyUser(useLogger(), request.headers, new URL(request.url).pathname);
}
`;
}

function getNitroEvlogAuthPluginFile(config: ProjectConfig) {
  if (usesCreateAuthFactory(config)) {
    return `${getAuthImportLine(config)}
import { createAuthIdentifier, type BetterAuthInstance } from "evlog/better-auth";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", async (event) => {
    const identify = createAuthIdentifier(${getAuthExpression(config)} as BetterAuthInstance, {
      exclude: ["/api/auth/**"],
      maskEmail: true,
    });
    await identify(event);
  });
});
`;
  }

  return `${getAuthImportLine(config)}
import { createAuthIdentifier, type BetterAuthInstance } from "evlog/better-auth";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook(
    "request",
    createAuthIdentifier(${getAuthExpression(config)} as BetterAuthInstance, {
      exclude: ["/api/auth/**"],
      maskEmail: true,
    }),
  );
});
`;
}

function getTanstackNitroConfigFile(serviceName: string) {
  return `import { defineConfig } from "nitro";
import evlog from "evlog/nitro/v3";

export default defineConfig({
  experimental: {
    asyncContext: true,
  },
  modules: [
    evlog({
      env: { service: "${serviceName}" },
    }),
  ],
});
`;
}

async function setupNextEvlog(config: ProjectConfig, serviceName: string) {
  const webDir = path.join(config.projectDir, "apps/web");
  const fsDrain = shouldWireEvlogWebFsDrain(config);

  const evlogPath = path.join(webDir, "src/lib/evlog.ts");
  if (!(await fs.pathExists(evlogPath))) {
    await writeFileIfChanged(evlogPath, getNextEvlogFile(serviceName, fsDrain));
  }

  const identifyWebAuth = shouldIdentifyWebAuth(config);

  if (identifyWebAuth) {
    const evlogAuthPath = path.join(webDir, "src/lib/evlog-auth.ts");
    if (!(await fs.pathExists(evlogAuthPath))) {
      await writeFileIfChanged(evlogAuthPath, getNextEvlogAuthFile(config));
    }
  }

  const instrumentationPath = path.join(webDir, "instrumentation.ts");
  if (!(await fs.pathExists(instrumentationPath))) {
    await writeFileIfChanged(instrumentationPath, getNextInstrumentationFile());
  }

  const proxyPath = path.join(webDir, "src/proxy.ts");
  const rootProxyPath = path.join(webDir, "proxy.ts");
  if (!(await fs.pathExists(proxyPath)) && !(await fs.pathExists(rootProxyPath))) {
    await writeFileIfChanged(proxyPath, getNextProxyFile());
  }

  const updateNextApiRoute = (content: string) => {
    let nextContent = addNextRouteWrappers(content);
    if (identifyWebAuth) {
      nextContent = addNextBetterAuthToRoute(nextContent);
    }
    return nextContent;
  };

  await updateFileIfExists(
    path.join(webDir, "src/app/api/trpc/[trpc]/route.ts"),
    updateNextApiRoute,
  );
  await updateFileIfExists(
    path.join(webDir, "src/app/api/rpc/[[...rest]]/route.ts"),
    updateNextApiRoute,
  );

  if (config.examples.includes("ai")) {
    await updateFileIfExists(path.join(webDir, "src/app/api/ai/route.ts"), (content) => {
      let nextContent = addNextAiEvlogSetup(content);
      if (identifyWebAuth) {
        nextContent = addNextBetterAuthToRoute(nextContent);
      }
      return nextContent;
    });
  }
}

async function setupTanstackStartEvlog(config: ProjectConfig, serviceName: string) {
  const webDir = path.join(config.projectDir, "apps/web");
  const fsDrain = shouldWireEvlogWebFsDrain(config);
  const nitroConfigPath = path.join(webDir, "nitro.config.ts");
  if (!(await fs.pathExists(nitroConfigPath))) {
    await writeFileIfChanged(nitroConfigPath, getTanstackNitroConfigFile(serviceName));
  }
  await updateFileIfExists(
    path.join(webDir, "src/routes/__root.tsx"),
    addTanstackStartRootEvlogSetup,
  );

  if (fsDrain) {
    const drainPath = path.join(webDir, "server/plugins/evlog-drain.ts");
    if (!(await fs.pathExists(drainPath))) {
      await writeFileIfChanged(drainPath, getNitroEvlogDrainFile());
    }
  }

  if (shouldIdentifyWebAuth(config)) {
    const authPluginPath = path.join(webDir, "server/plugins/evlog-auth.ts");
    if (!(await fs.pathExists(authPluginPath))) {
      await writeFileIfChanged(authPluginPath, getNitroEvlogAuthPluginFile(config));
    }
  }

  if (config.examples.includes("ai")) {
    await updateFileIfExists(
      path.join(webDir, "src/routes/api/ai/$.ts"),
      addTanstackStartAiEvlogSetup,
    );
  }
}

async function setupEvlogWeb(config: ProjectConfig) {
  const frontend = getEvlogWebFrontend(config.frontend);
  if (!frontend) return;

  const serviceName = `${config.projectName}-web`;

  if (frontend === "next") {
    await setupNextEvlog(config, serviceName);
  } else if (frontend === "tanstack-start") {
    await setupTanstackStartEvlog(config, serviceName);
  }
}

export async function setupEvlog(config: ProjectConfig): Promise<Result<void, AddonSetupError>> {
  return Result.tryPromise({
    try: async () => {
      if (isEvlogBackend(config.backend)) {
        const serverIndexPath = path.join(config.projectDir, "apps/server/src/index.ts");
        if (await fs.pathExists(serverIndexPath)) {
          const content = await fs.readFile(serverIndexPath, "utf-8");
          let nextContent = addEvlogServerSetup(
            content,
            config.backend,
            `${config.projectName}-server`,
            shouldWireEvlogServerFsDrain(config),
          );

          if (config.auth === "better-auth") {
            nextContent = addEvlogBetterAuthServerSetup(
              nextContent,
              config.backend,
              getAuthExpression(config),
            );
          }

          if (config.examples.includes("ai")) {
            nextContent = addBackendAiEvlogSetup(nextContent, config.backend);
          }

          if (nextContent !== content) {
            await fs.writeFile(serverIndexPath, nextContent);
          }
        }
      }

      await setupEvlogWeb(config);
    },
    catch: (error) =>
      new AddonSetupError({
        addon: "evlog",
        message: `Failed to set up evlog: ${error instanceof Error ? error.message : String(error)}`,
        cause: error,
      }),
  });
}
