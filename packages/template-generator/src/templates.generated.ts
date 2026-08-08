// Auto-generated - DO NOT EDIT
// Run 'bun run generate-templates' to regenerate

export const EMBEDDED_TEMPLATES: Map<string, string> = new Map([
  ["addons/biome/biome.json.hbs", `{
    "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
	"vcs": {
		"enabled": false,
		"clientKind": "git",
		"useIgnoreFile": false
	},
	"files": {
		"ignoreUnknown": false,
		"includes": [
			"**",
			"!**/.next",
			"!**/dist",
			"!**/.turbo",
			"!**/.nx",
			"!**/dev-dist",
			"!**/.zed",
			"!**/.vscode",
			"!**/routeTree.gen.ts",
			"!**/src-tauri",
			"!**/.nuxt",
			"!bts.jsonc",
			"!**/.expo",
			"!**/.wrangler",
			"!**/.alchemy",
			"!**/.svelte-kit",
			"!**/wrangler.jsonc",
			"!**/.source",
		]
	},
	"formatter": {
		"enabled": true,
		"indentStyle": "tab"
	},
	"assist": { "actions": { "source": { "organizeImports": "on" } } },
	"linter": {
		"enabled": true,
		"rules": {
			"recommended": true,
			"correctness": {
				"useExhaustiveDependencies": "info"
			},
			"nursery": {
				"useSortedClasses": {
					"level": "warn",
					"fix": "safe",
					"options": {
						"functions": ["clsx", "cva", "cn"]
					}
				}
			},
			"style": {
				"noParameterAssign": "error",
				"useAsConstAssertion": "error",
				"useDefaultParameterLast": "error",
				"useEnumInitializers": "error",
				"useSelfClosingElements": "error",
				"useSingleVarDeclarator": "error",
				"noUnusedTemplateLiteral": "error",
				"useNumberNamespace": "error",
				"noInferrableTypes": "error",
				"noUselessElse": "error"
			}
		}
	},
	"javascript": {
		"formatter": {
			"quoteStyle": "double"
		}
	},
	"css": {
		"parser": {
			"tailwindDirectives": true
		}
	}

}
`],
  ["addons/electrobun/apps/desktop/.gitignore", `artifacts
`],
  ["addons/electrobun/apps/desktop/electrobun.config.ts.hbs", `import type { ElectrobunConfig } from "electrobun";

const webBuildDir =
  "{{#if (includes frontend "react-router")}}../web/build/client{{else if (includes frontend "tanstack-start")}}../web/dist/client{{else if (includes frontend "next")}}../web/out{{else}}../web/dist{{/if}}";

export default {
  app: {
    name: "{{projectName}}",
    identifier: "dev.bettertstack.{{projectName}}.desktop",
    version: "0.0.1",
  },
  runtime: {
    exitOnLastWindowClosed: true,
  },
  build: {
    bun: {
      entrypoint: "src/bun/index.ts",
    },
    copy: {
      [webBuildDir]: "views/mainview",
    },
    watchIgnore: [\`\${webBuildDir}/**\`],
    mac: {
      bundleCEF: true,
      defaultRenderer: "cef",
    },
    linux: {
      bundleCEF: true,
      defaultRenderer: "cef",
    },
    win: {
      bundleCEF: true,
      defaultRenderer: "cef",
    },
  },
} satisfies ElectrobunConfig;
`],
  ["addons/electrobun/apps/desktop/package.json.hbs", `{
  "name": "desktop",
  "private": true,
  "type": "module",
  "scripts": {},
  "dependencies": {
    "electrobun": "^1.18.1"
  },
  "devDependencies": {
    "@types/bun": "^1.3.14",
    "@types/three": "^0.185.1",
    "concurrently": "^10.0.4",
    "typescript": "^6.0.3"
  }
}
`],
  ["addons/electrobun/apps/desktop/src/bun/index.ts.hbs", `import { BrowserWindow, Updater } from "electrobun/bun";

const DEV_SERVER_PORT = ;
const DEV_SERVER_URL = \`http://localhost:\${DEV_SERVER_PORT}\`;

async function getMainViewUrl(): Promise<string> {
  const channel = await Updater.localInfo.channel();
  if (channel === "dev") {
    try {
      await fetch(DEV_SERVER_URL, { method: "HEAD" });
      console.log(\`HMR enabled: Using web dev server at \${DEV_SERVER_URL}\`);
      return DEV_SERVER_URL;
    } catch {
      console.log(
        "Web dev server not running. Run dev:hmr for live reload.",
      );
    }
  }

  return "views://mainview/index.html";
}

const url = await getMainViewUrl();

new BrowserWindow({
  title: "{{projectName}}",
  url,
  frame: {
    width: 1280,
    height: 820,
    x: 120,
    y: 120,
  },
});

console.log("Electrobun desktop shell started.");
`],
  ["addons/electrobun/apps/desktop/tsconfig.json.hbs", `{
  "extends": "../../packages/config/tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ESNext", "DOM"],
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "electrobun.config.ts"]
}
`],
  ["addons/husky/.husky/pre-commit", `lint-staged
`],
  ["addons/lefthook/lefthook.yml.hbs", `# Lefthook configuration
# https://github.com/evilmartians/lefthook

pre-commit:
  parallel: true
  jobs:
{{#if (includes addons "biome")}}
    - name: biome
      glob: "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}"
      run: {{packageManager}} biome check --write --no-errors-on-unmatched --files-ignore-unknown=true {staged_files}
      stage_fixed: true
{{else if (includes addons "oxlint")}}
    - name: oxlint
      run: {{packageManager}} oxlint --fix {staged_files}
      stage_fixed: true
    - name: oxfmt
      run: {{packageManager}} oxfmt --write {staged_files}
      stage_fixed: true
{{else if (includes addons "vite-plus")}}
    - name: vite-plus
      run: {{packageManager}} vp staged
      stage_fixed: true
{{else}}
    # Add your pre-commit commands here
    # Example:
    # - name: lint
    #   run: {{packageManagerRunCmd}} lint
{{/if}}
`],
  ["addons/pwa/apps/web/next/public/favicon/apple-touch-icon.png", `[Binary file]`],
  ["addons/pwa/apps/web/next/public/favicon/favicon-96x96.png", `[Binary file]`],
  ["addons/pwa/apps/web/next/public/favicon/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="92" height="92"><svg width="92" height="92" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="8" width="76" height="76" rx="12" fill="#F5EEFF" stroke="#B79AFF" stroke-width="3"></rect>
  <text x="46" y="56" text-anchor="middle" font-family="monospace" font-size="40" fill="#8F5BFF">$<tspan dx="0" dy="0">_</tspan></text>
</svg><style>@media (prefers-color-scheme: light) { :root { filter: none; } }
@media (prefers-color-scheme: dark) { :root { filter: none; } }
</style></svg>`],
  ["addons/pwa/apps/web/next/public/favicon/site.webmanifest.hbs", `{
	"name": "{{projectName}}",
	"short_name": "{{projectName}}",
	"icons": [
		{
			"src": "/web-app-manifest-192x192.png",
			"sizes": "192x192",
			"type": "image/png",
			"purpose": "maskable"
		},
		{
			"src": "/web-app-manifest-512x512.png",
			"sizes": "512x512",
			"type": "image/png",
			"purpose": "maskable"
		}
	],
	"theme_color": "#ffffff",
	"background_color": "#ffffff",
	"display": "standalone"
}
`],
  ["addons/pwa/apps/web/next/public/favicon/web-app-manifest-192x192.png", `[Binary file]`],
  ["addons/pwa/apps/web/next/public/favicon/web-app-manifest-512x512.png", `[Binary file]`],
  ["addons/pwa/apps/web/next/src/app/manifest.ts.hbs", `import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "{{projectName}}",
		short_name: "{{projectName}}",
		description:
			"my pwa app",
		start_url: "/new",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#000000",
		icons: [
			{
				src: "/favicon/web-app-manifest-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/favicon/web-app-manifest-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
`],
  ["addons/pwa/apps/web/vite/public/logo.png", `[Binary file]`],
  ["addons/pwa/apps/web/vite/pwa-assets.config.ts.hbs", `import {
  defineConfig,
  minimal2023Preset as preset,
} from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset,
  images: ["public/logo.png"],
});
`],
  ["api/orpc/fullstack/next/src/app/api/rpc/[[...rest]]/route.ts.hbs", `import { createContext } from "@{{projectName}}/api/context";
import { appRouter } from "@{{projectName}}/api/routers/index";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { RPCHandler } from "@orpc/server/fetch";
import { onError } from "@orpc/server";
import { NextRequest } from "next/server";

const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});
const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

async function handleRequest(req: NextRequest) {
	const rpcResult = await rpcHandler.handle(req, {
		prefix: "/api/rpc",
		context: await createContext(req),
	});
	if (rpcResult.response) return rpcResult.response;

	const apiResult = await apiHandler.handle(req, {
		prefix: "/api/rpc/api-reference",
		context: await createContext(req),
	});
	if (apiResult.response) return apiResult.response;

	return new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;`],
  ["api/orpc/fullstack/tanstack-start/src/routes/api/rpc/$.ts.hbs", `import { createContext } from "@{{projectName}}/api/context";
import { appRouter } from "@{{projectName}}/api/routers/index";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { RPCHandler } from "@orpc/server/fetch";
import { onError } from "@orpc/server";
import { createFileRoute } from "@tanstack/react-router";

const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

async function handle({ request }: { request: Request }) {
	const rpcResult = await rpcHandler.handle(request, {
		prefix: "/api/rpc",
		context: await createContext({ req: request }),
	});
	if (rpcResult.response) return rpcResult.response;

	const apiResult = await apiHandler.handle(request, {
		prefix: "/api/rpc/api-reference",
		context: await createContext({ req: request }),
	});
	if (apiResult.response) return apiResult.response;

	return new Response("Not found", { status: 404 });
}

export const Route = createFileRoute('/api/rpc/$')({
  server: {
    handlers: {
      HEAD: handle,
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle,
    },
  },
})`],
  ["api/orpc/native/utils/orpc.ts.hbs", `import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import type { AppRouterClient } from "@{{projectName}}/api/routers/index";
import { env } from "@{{projectName}}/env/native";
{{#if (eq auth "better-auth")}}
import { authClient } from "@/lib/auth-client";
import { Platform } from "react-native";
{{/if}}

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			console.log(error)
		},
	}),
});

async function expoFetch(request: Request, init?: RequestInit) {
	const { fetch } = await import("expo/fetch");

	return fetch(request.url, {
		body: await request.blob(),
		headers: request.headers,
		method: request.method,
		signal: request.signal,
		...init,
	});
}

export const link = new RPCLink({
{{#if (eq backend "self")}}
{{#if (or (includes frontend "next") (includes frontend "tanstack-start"))}}
	url: \`\${env.EXPO_PUBLIC_SERVER_URL}/api/rpc\`,
{{else}}
	url: \`\${env.EXPO_PUBLIC_SERVER_URL}/rpc\`,
{{/if}}
{{else}}
	url: \`\${env.EXPO_PUBLIC_SERVER_URL}/rpc\`,
{{/if}}
{{#if (eq auth "better-auth")}}
	fetch(request, init) {
		return expoFetch(request, {
			...init,
			// Better Auth Expo forwards the session cookie manually on native.
			credentials: Platform.OS === "web" ? "include" : "omit",
		});
	},
	headers() {
		if (Platform.OS === "web") {
			return {};
		}
		const headers = new Map<string, string>();
		const cookies = authClient.getCookie();
		if (cookies) {
			headers.set("Cookie", cookies);
		}
		return Object.fromEntries(headers);
	},
{{else}}
	fetch: expoFetch,
{{/if}}
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
`],
  ["api/orpc/server/_gitignore", `# dependencies (bun install)
node_modules

# output
out
dist
*.tgz

# code coverage
coverage
*.lcov

# logs
logs
_.log
report.[0-9]_.[0-9]_.[0-9]_.[0-9]_.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# caches
.eslintcache
.cache
*.tsbuildinfo

# IntelliJ based IDEs
.idea

# Finder (MacOS) folder config
.DS_Store
`],
  ["api/orpc/server/package.json.hbs", `{
  "name": "@{{projectName}}/api",
  "exports": {
    ".": {
      "default": "./src/index.ts"
    },
    "./*": {
      "default": "./src/*.ts"
    }
  },
  "type": "module",
  "scripts": {},
  "devDependencies": {},
  "dependencies": {}
}`],
  ["api/orpc/server/src/context.ts.hbs", `
{{#if (and (eq backend 'self') (includes frontend "next"))}}
import type { NextRequest } from "next/server";
{{#if (eq auth "better-auth")}}
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
import { createAuth } from "@{{projectName}}/auth";
{{else}}
import { auth } from "@{{projectName}}/auth";
{{/if}}
{{/if}}

export async function createContext({{#if (eq auth "none")}}_req{{else}}req{{/if}}: NextRequest) {
{{#if (eq auth "better-auth")}}
	const session = await {{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}createAuth(){{else}}auth{{/if}}.api.getSession({
		headers: req.headers,
	});
	return {
		auth: null,
		session,
	};
{{else}}
	return {
		auth: null,
		session: null,
	};
{{/if}}
}

{{else if (and (eq backend 'self') (includes frontend "tanstack-start"))}}
{{#if (eq auth "better-auth")}}
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
import { createAuth } from "@{{projectName}}/auth";
{{else}}
import { auth } from "@{{projectName}}/auth";
{{/if}}
{{/if}}

export async function createContext({{#if (eq auth "none")}}_options{{else}}{ req }{{/if}}: { req: Request }) {
{{#if (eq auth "better-auth")}}
	const session = await {{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}createAuth(){{else}}auth{{/if}}.api.getSession({
		headers: req.headers,
	});
	return {
		auth: null,
		session,
	};
{{else}}
	return {
		auth: null,
		session: null,
	};
{{/if}}
}

{{else if (eq backend 'hono')}}
import type { Context as HonoContext } from "hono";
{{#if (eq auth "better-auth")}}
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
import { createAuth } from "@{{projectName}}/auth";
{{else}}
import { auth } from "@{{projectName}}/auth";
{{/if}}
{{/if}}

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createContext({{#if (eq auth "none")}}_options{{else}}{ context }{{/if}}: CreateContextOptions) {
{{#if (eq auth "better-auth")}}
	const session = await {{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}createAuth(){{else}}auth{{/if}}.api.getSession({
		headers: context.req.raw.headers,
	});
	return {
		auth: null,
		session,
	};
{{else}}
	return {
		auth: null,
		session: null,
	};
{{/if}}
}

{{else}}
export async function createContext() {
	return {
		auth: null,
		session: null,
	};
}
{{/if}}

export type Context = Awaited<ReturnType<typeof createContext>>;
`],
  ["api/orpc/server/src/index.ts.hbs", `import { os } from "@orpc/server";
import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

`],
  ["api/orpc/server/src/routers/index.ts.hbs", `{{#if (eq api "orpc")}}
import { publicProcedure } from "../index";
import type { RouterClient } from "@orpc/server";
{{#if (includes examples "todo")}}
import { todoRouter } from "./todo";
{{/if}}

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),

  {{#if (includes examples "todo")}}
  todo: todoRouter,
  {{/if}}
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
{{else}}
export const appRouter = {};
export type AppRouter = typeof appRouter;
{{/if}}
`],
  ["api/orpc/server/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "composite": true
  }
}`],
  ["api/orpc/web/react/base/src/utils/orpc.ts.hbs", `import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
{{#if (and (includes frontend "tanstack-start") (eq backend "self"))}}
import { createRouterClient } from "@orpc/server";
import type { RouterClient } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { appRouter } from "@{{projectName}}/api/routers/index";
import { createContext } from "@{{projectName}}/api/context";
{{else if (includes frontend "tanstack-start")}}
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "@{{projectName}}/api/routers/index";
import { env } from "@{{projectName}}/env/web";

{{else}}
import type { AppRouterClient } from "@{{projectName}}/api/routers/index";
{{#unless (eq backend "self")}}
import { env } from "@{{projectName}}/env/web";
{{/unless}}

{{/if}}

export function createQueryClient() {
	return new QueryClient({
		queryCache: new QueryCache({
			onError: (error, query) => {
				toast.error(\`Error: \${error.message}\`, {
					action: {
						label: "retry",
						onClick: () => {
							query.invalidate();
						},
					},
				});
			},
		}),
{{#if (includes frontend "tanstack-start")}}
		defaultOptions: { queries: { staleTime: 60 * 1000 } },
{{/if}}
	});
}

{{#unless (includes frontend "tanstack-start")}}
export const queryClient = createQueryClient();
{{/unless}}

{{#unless (eq backend "self")}}
{{> getServerUrl}}

{{/unless}}
{{#if (and (includes frontend "tanstack-start") (eq backend "self"))}}
const getORPCClient = createIsomorphicFn()
	.server(() =>
		createRouterClient(appRouter, {
			context: async () => {
				return createContext({ req: getRequest() });
			},
		}),
	)
	.client((): RouterClient<typeof appRouter> => {
			const link = new RPCLink({
			url: \`\${window.location.origin}/api/rpc\`,
{{#if (eq auth "better-auth")}}
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
{{/if}}
		});

		return createORPCClient(link);
	});

export const client: RouterClient<typeof appRouter> = getORPCClient();
{{else if (includes frontend "tanstack-start")}}
const link = new RPCLink({
	url: \`\${getServerUrl(env.VITE_SERVER_URL)}/rpc\`,

{{#if (eq auth "better-auth")}}
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: "include",
		});
	},
{{/if}}
});

const getORPCClient = () => {
	return createORPCClient(link) as RouterClient<AppRouter>;
};

export const client: RouterClient<AppRouter> = getORPCClient();
{{else}}
export const link = new RPCLink({
{{#if (and (eq backend "self") (includes frontend "next"))}}
	url: \`\${typeof window !== "undefined" ? window.location.origin : "http://localhost:3001"}/api/rpc\`,
{{else if (includes frontend "next")}}
	url: \`\${getServerUrl(env.NEXT_PUBLIC_SERVER_URL)}/rpc\`,
{{else}}
	url: \`\${getServerUrl(env.VITE_SERVER_URL)}/rpc\`,
{{/if}}

{{#if (eq auth "better-auth")}}
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: "include",
		});
	},
{{#if (includes frontend "next")}}
	headers: async () => {
		if (typeof window !== "undefined") {
			return {}
		}

		const { headers } = await import("next/headers")
		return Object.fromEntries(await headers())
	},
{{/if}}
{{/if}}
});

export const client: AppRouterClient = createORPCClient(link)
{{/if}}

export const orpc = createTanstackQueryUtils(client)
`],
  ["auth/better-auth/fullstack/next/src/app/api/auth/[...all]/route.ts.hbs", `{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
import { createAuth } from "@{{projectName}}/auth";
{{else}}
import { auth } from "@{{projectName}}/auth";
{{/if}}
import { toNextJsHandler } from "better-auth/next-js";

{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
export async function GET(request: Request) {
	return toNextJsHandler(createAuth()).GET(request);
}

export async function POST(request: Request) {
	return toNextJsHandler(createAuth()).POST(request);
}
{{else}}
export const { GET, POST } = toNextJsHandler(auth);
{{/if}}
`],
  ["auth/better-auth/fullstack/tanstack-start/src/routes/api/auth/$.ts.hbs", `{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
import { createAuth } from '@{{projectName}}/auth'
{{else}}
import { auth } from '@{{projectName}}/auth'
{{/if}}
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => {
        {{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
        const auth = createAuth()
        {{/if}}
        return auth.handler(request)
      },
      POST: ({ request }) => {
        {{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
        const auth = createAuth()
        {{/if}}
        return auth.handler(request)
      },
    },
  },
})
`],
  ["auth/better-auth/native/bare/app/(drawer)/index.tsx.hbs", `import { Button, Column, Host, Text as ExpoUIText } from "@expo/ui";
import { View, ScrollView, StyleSheet } from "react-native";

import { Container } from "@/components/container";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import { authClient } from "@/lib/auth-client";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { queryClient, orpc } from "@/utils/orpc";
{{/if}}

export default function Home() {
const { colorScheme } = useColorScheme();
const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
{{#if (eq api "orpc")}}
const healthCheck = useQuery(orpc.healthCheck.queryOptions());
const privateData = useQuery(orpc.privateData.queryOptions());
const isConnected = healthCheck?.data === "OK";
const isLoading = healthCheck?.isLoading;
{{/if}}

const { data: session } = authClient.useSession();

return (
<Container>
  <ScrollView style={styles.scrollView} contentInsetAdjustmentBehavior="never">
    <View style={styles.content}>
      <Host style={styles.titleHost}>
        <ExpoUIText
          textStyle=\\{{ color: theme.text, fontSize: 24, fontWeight: "bold", textAlign: "center" }}
        >
          BETTER T STACK
        </ExpoUIText>
      </Host>

      {session?.user ? (
      <View style={[styles.userCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Host style={styles.userHeader} matchContents=\\{{ vertical: true }}>
          <Column spacing={8}>
            <ExpoUIText textStyle=\\{{ color: theme.text, fontSize: 16 }}>
              {\`Welcome, \${session.user.name}\`}
            </ExpoUIText>
            <ExpoUIText
              textStyle=\\{{ color: theme.text, fontSize: 14 }}
              style=\\{{ opacity: 0.7 }}
            >
              {session.user.email}
            </ExpoUIText>
          </Column>
        </Host>
        <Host matchContents=\\{{ vertical: true }}>
          <Button
            label="Sign Out"
            variant="outlined"
            onPress={() => {
              authClient.signOut();
              {{#if (eq api "orpc")}}
              queryClient.invalidateQueries();
              {{/if}}

            }}
          />
        </Host>

      </View>
      ) : null}

      {{#unless (eq api "none")}}
      <View style={[styles.statusCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Host style={styles.cardTitleHost} matchContents=\\{{ vertical: true }}>
          <ExpoUIText
            textStyle=\\{{ color: theme.text, fontSize: 16, fontWeight: "bold" }}
          >
            System Status
          </ExpoUIText>
        </Host>
        <View style={styles.statusRow}>
          <View style={[styles.statusIndicator, { backgroundColor: isConnected ? "#10b981" : "#ef4444" }]} />
          <View style={styles.statusContent}>
            <Host matchContents=\\{{ vertical: true }}>
              <Column spacing={4}>
                <ExpoUIText
                  textStyle=\\{{ color: theme.text, fontSize: 14, fontWeight: "bold" }}
                >
                  {{#if (eq api "orpc")}}ORPC{{else}}TRPC{{/if}} Backend
                </ExpoUIText>
                <ExpoUIText
                  textStyle=\\{{ color: theme.text, fontSize: 12 }}
                  style=\\{{ opacity: 0.7 }}
                >
                  {isLoading
                  ? "Checking connection..."
                  : isConnected
                  ? "Connected to API"
                  : "API Disconnected"}
                </ExpoUIText>
              </Column>
            </Host>
          </View>
        </View>
      </View>

      <View style={[styles.privateDataCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Host style={styles.cardTitleHost} matchContents=\\{{ vertical: true }}>
          <ExpoUIText
            textStyle=\\{{ color: theme.text, fontSize: 16, fontWeight: "bold" }}
          >
            Private Data
          </ExpoUIText>
        </Host>
        {privateData && (
        <Host matchContents=\\{{ vertical: true }}>
          <ExpoUIText
            textStyle=\\{{ color: theme.text, fontSize: 14 }}
            style=\\{{ opacity: 0.7 }}
          >
            {privateData.data?.message ?? ""}
          </ExpoUIText>
        </Host>
        )}
      </View>
      {{/unless}}

      {!session?.user && (
      <>
        <SignIn />
        <SignUp />
      </>
      )}
    </View>
  </ScrollView>
</Container>
);
}

const styles = StyleSheet.create({
scrollView: {
flex: 1,
},
content: {
paddingHorizontal: 20,
paddingTop: 28,
paddingBottom: 32,
},
titleHost: {
alignSelf: "stretch",
height: 34,
marginBottom: 24,
},
userCard: {
marginBottom: 16,
padding: 16,
borderWidth: 1,
borderRadius: 16,
},
userHeader: {
marginBottom: 8,
},
paymentActions: {
marginTop: 12,
},
statusCard: {
marginBottom: 16,
padding: 16,
borderWidth: 1,
borderRadius: 16,
},
cardTitleHost: {
marginBottom: 12,
},
statusRow: {
flexDirection: "row",
alignItems: "center",
gap: 8,
},
statusIndicator: {
height: 8,
width: 8,
},
statusContent: {
flex: 1,
},
privateDataCard: {
marginBottom: 16,
padding: 16,
borderWidth: 1,
borderRadius: 16,
},
});
`],
  ["auth/better-auth/native/bare/components/sign-in.tsx.hbs", `import { authClient } from "@/lib/auth-client";

{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";
import z from "zod";

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Use at least 8 characters"),
});

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    for (const issue of error) {
      const message = getErrorMessage(issue);
      if (message) {
        return message;
      }
    }
    return null;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: unknown };
    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }
  }

  return null;
}

function SignIn() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.signIn.email(
        {
          email: value.email.trim(),
          password: value.password,
        },
        {
          onError(error) {
            setError(error.error?.message || "Failed to sign in");
          },
          onSuccess() {
            setError(null);
            formApi.reset();
            {{#if (eq api "orpc")}}
            queryClient.refetchQueries();
            {{/if}}

          },
        },
      );
    },
  });

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          validationError: getErrorMessage(state.errorMap.onSubmit),
        })}
      >
        {({ isSubmitting, validationError }) => {
          const formError = error ?? validationError;

          return (
            <>
              {formError ? (
                <View style={[styles.errorContainer, { backgroundColor: theme.notification + "20" }]}>
                  <Text style={[styles.errorText, { color: theme.notification }]}>{formError}</Text>
                </View>
              ) : null}

              <form.Field name="email">
                {(field) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.background,
                      },
                    ]}
                    placeholder="Email"
                    placeholderTextColor={theme.text}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={(value) => {
                      field.handleChange(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.background,
                      },
                    ]}
                    placeholder="Password"
                    placeholderTextColor={theme.text}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={(value) => {
                      field.handleChange(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                    secureTextEntry
                    onSubmitEditing={form.handleSubmit}
                  />
                )}
              </form.Field>

              <TouchableOpacity
                onPress={form.handleSubmit}
                disabled={isSubmitting}
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.primary,
                    opacity: isSubmitting ? 0.5 : 1,
                  },
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </>
          );
        }}
      </form.Subscribe>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  errorContainer: {
    marginBottom: 12,
    padding: 8,
  },
  errorText: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export { SignIn };
`],
  ["auth/better-auth/native/bare/components/sign-up.tsx.hbs", `import { authClient } from "@/lib/auth-client";

{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";
import z from "zod";

const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Use at least 8 characters"),
});

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    for (const issue of error) {
      const message = getErrorMessage(issue);
      if (message) {
        return message;
      }
    }
    return null;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: unknown };
    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }
  }

  return null;
}

function SignUp() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.signUp.email(
        {
          name: value.name.trim(),
          email: value.email.trim(),
          password: value.password,
        },
        {
          onError(error) {
            setError(error.error?.message || "Failed to sign up");
          },
          onSuccess() {
            setError(null);
            formApi.reset();
            {{#if (eq api "orpc")}}
            queryClient.refetchQueries();
            {{/if}}

          },
        },
      );
    },
  });

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          validationError: getErrorMessage(state.errorMap.onSubmit),
        })}
      >
        {({ isSubmitting, validationError }) => {
          const formError = error ?? validationError;

          return (
            <>
              {formError ? (
                <View style={[styles.errorContainer, { backgroundColor: theme.notification + "20" }]}>
                  <Text style={[styles.errorText, { color: theme.notification }]}>{formError}</Text>
                </View>
              ) : null}

              <form.Field name="name">
                {(field) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.background,
                      },
                    ]}
                    placeholder="Name"
                    placeholderTextColor={theme.text}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={(value) => {
                      field.handleChange(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                  />
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.background,
                      },
                    ]}
                    placeholder="Email"
                    placeholderTextColor={theme.text}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={(value) => {
                      field.handleChange(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.background,
                      },
                    ]}
                    placeholder="Password"
                    placeholderTextColor={theme.text}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={(value) => {
                      field.handleChange(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                    secureTextEntry
                    onSubmitEditing={form.handleSubmit}
                  />
                )}
              </form.Field>

              <TouchableOpacity
                onPress={form.handleSubmit}
                disabled={isSubmitting}
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.primary,
                    opacity: isSubmitting ? 0.5 : 1,
                  },
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </>
          );
        }}
      </form.Subscribe>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  errorContainer: {
    marginBottom: 12,
    padding: 8,
  },
  errorText: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export { SignUp };
`],
  ["auth/better-auth/native/base/lib/auth-client.ts.hbs", `import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { env } from "@{{projectName}}/env/native";

export const authClient = createAuthClient({
	baseURL: env.EXPO_PUBLIC_SERVER_URL,
	plugins: [
		expoClient({
			scheme: Constants.expoConfig?.scheme as string,
			storagePrefix: Constants.expoConfig?.scheme as string,
			storage: SecureStore,
		}),
	],
});

`],
  ["auth/better-auth/native/unistyles/app/(drawer)/index.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { queryClient, orpc } from "@/utils/orpc";
{{/if}}

export default function Home() {
    {{#if (eq api "orpc")}}
    const healthCheck = useQuery(orpc.healthCheck.queryOptions());
    const privateData = useQuery(orpc.privateData.queryOptions());
    {{/if}}

  const { data: session } = authClient.useSession();

  return (
    <Container>
      <ScrollView>
        <View style={styles.pageContainer}>
          <Text style={styles.headerTitle}>BETTER T STACK</Text>
          {session?.user ? (
            <View style={styles.sessionInfoCard}>
              <View style={styles.sessionUserRow}>
                <Text style={styles.welcomeText}>
                  Welcome,{" "}
                  <Text style={styles.userNameText}>{session.user.name}</Text>
                </Text>
              </View>
              <Text style={styles.emailText}>{session.user.email}</Text>

              <TouchableOpacity
                style={styles.signOutButton}
                onPress={() => {
                  authClient.signOut();
                  {{#if (eq api "orpc")}}
                  queryClient.invalidateQueries();
                  {{/if}}

                }}
              >
                <Text style={styles.signOutButtonText}>Sign Out</Text>
              </TouchableOpacity>

            </View>
          ) : null}
          {{#unless (eq api "none")}}
          <View style={styles.apiStatusCard}>
            <Text style={styles.cardTitle}>API Status</Text>
            <View style={styles.apiStatusRow}>
              <View
                style={[
                  styles.statusIndicatorDot,
                  healthCheck.data
                    ? styles.statusIndicatorGreen
                    : styles.statusIndicatorRed,
                ]}
              />
              <Text style={styles.mutedText}>
                {healthCheck.isLoading
                  ? "Checking..."
                  : healthCheck.data
                    ? "Connected to API"
                    : "API Disconnected"}
              </Text>
            </View>
          </View>
          <View style={styles.privateDataCard}>
            <Text style={styles.cardTitle}>Private Data</Text>
            {privateData && (
              <View>
                <Text style={styles.mutedText}>
                  {privateData.data?.message}
                </Text>
              </View>
            )}
          </View>
          {{/unless}}
          {!session?.user && (
            <>
              <SignIn />
              <SignUp />
            </>
          )}
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  pageContainer: {
    paddingHorizontal: 8,
  },
  headerTitle: {
    color: theme?.colors?.typography,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sessionInfoCard: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme?.colors?.border,
  },
  sessionUserRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  welcomeText: {
    color: theme?.colors?.typography,
    fontSize: 16,
  },
  userNameText: {
    fontWeight: "500",
    color: theme?.colors?.typography,
  },
  emailText: {
    color: theme?.colors?.typography,
    fontSize: 14,
    marginBottom: 16,
  },
  signOutButton: {
    backgroundColor: theme?.colors?.destructive,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  signOutButtonText: {
    fontWeight: "500",
  },
  paymentActions: {
    marginTop: 12,
    gap: 8,
    alignItems: "flex-start",
  },
  polarPrimaryButton: {
    backgroundColor: theme?.colors?.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  polarPrimaryButtonText: {
    color: theme?.colors?.primaryForeground,
    fontWeight: "500",
  },
  polarSecondaryButton: {
    borderWidth: 1,
    borderColor: theme?.colors?.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  polarSecondaryButtonText: {
    color: theme?.colors?.typography,
    fontWeight: "500",
  },
  apiStatusCard: {
    marginBottom: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme?.colors?.border,
    padding: 16,
  },
  cardTitle: {
    marginBottom: 12,
    fontWeight: "500",
    color: theme?.colors?.typography,
  },
  apiStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusIndicatorDot: {
    height: 12,
    width: 12,
    borderRadius: 9999,
  },
  statusIndicatorGreen: {
    backgroundColor: theme.colors.success,
  },
  statusIndicatorRed: {
    backgroundColor: theme.colors.destructive,
  },
  mutedText: {
    color: theme?.colors?.typography,
  },
  privateDataCard: {
    marginBottom: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme?.colors?.border,
    padding: 16,
  },
}));
`],
  ["auth/better-auth/native/unistyles/components/sign-in.tsx.hbs", `import { authClient } from "@/lib/auth-client";

{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import z from "zod";

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Use at least 8 characters"),
});

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    for (const issue of error) {
      const message = getErrorMessage(issue);
      if (message) {
        return message;
      }
    }
    return null;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: unknown };
    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }
  }

  return null;
}

export function SignIn() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.signIn.email(
        {
          email: value.email.trim(),
          password: value.password,
        },
        {
          onError(error) {
            setError(error.error?.message || "Failed to sign in");
          },
          onSuccess() {
            setError(null);
            formApi.reset();
            {{#if (eq api "orpc")}}
            queryClient.refetchQueries();
            {{/if}}

          },
        },
      );
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          validationError: getErrorMessage(state.errorMap.onSubmit),
        })}
      >
        {({ isSubmitting, validationError }) => {
          const formError = error ?? validationError;

          return (
            <>
              {formError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{formError}</Text>
                </View>
              ) : null}

              <form.Field name="email">
                {(field) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={(value) => {
                      field.handleChange(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={(value) => {
                      field.handleChange(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                    secureTextEntry
                    onSubmitEditing={form.handleSubmit}
                  />
                )}
              </form.Field>

              <TouchableOpacity
                onPress={form.handleSubmit}
                disabled={isSubmitting}
                style={styles.button}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </>
          );
        }}
      </form.Subscribe>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.typography,
    marginBottom: 16,
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 6,
  },
  errorText: {
    color: theme.colors.destructive,
    fontSize: 14,
  },
  input: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 6,
    color: theme.colors.typography,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "500",
  },
}));
`],
  ["auth/better-auth/native/unistyles/components/sign-up.tsx.hbs", `import { authClient } from "@/lib/auth-client";

{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import z from "zod";

const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Use at least 8 characters"),
});

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    for (const issue of error) {
      const message = getErrorMessage(issue);
      if (message) {
        return message;
      }
    }
    return null;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: unknown };
    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }
  }

  return null;
}

export function SignUp() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.signUp.email(
        {
          name: value.name.trim(),
          email: value.email.trim(),
          password: value.password,
        },
        {
          onError(error) {
            setError(error.error?.message || "Failed to sign up");
          },
          onSuccess() {
            setError(null);
            formApi.reset();
            {{#if (eq api "orpc")}}
            queryClient.refetchQueries();
            {{/if}}

          },
        },
      );
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          validationError: getErrorMessage(state.errorMap.onSubmit),
        })}
      >
        {({ isSubmitting, validationError }) => {
          const formError = error ?? validationError;

          return (
            <>
              {formError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{formError}</Text>
                </View>
              ) : null}

              <form.Field name="name">
                {(field) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={(value) => {
                      field.handleChange(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                  />
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={(value) => {
                      field.handleChange(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <TextInput
                    style={styles.inputLast}
                    placeholder="Password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={(value) => {
                      field.handleChange(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                    secureTextEntry
                    onSubmitEditing={form.handleSubmit}
                  />
                )}
              </form.Field>

              <TouchableOpacity
                onPress={form.handleSubmit}
                disabled={isSubmitting}
                style={styles.button}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </>
          );
        }}
      </form.Subscribe>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.typography,
    marginBottom: 16,
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 6,
  },
  errorText: {
    color: theme.colors.destructive,
    fontSize: 14,
  },
  input: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 6,
    color: theme.colors.typography,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputLast: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 6,
    color: theme.colors.typography,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "500",
  },
}));
`],
  ["auth/better-auth/native/uniwind/app/(drawer)/index.tsx.hbs", `import { Text, View, Pressable } from "react-native";

import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { Card, Chip, useThemeColor } from "heroui-native";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { queryClient, orpc } from "@/utils/orpc";
{{/if}}

export default function Home() {
{{#if (eq api "orpc")}}
const healthCheck = useQuery(orpc.healthCheck.queryOptions());
const privateData = useQuery(orpc.privateData.queryOptions());
const isConnected = healthCheck?.data === "OK";
const isLoading = healthCheck?.isLoading;
{{/if}}

const { data: session } = authClient.useSession();

const mutedColor = useThemeColor("muted");
const successColor = useThemeColor("success");
const dangerColor = useThemeColor("danger");
const foregroundColor = useThemeColor("foreground");

return (
<Container className="p-6">
  <View className="py-4 mb-6">
    <Text className="text-4xl font-bold text-foreground mb-2">
      BETTER T STACK
    </Text>
  </View>

  {session?.user ? (
  <Card variant="secondary" className="mb-6 p-4">
    <Text className="text-foreground text-base mb-2">
      Welcome, <Text className="font-medium">{session.user.name}</Text>
    </Text>
    <Text className="text-muted text-sm mb-4">
      {session.user.email}
    </Text>
    <Pressable className="bg-danger py-3 px-4 rounded-lg self-start active:opacity-70" onPress={()=> {
      authClient.signOut();
      {{#if (eq api "orpc")}}
      queryClient.invalidateQueries();
      {{/if}}

      }}
      >
      <Text className="text-foreground font-medium">Sign Out</Text>
    </Pressable>

  </Card>
  ) : null}

  {{#unless (eq api "none")}}
  <Card variant="secondary" className="p-6">
    <View className="flex-row items-center justify-between mb-4">
      <Card.Title>System Status</Card.Title>
      <Chip variant="secondary" color={isConnected ? "success" : "danger" } size="sm">
        <Chip.Label>{isConnected ? "LIVE" : "OFFLINE"}</Chip.Label>
      </Chip>
    </View>

    <Card className="p-4">
      <View className="flex-row items-center">
        <View className={\`w-3 h-3 rounded-full mr-3 \${isConnected ? "bg-success" : "bg-muted" }\`} />
        <View className="flex-1">
          <Text className="text-foreground font-medium mb-1">
            {{#if (eq api "orpc")}}ORPC{{else}}TRPC{{/if}} Backend
          </Text>
          <Card.Description>
            {isLoading
            ? "Checking connection..."
            : isConnected
            ? "Connected to API"
            : "API Disconnected"}
          </Card.Description>
        </View>
        {isLoading && (
        <Ionicons name="hourglass-outline" size={20} color={mutedColor} />
        )}
        {!isLoading && isConnected && (
        <Ionicons name="checkmark-circle" size={20} color={successColor} />
        )}
        {!isLoading && !isConnected && (
        <Ionicons name="close-circle" size={20} color={dangerColor} />
        )}
      </View>
    </Card>
  </Card>

  <Card variant="secondary" className="mt-6 p-4">
    <Card.Title className="mb-3">Private Data</Card.Title>
    {privateData && (
    <Card.Description>
      {privateData.data?.message}
    </Card.Description>
    )}
  </Card>
  {{/unless}}

  {!session?.user && (
  <>
    <SignIn />
    <SignUp />
  </>
  )}
</Container>
);
}
`],
  ["auth/better-auth/native/uniwind/components/sign-in.tsx.hbs", `import { authClient } from "@/lib/auth-client";

{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
import { useForm } from "@tanstack/react-form";
import { useRef } from "react";
import { Text, TextInput, View } from "react-native";
import { Button, FieldError, Input, Label, Spinner, Surface, TextField, useToast } from "heroui-native";
import z from "zod";

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Use at least 8 characters"),
});

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    for (const issue of error) {
      const message = getErrorMessage(issue);
      if (message) {
        return message;
      }
    }
    return null;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: unknown };
    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }
  }

  return null;
}

function SignIn() {
  const passwordInputRef = useRef<TextInput>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.signIn.email(
        {
          email: value.email.trim(),
          password: value.password,
        },
        {
          onError(error) {
            toast.show({
              variant: "danger",
              label: error.error?.message || "Failed to sign in",
            });
          },
          onSuccess() {
            formApi.reset();
            toast.show({
              variant: "success",
              label: "Signed in successfully",
            });
            {{#if (eq api "orpc")}}
            queryClient.refetchQueries();
            {{/if}}

          },
        },
      );
    },
  });

  return (
    <Surface variant="secondary" className="p-4 rounded-lg">
      <Text className="text-foreground font-medium mb-4">Sign In</Text>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          validationError: getErrorMessage(state.errorMap.onSubmit),
        })}
      >
        {({ isSubmitting, validationError }) => {
          const formError = validationError;

          return (
            <>
              <FieldError isInvalid={!!formError} className="mb-3">
                {formError}
              </FieldError>

              <View className="gap-3">
                <form.Field name="email">
                  {(field) => (
                    <TextField>
                      <Label>Email</Label>
                      <Input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="email@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                          passwordInputRef.current?.focus();
                        }}
                      />
                    </TextField>
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => (
                    <TextField>
                      <Label>Password</Label>
                      <Input
                        ref={passwordInputRef}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="••••••••"
                        secureTextEntry
                        autoComplete="password"
                        textContentType="password"
                        returnKeyType="go"
                        onSubmitEditing={form.handleSubmit}
                      />
                    </TextField>
                  )}
                </form.Field>

                <Button onPress={form.handleSubmit} isDisabled={isSubmitting} className="mt-1">
                  {isSubmitting ? <Spinner size="sm" color="default" /> : <Button.Label>Sign In</Button.Label>}
                </Button>
              </View>
            </>
          );
        }}
      </form.Subscribe>
    </Surface>
  );
}

export { SignIn };
`],
  ["auth/better-auth/native/uniwind/components/sign-up.tsx.hbs", `import { authClient } from "@/lib/auth-client";

{{#if (eq api "orpc")}}
import { queryClient } from "@/utils/orpc";
{{/if}}
import { useForm } from "@tanstack/react-form";
import { useRef } from "react";
import { Text, TextInput, View } from "react-native";
import { Button, FieldError, Input, Label, Spinner, Surface, TextField, useToast } from "heroui-native";
import z from "zod";

const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Use at least 8 characters"),
});

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    for (const issue of error) {
      const message = getErrorMessage(issue);
      if (message) {
        return message;
      }
    }
    return null;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: unknown };
    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }
  }

  return null;
}

export function SignUp() {
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.signUp.email(
        {
          name: value.name.trim(),
          email: value.email.trim(),
          password: value.password,
        },
        {
          onError(error) {
            toast.show({
              variant: "danger",
              label: error.error?.message || "Failed to sign up",
            });
          },
          onSuccess() {
            formApi.reset();
            toast.show({
              variant: "success",
              label: "Account created successfully",
            });
            {{#if (eq api "orpc")}}
            queryClient.refetchQueries();
            {{/if}}

          },
        },
      );
    },
  });

  return (
    <Surface variant="secondary" className="p-4 rounded-lg">
      <Text className="text-foreground font-medium mb-4">Create Account</Text>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          validationError: getErrorMessage(state.errorMap.onSubmit),
        })}
      >
        {({ isSubmitting, validationError }) => {
          const formError = validationError;

          return (
            <>
              <FieldError isInvalid={!!formError} className="mb-3">
                {formError}
              </FieldError>

              <View className="gap-3">
                <form.Field name="name">
                  {(field) => (
                    <TextField>
                      <Label>Name</Label>
                      <Input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="John Doe"
                        autoComplete="name"
                        textContentType="name"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                          emailInputRef.current?.focus();
                        }}
                      />
                    </TextField>
                  )}
                </form.Field>

                <form.Field name="email">
                  {(field) => (
                    <TextField>
                      <Label>Email</Label>
                      <Input
                        ref={emailInputRef}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="email@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                          passwordInputRef.current?.focus();
                        }}
                      />
                    </TextField>
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => (
                    <TextField>
                      <Label>Password</Label>
                      <Input
                        ref={passwordInputRef}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="••••••••"
                        secureTextEntry
                        autoComplete="new-password"
                        textContentType="newPassword"
                        returnKeyType="go"
                        onSubmitEditing={form.handleSubmit}
                      />
                    </TextField>
                  )}
                </form.Field>

                <Button onPress={form.handleSubmit} isDisabled={isSubmitting} className="mt-1">
                  {isSubmitting ? (
                    <Spinner size="sm" color="default" />
                  ) : (
                    <Button.Label>Create Account</Button.Label>
                  )}
                </Button>
              </View>
            </>
          );
        }}
      </form.Subscribe>
    </Surface>
  );
}
`],
  ["auth/better-auth/server/base/_gitignore", `# dependencies (bun install)
node_modules

# output
out
dist
*.tgz

# code coverage
coverage
*.lcov

# logs
logs
_.log
report.[0-9]_.[0-9]_.[0-9]_.[0-9]_.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# caches
.eslintcache
.cache
*.tsbuildinfo

# IntelliJ based IDEs
.idea

# Finder (MacOS) folder config
.DS_Store
`],
  ["auth/better-auth/server/base/package.json.hbs", `{
  "name": "@{{projectName}}/auth",
  "exports": {
    ".": {
      "default": "./src/index.ts"
    },
    "./*": {
      "default": "./src/*.ts"
    }
  },
  "type": "module",
  "scripts": {},
  "devDependencies": {}
}`],
  ["auth/better-auth/server/base/src/index.ts.hbs", `{{#if (eq orm "prisma")}}
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { createPrismaClient } from "@{{projectName}}/db";

export function createAuth() {
	const prisma = createPrismaClient();

	return betterAuth({
		database: prismaAdapter(prisma, {
{{#if (eq database "postgres")}}provider: "postgresql",{{/if}}
{{#if (eq database "sqlite")}}provider: "sqlite",{{/if}}
{{#if (eq database "mysql")}}provider: "mysql",{{/if}}
{{#if (eq database "mongodb")}}provider: "mongodb",{{/if}}
		}),

		trustedOrigins: [
			env.CORS_ORIGIN,
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
			"{{projectName}}://",
			"exp://",
			"http://localhost:8081",
{{/if}}
		],
		emailAndPassword: {
			enabled: true,
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
{{#if (ne backend "self")}}
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
{{/if}}
		plugins: [

		],
	});
}

{{#if (and (ne runtime "workers") (ne serverDeploy "cloudflare") (or (ne backend "self") (ne webDeploy "cloudflare")))}}
export const auth = createAuth();
{{/if}}
{{/if}}

{{#if (eq orm "drizzle")}}
{{#if (or (eq runtime "bun") (eq runtime "node") (eq runtime "none"))}}
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { createDb } from "@{{projectName}}/db";
import * as schema from "@{{projectName}}/db/schema/auth";

export function createAuth() {
	const db = createDb();

	return betterAuth({
		database: drizzleAdapter(db, {
{{#if (eq database "postgres")}}provider: "pg",{{/if}}
{{#if (eq database "sqlite")}}provider: "sqlite",{{/if}}
{{#if (eq database "mysql")}}provider: "mysql",{{/if}}
			schema: schema,
		}),
		trustedOrigins: [
			env.CORS_ORIGIN,
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
			"{{projectName}}://",
			"exp://",
			"http://localhost:8081",
{{/if}}
		],
		emailAndPassword: {
			enabled: true,
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
{{#if (ne backend "self")}}
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
{{/if}}
		plugins: [

		],
	});
}

{{#if (and (ne runtime "workers") (ne serverDeploy "cloudflare") (or (ne backend "self") (ne webDeploy "cloudflare")))}}
export const auth = createAuth();
{{/if}}
{{/if}}

{{#if (eq runtime "workers")}}
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@{{projectName}}/env/server";

import { createDb } from "@{{projectName}}/db";
import * as schema from "@{{projectName}}/db/schema/auth";

export function createAuth() {
	const db = createDb();

	return betterAuth({
		database: drizzleAdapter(db, {
{{#if (eq database "postgres")}}provider: "pg",{{/if}}
{{#if (eq database "sqlite")}}provider: "sqlite",{{/if}}
{{#if (eq database "mysql")}}provider: "mysql",{{/if}}
			schema: schema,
		}),
		trustedOrigins: [
			env.CORS_ORIGIN,
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
			"{{projectName}}://",
			"exp://",
			"http://localhost:8081",
{{/if}}
		],
		emailAndPassword: {
			enabled: true,
		},
		// uncomment cookieCache setting when ready to deploy to Cloudflare using *.workers.dev domains
		// session: {
		//   cookieCache: {
		//     enabled: true,
		//     maxAge: 60,
		//   },
		// },
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
			// uncomment crossSubDomainCookies setting when ready to deploy and replace <your-workers-subdomain> with your actual workers subdomain
			// https://developers.cloudflare.com/workers/wrangler/configuration/#workersdev
			// crossSubDomainCookies: {
			//   enabled: true,
			//   domain: "<your-workers-subdomain>",
			// },
		},

	});
}
{{/if}}
{{/if}}

{{#if (eq orm "mongoose")}}
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { client } from "@{{projectName}}/db";

export function createAuth() {
	return betterAuth({
		database: mongodbAdapter(client),
		trustedOrigins: [
			env.CORS_ORIGIN,
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
			"{{projectName}}://",
			"exp://",
			"http://localhost:8081",
{{/if}}
		],
		emailAndPassword: {
			enabled: true,
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
{{#if (ne backend "self")}}
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
{{/if}}

	});
}

{{#if (and (ne runtime "workers") (ne serverDeploy "cloudflare") (or (ne backend "self") (ne webDeploy "cloudflare")))}}
export const auth = createAuth();
{{/if}}
{{/if}}

{{#if (eq orm "none")}}
import { betterAuth } from "better-auth";

export function createAuth() {
	return betterAuth({
		database: "", // Invalid configuration
		trustedOrigins: [
			env.CORS_ORIGIN,
{{#if (or (includes frontend "native-bare") (includes frontend "native-uniwind") (includes frontend "native-unistyles"))}}
			"{{projectName}}://",
			"exp://",
			"http://localhost:8081",
{{/if}}
		],
		emailAndPassword: {
			enabled: true,
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
{{#if (ne backend "self")}}
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
{{/if}}

	});
}

{{#if (and (ne runtime "workers") (ne serverDeploy "cloudflare") (or (ne backend "self") (ne webDeploy "cloudflare")))}}
export const auth = createAuth();
{{/if}}
{{/if}}
`],
  ["auth/better-auth/server/base/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "composite": true
  }
}`],
  ["auth/better-auth/server/db/drizzle/mysql/src/schema/auth.ts.hbs", `import { relations } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = mysqlTable(
  "session",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = mysqlTable(
  "account",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3 }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = mysqlTable(
  "verification",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
`],
  ["auth/better-auth/server/db/drizzle/postgres/src/schema/auth.ts.hbs", `import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
`],
  ["auth/better-auth/server/db/drizzle/sqlite/src/schema/auth.ts.hbs", `import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql\`(cast(unixepoch('subsecond') * 1000 as integer))\`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql\`(cast(unixepoch('subsecond') * 1000 as integer))\`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql\`(cast(unixepoch('subsecond') * 1000 as integer))\`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql\`(cast(unixepoch('subsecond') * 1000 as integer))\`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql\`(cast(unixepoch('subsecond') * 1000 as integer))\`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql\`(cast(unixepoch('subsecond') * 1000 as integer))\`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
`],
  ["auth/better-auth/server/db/mongoose/mongodb/src/models/auth.model.ts.hbs", `import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema(
    {
        _id: { type: ObjectId, auto: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        emailVerified: { type: Boolean, required: true, default: false },
        image: { type: String },
        createdAt: { type: Date, required: true, default: Date.now },
        updatedAt: { type: Date, required: true, default: Date.now },
    },
    { collection: 'user' }
);

const sessionSchema = new Schema(
    {
        _id: { type: ObjectId, auto: true },
        expiresAt: { type: Date, required: true },
        token: { type: String, required: true, unique: true },
        createdAt: { type: Date, required: true, default: Date.now },
        updatedAt: { type: Date, required: true, default: Date.now },
        ipAddress: { type: String },
        userAgent: { type: String },
        userId: { type: ObjectId, ref: 'User', required: true },
    },
    { collection: 'session' }
);
sessionSchema.index({ userId: 1 });

const accountSchema = new Schema(
    {
        _id: { type: ObjectId, auto: true },
        accountId: { type: String, required: true },
        providerId: { type: String, required: true },
        userId: { type: ObjectId, ref: 'User', required: true },
        accessToken: { type: String },
        refreshToken: { type: String },
        idToken: { type: String },
        accessTokenExpiresAt: { type: Date },
        refreshTokenExpiresAt: { type: Date },
        scope: { type: String },
        password: { type: String },
        createdAt: { type: Date, required: true, default: Date.now },
        updatedAt: { type: Date, required: true, default: Date.now },
    },
    { collection: 'account' }
);
accountSchema.index({ userId: 1 });

const verificationSchema = new Schema(
    {
        _id: { type: ObjectId, auto: true },
        identifier: { type: String, required: true },
        value: { type: String, required: true },
        expiresAt: { type: Date, required: true },
        createdAt: { type: Date, required: true, default: Date.now },
        updatedAt: { type: Date, required: true, default: Date.now },
    },
    { collection: 'verification' }
);
verificationSchema.index({ identifier: 1 });

const User = model('User', userSchema);
const Session = model('Session', sessionSchema);
const Account = model('Account', accountSchema);
const Verification = model('Verification', verificationSchema);

export { User, Session, Account, Verification };
`],
  ["auth/better-auth/server/db/prisma/mongodb/prisma/schema/auth.prisma.hbs", `model User {
  id            String    @id @map("_id")
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id @map("_id")
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id @map("_id")
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String   @id @map("_id")
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}
`],
  ["auth/better-auth/server/db/prisma/mysql/prisma/schema/auth.prisma.hbs", `model User {
  id            String    @id
  name          String    @db.Text
  email         String
  emailVerified Boolean   @default(false)
  image         String?   @db.Text
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?  @db.Text
  userAgent String?  @db.Text
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId(length: 191)])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String    @db.Text
  providerId            String    @db.Text
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?   @db.Text
  refreshToken          String?   @db.Text
  idToken               String?   @db.Text
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?   @db.Text
  password              String?   @db.Text
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId(length: 191)])
  @@map("account")
}

model Verification {
  id         String   @id
  identifier String   @db.Text
  value      String   @db.Text
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier(length: 191)])
  @@map("verification")
}
`],
  ["auth/better-auth/server/db/prisma/postgres/prisma/schema/auth.prisma.hbs", `model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}
`],
  ["auth/better-auth/server/db/prisma/sqlite/prisma/schema/auth.prisma.hbs", `model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}
`],
  ["auth/better-auth/web/react/base/src/lib/auth-client.ts.hbs", `import { createAuthClient } from "better-auth/react";

{{#unless (eq backend "self")}}
import { env } from "@{{projectName}}/env/web";

{{> getServerUrl}}
{{/unless}}

export const authClient = createAuthClient({
{{#unless (eq backend "self")}}
	// better-auth derives its route-matching base from this URL's path, so the
	// public auth path must equal the server-side mount (/api/auth everywhere)
		baseURL: new URL("/api/auth", getServerUrl(env.{{#if (includes frontend "next")}}NEXT_PUBLIC_SERVER_URL{{else}}VITE_SERVER_URL{{/if}})).toString(),
{{/unless}}

});
`],
  ["auth/better-auth/web/react/next/src/app/dashboard/dashboard.tsx.hbs", `"use client";

import { authClient } from "@/lib/auth-client";
{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
{{/if}}

export default function Dashboard({

	session
}: {

	session: typeof authClient.$Infer.Session;
}) {
	{{#if (eq api "orpc")}}
	const privateData = useQuery(orpc.privateData.queryOptions());
	{{/if}}

	return (
		<>
			{{#if (eq api "orpc")}}
			<p>API: {privateData.data?.message}</p>
			{{/if}}

		</>
	);
}
`],
  ["auth/better-auth/web/react/next/src/app/dashboard/page.tsx.hbs", `import { redirect } from "next/navigation";
import Dashboard from "./dashboard";
import { headers } from "next/headers";
{{#if (eq backend "self")}}
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
import { createAuth } from "@{{projectName}}/auth";
{{else}}
import { auth } from "@{{projectName}}/auth";
{{/if}}
{{/if}}

export default async function DashboardPage() {
	{{#if (eq backend "self")}}
	const session = await {{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}createAuth(){{else}}auth{{/if}}.api.getSession({
		headers: await headers(),
	});
	{{else}}
	const session = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
			throw: true
		}
	});
	{{/if}}

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session.user.name}</p>
			<Dashboard session={session}  />
		</div>
	);
}
`],
  ["auth/better-auth/web/react/next/src/app/login/page.tsx.hbs", `"use client"

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { useState } from "react";


export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(false);

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
`],
  ["auth/better-auth/web/react/next/src/components/sign-in-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "@{{projectName}}/ui/components/button";
import { Input } from "@{{projectName}}/ui/components/input";
import { Label } from "@{{projectName}}/ui/components/label";
import { useRouter } from "next/navigation";

export default function SignInForm({
  onSwitchToSignUp,
}: {
  onSwitchToSignUp: () => void;
}) {
  const router = useRouter()
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push("/dashboard")
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
          {({ canSubmit, isSubmitting }) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignUp}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Need an account? Sign Up
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/next/src/components/sign-up-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "@{{projectName}}/ui/components/button";
import { Input } from "@{{projectName}}/ui/components/input";
import { Label } from "@{{projectName}}/ui/components/label";
import { useRouter } from "next/navigation";

export default function SignUpForm({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
}) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
          {({ canSubmit, isSubmitting }) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignIn}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/next/src/components/user-menu.tsx.hbs", `import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@{{projectName}}/ui/components/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "@{{projectName}}/ui/components/button";
import { Skeleton } from "@{{projectName}}/ui/components/skeleton";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
    return (
      <Link href="/login">
        <Button variant="outline">Sign In</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {session.user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/");
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`],
  ["auth/better-auth/web/react/react-router/src/components/sign-in-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "@{{projectName}}/ui/components/button";
import { Input } from "@{{projectName}}/ui/components/input";
import { Label } from "@{{projectName}}/ui/components/label";

export default function SignInForm({
  onSwitchToSignUp,
}: {
  onSwitchToSignUp: () => void;
}) {
  const navigate = useNavigate();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate("/dashboard");
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
          {({ canSubmit, isSubmitting }) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignUp}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Need an account? Sign Up
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/react-router/src/components/sign-up-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "@{{projectName}}/ui/components/button";
import { Input } from "@{{projectName}}/ui/components/input";
import { Label } from "@{{projectName}}/ui/components/label";

export default function SignUpForm({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
}) {
  const navigate = useNavigate();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate("/dashboard");
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
          {({ canSubmit, isSubmitting }) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignIn}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/react-router/src/components/user-menu.tsx.hbs", `import { Link, useNavigate } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@{{projectName}}/ui/components/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "@{{projectName}}/ui/components/button";
import { Skeleton } from "@{{projectName}}/ui/components/skeleton";

export default function UserMenu() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
    return (
      <Link to="/login">
        <Button variant="outline">Sign In</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {session.user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate("/");
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`],
  ["auth/better-auth/web/react/react-router/src/routes/dashboard.tsx.hbs", `
import { authClient } from "@/lib/auth-client";
{{#if (eq api "orpc")}}
import { orpc } from "@/utils/orpc";
{{/if}}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  {{#if (eq api "orpc")}}
  const privateData = useQuery(orpc.privateData.queryOptions());
  {{/if}}

  useEffect(() => {
    if (!session && !isPending) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user.name}</p>

    </div>
  );
}
`],
  ["auth/better-auth/web/react/react-router/src/routes/login.tsx.hbs", `import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { useState } from "react";

export default function Login() {
  const [showSignIn, setShowSignIn] = useState(false);

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
`],
  ["auth/better-auth/web/react/tanstack-router/src/components/sign-in-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "@{{projectName}}/ui/components/button";
import { Input } from "@{{projectName}}/ui/components/input";
import { Label } from "@{{projectName}}/ui/components/label";

export default function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
          {({ canSubmit, isSubmitting }) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignUp}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Need an account? Sign Up
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/tanstack-router/src/components/sign-up-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "@{{projectName}}/ui/components/button";
import { Input } from "@{{projectName}}/ui/components/input";
import { Label } from "@{{projectName}}/ui/components/label";

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
          {({ canSubmit, isSubmitting }) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignIn}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/tanstack-router/src/components/user-menu.tsx.hbs", `import { Link, useNavigate } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@{{projectName}}/ui/components/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "@{{projectName}}/ui/components/button";
import { Skeleton } from "@{{projectName}}/ui/components/skeleton";

export default function UserMenu() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
    return (
      <Link to="/login">
        <Button variant="outline">Sign In</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {session.user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate({
                      to: "/",
                    });
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`],
  ["auth/better-auth/web/react/tanstack-router/src/routes/_auth/dashboard.tsx.hbs", `
{{#if (eq api "orpc")}}
import { orpc } from "@/utils/orpc";
{{/if}}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { session } = Route.useRouteContext();

	{{#if (eq api "orpc")}}
	const privateData = useQuery(orpc.privateData.queryOptions());
	{{/if}}

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session.data?.user.name}</p>

		</div>
	);
}
`],
  ["auth/better-auth/web/react/tanstack-router/src/routes/_auth/route.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) {
			throw redirect({
				to: "/login",
			});
		}

	},
});

function AuthLayout() {
	return <Outlet />;
}
`],
  ["auth/better-auth/web/react/tanstack-router/src/routes/login.tsx.hbs", `import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
`],
  ["auth/better-auth/web/react/tanstack-start/src/components/sign-in-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "@{{projectName}}/ui/components/button";
import { Input } from "@{{projectName}}/ui/components/input";
import { Label } from "@{{projectName}}/ui/components/label";

export default function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
          {({ canSubmit, isSubmitting }) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignUp}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Need an account? Sign Up
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/tanstack-start/src/components/sign-up-form.tsx.hbs", `import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import Loader from "./loader";
import { Button } from "@{{projectName}}/ui/components/button";
import { Input } from "@{{projectName}}/ui/components/input";
import { Label } from "@{{projectName}}/ui/components/label";

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign up successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
          {({ canSubmit, isSubmitting }) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignIn}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
}
`],
  ["auth/better-auth/web/react/tanstack-start/src/components/user-menu.tsx.hbs", `import { Link, useNavigate } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@{{projectName}}/ui/components/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "@{{projectName}}/ui/components/button";
import { Skeleton } from "@{{projectName}}/ui/components/skeleton";

export default function UserMenu() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
    return (
      <Link to="/login">
        <Button variant="outline">Sign In</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {session.user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{session.user.email}</DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate({
                      to: "/",
                    });
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`],
  ["auth/better-auth/web/react/tanstack-start/src/functions/get-user.ts.hbs", `import { authMiddleware } from "@/middleware/auth";
import { createServerFn } from "@tanstack/react-start";

export const getUser = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(async ({ context }) => {
    return context.session
})`],
  ["auth/better-auth/web/react/tanstack-start/src/middleware/auth.ts.hbs", `{{#if (eq backend "self")}}
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
import { createAuth } from "@{{projectName}}/auth";
{{else}}
import { auth } from "@{{projectName}}/auth";
{{/if}}
import { createMiddleware } from "@tanstack/react-start";


export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
    const session = await {{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}createAuth(){{else}}auth{{/if}}.api.getSession({
        headers: request.headers,
    })
    return next({
        context: { session }
    })
})
{{else}}
import { authClient } from "@/lib/auth-client";
import { createMiddleware } from "@tanstack/react-start";

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const session = await authClient.getSession({
			fetchOptions: {
				headers: request.headers,
				throw: true
			}
		})
		return next({
			context: { session },
		});
	},
);
{{/if}}
`],
  ["auth/better-auth/web/react/tanstack-start/src/routes/_auth/dashboard.tsx.hbs", `
{{#if (eq api "orpc") }}
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
{{/if}}
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();

  {{#if (eq api "orpc") }}
  const privateData = useQuery(orpc.privateData.queryOptions());
  {{/if}}

  return (
    <div>
      <h1>Dashboard</h1>
      {{#if (eq backend "self")}}
      <p>Welcome {session?.user.name}</p>
      {{else}}
      <p>Welcome {session.data?.user.name}</p>
      {{/if}}

    </div>
  );
}
`],
  ["auth/better-auth/web/react/tanstack-start/src/routes/_auth/route.tsx.hbs", `{{#if (eq backend "self")}}
import { getUser } from "@/functions/get-user";
{{else}}
import { authClient } from "@/lib/auth-client";
{{/if}}

import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  {{#unless (eq backend "self")}}
  ssr: false,
  {{/unless}}
  component: AuthLayout,
  beforeLoad: async () => {
    {{#if (eq backend "self")}}
    const session = await getUser();
    if (!session) {
      throw redirect({
        to: "/login",
      });
    }

    {{else}}
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: "/login",
      });
    }

    {{/if}}
  },
  {{#if (eq backend "self")}}
  loader: async ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: "/login",
      });
    }
  },
  {{/if}}
});

function AuthLayout() {
  return <Outlet />;
}
`],
  ["auth/better-auth/web/react/tanstack-start/src/routes/login.tsx.hbs", `import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
`],
  ["backend/server/base/_gitignore", `# prod
dist/
/build
/out/

# dev
.yarn/
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions
.vscode/*
!.vscode/launch.json
!.vscode/*.code-snippets
.idea/workspace.xml
.idea/usage.statistics.xml
.idea/shelf
.wrangler
.alchemy
/.next/
.vercel
prisma/generated/


# deps
node_modules/
/node_modules
/.pnp
.pnp.*

# env
.env*
.env.production
!.env.example
.dev.vars

# logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# misc
.DS_Store
*.pem

# local db
*.db*

# typescript
*.tsbuildinfo
next-env.d.ts
`],
  ["backend/server/base/package.json.hbs", `{
	"name": "server",
	"main": "src/index.ts",
	"type": "module",
	"scripts": {
		"build": "tsdown",
		"check-types": "tsc -b",
		"compile": "bun build --compile --minify --sourcemap --bytecode ./src/index.ts --outfile server"
	},
	"dependencies": {},
	{{#if (eq dbSetup 'supabase')}}
	"trustedDependencies": [
        "supabase"
    ],
    {{/if}}
	"devDependencies": {}
}
`],
  ["backend/server/base/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
		"outDir": "dist",
		"paths": {
      "@/*": ["./src/*"]
    },
    "jsx": "react-jsx"{{#if (eq backend "hono")}},
    "jsxImportSource": "hono/jsx"{{/if}}
  }
}
`],
  ["backend/server/base/tsdown.config.ts.hbs", `import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: './src/index.ts',
    format: 'esm',
    outDir: './dist',
    clean: true,
    noExternal: [/@{{projectName}}\\/.*/]
});
`],
  ["backend/server/hono/src/index.ts.hbs", `import { env } from "@{{projectName}}/env/server";
{{#if (eq api "orpc")}}
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { RPCHandler } from "@orpc/server/fetch";
import { onError } from "@orpc/server";
import { createContext } from "@{{projectName}}/api/context";
import { appRouter } from "@{{projectName}}/api/routers/index";
{{/if}}

{{#if (eq auth "better-auth")}}
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
import { createAuth } from "@{{projectName}}/auth";
{{else}}
import { auth } from "@{{projectName}}/auth";
{{/if}}
{{/if}}
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
{{#if (and (includes examples "ai") (or (eq runtime "bun") (eq runtime "node")))}}
import { createUIMessageStreamResponse, streamText, toUIMessageStream, convertToModelMessages, wrapLanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { devToolsMiddleware } from "@ai-sdk/devtools";
{{/if}}
{{#if (and (includes examples "ai") (eq runtime "workers"))}}
import { createUIMessageStreamResponse, streamText, toUIMessageStream, convertToModelMessages, wrapLanguageModel } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { devToolsMiddleware } from "@ai-sdk/devtools";
{{/if}}

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "OPTIONS"],

{{#if (eq auth "better-auth")}}
		credentials: true,
{{/if}}
	})
);

{{#if (eq auth "better-auth")}}
app.on(
	["POST", "GET"],
	"/api/auth/*",
	(c) =>
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
		createAuth().handler(c.req.raw)
{{else}}
		auth.handler(c.req.raw)
{{/if}}
);
{{/if}}

{{#if (eq api "orpc")}}
export const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

export const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

app.use("/*", async (c, next) => {
	const context = await createContext({ context: c });

	const rpcResult = await rpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: context,
	});

	if (rpcResult.matched) {
		return c.newResponse(rpcResult.response.body, rpcResult.response);
	}

	const apiResult = await apiHandler.handle(c.req.raw, {
		prefix: "/api-reference",
		context: context,
	});

	if (apiResult.matched) {
		return c.newResponse(apiResult.response.body, apiResult.response);
	}

	await next();
});
{{/if}}

{{#if (and (includes examples "ai") (or (eq runtime "bun") (eq runtime "node")))}}
app.post("/ai", async (c) => {
	const body = await c.req.json();
	const uiMessages = body.messages || [];
	const model = wrapLanguageModel({
		model: google("gemini-2.5-flash"),
		middleware: devToolsMiddleware(),
	});
	const result = streamText({
		model,
		messages: await convertToModelMessages(uiMessages),
	});

	return createUIMessageStreamResponse({
		stream: toUIMessageStream({ stream: result.stream }),
	});
});
{{/if}}

{{#if (and (includes examples "ai") (eq runtime "workers"))}}
app.post("/ai", async (c) => {
	const body = await c.req.json();
	const uiMessages = body.messages || [];
	const google = createGoogleGenerativeAI({
		apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
	});
	const model = wrapLanguageModel({
		model: google("gemini-2.5-flash"),
		middleware: devToolsMiddleware(),
	});
	const result = streamText({
		model,
		messages: await convertToModelMessages(uiMessages),
	});

	return createUIMessageStreamResponse({
		stream: toUIMessageStream({ stream: result.stream }),
	});
});
{{/if}}

app.get("/", (c) => {
	return c.text("OK");
});

{{#if (eq runtime "node")}}
import { serve } from "@hono/node-server";

{{#if (eq serverDeploy "vercel")}}
export default app;

if (!process.env.VERCEL) {
{{/if}}
	serve(
		{
			fetch: app.fetch,
			port: 3000,
		},
		(info) => {
			console.log(\`Server is running on http://localhost:\${info.port}\`);
		}
	);
{{#if (eq serverDeploy "vercel")}}
}
{{/if}}
{{else}}
{{#if (eq runtime "bun")}}
export default app;
{{/if}}
{{#if (eq runtime "workers")}}
export default app;
{{/if}}
{{/if}}
`],
  ["base/_gitignore", `# Dependencies
node_modules
.pnp
.pnp.js

# Build outputs
dist
build
*.tsbuildinfo

# Generated files
apps/web/src/routeTree.gen.ts

# Environment variables
.env
.env*.local

# IDEs and editors
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea
*.swp
*.swo
*~
.DS_Store

# Logs
logs
.evlog/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Turbo
.turbo
.nx

# Better-T-Stack
.alchemy
.vercel

# Testing
coverage
.nyc_output

# Misc
*.tgz
.cache
tmp
temp
`],
  ["base/package.json.hbs", `{
  "name": "better-t-stack",
  "private": true,
  "type": "module",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {}
}
`],
  ["base/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
}
`],
  ["db-setup/docker-compose/mongodb/docker-compose.yml.hbs", `name: {{projectName}}

services:
  mongodb:
    image: mongo:8
    container_name: {{projectName}}-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: {{projectName}}
    ports:
      - "27017:27017"
    volumes:
      - {{projectName}}_mongodb_data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  {{projectName}}_mongodb_data:`],
  ["db-setup/docker-compose/mysql/docker-compose.yml.hbs", `name: {{projectName}}

services:
  mysql:
    image: mysql:8.4
    container_name: {{projectName}}-mysql
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: {{projectName}}
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - {{projectName}}_mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  {{projectName}}_mysql_data:`],
  ["db-setup/docker-compose/postgres/docker-compose.yml.hbs", `name: {{projectName}}

services:
  postgres:
    image: postgres:18
    container_name: {{projectName}}-postgres
    environment:
      POSTGRES_DB: {{projectName}}
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - {{projectName}}_postgres_data:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  {{projectName}}_postgres_data:`],
  ["db/base/_gitignore", `# dependencies (bun install)
node_modules

# output
out
dist
*.tgz
/prisma/generated

# code coverage
coverage
*.lcov

# logs
logs
_.log
report.[0-9]_.[0-9]_.[0-9]_.[0-9]_.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# caches
.eslintcache
.cache
*.tsbuildinfo

# IntelliJ based IDEs
.idea

# Finder (MacOS) folder config
.DS_Store
`],
  ["db/base/package.json.hbs", `{
  "name": "@{{projectName}}/db",
  "type": "module",
  "exports": {
    ".": {
      "default": "./src/index.ts"
    },
    "./*": {
      "default": "./src/*.ts"
    }
  },
  "scripts": {},
  "devDependencies": {}
}`],
  ["db/base/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "composite": true
  }
}`],
  ["db/drizzle/base/src/schema/index.ts.hbs", `{{#if (eq auth "better-auth")}}
export * from "./auth";
{{/if}}
{{#if (includes examples "todo")}}
export * from "./todo";
{{/if}}
export {};`],
  ["db/drizzle/mysql/drizzle.config.ts.hbs", `import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
    {{#if (eq backend "self")}}
    path: "../../apps/web/.env",
    {{else}}
    path: "../../apps/server/.env",
    {{/if}}
});

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
`],
  ["db/drizzle/mysql/src/index.ts.hbs", `{{#if (or (eq runtime "bun") (eq runtime "node") (eq runtime "none"))}}

import * as schema from "./schema";

{{#if (and (ne serverDeploy "cloudflare") (or (ne backend "self") (ne webDeploy "cloudflare")))}}
export const db = createDb();
{{/if}}
{{/if}}

{{#if (eq runtime "workers")}}
import * as schema from "./schema";

{{/if}}
`],
  ["db/drizzle/postgres/drizzle.config.ts.hbs", `import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
    {{#if (eq backend "self")}}
    path: "../../apps/web/.env",
    {{else}}
    path: "../../apps/server/.env",
    {{/if}}
});

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
`],
  ["db/drizzle/postgres/src/index.ts.hbs", `{{#if (or (eq runtime "bun") (eq runtime "node") (eq runtime "none"))}}

import * as schema from "./schema";

{{#if (eq dbSetup "neon")}}
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export function createDb() {
	const sql = neon(env.DATABASE_URL);
	return drizzle(sql, { schema });
}
{{else}}
import { drizzle } from "drizzle-orm/node-postgres";
{{#if (and (eq backend "self") (eq webDeploy "cloudflare"))}}
import { Pool } from "pg";
{{/if}}

export function createDb() {
{{#if (and (eq backend "self") (eq webDeploy "cloudflare"))}}
	const pool = new Pool({
		connectionString: env.DATABASE_URL,
		maxUses: 1,
	});

	return drizzle({ client: pool, schema });
{{else}}
	return drizzle(env.DATABASE_URL, { schema });
{{/if}}
}
{{/if}}

{{#if (and (ne serverDeploy "cloudflare") (or (ne backend "self") (ne webDeploy "cloudflare")))}}
export const db = createDb();
{{/if}}
{{/if}}

{{#if (eq runtime "workers")}}
import * as schema from "./schema";

{{#if (eq dbSetup "neon")}}
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from "@{{projectName}}/env/server";

export function createDb() {
	const sql = neon(env.DATABASE_URL || "");
	return drizzle(sql, { schema });
}
{{else}}
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@{{projectName}}/env/server";
import { Pool } from "pg";

export function createDb() {
	const pool = new Pool({
		connectionString: env.DATABASE_URL || "",
		maxUses: 1,
	});

	return drizzle({ client: pool, schema });
}
{{/if}}
{{/if}}
`],
  ["db/drizzle/sqlite/drizzle.config.ts.hbs", `import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
    {{#if (eq backend "self")}}
    path: "../../apps/web/.env",
    {{else}}
    path: "../../apps/server/.env",
    {{/if}}
});

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  {{#if (eq dbSetup "d1")}}
  // DOCS: https://orm.drizzle.team/docs/guides/d1-http-with-drizzle-kit
  dialect: "sqlite",
  driver: "d1-http",
  {{else}}
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",

  },
  {{/if}}
});
`],
  ["db/drizzle/sqlite/src/index.ts.hbs", `{{#if (eq dbSetup "d1")}}
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/d1";

export function createDb() {
	return drizzle(env.DB, { schema });
}
{{else if (or (eq runtime "bun") (eq runtime "node") (eq runtime "none"))}}

import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

export function createDb() {
	const client = createClient({
		url: env.DATABASE_URL,

	});

	return drizzle({ client, schema });
}

{{#if (and (ne serverDeploy "cloudflare") (or (ne backend "self") (ne webDeploy "cloudflare")))}}
export const db = createDb();
{{/if}}
{{else if (eq runtime "workers")}}
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "@{{projectName}}/env/server";
import { createClient } from "@libsql/client";

export function createDb() {
	const client = createClient({
		url: env.DATABASE_URL || "",

	});

	return drizzle({ client, schema });
}
{{/if}}
`],
  ["db/drizzle/sqlite/src/migrations/.gitkeep", ``],
  ["db/mongoose/mongodb/src/index.ts.hbs", `import mongoose from "mongoose";
import { env } from "@{{projectName}}/env/server";

await mongoose.connect(env.DATABASE_URL);

const client = mongoose.connection.getClient().db();

export { client };
`],
  ["db/prisma/mongodb/prisma.config.ts.hbs", `import path from "node:path";
import type { PrismaConfig } from "prisma";
import dotenv from "dotenv";

dotenv.config({
    {{#if (eq backend "self")}}
    path: "../../apps/web/.env",
    {{else}}
    path: "../../apps/server/.env",
    {{/if}}
});

export default {
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  }
} satisfies PrismaConfig;
`],
  ["db/prisma/mongodb/prisma/schema/schema.prisma.hbs", `generator client {
  provider = "prisma-client"
  output   = "../generated"
  moduleFormat = "esm"
  {{#if (eq runtime "bun")}}
  runtime = "bun"
  {{/if}}
  {{#if (eq runtime "node")}}
  runtime = "nodejs"
  {{/if}}
  {{#if (or (eq runtime "workers") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
  runtime = "workerd"
  {{/if}}
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
`],
  ["db/prisma/mongodb/src/index.ts.hbs", `import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient();

export default prisma;
`],
  ["db/prisma/mysql/prisma.config.ts.hbs", `import path from "node:path";
import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({
  {{#if (eq backend "self")}}
  path: "../../apps/web/.env",
  {{else}}
  path: "../../apps/server/.env",
  {{/if}}
});

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});`],
  ["db/prisma/mysql/prisma/schema/schema.prisma.hbs", `generator client {
  provider      = "prisma-client"
  output        = "../generated"
  moduleFormat  = "esm"
  {{#if (eq runtime "bun")}}
  runtime       = "bun"
  {{/if}}
  {{#if (eq runtime "node")}}
  runtime       = "nodejs"
  {{/if}}
  {{#if (or (eq runtime "workers") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
  runtime       = "workerd"
  {{/if}}
}

datasource db {
  provider = "mysql"

}`],
  ["db/prisma/mysql/src/index.ts.hbs", `{{#if (eq runtime "workers")}}
import { PrismaClient } from "../prisma/generated/client";
import { env } from "@{{projectName}}/env/server";

{{else}}
import { PrismaClient } from "../prisma/generated/client";

{{#if (and (ne serverDeploy "cloudflare") (or (ne backend "self") (ne webDeploy "cloudflare")))}}
const prisma = createPrismaClient();
export default prisma;
{{/if}}
{{/if}}
`],
  ["db/prisma/postgres/prisma.config.ts.hbs", `import path from "node:path";
import { defineConfig, env } from 'prisma/config'
import dotenv from 'dotenv'

dotenv.config({
    {{#if (eq backend "self")}}
    path: "../../apps/web/.env",
    {{else}}
    path: "../../apps/server/.env",
    {{/if}}
})

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
    },
    datasource: {
        url: env('DATABASE_URL'),
    },
})
`],
  ["db/prisma/postgres/prisma/schema/schema.prisma.hbs", `generator client {
  provider = "prisma-client"
  output   = "../generated"
  moduleFormat = "esm"
  {{#if (eq runtime "bun")}}
  runtime = "bun"
  {{/if}}
  {{#if (eq runtime "node")}}
  runtime = "nodejs"
  {{/if}}
  {{#if (or (eq runtime "workers") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
  runtime = "workerd"
  {{/if}}
}

datasource db {
  provider = "postgresql"

}
`],
  ["db/prisma/postgres/src/index.ts.hbs", `{{#if (eq runtime "workers")}}
import { PrismaClient } from "../prisma/generated/client";
import { env } from "@{{projectName}}/env/server";
{{#if (eq dbSetup "neon")}}
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

neonConfig.poolQueryViaFetch = true;

export function createPrismaClient() {
	return new PrismaClient({
		adapter: new PrismaNeon({
			connectionString: env.DATABASE_URL,
		}),
	});
}

{{else if (eq dbSetup "prisma-postgres")}}
import { PrismaPg } from "@prisma/adapter-pg";

export function createPrismaClient() {
	const adapter = new PrismaPg({
		connectionString: env.DATABASE_URL,
		maxUses: 1,
	});

	return new PrismaClient({ adapter });
}

{{else}}
import { PrismaPg } from "@prisma/adapter-pg";

export function createPrismaClient() {
	const adapter = new PrismaPg({
		connectionString: env.DATABASE_URL,
		maxUses: 1,
	});
	return new PrismaClient({ adapter });
}

{{/if}}
{{else}}
import { PrismaClient } from "../prisma/generated/client";

{{#if (eq dbSetup "neon")}}
import { PrismaNeon } from "@prisma/adapter-neon";

export function createPrismaClient() {
	const adapter = new PrismaNeon({
		connectionString: env.DATABASE_URL,
	});

	return new PrismaClient({ adapter });
}

{{else if (eq dbSetup "prisma-postgres")}}
import { PrismaPg } from "@prisma/adapter-pg";

export function createPrismaClient() {
	const adapter = new PrismaPg({
		connectionString: env.DATABASE_URL,
{{#if (and (eq backend "self") (eq webDeploy "cloudflare"))}}
		maxUses: 1,
{{/if}}
	});

	return new PrismaClient({ adapter });
}

{{else}}
import { PrismaPg } from "@prisma/adapter-pg";

export function createPrismaClient() {
	const adapter = new PrismaPg({
		connectionString: env.DATABASE_URL,
{{#if (and (eq backend "self") (eq webDeploy "cloudflare"))}}
		maxUses: 1,
{{/if}}
	});
	return new PrismaClient({ adapter });
}

{{/if}}
{{#if (and (ne serverDeploy "cloudflare") (or (ne backend "self") (ne webDeploy "cloudflare")))}}
const prisma = createPrismaClient();
export default prisma;
{{/if}}
{{/if}}
`],
  ["db/prisma/sqlite/prisma.config.ts.hbs", `import path from "node:path";
import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({
  {{#if (eq backend "self")}}
  path: "../../apps/web/.env",
  {{else}}
  path: "../../apps/server/.env",
  {{/if}}
});

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {

  },
});`],
  ["db/prisma/sqlite/prisma/migrations/.gitkeep", ``],
  ["db/prisma/sqlite/prisma/schema/schema.prisma.hbs", `generator client {
  provider = "prisma-client"
  output   = "../generated"
  moduleFormat = "esm"
  {{#if (eq runtime "bun")}}
  runtime = "bun"
  {{/if}}
  {{#if (eq runtime "node")}}
  runtime = "nodejs"
  {{/if}}
  {{#if (or (eq runtime "workers") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
  runtime = "workerd"
  {{/if}}
}

datasource db {
  provider = "sqlite"
}
`],
  ["db/prisma/sqlite/src/index.ts.hbs", `import { PrismaClient } from "../prisma/generated/client";

{{#if (eq dbSetup "d1")}}
import { PrismaD1 } from "@prisma/adapter-d1";

export function createPrismaClient() {
	const adapter = new PrismaD1(env.DB);
	return new PrismaClient({ adapter });
}

{{#if (and (ne runtime "workers") (ne serverDeploy "cloudflare") (or (ne backend "self") (ne webDeploy "cloudflare")))}}
const prisma = createPrismaClient();
export default prisma;
{{/if}}
{{else}}
import { PrismaLibSql } from "@prisma/adapter-libsql";

export function createPrismaClient() {
	const adapter = new PrismaLibSql({
		url: env.DATABASE_URL,

	});

	return new PrismaClient({ adapter });
}

{{#if (and (ne runtime "workers") (ne serverDeploy "cloudflare") (or (ne backend "self") (ne webDeploy "cloudflare")))}}
const prisma = createPrismaClient();
export default prisma;
{{/if}}
{{/if}}
`],
  ["deploy/docker/compose/_dockerignore", `**/node_modules
.git

**/dist
**/build
**/.next
**/.nuxt
**/.output
**/.svelte-kit
**/.astro
**/.turbo
.turbo

**/.wrangler
**/.alchemy
**/.expo
**/.vercel
*.log

Dockerfile
**/Dockerfile
docker-compose.yml

# Secrets stay out of image layers; runtime env comes from compose env_file,
# build-time public values come from compose build args
**/.env
**/.env.*
!**/.env.example
`],
  ["deploy/docker/compose/docker-compose.yml.hbs", `name: {{projectName}}

services:
{{#if (eq webDeploy "docker")}}
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile

    init: true
    ports:

    env_file:
      - path: apps/web/.env
        required: false
{{#if (eq backend "self")}}
{{#if (or (eq dbSetup "docker") (eq auth "better-auth"))}}
    environment:
{{#if (eq auth "better-auth")}}
      BETTER_AUTH_URL: http://localhost:3001
      CORS_ORIGIN: http://localhost:3001
{{/if}}
{{#if (and (eq dbSetup "docker") (eq database "postgres"))}}
      DATABASE_URL: postgresql://postgres:\${POSTGRES_PASSWORD:-password}@postgres:5432/{{projectName}}
{{/if}}
{{#if (and (eq dbSetup "docker") (eq database "mysql"))}}
      DATABASE_URL: mysql://user:\${MYSQL_PASSWORD:-password}@mysql:3306/{{projectName}}
{{/if}}
{{#if (and (eq dbSetup "docker") (eq database "mongodb"))}}
      DATABASE_URL: mongodb://root:\${MONGO_PASSWORD:-password}@mongodb:27017/{{projectName}}?authSource=admin
{{/if}}
{{/if}}
{{#if (eq dbSetup "docker")}}
    depends_on:
      {{database}}:
        condition: service_healthy
{{/if}}
{{else}}
{{#if (eq serverDeploy "docker")}}

    depends_on:
      server:
        condition: service_healthy
{{/if}}
{{/if}}
    healthcheck:

      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    restart: unless-stopped

{{/if}}
{{#if (and (eq serverDeploy "docker") (ne backend "self"))}}
  server:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    init: true
    ports:
      - "3000:3000"
    env_file:
      - path: apps/server/.env
        required: false
{{#if (or (eq webDeploy "docker") (eq dbSetup "docker"))}}
    environment:
{{#if (eq webDeploy "docker")}}
      CORS_ORIGIN: http://localhost:3001
{{/if}}
{{#if (and (eq dbSetup "docker") (eq database "postgres"))}}
      DATABASE_URL: postgresql://postgres:\${POSTGRES_PASSWORD:-password}@postgres:5432/{{projectName}}
{{/if}}
{{#if (and (eq dbSetup "docker") (eq database "mysql"))}}
      DATABASE_URL: mysql://user:\${MYSQL_PASSWORD:-password}@mysql:3306/{{projectName}}
{{/if}}
{{#if (and (eq dbSetup "docker") (eq database "mongodb"))}}
      DATABASE_URL: mongodb://root:\${MONGO_PASSWORD:-password}@mongodb:27017/{{projectName}}?authSource=admin
{{/if}}
{{/if}}
    healthcheck:
      test:
        [
          "CMD",
          "node",
          "-e",
          "fetch('http://localhost:3000/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))",
        ]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
{{#if (eq dbSetup "docker")}}
    depends_on:
      {{database}}:
        condition: service_healthy
{{/if}}
    restart: unless-stopped

{{/if}}
{{#if (eq dbSetup "docker")}}
{{#if (eq database "postgres")}}
  postgres:
    image: postgres:18
    container_name: {{projectName}}-postgres
    environment:
      POSTGRES_DB: {{projectName}}
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-password}
    ports:
      - "5432:5432"
    volumes:
      - {{projectName}}_postgres_data:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
{{/if}}
{{#if (eq database "mysql")}}
  mysql:
    image: mysql:8.4
    container_name: {{projectName}}-mysql
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD:-password}
      MYSQL_DATABASE: {{projectName}}
      MYSQL_USER: user
      MYSQL_PASSWORD: \${MYSQL_PASSWORD:-password}
    ports:
      - "3306:3306"
    volumes:
      - {{projectName}}_mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
{{/if}}
{{#if (eq database "mongodb")}}
  mongodb:
    image: mongo:8
    container_name: {{projectName}}-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: \${MONGO_PASSWORD:-password}
      MONGO_INITDB_DATABASE: {{projectName}}
    ports:
      - "27017:27017"
    volumes:
      - {{projectName}}_mongodb_data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
{{/if}}

volumes:
  {{projectName}}_{{database}}_data:
{{/if}}
`],
  ["deploy/docker/server/Dockerfile.hbs", `FROM node:24-slim AS base
{{#if (or (eq packageManager "bun") (eq runtime "bun"))}}
COPY --from=oven/bun:1 /usr/local/bin/bun /usr/local/bin/bun
{{/if}}
{{#if (eq packageManager "pnpm")}}
RUN npm install -g pnpm@11
{{/if}}
WORKDIR /app
ENV SKIP_ENV_VALIDATION=1
{{#if (eq orm "prisma")}}
# prisma generate resolves DATABASE_URL at install time; the real value comes from compose at runtime
ENV DATABASE_URL={{#if (eq database "mysql")}}mysql://build:build@localhost:3306/build{{else if (eq database "mongodb")}}mongodb://localhost:27017/build{{else if (eq database "sqlite")}}file:./build.db{{else}}postgresql://build:build@localhost:5432/build{{/if}}
{{/if}}

COPY . .
{{#if (eq packageManager "bun")}}
RUN --mount=type=cache,target=/root/.bun/install/cache bun install
{{else if (eq packageManager "pnpm")}}
RUN --mount=type=cache,target=/pnpm-store pnpm install --store-dir /pnpm-store
{{else}}
RUN --mount=type=cache,target=/root/.npm npm install
{{/if}}

ENV NODE_ENV=production
RUN cd apps/server && {{packageManager}} run build
ENV SKIP_ENV_VALIDATION=
{{#if (eq orm "prisma")}}
ENV DATABASE_URL=
{{/if}}

EXPOSE 3000

WORKDIR /app/apps/server
{{#if (eq runtime "bun")}}
CMD ["bun", "dist/index.mjs"]
{{else}}
CMD ["node", "dist/index.mjs"]
{{/if}}
`],
  ["deploy/docker/web/react/next/Dockerfile.hbs", `FROM node:24-slim AS builder
{{#if (eq packageManager "bun")}}
COPY --from=oven/bun:1 /usr/local/bin/bun /usr/local/bin/bun
{{/if}}
{{#if (eq packageManager "pnpm")}}
RUN npm install -g pnpm@11
{{/if}}
WORKDIR /app
ENV SKIP_ENV_VALIDATION=1
{{#if (and (eq backend "self") (eq auth "better-auth"))}}
# the build evaluates the auth config; the real secret comes from compose at runtime
ENV BETTER_AUTH_SECRET=build-time-placeholder-secret-not-used-at-runtime
{{/if}}
{{#if (eq orm "prisma")}}
# prisma generate resolves DATABASE_URL at install time; the real value comes from compose at runtime
ENV DATABASE_URL={{#if (eq database "mysql")}}mysql://build:build@localhost:3306/build{{else if (eq database "mongodb")}}mongodb://localhost:27017/build{{else if (eq database "sqlite")}}file:./build.db{{else}}postgresql://build:build@localhost:5432/build{{/if}}
{{/if}}

COPY . .
{{#if (eq packageManager "bun")}}
RUN --mount=type=cache,target=/root/.bun/install/cache bun install
{{else if (eq packageManager "pnpm")}}
RUN --mount=type=cache,target=/pnpm-store pnpm install --store-dir /pnpm-store
{{else}}
RUN --mount=type=cache,target=/root/.npm npm install
{{/if}}

ENV NODE_ENV=production
RUN cd apps/web && {{packageManager}} run build
# standalone output excludes public/; ensure it exists so the runner copy never fails
RUN mkdir -p apps/web/public

FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

ENV HOSTNAME=0.0.0.0
ENV PORT=3001
EXPOSE 3001

CMD ["node", "apps/web/server.js"]
`],
  ["deploy/docker/web/react/react-router/Dockerfile.hbs", `FROM node:24{{#unless (includes addons "vite-plus")}}-slim{{/unless}} AS builder
{{#if (eq packageManager "bun")}}
COPY --from=oven/bun:1 /usr/local/bin/bun /usr/local/bin/bun
{{/if}}
{{#if (eq packageManager "pnpm")}}
RUN npm install -g pnpm@11
{{/if}}
WORKDIR /app
ENV SKIP_ENV_VALIDATION=1
{{#if (and (eq backend "self") (eq auth "better-auth"))}}
# the build evaluates the auth config; the real secret comes from compose at runtime
ENV BETTER_AUTH_SECRET=build-time-placeholder-secret-not-used-at-runtime
{{/if}}
{{#if (eq orm "prisma")}}
# prisma generate resolves DATABASE_URL at install time; the real value comes from compose at runtime
ENV DATABASE_URL={{#if (eq database "mysql")}}mysql://build:build@localhost:3306/build{{else if (eq database "mongodb")}}mongodb://localhost:27017/build{{else if (eq database "sqlite")}}file:./build.db{{else}}postgresql://build:build@localhost:5432/build{{/if}}
{{/if}}

COPY . .
{{#if (eq packageManager "bun")}}
RUN --mount=type=cache,target=/root/.bun/install/cache bun install
{{else if (eq packageManager "pnpm")}}
RUN --mount=type=cache,target=/pnpm-store pnpm install --store-dir /pnpm-store
{{else}}
RUN --mount=type=cache,target=/root/.npm npm install
{{/if}}

ENV NODE_ENV=production
RUN cd apps/web && {{packageManager}} run build

FROM node:24-slim AS runner
WORKDIR /app
COPY --from=builder /app .
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
EXPOSE 3001
CMD ["sh", "-c", "cd apps/web && npm run start"]
`],
  ["deploy/docker/web/react/tanstack-router/Dockerfile.hbs", `FROM node:24{{#unless (includes addons "vite-plus")}}-slim{{/unless}} AS builder
{{#if (eq packageManager "bun")}}
COPY --from=oven/bun:1 /usr/local/bin/bun /usr/local/bin/bun
{{/if}}
{{#if (eq packageManager "pnpm")}}
RUN npm install -g pnpm@11
{{/if}}
WORKDIR /app
ENV SKIP_ENV_VALIDATION=1
{{#if (and (eq backend "self") (eq auth "better-auth"))}}
# the build evaluates the auth config; the real secret comes from compose at runtime
ENV BETTER_AUTH_SECRET=build-time-placeholder-secret-not-used-at-runtime
{{/if}}
{{#if (eq orm "prisma")}}
# prisma generate resolves DATABASE_URL at install time; the real value comes from compose at runtime
ENV DATABASE_URL={{#if (eq database "mysql")}}mysql://build:build@localhost:3306/build{{else if (eq database "mongodb")}}mongodb://localhost:27017/build{{else if (eq database "sqlite")}}file:./build.db{{else}}postgresql://build:build@localhost:5432/build{{/if}}
{{/if}}

COPY . .
{{#if (eq packageManager "bun")}}
RUN --mount=type=cache,target=/root/.bun/install/cache bun install
{{else if (eq packageManager "pnpm")}}
RUN --mount=type=cache,target=/pnpm-store pnpm install --store-dir /pnpm-store
{{else}}
RUN --mount=type=cache,target=/root/.npm npm install
{{/if}}

ENV NODE_ENV=production
RUN cd apps/web && {{packageManager}} run build

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`],
  ["deploy/docker/web/react/tanstack-router/nginx.conf", `server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;

    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
`],
  ["deploy/docker/web/react/tanstack-start/Dockerfile.hbs", `FROM node:24{{#unless (includes addons "vite-plus")}}-slim{{/unless}} AS base
{{#if (eq packageManager "bun")}}
COPY --from=oven/bun:1 /usr/local/bin/bun /usr/local/bin/bun
{{/if}}
{{#if (eq packageManager "pnpm")}}
RUN npm install -g pnpm@11
{{/if}}
WORKDIR /app
ENV SKIP_ENV_VALIDATION=1
{{#if (and (eq backend "self") (eq auth "better-auth"))}}
# the build evaluates the auth config; the real secret comes from compose at runtime
ENV BETTER_AUTH_SECRET=build-time-placeholder-secret-not-used-at-runtime
{{/if}}
{{#if (eq orm "prisma")}}
# prisma generate resolves DATABASE_URL at install time; the real value comes from compose at runtime
ENV DATABASE_URL={{#if (eq database "mysql")}}mysql://build:build@localhost:3306/build{{else if (eq database "mongodb")}}mongodb://localhost:27017/build{{else if (eq database "sqlite")}}file:./build.db{{else}}postgresql://build:build@localhost:5432/build{{/if}}
{{/if}}

COPY . .
{{#if (eq packageManager "bun")}}
RUN --mount=type=cache,target=/root/.bun/install/cache bun install
{{else if (eq packageManager "pnpm")}}
RUN --mount=type=cache,target=/pnpm-store pnpm install --store-dir /pnpm-store
{{else}}
RUN --mount=type=cache,target=/root/.npm npm install
{{/if}}

ENV NODE_ENV=production
RUN cd apps/web && {{packageManager}} run build
ENV SKIP_ENV_VALIDATION=
{{#if (and (eq backend "self") (eq auth "better-auth"))}}
ENV BETTER_AUTH_SECRET=
{{/if}}
{{#if (eq orm "prisma")}}
ENV DATABASE_URL=
{{/if}}

ENV HOST=0.0.0.0
ENV PORT=3001
EXPOSE 3001

# SSR chunks require() externals at runtime; must run from the workspace
WORKDIR /app/apps/web
CMD ["node", ".output/server/index.mjs"]
`],
  ["deploy/vercel/_vercelignore", `# Local env files must never ship in deployments: Vercel project env vars are
# the source of truth (bun env:vercel:*), and frameworks like Next.js would
# otherwise load these localhost values at runtime.
.env
.env.*
**/.env
**/.env.*
!**/.env.example
local.db
local.db-*
.alchemy/
`],
  ["deploy/vercel/scripts/sync-vercel-env.ts.hbs", `import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import dotenv from "dotenv";

const DEFAULT_ENVIRONMENT = "preview";
const VALID_ENVIRONMENTS = new Set(["development", "preview", "production"]);
const VERCEL_COMMAND = [{{#if (eq packageManager "npm")}}"npx", "vercel"{{else if (eq packageManager "pnpm")}}"pnpm", "exec", "vercel"{{else}}"bunx", "vercel"{{/if}}] as const;
const DEFAULT_FILES = [
{{#if (eq webDeploy "vercel")}}
	"apps/web/.env",
{{/if}}

];
const SKIP_KEYS = new Set([

]);
const OVERRIDE_KEYS = new Map([

]);

const args = process.argv.slice(2);
const separatorIndex = args.indexOf("--");
const scriptArgs = separatorIndex === -1 ? args : args.slice(0, separatorIndex);
const forwardedArgs = separatorIndex === -1 ? [] : args.slice(separatorIndex + 1);

const environment =
	scriptArgs[0] && VALID_ENVIRONMENTS.has(scriptArgs[0]) ? scriptArgs[0] : DEFAULT_ENVIRONMENT;
const remainingArgs = scriptArgs.slice(VALID_ENVIRONMENTS.has(scriptArgs[0] ?? "") ? 1 : 0);
// Split remaining args into env-file paths and passthrough Vercel CLI flags.
// A bare token counts as a file only when it exists on disk, so flags and their
// values (e.g. \`--scope my-team\`) forward correctly regardless of argument order.
const files: string[] = [];
const passthroughArgs: string[] = [];
for (const arg of remainingArgs) {
	if (!arg.startsWith("-") && existsSync(arg)) {
		files.push(arg);
	} else {
		passthroughArgs.push(arg);
	}
}
const vercelArgs = [...passthroughArgs, ...forwardedArgs];
const envFiles = files.length > 0 ? files : DEFAULT_FILES;

if (envFiles.length === 0) {
	console.log("No env files configured for this Vercel stack.");
	process.exit(0);
}

const env = new Map<string, string>();

for (const file of envFiles) {
	if (!existsSync(file)) {
		console.warn(\`Skipping missing env file: \${file}\`);
		continue;
	}

	for (const [key, value] of Object.entries(dotenv.parse(readFileSync(file, "utf8")))) {
		if (SKIP_KEYS.has(key)) continue;
		env.set(key, OVERRIDE_KEYS.get(key) ?? value);
	}
}

if (env.size === 0) {
	console.log("No Vercel env vars found to sync.");
	process.exit(0);
}

const LOCAL_VALUE_PATTERN = /localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0|^file:/i;
const localKeys = [...env.entries()]
	.filter(([, value]) => LOCAL_VALUE_PATTERN.test(value))
	.map(([key]) => key);
if (localKeys.length > 0) {
	console.warn(
		\`Warning: \${localKeys.join(", ")} look\${localKeys.length === 1 ? "s" : ""} like local-only value(s). Update them in your .env file(s) and re-run this sync if your deployed app should not point at local endpoints.\`,
	);
}

console.log(\`Syncing \${env.size} env var(s) to Vercel \${environment}.\`);
for (const [key, value] of env.entries()) {
	const result = spawnSync(
		VERCEL_COMMAND[0],
		[
			...VERCEL_COMMAND.slice(1),
			"env",
			"add",
			key,
			environment,
			"--force",
			"--yes",
			"--non-interactive",
			...vercelArgs,
		],
		{
			input: \`\${value}\\n\`,
			stdio: ["pipe", "inherit", "inherit"],
			encoding: "utf8",
			// Windows resolves bunx/npx/pnpm via .cmd shims, which need a shell
			shell: process.platform === "win32",
		},
	);

	if (result.error) {
		console.error(\`Failed to sync \${key}: \${result.error.message}\`);
		process.exit(1);
	}

	if (result.status !== 0) {
		console.error(\`Failed to sync \${key}\`);
		process.exit(result.status ?? 1);
	}
}

console.log("Vercel env sync complete. Redeploy for changes to take effect.");
`],
  ["examples/ai/fullstack/next/src/app/api/ai/route.ts.hbs", `import { google } from "@ai-sdk/google";
import { createUIMessageStreamResponse, streamText, toUIMessageStream, type UIMessage, convertToModelMessages, wrapLanguageModel } from "ai";
import { devToolsMiddleware } from "@ai-sdk/devtools";

export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages }: { messages: UIMessage[] } = await req.json();

	const model = wrapLanguageModel({
		model: google("gemini-2.5-flash"),
		middleware: devToolsMiddleware(),
	});
	const result = streamText({
		model,
		messages: await convertToModelMessages(messages),
	});

	return createUIMessageStreamResponse({
		stream: toUIMessageStream({ stream: result.stream }),
	});
}
`],
  ["examples/ai/fullstack/tanstack-start/src/routes/api/ai/$.ts.hbs", `import { createFileRoute } from "@tanstack/react-router";
import { google } from "@ai-sdk/google";
import { createUIMessageStreamResponse, streamText, toUIMessageStream, type UIMessage, convertToModelMessages, wrapLanguageModel } from "ai";
import { devToolsMiddleware } from "@ai-sdk/devtools";

export const Route = createFileRoute("/api/ai/$")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages }: { messages: UIMessage[] } = await request.json();

          const model = wrapLanguageModel({
            model: google("gemini-2.5-flash"),
            middleware: devToolsMiddleware(),
          });
          const result = streamText({
            model,
            messages: await convertToModelMessages(messages),
          });

          return createUIMessageStreamResponse({
            stream: toUIMessageStream({ stream: result.stream }),
          });
        } catch (error) {
          console.error("AI API error:", error);
          return new Response(
            JSON.stringify({ error: "Failed to process AI request" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
`],
  ["examples/ai/native/bare/app/(drawer)/ai.tsx.hbs", `
`],
  ["examples/ai/native/bare/polyfills.js", `import structuredClone from "@ungap/structured-clone";
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import("react-native/Libraries/Utilities/PolyfillFunctions");

    const { TextEncoderStream, TextDecoderStream } =
      await import("@stardazed/streams-text-encoding");

    if (!("structuredClone" in global)) {
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  };

  setupPolyfills();
}

export {};
`],
  ["examples/ai/native/unistyles/app/(drawer)/ai.tsx.hbs", `import "@/unistyles";

`],
  ["examples/ai/native/unistyles/polyfills.js", `import structuredClone from "@ungap/structured-clone";
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import("react-native/Libraries/Utilities/PolyfillFunctions");

    const { TextEncoderStream, TextDecoderStream } =
      await import("@stardazed/streams-text-encoding");

    if (!("structuredClone" in global)) {
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  };

  setupPolyfills();
}

export {};
`],
  ["examples/ai/native/uniwind/app/(drawer)/ai.tsx.hbs", `
`],
  ["examples/ai/native/uniwind/polyfills.js", `import structuredClone from "@ungap/structured-clone";
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import("react-native/Libraries/Utilities/PolyfillFunctions");

    const { TextEncoderStream, TextDecoderStream } =
      await import("@stardazed/streams-text-encoding");

    if (!("structuredClone" in global)) {
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  };

  setupPolyfills();
}

export {};
`],
  ["examples/ai/web/react/next/src/app/ai/page.tsx.hbs", `
`],
  ["examples/ai/web/react/react-router/src/routes/ai.tsx.hbs", `
`],
  ["examples/ai/web/react/tanstack-router/src/routes/ai.tsx.hbs", ``],
  ["examples/ai/web/react/tanstack-start/src/routes/ai.tsx.hbs", ``],
  ["examples/todo/native/bare/app/(drawer)/todos.tsx.hbs", `import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Container } from "@/components/container";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
`],
  ["examples/todo/native/unistyles/app/(drawer)/todos.tsx.hbs", `import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Container } from "@/components/container";
`],
  ["examples/todo/native/uniwind/app/(drawer)/todos.tsx.hbs", `import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Container } from "@/components/container";
`],
  ["examples/todo/server/drizzle/base/src/routers/todo.ts.hbs", `{{#if (eq api "orpc")}}
import { eq } from "drizzle-orm";
import z from "zod";
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
import { createDb } from "@{{projectName}}/db";
{{else}}
import { db } from "@{{projectName}}/db";
{{/if}}
import { todo } from "@{{projectName}}/db/schema/todo";
import { publicProcedure } from "../index";

export const todoRouter = {
  getAll: publicProcedure.handler(async () => {
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
    const db = createDb();
{{/if}}
    return await db.select().from(todo);
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .handler(async ({ input }) => {
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
      const db = createDb();
{{/if}}
      return await db
        .insert(todo)
        .values({
          text: input.text,
        });
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .handler(async ({ input }) => {
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
      const db = createDb();
{{/if}}
      return await db
        .update(todo)
        .set({ completed: input.completed })
        .where(eq(todo.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
      const db = createDb();
{{/if}}
      return await db.delete(todo).where(eq(todo.id, input.id));
    }),
};
{{/if}}

`],
  ["examples/todo/server/drizzle/mysql/src/schema/todo.ts", `import { mysqlTable, varchar, int, boolean } from "drizzle-orm/mysql-core";

export const todo = mysqlTable("todo", {
  id: int("id").primaryKey().autoincrement(),
  text: varchar("text", { length: 255 }).notNull(),
  completed: boolean("completed").default(false).notNull(),
});
`],
  ["examples/todo/server/drizzle/postgres/src/schema/todo.ts", `import { pgTable, text, boolean, serial } from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  completed: boolean("completed").default(false).notNull(),
});
`],
  ["examples/todo/server/drizzle/sqlite/src/schema/todo.ts", `import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todo = sqliteTable("todo", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false).notNull(),
});
`],
  ["examples/todo/server/mongoose/base/src/routers/todo.ts.hbs", `{{#if (eq api "orpc")}}
import z from "zod";
import "@{{projectName}}/db";
import { publicProcedure } from "../index";
import { Todo } from "@{{projectName}}/db/models/todo.model";

export const todoRouter = {
    getAll: publicProcedure.handler(async () => {
        const todos = await Todo.find().lean();
        return todos.map((todo) => ({ ...todo, id: todo.id }));
    }),

    create: publicProcedure
        .input(z.object({ text: z.string().min(1) }))
        .handler(async ({ input }) => {
            const newTodo = await Todo.create({ text: input.text });
            const todo = newTodo.toObject();
            return { ...todo, id: todo.id };
    }),

    toggle: publicProcedure
        .input(z.object({ id: z.string(), completed: z.boolean() }))
        .handler(async ({ input }) => {
            await Todo.updateOne({ id: input.id }, { completed: input.completed });
            return { success: true };
    }),

    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .handler(async ({ input }) => {
            await Todo.deleteOne({ id: input.id });
            return { success: true };
    }),
};

{{/if}}

`],
  ["examples/todo/server/mongoose/mongodb/src/models/todo.model.ts.hbs", `import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const todoSchema = new Schema({
  id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  collection: 'todo',
  id: false,
});

const Todo = model('Todo', todoSchema);

export { Todo };
`],
  ["examples/todo/server/prisma/base/src/routers/todo.ts.hbs", `{{#if (eq api "orpc")}}
import z from "zod";
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
import { createPrismaClient } from "@{{projectName}}/db";
{{else}}
import prisma from "@{{projectName}}/db";
{{/if}}
import { publicProcedure } from "../index";

export const todoRouter = {
  getAll: publicProcedure.handler(async () => {
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
    const prisma = createPrismaClient();
{{/if}}
    return await prisma.todo.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .handler(async ({ input }) => {
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
      const prisma = createPrismaClient();
{{/if}}
      return await prisma.todo.create({
        data: {
          text: input.text,
        },
      });
    }),

  toggle: publicProcedure
    {{#if (eq database "mongodb")}}
    .input(z.object({ id: z.string(), completed: z.boolean() }))
    {{else}}
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    {{/if}}
    .handler(async ({ input }) => {
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
      const prisma = createPrismaClient();
{{/if}}
      return await prisma.todo.update({
        where: { id: input.id },
        data: { completed: input.completed },
      });
    }),

  delete: publicProcedure
    {{#if (eq database "mongodb")}}
    .input(z.object({ id: z.string() }))
    {{else}}
    .input(z.object({ id: z.number() }))
    {{/if}}
    .handler(async ({ input }) => {
{{#if (or (eq runtime "workers") (eq serverDeploy "cloudflare") (and (eq backend "self") (eq webDeploy "cloudflare")))}}
      const prisma = createPrismaClient();
{{/if}}
      return await prisma.todo.delete({
        where: { id: input.id },
      });
    }),
};
{{/if}}

`],
  ["examples/todo/server/prisma/mongodb/prisma/schema/todo.prisma.hbs", `model Todo {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  text      String
  completed Boolean @default(false)

  @@map("todo")
}
`],
  ["examples/todo/server/prisma/mysql/prisma/schema/todo.prisma.hbs", `model Todo {
  id        Int     @id @default(autoincrement())
  text      String
  completed Boolean @default(false)

  @@map("todo")
}
`],
  ["examples/todo/server/prisma/postgres/prisma/schema/todo.prisma.hbs", `model Todo {
  id        Int     @id @default(autoincrement())
  text      String
  completed Boolean @default(false)

  @@map("todo")
}
`],
  ["examples/todo/server/prisma/sqlite/prisma/schema/todo.prisma.hbs", `model Todo {
  id        Int     @id @default(autoincrement())
  text      String
  completed Boolean @default(false)

  @@map("todo")
}
`],
  ["examples/todo/web/react/next/src/app/todos/page.tsx.hbs", `"use client"

import { Button } from "@{{projectName}}/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@{{projectName}}/ui/components/card";
import { Checkbox } from "@{{projectName}}/ui/components/checkbox";
import { Input } from "@{{projectName}}/ui/components/input";
import { Loader2, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";

`],
  ["examples/todo/web/react/react-router/src/routes/todos.tsx.hbs", `import { Button } from "@{{projectName}}/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@{{projectName}}/ui/components/card";
import { Checkbox } from "@{{projectName}}/ui/components/checkbox";
import { Input } from "@{{projectName}}/ui/components/input";
import { Loader2, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";

`],
  ["examples/todo/web/react/tanstack-router/src/routes/todos.tsx.hbs", `import { Button } from "@{{projectName}}/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@{{projectName}}/ui/components/card";
import { Checkbox } from "@{{projectName}}/ui/components/checkbox";
import { Input } from "@{{projectName}}/ui/components/input";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";

`],
  ["examples/todo/web/react/tanstack-start/src/routes/todos.tsx.hbs", `import { Button } from "@{{projectName}}/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@{{projectName}}/ui/components/card";
import { Checkbox } from "@{{projectName}}/ui/components/checkbox";
import { Input } from "@{{projectName}}/ui/components/input";
import { createFileRoute } from "@tanstack/react-router";

import { useState, type FormEvent } from "react";

`],
  ["extras/_npmrc.hbs", `node-linker=isolated
`],
  ["extras/env.d.ts.hbs", `{{#if (eq serverDeploy "cloudflare")}}
import { type server } from "@{{projectName}}/infra/alchemy.run";
{{else}}
import { type web as server } from "@{{projectName}}/infra/alchemy.run";
{{/if}}

// This file infers types for the cloudflare:workers environment from your Alchemy Worker.
// @see https://alchemy.run/concepts/bindings/#type-safe-bindings

export type CloudflareEnv = typeof server.Env;

declare global {
  type Env = CloudflareEnv;
}

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends CloudflareEnv {}
  }
}
`],
  ["extras/pnpm-workspace.yaml.hbs", `packages:
  - "apps/*"
  - "packages/*"

`],
  ["frontend/native/bare/_gitignore", `node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# macOS
.DS_Store

# Temporary files created by Metro to check the health of the file watcher
.metro-health-check*

`],
  ["frontend/native/bare/app.json.hbs", `{
	"expo": {
		"name": "{{projectName}}",
		"slug": "{{projectName}}",
		"version": "1.0.0",
		"orientation": "portrait",
		"icon": "./assets/images/icon.png",
		"scheme": "{{projectName}}",
		"userInterfaceStyle": "automatic",
		"ios": {
			"supportsTablet": true
		},
		"android": {
			"adaptiveIcon": {
				"backgroundColor": "#E6F4FE",
				"foregroundImage": "./assets/images/android-icon-foreground.png",
				"backgroundImage": "./assets/images/android-icon-background.png",
				"monochromeImage": "./assets/images/android-icon-monochrome.png"
			},
			"predictiveBackGestureEnabled": false,
			"package": "com.anonymous.mybettertapp"
		},
		"web": {
			"output": "static",
			"favicon": "./assets/images/favicon.png"
		},
		"plugins": [
			"expo-router",
			[
				"expo-splash-screen",
				{
					"image": "./assets/images/splash-icon.png",
					"imageWidth": 200,
					"resizeMode": "contain",
					"backgroundColor": "#ffffff",
					"dark": {
						"backgroundColor": "#000000"
					}
				}
			]
		],
		"experiments": {
			"typedRoutes": true,
			"reactCompiler": true
		}
	}
}
`],
  ["frontend/native/bare/app/_layout.tsx.hbs", `{{#if (includes examples "ai")}}
import "@/polyfills";
{{/if}}

`],
  ["frontend/native/bare/app/(drawer)/_layout.tsx.hbs", `import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

import { HeaderButton } from "@/components/header-button";

const DrawerLayout = () => {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Drawer
      screenOptions=\\{{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerTintColor: theme.text,
        drawerStyle: {
          backgroundColor: theme.background,
        },
        drawerLabelStyle: {
          color: theme.text,
        },
        drawerInactiveTintColor: theme.text,
      }}
    >
      <Drawer.Screen
        name="index"
        options=\\{{
          headerTitle: "Home",
          drawerLabel: "Home",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options=\\{{
          headerTitle: "Tabs",
          drawerLabel: "Tabs",
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="border-bottom" size={size} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      {{#if (includes examples "todo")}}
      <Drawer.Screen
        name="todos"
        options=\\{{
          headerTitle: "Todos",
          drawerLabel: "Todos",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="checkbox-outline" size={size} color={color} />
          ),
        }}
      />
      {{/if}}
      {{#if (includes examples "ai")}}
      <Drawer.Screen
        name="ai"
        options=\\{{
          headerTitle: "AI",
          drawerLabel: "AI",
          drawerIcon: ({ size, color }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      {{/if}}
    </Drawer>
  );
};

export default DrawerLayout;

`],
  ["frontend/native/bare/app/(drawer)/(tabs)/_layout.tsx.hbs", `import { TabBarIcon } from "@/components/tabbar-icon";
import { useColorScheme } from "@/lib/use-color-scheme";
import { Tabs } from "expo-router";
import { NAV_THEME } from "@/lib/constants";

export default function TabLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Tabs
      screenOptions=\\{{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options=\\{{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options=\\{{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="compass" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

`],
  ["frontend/native/bare/app/(drawer)/(tabs)/index.tsx.hbs", `import { Container } from "@/components/container";
import { Column, Host, Text as ExpoUIText } from "@expo/ui";
import { ScrollView, View, StyleSheet } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

export default function TabOne() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Container>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Host matchContents=\\{{ vertical: true }}>
            <Column spacing={8}>
              <ExpoUIText
                textStyle=\\{{ color: theme.text, fontSize: 24, fontWeight: "bold" }}
              >
                Tab One
              </ExpoUIText>
              <ExpoUIText
                textStyle=\\{{ color: theme.text, fontSize: 16 }}
                style=\\{{ opacity: 0.7 }}
              >
                Explore the first section of your app
              </ExpoUIText>
            </Column>
          </Host>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 16,
  },
  content: {
    paddingVertical: 16,
  },
});
`],
  ["frontend/native/bare/app/(drawer)/(tabs)/two.tsx.hbs", `import { Container } from "@/components/container";
import { Column, Host, Text as ExpoUIText } from "@expo/ui";
import { ScrollView, View, StyleSheet } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

export default function TabTwo() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Container>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Host matchContents=\\{{ vertical: true }}>
            <Column spacing={8}>
              <ExpoUIText
                textStyle=\\{{ color: theme.text, fontSize: 24, fontWeight: "bold" }}
              >
                Tab Two
              </ExpoUIText>
              <ExpoUIText
                textStyle=\\{{ color: theme.text, fontSize: 16 }}
                style=\\{{ opacity: 0.7 }}
              >
                Discover more features and content
              </ExpoUIText>
            </Column>
          </Host>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 16,
  },
  content: {
    paddingVertical: 16,
  },
});
`],
  ["frontend/native/bare/app/(drawer)/index.tsx.hbs", `import { Column, Host, Text as ExpoUIText } from "@expo/ui";
import { View, ScrollView, StyleSheet } from "react-native";

import { Container } from "@/components/container";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
{{/if}}

export default function Home() {
const { colorScheme } = useColorScheme();
const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
{{#if (eq api "orpc")}}
const healthCheck = useQuery(orpc.healthCheck.queryOptions());
{{/if}}

return (
<Container>
  <ScrollView style={styles.scrollView} contentInsetAdjustmentBehavior="never">
    <View style={styles.content}>
      <Host style={styles.titleHost}>
        <ExpoUIText
          textStyle=\\{{ color: theme.text, fontSize: 24, fontWeight: "bold", textAlign: "center" }}
        >
          BETTER T STACK
        </ExpoUIText>
      </Host>

      `],
  ["frontend/native/bare/app/+not-found.tsx.hbs", `import { Container } from "@/components/container";
import { Button, Column, Host, Text as ExpoUIText } from "@expo/ui";
import { Stack, router } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

export default function NotFoundScreen() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <>
      <Stack.Screen options=\\{{ title: "Oops!" }} />
      <Container>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>🤔</Text>
            <Host matchContents=\\{{ vertical: true }}>
              <Column spacing={12} alignment="center">
                <ExpoUIText
                  textStyle=\\{{ color: theme.text, fontSize: 20, fontWeight: "bold", textAlign: "center" }}
                >
                  Page Not Found
                </ExpoUIText>
                <ExpoUIText
                  textStyle=\\{{ color: theme.text, fontSize: 14, textAlign: "center" }}
                  style=\\{{ opacity: 0.7 }}
                >
                  Sorry, the page you're looking for doesn't exist.
                </ExpoUIText>
                <Button
                  label="Go to Home"
                  variant="outlined"
                  onPress={() => router.replace("/")}
                />
              </Column>
            </Host>
          </View>
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
});
`],
  ["frontend/native/bare/app/modal.tsx.hbs", `import { Container } from "@/components/container";
import { Button, Column, Host, Text as ExpoUIText } from "@expo/ui";
import { View, StyleSheet } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

export default function Modal() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Container>
      <View style={styles.container}>
        <Host style={styles.expoUiHost}>
          <Column spacing={12} alignment="center">
            <ExpoUIText
              textStyle=\\{{ color: theme.text, fontSize: 20, fontWeight: "bold" }}
            >
              Modal
            </ExpoUIText>
            <ExpoUIText
              textStyle=\\{{ color: theme.text, fontSize: 14, textAlign: "center" }}
              style=\\{{ opacity: 0.7 }}
            >
              Built with Expo UI universal components
            </ExpoUIText>
            <Button label="Native control" onPress={() => null} />
          </Column>
        </Host>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  expoUiHost: {
    alignSelf: "stretch",
    padding: 16,
  },
});
`],
  ["frontend/native/bare/components/container.tsx.hbs", `import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import { StyleSheet } from "react-native";

export function Container({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  const backgroundColor = colorScheme === "dark" 
    ? NAV_THEME.dark.background 
    : NAV_THEME.light.background;

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={[styles.container, { backgroundColor }]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
`],
  ["frontend/native/bare/components/header-button.tsx.hbs", `import FontAwesome from "@expo/vector-icons/FontAwesome";
import { forwardRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useColorScheme } from "@/lib/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";

export const HeaderButton = forwardRef<
  View,
  { onPress?: () => void }
>(({ onPress }, ref) => {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed 
            ? theme.background 
            : theme.card,
        },
      ]}
    >
      {({ pressed }) => (
        <FontAwesome
          name="info-circle"
          size={20}
          color={theme.text}
          style=\\{{
            opacity: pressed ? 0.7 : 1,
          }}
        />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 8,
  },
});

`],
  ["frontend/native/bare/components/tabbar-icon.tsx.hbs", `import FontAwesome from "@expo/vector-icons/FontAwesome";

type FontAwesomeProps = React.ComponentProps<typeof FontAwesome>;

export const TabBarIcon = (props: {
  name: FontAwesomeProps["name"];
  color: FontAwesomeProps["color"];
}) => {
  return <FontAwesome size={24} style=\\{{ marginBottom: -3 }} {...props} />;
};
`],
  ["frontend/native/bare/lib/constants.ts.hbs", `export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)",
    border: "hsl(220 13% 91%)",
    card: "hsl(0 0% 100%)",
    notification: "hsl(0 84.2% 60.2%)",
    primary: "hsl(221.2 83.2% 53.3%)",
    text: "hsl(222.2 84% 4.9%)",
  },
  dark: {
    background: "hsl(222.2 84% 4.9%)",
    border: "hsl(217.2 32.6% 17.5%)",
    card: "hsl(222.2 84% 4.9%)",
    notification: "hsl(0 72% 51%)",
    primary: "hsl(217.2 91.2% 59.8%)",
    text: "hsl(210 40% 98%)",
  },
};

`],
  ["frontend/native/bare/lib/use-color-scheme.ts.hbs", `import { useColorScheme as useRNColorScheme } from "react-native";

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const colorScheme = systemColorScheme ?? "light";
  
  return {
    colorScheme: colorScheme as "light" | "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme: () => {
      // Color scheme is managed by the system in bare mode
      console.warn("setColorScheme is not available in bare mode. Color scheme is managed by the system.");
    },
    toggleColorScheme: () => {
      // Color scheme is managed by the system in bare mode
      console.warn("toggleColorScheme is not available in bare mode. Color scheme is managed by the system.");
    },
  };
}

`],
  ["frontend/native/bare/metro.config.js.hbs", `// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
{{#if (or (eq webDeploy "cloudflare") (eq serverDeploy "cloudflare"))}}
// Alchemy writes runtime state here; block it to avoid Metro refresh loops.
const blockList = config.resolver.blockList ?? [];
const blockListPatterns = Array.isArray(blockList) ? blockList : [blockList];

config.resolver.blockList = [
	...blockListPatterns,
	/[/\\\\]packages[/\\\\]infra[/\\\\]\\.alchemy(?:[/\\\\]|$)/,
];
{{/if}}

module.exports = config;
`],
  ["frontend/native/bare/package.json.hbs", `{
  "name": "native",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "dev": "expo start --clear",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "prebuild": "expo prebuild",
    "web": "expo start --web"
  },
  "dependencies": {
    "@expo/ui": "~57.0.7",
    "@expo/vector-icons": "^15.1.1",
    "@tanstack/react-query": "^5.101.4",
    {{#if (includes examples "ai")}}
    "@stardazed/streams-text-encoding": "^1.0.2",
    "@ungap/structured-clone": "^1.3.3",
    {{/if}}
    "expo": "~57.0.8",
    "expo-constants": "~57.0.7",
    "expo-crypto": "~57.0.1",
    "expo-font": "~57.0.1",
    "expo-linking": "~57.0.4",
    "expo-network": "~57.0.1",
    "expo-router": "~57.0.8",
    "expo-secure-store": "~57.0.1",
    "expo-splash-screen": "~57.0.5",
    "expo-status-bar": "~57.0.1",
    "expo-system-ui": "~57.0.1",
    "expo-web-browser": "~57.0.2",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.0",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-reanimated": "4.5.0",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.10.0"
  },
  "devDependencies": {
    "@types/react": "~19.2.17",
    "typescript": "~6.0.3"
  },
  "private": true
}
`],
  ["frontend/native/bare/tsconfig.json.hbs", `{
	"extends": "expo/tsconfig.base",
	"compilerOptions": {
		"strict": true,
		"paths": {
			"@/*": ["./*"]
		}
	},
	"include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}

`],
  ["frontend/native/base/assets/images/android-icon-background.png", `[Binary file]`],
  ["frontend/native/base/assets/images/android-icon-foreground.png", `[Binary file]`],
  ["frontend/native/base/assets/images/android-icon-monochrome.png", `[Binary file]`],
  ["frontend/native/base/assets/images/favicon.png", `[Binary file]`],
  ["frontend/native/base/assets/images/icon.png", `[Binary file]`],
  ["frontend/native/base/assets/images/partial-react-logo.png", `[Binary file]`],
  ["frontend/native/base/assets/images/react-logo.png", `[Binary file]`],
  ["frontend/native/base/assets/images/react-logo@2x.png", `[Binary file]`],
  ["frontend/native/base/assets/images/react-logo@3x.png", `[Binary file]`],
  ["frontend/native/base/assets/images/splash-icon.png", `[Binary file]`],
  ["frontend/native/unistyles/_gitignore", `node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
# expo router
expo-env.d.ts

.env

ios
android

# macOS
.DS_Store

# Temporary files created by Metro to check the health of the file watcher
.metro-health-check*`],
  ["frontend/native/unistyles/app.json.hbs", `{
  "expo": {
    "name": "{{projectName}}",
    "slug": "{{projectName}}",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "{{projectName}}",
    "userInterfaceStyle": "automatic",
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false,
      "package": "com.anonymous.mybettertapp"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
`],
  ["frontend/native/unistyles/app/_layout.tsx.hbs", `import "@/unistyles";
{{#if (includes examples "ai")}}
import "@/polyfills";
{{/if}}

`],
  ["frontend/native/unistyles/app/(drawer)/_layout.tsx.hbs", `import "@/unistyles";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useUnistyles } from "react-native-unistyles";

import { HeaderButton } from "../../components/header-button";

const DrawerLayout = () => {
  const { theme } = useUnistyles();

  return (
    <Drawer
      screenOptions=\\{{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTitleStyle: {
          color: theme.colors.foreground,
        },
        headerTintColor: theme.colors.foreground,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        drawerLabelStyle: {
          color: theme.colors.foreground,
        },
        drawerInactiveTintColor: theme.colors.mutedForeground,
      }}
    >
      <Drawer.Screen
        name="index"
        options=\\{{
          headerTitle: "Home",
          drawerLabel: "Home",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options=\\{{
          headerTitle: "Tabs",
          drawerLabel: "Tabs",
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="border-bottom" size={size} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      {{#if (includes examples "todo")}}
      <Drawer.Screen
        name="todos"
        options=\\{{
          headerTitle: "Todos",
          drawerLabel: "Todos",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="checkbox-outline" size={size} color={color} />
          ),
        }}
      />
      {{/if}}
      {{#if (includes examples "ai")}}
      <Drawer.Screen
        name="ai"
        options=\\{{
          headerTitle: "AI",
          drawerLabel: "AI",
          drawerIcon: ({ size, color }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      {{/if}}
    </Drawer>
  );
};

export default DrawerLayout;
`],
  ["frontend/native/unistyles/app/(drawer)/(tabs)/_layout.tsx.hbs", `import "@/unistyles";

import { Tabs } from "expo-router";
import { useUnistyles } from "react-native-unistyles";

import { TabBarIcon } from "@/components/tabbar-icon";

export default function TabLayout() {
  const { theme } = useUnistyles();

  return (
    <Tabs
      screenOptions=\\{{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options=\\{{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options=\\{{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="compass" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
`],
  ["frontend/native/unistyles/app/(drawer)/(tabs)/index.tsx.hbs", `import "@/unistyles";

import { Container } from "@/components/container";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function Home() {
  return (
    <Container>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Tab One</Text>
          <Text style={styles.subtitle}>
            Explore the first section of your app
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.lg,
  },
  headerSection: {
    paddingVertical: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize["3xl"],
    fontWeight: "bold",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.mutedForeground,
  },
}));
`],
  ["frontend/native/unistyles/app/(drawer)/(tabs)/two.tsx.hbs", `import "@/unistyles";

import { Container } from "@/components/container";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function TabTwo() {
  return (
    <Container>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Tab Two</Text>
          <Text style={styles.subtitle}>
            Discover more features and content
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.lg,
  },
  headerSection: {
    paddingVertical: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize["3xl"],
    fontWeight: "bold",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.mutedForeground,
  },
}));
`],
  ["frontend/native/unistyles/app/(drawer)/index.tsx.hbs", `import "@/unistyles";

import { ScrollView, Text, View, TouchableOpacity } from "react-native";

import { StyleSheet } from "react-native-unistyles";
import { Container } from "@/components/container";

{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
{{/if}}

export default function Home() {
  {{#if (eq api "orpc")}}
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());
  {{/if}}

  return (
    <Container>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heroTitle}>
          BETTER T STACK
        </Text>

        `],
  ["frontend/native/unistyles/app/+html.tsx.hbs", `import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

import "../unistyles";

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
`],
  ["frontend/native/unistyles/app/+not-found.tsx.hbs", `import "@/unistyles";

import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Container } from "@/components/container";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options=\\{{ title: "Oops!" }} />
      <Container>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>🤔</Text>
            <Text style={styles.title}>Page Not Found</Text>
            <Text style={styles.description}>
              Sorry, the page you're looking for doesn't exist.
            </Text>
            <Link href="/" style={styles.button}>
              <Text style={styles.buttonText}>Go to Home</Text>
            </Link>
          </View>
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  content: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: "bold",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  description: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    maxWidth: 280,
  },
  button: {
    backgroundColor: \`\${theme.colors.primary}1A\`, // 10% opacity
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: theme.borderRadius.lg,
  },
  buttonText: {
    color: theme.colors.primary,
    fontWeight: "500",
  },
}));
`],
  ["frontend/native/unistyles/app/modal.tsx.hbs", `import "@/unistyles";

import { Container } from "@/components/container";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function Modal() {
  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Modal</Text>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: "bold",
    color: theme.colors.foreground,
  },
}));
`],
  ["frontend/native/unistyles/babel.config.js.hbs", `module.exports = (api) => {
	api.cache(true);
	const plugins = [];

	plugins.push([
		"react-native-unistyles/plugin",
		{
			root: "src",
			autoProcessRoot: "app",
			autoProcessImports: ["@/components"],
		},
	]);

	plugins.push("react-native-worklets/plugin");

	return {
		presets: ["babel-preset-expo"],

		plugins,
	};
};
`],
  ["frontend/native/unistyles/breakpoints.ts.hbs", `export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  superLarge: 2000,
  tvLike: 4000,
} as const;
`],
  ["frontend/native/unistyles/components/container.tsx.hbs", `import "@/unistyles";

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: rt.insets.bottom,
  },
}));
`],
  ["frontend/native/unistyles/components/header-button.tsx.hbs", `import "@/unistyles";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { forwardRef } from "react";
import { Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export const HeaderButton = forwardRef<
  typeof Pressable,
  { onPress?: () => void }
>(({ onPress }, ref) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      {({ pressed }) => (
        <FontAwesome
          name="info-circle"
          size={20}
          color={styles.icon.color}
          style=\\{{
            opacity: pressed ? 0.7 : 1,
          }}
        />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create((theme) => ({
  button: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: \`\${theme.colors.secondary}80\`, // 50% opacity
  },
  icon: {
    color: theme.colors.secondaryForeground,
  },
}));
`],
  ["frontend/native/unistyles/components/tabbar-icon.tsx.hbs", `import FontAwesome from "@expo/vector-icons/FontAwesome";

type FontAwesomeProps = React.ComponentProps<typeof FontAwesome>;

export const TabBarIcon = (props: {
  name: FontAwesomeProps["name"];
  color: FontAwesomeProps["color"];
}) => {
  return <FontAwesome size={24} style=\\{{ marginBottom: -3 }} {...props} />;
};
`],
  ["frontend/native/unistyles/index.js.hbs", `import './unistyles';
import 'expo-router/entry';
`],
  ["frontend/native/unistyles/metro.config.js.hbs", `const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
{{#if (or (eq webDeploy "cloudflare") (eq serverDeploy "cloudflare"))}}
// Alchemy writes runtime state here; block it to avoid Metro refresh loops.
const blockList = config.resolver.blockList ?? [];
const blockListPatterns = Array.isArray(blockList) ? blockList : [blockList];

config.resolver.blockList = [
	...blockListPatterns,
	/[/\\\\]packages[/\\\\]infra[/\\\\]\\.alchemy(?:[/\\\\]|$)/,
];
{{/if}}

module.exports = config;
`],
  ["frontend/native/unistyles/package.json.hbs", `{
  "name": "native",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "scripts": {
    "dev": "expo start --clear",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.1.1",
    {{#if (includes examples "ai")}}
    "@stardazed/streams-text-encoding": "^1.0.2",
    "@ungap/structured-clone": "^1.3.3",
    {{/if}}
    "babel-preset-expo": "~57.0.4",
    "expo": "~57.0.8",
    "expo-constants": "~57.0.7",
    "expo-crypto": "~57.0.1",
    "expo-dev-client": "~57.0.8",
    "expo-font": "~57.0.1",
    "expo-linking": "~57.0.4",
    "expo-network": "~57.0.1",
    "expo-router": "~57.0.8",
    "expo-secure-store": "~57.0.1",
    "expo-splash-screen": "~57.0.5",
    "expo-status-bar": "~57.0.1",
    "expo-system-ui": "~57.0.1",
    "expo-web-browser": "~57.0.2",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.0",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-nitro-modules": "0.36.3",
    "react-native-reanimated": "4.5.0",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-unistyles": "^3.3.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.10.0"
  },
  "devDependencies": {
    "ajv": "^8.20.0",
    "@babel/core": "^7.29.7",
    "@types/react": "~19.2.17",
    "typescript": "~6.0.3"
  }
}
`],
  ["frontend/native/unistyles/theme.ts.hbs", `const sharedColors = {
  success: "#22C55E",
  destructive: "#EF4444",
  destructiveForeground: "#FFFFFF",
  warning: "#F59E0B",
  info: "#3B82F6",
} as const;

export const lightTheme = {
  colors: {
    ...sharedColors,
    typography: "hsl(0 0% 0%)",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(0 0% 0%)",
    card: "hsl(0 0% 98%)",
    cardForeground: "hsl(0 0% 0%)",
    primary: "hsl(0 0% 10%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(0 0% 95%)",
    secondaryForeground: "hsl(0 0% 0%)",
    muted: "hsl(0 0% 96%)",
    mutedForeground: "hsl(0 0% 45%)",
    accent: "hsl(0 0% 96%)",
    accentForeground: "hsl(0 0% 0%)",
    border: "hsl(0 0% 90%)",
    input: "hsl(0 0% 90%)",
    ring: "hsl(0 0% 20%)",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
} as const;

export const darkTheme = {
  colors: {
    ...sharedColors,
    typography: "hsl(0 0% 100%)",
    background: "hsl(0 0% 0%)",
    foreground: "hsl(0 0% 100%)",
    card: "hsl(0 0% 2%)",
    cardForeground: "hsl(0 0% 100%)",
    primary: "hsl(0 0% 90%)",
    primaryForeground: "hsl(0 0% 0%)",
    secondary: "hsl(0 0% 10%)",
    secondaryForeground: "hsl(0 0% 100%)",
    muted: "hsl(0 0% 8%)",
    mutedForeground: "hsl(0 0% 65%)",
    accent: "hsl(0 0% 8%)",
    accentForeground: "hsl(0 0% 100%)",
    border: "hsl(0 0% 15%)",
    input: "hsl(0 0% 15%)",
    ring: "hsl(0 0% 80%)",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
} as const;
`],
  ["frontend/native/unistyles/tsconfig.json.hbs", `{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
`],
  ["frontend/native/unistyles/unistyles.ts.hbs", `import { StyleSheet } from "react-native-unistyles";

import { breakpoints } from "./breakpoints";
import { darkTheme, lightTheme } from "./theme";

type AppBreakpoints = typeof breakpoints;

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module "react-native-unistyles" {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  breakpoints,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  settings: {
    adaptiveThemes: true,
  },
});
`],
  ["frontend/native/uniwind/_gitignore", `node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# macOS
.DS_Store

# Temporary files created by Metro to check the health of the file watcher
.metro-health-check*

# UniWind generated types
uniwind-types.d.ts

`],
  ["frontend/native/uniwind/app.json.hbs", `{
  "expo": {
    "scheme": "{{projectName}}",
    "userInterfaceStyle": "automatic",
    "orientation": "default",
    "web": {
      "bundler": "metro"
    },
    "name": "{{projectName}}",
    "slug": "{{projectName}}",
    "plugins": [
      "expo-font"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
`],
  ["frontend/native/uniwind/app/_layout.tsx.hbs", `{{#if (includes examples "ai")}}
import "@/polyfills";
{{/if}}

import "@/global.css";
`],
  ["frontend/native/uniwind/app/(drawer)/_layout.tsx.hbs", `import React, { useCallback } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useThemeColor } from "heroui-native";
import { Pressable, Text } from "react-native";
import { ThemeToggle } from "@/components/theme-toggle";

function DrawerLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  return (
    <Drawer
      screenOptions=\\{{
        headerTintColor: themeColorForeground,
        headerStyle: { backgroundColor: themeColorBackground },
        headerTitleStyle: {
          fontWeight: "600",
          color: themeColorForeground,
        },
        headerRight: renderThemeToggle,
        drawerStyle: { backgroundColor: themeColorBackground },
      }}
    >
      <Drawer.Screen
        name="index"
        options=\\{{
          headerTitle: "Home",
          drawerLabel: ({ color, focused }) => (
            <Text style=\\{{ color: focused ? color : themeColorForeground }}>Home</Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <Ionicons name="home-outline" size={size} color={focused ? color : themeColorForeground} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options=\\{{
          headerTitle: "Tabs",
          drawerLabel: ({ color, focused }) => (
            <Text style=\\{{ color: focused ? color : themeColorForeground }}>Tabs</Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <MaterialIcons name="border-bottom" size={size} color={focused ? color : themeColorForeground} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable className="mr-4">
                <Ionicons name="add-outline" size={24} color={themeColorForeground} />
              </Pressable>
            </Link>
          ),
        }}
      />
      {{#if (includes examples "todo")}}
      <Drawer.Screen
        name="todos"
        options=\\{{
          headerTitle: "Todos",
          drawerLabel: ({ color, focused }) => (
            <Text style=\\{{ color: focused ? color : themeColorForeground }}>Todos</Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <Ionicons name="checkbox-outline" size={size} color={focused ? color : themeColorForeground} />
          ),
        }}
      />
      {{/if}}
      {{#if (includes examples "ai")}}
      <Drawer.Screen
        name="ai"
        options=\\{{
          headerTitle: "AI",
          drawerLabel: ({ color, focused }) => (
            <Text style=\\{{ color: focused ? color : themeColorForeground }}>AI</Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={size} color={focused ? color : themeColorForeground} />
          ),
        }}
      />
      {{/if}}
    </Drawer>
  );
}

export default DrawerLayout;`],
  ["frontend/native/uniwind/app/(drawer)/(tabs)/_layout.tsx.hbs", `import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";

export default function TabLayout() {
	const themeColorForeground = useThemeColor("foreground");
	const themeColorBackground = useThemeColor("background");

	return (
		<Tabs
			screenOptions=\\{{
				headerShown: false,
				headerStyle: {
					backgroundColor: themeColorBackground,
				},
				headerTintColor: themeColorForeground,
				headerTitleStyle: {
					color: themeColorForeground,
					fontWeight: "600",
				},
				tabBarStyle: {
					backgroundColor: themeColorBackground,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options=\\{{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="two"
				options=\\{{
					title: "Explore",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="compass" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
`],
  ["frontend/native/uniwind/app/(drawer)/(tabs)/index.tsx.hbs", `import { Container } from "@/components/container";
import { Text, View } from "react-native";
import { Card } from "heroui-native";

export default function Home() {
	return (
		<Container className="p-6">
			<View className="flex-1 justify-center items-center">
				<Card variant="secondary" className="p-8 items-center">
					<Card.Title className="text-3xl mb-2">Tab One</Card.Title>
				</Card>
			</View>
		</Container>
	);
}
`],
  ["frontend/native/uniwind/app/(drawer)/(tabs)/two.tsx.hbs", `import { Container } from "@/components/container";
import { Text, View } from "react-native";
import { Card } from "heroui-native";

export default function TabTwo() {
	return (
		<Container className="p-6">
			<View className="flex-1 justify-center items-center">
				<Card variant="secondary" className="p-8 items-center">
					<Card.Title className="text-3xl mb-2">TabTwo</Card.Title>
				</Card>
			</View>
		</Container>
	);
}
`],
  ["frontend/native/uniwind/app/(drawer)/index.tsx.hbs", `import { Text, View } from "react-native";

import { Container } from "@/components/container";
{{#if (eq api "orpc")}}
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
{{/if}}

`],
  ["frontend/native/uniwind/app/+not-found.tsx.hbs", `import { Link, Stack } from "expo-router";
import { Button, Surface } from "heroui-native";
import { Text, View } from "react-native";

import { Container } from "@/components/container";

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options=\\{{ title: "Not Found" }} />
			<Container>
				<View className="flex-1 justify-center items-center p-4">
					<Surface variant="secondary" className="items-center p-6 max-w-sm rounded-lg">
						<Text className="text-4xl mb-3">🤔</Text>
						<Text className="text-foreground font-medium text-lg mb-1">Page Not Found</Text>
						<Text className="text-muted text-sm text-center mb-4">
							The page you're looking for doesn't exist.
						</Text>
						<Link href="/" asChild>
							<Button size="sm">Go Home</Button>
						</Link>
					</Surface>
				</View>
			</Container>
		</>
	);
}
`],
  ["frontend/native/uniwind/app/modal.tsx.hbs", `import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Text, View } from "react-native";

import { Container } from "@/components/container";

function Modal() {
	const accentForegroundColor = useThemeColor("accent-foreground");

	function handleClose() {
		router.back();
	}

	return (
		<Container>
			<View className="flex-1 justify-center items-center p-4">
				<Surface variant="secondary" className="p-5 w-full max-w-sm rounded-lg">
					<View className="items-center">
						<View className="w-12 h-12 bg-accent rounded-lg items-center justify-center mb-3">
							<Ionicons name="checkmark" size={24} color={accentForegroundColor} />
						</View>
						<Text className="text-foreground font-medium text-lg mb-1">Modal Screen</Text>
						<Text className="text-muted text-sm text-center mb-4">
							This is an example modal screen for dialogs and confirmations.
						</Text>
					</View>
					<Button onPress={handleClose} className="w-full" size="sm">
						<Button.Label>Close</Button.Label>
					</Button>
				</Surface>
			</View>
		</Container>
	);
}

export default Modal;
`],
  ["frontend/native/uniwind/components/container.tsx.hbs", `import { cn } from "heroui-native";
import { type PropsWithChildren } from "react";
import { ScrollView, View, type ScrollViewProps, type ViewProps } from "react-native";
import Animated, { type AnimatedProps } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedView = Animated.createAnimatedComponent(View);

type Props = AnimatedProps<ViewProps> & {
  className?: string;
  isScrollable?: boolean;
  scrollViewProps?: Omit<ScrollViewProps, "contentContainerStyle">;
};

export function Container({
  children,
  className,
  isScrollable = true,
  scrollViewProps,
  ...props
}: PropsWithChildren<Props>) {
  const insets = useSafeAreaInsets();

  return (
    <AnimatedView
      className={cn("flex-1 bg-background", className)}
      style=\\{{
        paddingBottom: insets.bottom,
      }}
      {...props}
    >
      {isScrollable ? (
        <ScrollView
          contentContainerStyle=\\{{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1">{children}</View>
      )}
    </AnimatedView>
  );
}
`],
  ["frontend/native/uniwind/components/theme-toggle.tsx.hbs", `import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable } from 'react-native';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { useAppTheme } from '@/contexts/app-theme-context';

const StyledIonicons = withUniwind(Ionicons);

export function ThemeToggle() {
	const { toggleTheme, isLight } = useAppTheme();

	return (
		<Pressable
			onPress={() => {
				if (Platform.OS === 'ios') {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				}
				toggleTheme();
			}}
			className="px-2.5"
		>
			{isLight ? (
				<Animated.View key="moon" entering={ZoomIn} exiting={FadeOut}>
					<StyledIonicons name="moon" size={20} className="text-foreground" />
				</Animated.View>
			) : (
				<Animated.View key="sun" entering={ZoomIn} exiting={FadeOut}>
					<StyledIonicons name="sunny" size={20} className="text-foreground" />
				</Animated.View>
			)}
		</Pressable>
	);
}

`],
  ["frontend/native/uniwind/contexts/app-theme-context.tsx.hbs", `import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { Uniwind, useUniwind } from 'uniwind';

type ThemeName = 'light' | 'dark';

type AppThemeContextType = {
    currentTheme: string;
    isLight: boolean;
    isDark: boolean;
    setTheme: (theme: ThemeName) => void;
    toggleTheme: () => void;
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(
    undefined
);

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useUniwind();

    const isLight = useMemo(() => {
        return theme === 'light';
    }, [theme]);

    const isDark = useMemo(() => {
        return theme === 'dark';
    }, [theme]);

    const setTheme = useCallback((newTheme: ThemeName) => {
        Uniwind.setTheme(newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        Uniwind.setTheme(theme === 'light' ? 'dark' : 'light');
    }, [theme]);

    const value = useMemo(
        () => ({
            currentTheme: theme,
            isLight,
            isDark,
            setTheme,
            toggleTheme,
        }),
        [theme, isLight, isDark, setTheme, toggleTheme]
    );

    return (
        <AppThemeContext.Provider value={value}>
            {children}
        </AppThemeContext.Provider>
    );
};

export function useAppTheme() {
    const context = useContext(AppThemeContext);
    if (!context) {
        throw new Error('useAppTheme must be used within AppThemeProvider');
    }
    return context;
}

`],
  ["frontend/native/uniwind/global.css", `@import "tailwindcss";
@import "uniwind";
@import "heroui-native/styles";

@source './node_modules/heroui-native/lib';
`],
  ["frontend/native/uniwind/metro.config.js.hbs", `const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
{{#if (or (eq webDeploy "cloudflare") (eq serverDeploy "cloudflare"))}}
// Alchemy writes runtime state here; block it to avoid Metro refresh loops.
const blockList = config.resolver.blockList ?? [];
const blockListPatterns = Array.isArray(blockList) ? blockList : [blockList];

config.resolver.blockList = [
	...blockListPatterns,
	/[/\\\\]packages[/\\\\]infra[/\\\\]\\.alchemy(?:[/\\\\]|$)/,
];
{{/if}}

const uniwindConfig = withUniwindConfig(wrapWithReanimatedMetroConfig(config), {
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-types.d.ts",
});

module.exports = uniwindConfig;
`],
  ["frontend/native/uniwind/package.json.hbs", `{
  "name": "native",
  "version": "1.0.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "dev": "expo start --clear",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "prebuild": "expo prebuild",
    "web": "expo start --web"
  },
  "dependencies": {
    "@expo/metro-runtime": "~57.0.7",
    "@expo/vector-icons": "^15.1.1",
    "@gorhom/bottom-sheet": "^5.2.14",
    {{#if (includes examples "ai")}}
    "@stardazed/streams-text-encoding": "^1.0.2",
    "@ungap/structured-clone": "^1.3.3",
    {{/if}}
    "expo": "~57.0.8",
    "expo-constants": "~57.0.7",
    "expo-font": "~57.0.1",
    "expo-haptics": "~57.0.1",
    "expo-linking": "~57.0.4",
    "expo-network": "~57.0.1",
    "expo-router": "~57.0.8",
    "expo-secure-store": "~57.0.1",
    "expo-status-bar": "~57.0.1",
    "expo-web-browser": "~57.0.2",
    "heroui-native": "^1.0.7",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.0",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-keyboard-controller": "1.21.9",
    "react-native-reanimated": "4.5.0",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-svg": "15.15.4",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.10.0",
    "tailwind-merge": "^3.6.0",
    "tailwind-variants": "^3.3.0",
    "tailwindcss": "^4.3.3",
    "uniwind": "^1.10.0"
  },
  "devDependencies": {
    "@types/node": "^26.1.2",
    "@types/react": "~19.2.17",
    "typescript": "~6.0.3"
  }
}
`],
  ["frontend/native/uniwind/tsconfig.json.hbs", `{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}`],
  ["frontend/native/uniwind/uniwind-env.d.ts", `/// <reference types="uniwind/types" />

declare module "*.css";
`],
  ["frontend/react/next/AGENTS.md.hbs", `<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in \`node_modules/next/dist/docs/\` (resolved from this file's directory; in monorepos the \`next\` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by \`next dev\` — verify at \`node_modules/next/dist/server/lib/generate-agent-files.js\`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
`],
  ["frontend/react/next/next-env.d.ts.hbs", `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
`],
  ["frontend/react/next/next.config.ts.hbs", `import "@{{projectName}}/env/web";
{{#if (eq webDeploy "cloudflare")}}
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
{{/if}}
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,

	{{#if (includes examples "ai")}}
	transpilePackages: ["shiki"],
	{{/if}}

};

export default nextConfig;

{{#if (eq webDeploy "cloudflare")}}
initOpenNextCloudflareForDev();
{{/if}}
`],
  ["frontend/react/next/package.json.hbs", `{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "check-types": "tsc --noEmit",
    "start": "next start"
  },
  "dependencies": {
    "@{{projectName}}/ui": "{{#if (eq packageManager "npm")}}*{{else}}workspace:*{{/if}}",
    "@swc/helpers": "^0.5.23",
    "lucide-react": "^1.27.0",
    "next": "^16.3.0",
    "next-themes": "^0.4.6",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "sonner": "^2.0.7",
    "babel-plugin-react-compiler": "^1.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.3",
    "@types/node": "^20.19.43",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "tailwindcss": "^4.3.3"
  }
}
`],
  ["frontend/react/next/postcss.config.mjs.hbs", `const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
`],
  ["frontend/react/next/src/app/favicon.ico", `[Binary file]`],
  ["frontend/react/next/src/app/layout.tsx.hbs", `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";

import Providers from "@/components/providers";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "{{projectName}}",
  description: "{{projectName}}",
};

`],
  ["frontend/react/next/src/app/page.tsx.hbs", `"use client"

const TITLE_TEXT = \`
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 \`;

export default function Home() {

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          `],
  ["frontend/react/next/src/components/mode-toggle.tsx.hbs", `"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@{{projectName}}/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@{{projectName}}/ui/components/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
`],
  ["frontend/react/next/src/components/providers.tsx.hbs", `"use client";

`],
  ["frontend/react/next/src/components/theme-provider.tsx.hbs", `"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
`],
  ["frontend/react/next/tsconfig.json.hbs", `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@{{projectName}}/ui/*": ["../../packages/ui/src/*"]
    }{{#if (or (eq serverDeploy "cloudflare") (eq webDeploy "cloudflare"))}},
    "types": [
      "@cloudflare/workers-types"
    ]{{/if}}
  },
  "include": [
    {{#if (eq serverDeploy "cloudflare")}}
    "../server/env.d.ts",
    {{/if}}
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "./node_modules"
  ]
}
`],
  ["frontend/react/react-router/package.json.hbs", `{
  "name": "web",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "react-router build",
    "dev": "react-router dev",
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "react-router typegen && tsc"
  },
  "dependencies": {
    "@{{projectName}}/ui": "{{#if (eq packageManager "npm")}}*{{else}}workspace:*{{/if}}",
    "@react-router/fs-routes": "^8.3.0",
    "@react-router/node": "^8.3.0",
    "@react-router/serve": "^8.3.0",
    "isbot": "^5.2.1",
    "lucide-react": "^1.27.0",
    "next-themes": "^0.4.6",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router": "^8.3.0",
    "sonner": "^2.0.7"
  },
  "devDependencies": {
    "@react-router/dev": "^8.3.0",
    "@tailwindcss/vite": "^4.3.3",
    "@types/node": "^22.20.1",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "react-router-devtools": "^6.2.3",
    "tailwindcss": "^4.3.3",
    "vite": "^8.1.5",
    "vite-tsconfig-paths": "^6.1.1"
  }
}
`],
  ["frontend/react/react-router/public/favicon.ico", `[Binary file]`],
  ["frontend/react/react-router/react-router.config.ts.hbs", `import type { Config } from "@react-router/dev/config";

export default {
{{#if (and (eq webDeploy "vercel") (not (or (includes addons "tauri") (includes addons "electrobun"))))}}
  // Adopt vercelPreset() once @vercel/react-router supports RR8 (vercel/vercel#16730)
{{/if}}
{{#if (or (includes addons "tauri") (includes addons "electrobun"))}}
  // Desktop addons package static web assets; SSR output cannot be bundled
  ssr: false,
{{/if}}
  appDirectory: "src",
} satisfies Config;
`],
  ["frontend/react/react-router/src/components/mode-toggle.tsx.hbs", `import { Moon, Sun } from "lucide-react";

import { Button } from "@{{projectName}}/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@{{projectName}}/ui/components/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`],
  ["frontend/react/react-router/src/components/theme-provider.tsx.hbs", `import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export { useTheme } from "next-themes";
`],
  ["frontend/react/react-router/src/root.tsx.hbs", `import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "./index.css";
import Header from "./components/header";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@{{projectName}}/ui/components/sonner";

`],
  ["frontend/react/react-router/src/routes.ts", `import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes() satisfies RouteConfig;
`],
  ["frontend/react/react-router/src/routes/_index.tsx.hbs", `import type { Route } from "./+types/_index";

const TITLE_TEXT = \`
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 \`;

export function meta({}: Route.MetaArgs) {
  return [{ title: "{{projectName}}" }, { name: "description", content: "{{projectName}} is a web application" }];
}

export default function Home() {

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          `],
  ["frontend/react/react-router/tsconfig.json.hbs", `{
  "include": [
    "**/*",
    "**/.server/**/*",
    "**/.client/**/*",
    ".react-router/types/**/*"
  ],
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "types": ["node", "vite/client"],
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "rootDirs": [".", "./.react-router/types"],
    "paths": {
      "@/*": ["./src/*"],
      "@{{projectName}}/ui/*": ["../../packages/ui/src/*"]
    },
    "esModuleInterop": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true
  }
}
`],
  ["frontend/react/react-router/vite.config.ts.hbs", `import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "{{#if (includes addons "vite-plus")}}vite-plus{{else}}vite{{/if}}";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
{{#if (and (eq webDeploy "vercel") (not (or (includes addons "tauri") (includes addons "electrobun"))))}}
  ssr: {
    // Vercel functions have no node_modules; bundle all deps into the server build
    noExternal: true,
  },
{{/if}}
});
`],
  ["frontend/react/tanstack-router/index.html.hbs", `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{projectName}}</title>
  </head>

  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`],
  ["frontend/react/tanstack-router/package.json.hbs", `{
	"name": "web",
	"version": "0.0.0",
	"private": true,
	"type": "module",
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"serve": "vite preview",
		"start": "vite",
		"check-types": "vite build && tsc --noEmit"
	},
	"dependencies": {
        "@hookform/resolvers": "^5.5.7",
        "@{{projectName}}/ui": "{{#if (eq packageManager "npm")}}*{{else}}workspace:*{{/if}}",
		"@tailwindcss/vite": "^4.3.3",
		"@tanstack/react-router": "^1.170.18",
		"lucide-react": "^1.27.0",
        "next-themes": "^0.4.6",
		"react": "^19.2.8",
		"react-dom": "^19.2.8",
        "sonner": "^2.0.7"
	},
	"devDependencies": {
		"@tanstack/react-router-devtools": "^1.167.0",
		"@tanstack/router-plugin": "^1.168.23",
		"@types/node": "^22.20.1",
		"@types/react": "^19.2.17",
		"@types/react-dom": "^19.2.3",
		"@vitejs/plugin-react": "^6.0.4",
		"postcss": "^8.5.24",
		"tailwindcss": "^4.3.3",
		"vite": "^8.1.5"
	}
}
`],
  ["frontend/react/tanstack-router/src/components/mode-toggle.tsx.hbs", `import { Moon, Sun } from "lucide-react";

import { Button } from "@{{projectName}}/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@{{projectName}}/ui/components/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
`],
  ["frontend/react/tanstack-router/src/components/theme-provider.tsx.hbs", `import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export { useTheme } from "next-themes";
`],
  ["frontend/react/tanstack-router/src/main.tsx.hbs", `import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";

{{#if (eq api "orpc")}}
  import { QueryClientProvider } from "@tanstack/react-query";
  import { orpc, queryClient } from "./utils/orpc";
{{/if}}

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultPendingComponent: () => <Loader />,
  {{#if (eq api "orpc")}}
  context: { orpc, queryClient },
  Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
    return (

    );
  },
  {{else}}
  context: {},
  {{/if}}
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
`],
  ["frontend/react/tanstack-router/src/routes/__root.tsx.hbs", `import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@{{projectName}}/ui/components/sonner";
{{#if (eq api "orpc")}}
import { link, orpc } from "@/utils/orpc";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { AppRouterClient } from "@{{projectName}}/api/routers/index";
import { createORPCClient } from "@orpc/client";
{{/if}}

import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../index.css";

{{#if (eq api "orpc")}}
export interface RouterAppContext {
  orpc: typeof orpc;
  queryClient: QueryClient;
}
{{else}}
export interface RouterAppContext {}
{{/if}}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "{{projectName}}",
      },
      {
        name: "description",
        content: "{{projectName}} is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  {{#if (eq api "orpc")}}
  const [client] = useState<AppRouterClient>(() => createORPCClient(link));
  const [orpcUtils] = useState(() => createTanstackQueryUtils(client));
  {{/if}}

  return (
    <>
      <HeadContent />
      {{#if (eq api "orpc")}}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          storageKey="vite-ui-theme"
        >
          <div className="grid grid-rows-[auto_1fr] h-svh">
            <Header />
            <Outlet />
          </div>
          <Toaster richColors />
        </ThemeProvider>
      {{else}}
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <div className="grid grid-rows-[auto_1fr] h-svh">
          <Header />
          <Outlet />
        </div>
        <Toaster richColors />
      </ThemeProvider>
      {{/if}}
      <TanStackRouterDevtools position="bottom-left" />

    </>
  );
}
`],
  ["frontend/react/tanstack-router/src/routes/index.tsx.hbs", `import { createFileRoute } from "@tanstack/react-router";
{{#if (eq api "orpc")}}
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
{{/if}}

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const TITLE_TEXT = \`
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 \`;

function HomeComponent() {
  {{#if (eq api "orpc")}}
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());
  {{/if}}

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          `],
  ["frontend/react/tanstack-router/tsconfig.json.hbs", `{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "skipLibCheck": true,
    "types": ["vite/client"],
    "rootDirs": ["."],
    "paths": {
      "@/*": ["./src/*"],
      "@{{projectName}}/ui/*": ["../../packages/ui/src/*"]
    }
  }
}
`],
  ["frontend/react/tanstack-router/vite.config.ts.hbs", `import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "{{#if (includes addons "vite-plus")}}vite-plus{{else}}vite{{/if}}";

export default defineConfig({
  server: {
    port: 3001,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
});
`],
  ["frontend/react/tanstack-start/package.json.hbs", `{
  "name": "web",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "vite build",
    "serve": "vite preview",
    "dev": "vite dev"
  },
  "dependencies": {
    "@{{projectName}}/ui": "{{#if (eq packageManager "npm")}}*{{else}}workspace:*{{/if}}",
    "@tailwindcss/vite": "^4.3.3",
    "@tanstack/react-query": "^5.101.4",
    "@tanstack/react-router": "^1.170.18",
    "@tanstack/react-start": "^1.168.32",
    "lucide-react": "^1.27.0",
    "next-themes": "^0.4.6",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "sonner": "^2.0.7",
    "tailwindcss": "^4.3.3"
  },
  "devDependencies": {
    "@tanstack/react-router-devtools": "^1.167.0",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/react": "^16.3.2",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.4",
    "jsdom": "^30.0.0",
    "vite": "^8.1.5",
    "web-vitals": "^6.0.1"
  }
}
`],
  ["frontend/react/tanstack-start/public/robots.txt", `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
`],
  ["frontend/react/tanstack-start/src/router.tsx.hbs", ``],
  ["frontend/react/tanstack-start/src/routes/__root.tsx.hbs", `import { Toaster } from "@{{projectName}}/ui/components/sonner";
`],
  ["frontend/react/tanstack-start/src/routes/index.tsx.hbs", `import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const TITLE_TEXT = \`
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 \`;

function HomeComponent() {

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          `],
  ["frontend/react/tanstack-start/tsconfig.json.hbs", `{
  "include": ["**/*.ts", "**/*.tsx"],
  "compilerOptions": {
    "target": "ES2022",
    "jsx": "react-jsx",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,

    /* Linting */
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "paths": {
      "@/*": ["./src/*"],
      "@{{projectName}}/ui/*": ["../../packages/ui/src/*"]
    }
  }
}
`],
  ["frontend/react/tanstack-start/vite.config.ts.hbs", `import { defineConfig } from "{{#if (includes addons "vite-plus")}}vite-plus{{else}}vite{{/if}}";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
{{#if (or (eq webDeploy "docker") (eq webDeploy "vercel"))}}
import { nitro } from "nitro/vite";
{{/if}}
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 3001,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
{{#if (or (eq webDeploy "docker") (eq webDeploy "vercel"))}}
    nitro(),
{{/if}}
    viteReact(),
  ],
{{#if (eq webDeploy "vercel")}}
  // Bundle all SSR deps: Vercel functions have no node_modules at runtime
  ssr: {
    noExternal: true,
  },
{{/if}}
});
`],
  ["frontend/react/web-base/_gitignore", `# Dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# Testing
/coverage

# Build outputs
/.next/
/out/
/build/
/dist/
.vinxi
.output
.react-router/
.tanstack/
.nitro/

# Deployment
.vercel
.netlify
.wrangler
.alchemy

# Environment & local files
.env*
!.env.example
.DS_Store
*.pem
*.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
*.log*

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/*
!.vscode/extensions.json
.idea

# Other
dev-dist

.wrangler
.dev.vars*

.open-next
`],
  ["frontend/react/web-base/components.json.hbs", `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-lyra",
  "rsc": {{#if (includes frontend "next")}}true{{else}}false{{/if}},
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../packages/ui/src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@{{projectName}}/ui/lib/utils",
    "ui": "@{{projectName}}/ui/components",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
`],
  ["frontend/react/web-base/src/components/header.tsx.hbs", `{{#if (includes frontend "next")}}
"use client";
import Link from "next/link";
{{else if (includes frontend "react-router")}}
import { NavLink } from "react-router";
{{else if (or (includes frontend "tanstack-router") (includes frontend "tanstack-start"))}}
import { Link } from "@tanstack/react-router";
{{/if}}
{{#unless (includes frontend "tanstack-start")}}
import { ModeToggle } from "./mode-toggle";
{{/unless}}

export default function Header() {
  const links = [
    { to: "/", label: "Home" },

    {{#if (includes examples "todo")}}
    { to: "/todos", label: "Todos" },
    {{/if}}
    {{#if (includes examples "ai")}}
    { to: "/ai", label: "AI Chat" },
    {{/if}}
  ] as const;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            {{#if (includes frontend "next")}}
            return (
              <Link key={to} href={to}>
                {label}
              </Link>
            );
            {{else if (includes frontend "react-router")}}
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => isActive ? "font-bold" : ""}
                end
              >
                {label}
              </NavLink>
            );
            {{else if (or (includes frontend "tanstack-router") (includes frontend "tanstack-start"))}}
            return (
              <Link
                key={to}
                to={to}
              >
                {label}
              </Link>
            );
            {{else}}
            return null;
            {{/if}}
          })}
        </nav>
        <div className="flex items-center gap-2">
          {{#unless (includes frontend "tanstack-start")}}
          <ModeToggle />
          {{/unless}}

        </div>
      </div>
      <hr />
    </div>
  );
}
`],
  ["frontend/react/web-base/src/components/loader.tsx.hbs", `import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex h-full items-center justify-center pt-8">
      <Loader2 className="animate-spin" />
    </div>
  );
}
`],
  ["frontend/react/web-base/src/index.css.hbs", `@import '@{{projectName}}/ui/globals.css';
{{#if (includes examples "ai")}}
@source "../node_modules/streamdown/dist/*.js";
{{/if}}
`],
  ["packages/config/package.json.hbs", `{
  "name": "@{{projectName}}/config",
  "version": "0.0.0",
  "private": true
}
`],
  ["packages/config/tsconfig.base.json.hbs", `{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ESNext"],
    "verbatimModuleSyntax": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": [
      {{#if (eq runtime "node")}}
        "node"
      {{else if (eq runtime "bun")}}
        "bun"
      {{else if (eq runtime "workers")}}
        "node"
      {{else}}
        "node"
      {{/if}}{{#if (or (eq serverDeploy "cloudflare") (eq webDeploy "cloudflare"))}},
      "@cloudflare/workers-types"{{/if}}
    ]
  }
}`],
  ["packages/env/package.json.hbs", `{
	"name": "@{{projectName}}/env",
	"version": "0.0.0",
	"private": true,
	"type": "module",
	"exports": {}
}`],
  ["packages/env/src/cloudflare-local.ts.hbs", `import { config } from "dotenv";
import { fileURLToPath } from "node:url";

config({ path: fileURLToPath(new URL("../../../.env", import.meta.url)) });
config();

const runtimeEnv = typeof process === "undefined" ? {} : process.env;

export const env = new Proxy({} as Env, {
	get(_target, prop) {
		if (typeof prop !== "string") {
			return undefined;
		}

		return runtimeEnv[prop];
	},
});
`],
  ["packages/env/src/native.ts.hbs", `import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "EXPO_PUBLIC_",
	client: {

	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
`],
  ["packages/env/src/server.ts.hbs", `{{#if (and (eq serverDeploy "cloudflare") (or (ne backend "self") (ne webDeploy "cloudflare")))}}
/// <reference types="@cloudflare/workers-types" />
/// <reference path="../env.d.ts" />
// For Cloudflare Workers, env is accessed via cloudflare:workers module
// Types are defined in env.d.ts based on your alchemy.run.ts bindings
export { env } from "cloudflare:workers";
{{else if (and (eq backend "self") (eq webDeploy "cloudflare") (includes frontend "next"))}}
/// <reference path="../env.d.ts" />
import { getCloudflareContext } from "@opennextjs/cloudflare";

function getNodeEnvValue(key: string) {
	if (key === "DB") {
		return undefined;
	}

	return process.env[key];
}

function getCloudflareEnvSync() {
	try {
		return getCloudflareContext().env as Env;
	} catch {
		return undefined;
	}
}

type EnvValue = Env[keyof Env];

function createEnvProxy(getValue: (key: keyof Env & string) => EnvValue | undefined) {
	return new Proxy({} as Env, {
		get(_target, prop) {
			if (typeof prop !== "string") {
				return undefined;
			}

			return getValue(prop as keyof Env & string);
		},
	});
}

function resolveEnvValue(key: keyof Env & string): EnvValue | undefined {
	const nodeValue = getNodeEnvValue(key);
	if (nodeValue !== undefined) {
		return nodeValue as EnvValue;
	}

	return getCloudflareEnvSync()?.[key as keyof Env];
}

// Next.js local dev runs in Node.js, where env vars are exposed on process.env.
// In the Cloudflare runtime, fall back to OpenNext's Cloudflare context bindings.
// For static routes (ISR/SSG), use getEnvAsync() so OpenNext can resolve bindings
// with the async Cloudflare context API.
export async function getEnvAsync() {
	const cloudflareEnv = (await getCloudflareContext({ async: true })).env as Env;

	return createEnvProxy((key) => {
		const nodeValue = getNodeEnvValue(key);
		if (nodeValue !== undefined) {
			return nodeValue;
		}

		return cloudflareEnv[key as keyof Env];
	});
}

export const env = createEnvProxy(resolveEnvValue);
{{else if (and (eq backend "self") (eq webDeploy "cloudflare"))}}
/// <reference types="@cloudflare/workers-types" />
/// <reference path="../env.d.ts" />
// For Cloudflare Workers, env is accessed via cloudflare:workers module
// Types are defined in env.d.ts based on your alchemy.run.ts bindings
export { env } from "cloudflare:workers";
{{else}}
import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

{{#if (or (eq webDeploy "vercel") (eq serverDeploy "vercel"))}}
function getVercelOrigin() {
	const vercelUrl =
		process.env.VERCEL_ENV === "production"
			? (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL)
			: (process.env.VERCEL_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL);
	if (!vercelUrl) return undefined;
	return vercelUrl.startsWith("http") ? vercelUrl : \`https://\${vercelUrl}\`;
}

const vercelOrigin = getVercelOrigin();

const runtimeEnv = {
	...process.env,
{{#if (eq auth "better-auth")}}
{{#if (and (eq webDeploy "vercel") (eq serverDeploy "vercel") (ne backend "self"))}}
		// Public auth base: /api/auth bypasses the rewrite's path strip, so the
	// same URL works for incoming matching and generated callbacks
	BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? (vercelOrigin ? \`\${vercelOrigin}/api/auth\` : undefined),
{{else}}
	BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? vercelOrigin,
{{/if}}
{{/if}}
	CORS_ORIGIN: process.env.CORS_ORIGIN ?? vercelOrigin,
};

{{/if}}
export const env = createEnv({
	server: {
{{#if (ne database "none")}}

{{/if}}
{{#if (eq auth "better-auth")}}
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
{{/if}}

		CORS_ORIGIN: z.url(),
		NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	},
	runtimeEnv: {{#if (or (eq webDeploy "vercel") (eq serverDeploy "vercel"))}}runtimeEnv{{else}}process.env{{/if}},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
{{/if}}
`],
  ["packages/env/src/web.ts.hbs", `{{#if (includes frontend "next")}}
import { createEnv } from "@t3-oss/env-nextjs";
{{else}}
import { createEnv } from "@t3-oss/env-core";
{{/if}}
import { z } from "zod";

export const env = createEnv({

	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
`],
  ["packages/env/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
}
`],
  ["packages/infra/alchemy.run.ts.hbs", `import alchemy from "alchemy";
{{#if (eq webDeploy "cloudflare")}}
{{#if (includes frontend "next")}}
import { Nextjs } from "alchemy/cloudflare";
{{else if (includes frontend "tanstack-start")}}
import { TanStackStart } from "alchemy/cloudflare";
{{else if (includes frontend "tanstack-router")}}
import { Vite } from "alchemy/cloudflare";
{{else if (includes frontend "react-router")}}
import { ReactRouter } from "alchemy/cloudflare";
{{/if}}
{{/if}}
{{#if (eq serverDeploy "cloudflare")}}
import { Worker } from "alchemy/cloudflare";
{{/if}}
{{#if (and (or (eq serverDeploy "cloudflare") (and (eq webDeploy "cloudflare") (eq backend "self"))) (eq dbSetup "d1"))}}
import { D1Database } from "alchemy/cloudflare";
{{/if}}
import { config } from "dotenv";

{{#if (and (eq webDeploy "cloudflare") (eq serverDeploy "cloudflare"))}}
config({ path: "./.env" });
config({ path: "../../apps/web/.env" });
config({ path: "../../apps/server/.env" });
{{else if (eq webDeploy "cloudflare")}}
config({ path: "./.env" });
config({ path: "../../apps/web/.env" });
{{else if (eq serverDeploy "cloudflare")}}
config({ path: "./.env" });
config({ path: "../../apps/server/.env" });
{{/if}}

const app = await alchemy("{{projectName}}");

{{#if (and (or (eq serverDeploy "cloudflare") (and (eq webDeploy "cloudflare") (eq backend "self"))) (eq dbSetup "d1"))}}
const db = await D1Database("database", {
	{{#if (eq orm "prisma")}}
	migrationsDir: "../../packages/db/prisma/migrations",
	{{else if (eq orm "drizzle")}}
	migrationsDir: "../../packages/db/src/migrations",
	{{/if}}
});
{{/if}}

{{#if (eq serverDeploy "cloudflare")}}
export const server = await Worker("server", {
  cwd: "../../apps/server",
  entrypoint: "src/index.ts",
  compatibility: "node",
  url: true,
  bindings: {
    {{#if (eq dbSetup "d1")}}
    DB: db,
    {{else if (ne database "none")}}
    DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
    {{/if}}
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
    {{#if (eq auth "better-auth")}}
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
    {{/if}}

    {{#if (includes examples "ai")}}
    GOOGLE_GENERATIVE_AI_API_KEY: alchemy.secret.env.GOOGLE_GENERATIVE_AI_API_KEY!,
    {{/if}}

    {{#if (eq database "mysql")}}
    {{#if (eq orm "drizzle")}}
    DATABASE_HOST: alchemy.env.DATABASE_HOST!,
    DATABASE_USERNAME: alchemy.env.DATABASE_USERNAME!,
    DATABASE_PASSWORD: alchemy.secret.env.DATABASE_PASSWORD!,
    {{/if}}
    {{/if}}
  },
  dev: {
		port: 3000,
	},
});
{{/if}}

{{#if (eq webDeploy "cloudflare")}}
{{#if (includes frontend "next")}}
export const web = await Nextjs("web", {
  cwd: "../../apps/web",
  bindings: {

    {{#if (eq dbSetup "d1")}}
    DB: db,
    {{else if (ne database "none")}}
    DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
    {{/if}}

    {{#if (eq database "mysql")}}
    {{#if (eq orm "drizzle")}}
    DATABASE_HOST: alchemy.env.DATABASE_HOST!,
    DATABASE_USERNAME: alchemy.env.DATABASE_USERNAME!,
    DATABASE_PASSWORD: alchemy.secret.env.DATABASE_PASSWORD!,
    {{/if}}
    {{/if}}
  },
  dev: {
    env: {
      PORT: "3001",
    },
  },
});
{{else if (includes frontend "tanstack-start")}}
export const web = await TanStackStart("web", {
  cwd: "../../apps/web",
  bindings: {

    {{#if (eq dbSetup "d1")}}
    DB: db,
    {{else if (ne database "none")}}
    DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
    {{/if}}

    {{#if (eq database "mysql")}}
    {{#if (eq orm "drizzle")}}
    DATABASE_HOST: alchemy.env.DATABASE_HOST!,
    DATABASE_USERNAME: alchemy.env.DATABASE_USERNAME!,
    DATABASE_PASSWORD: alchemy.secret.env.DATABASE_PASSWORD!,
    {{/if}}
    {{/if}}
  }
});
{{else if (includes frontend "tanstack-router")}}
export const web = await Vite("web", {
  cwd: "../../apps/web",
  assets: "dist",
  bindings: {

  }
});
{{else if (includes frontend "react-router")}}
export const web = await ReactRouter("web", {
  cwd: "../../apps/web",
  bindings: {

  }
});
{{/if}}
{{/if}}

{{#if (and (eq webDeploy "cloudflare") (eq serverDeploy "cloudflare"))}}
console.log(\`Web    -> \${web.url}\`);
console.log(\`Server -> \${server.url}\`);
{{else if (eq webDeploy "cloudflare")}}
console.log(\`Web    -> \${web.url}\`);
{{else if (eq serverDeploy "cloudflare")}}
console.log(\`Server -> \${server.url}\`);
{{/if}}

await app.finalize();
`],
  ["packages/infra/package.json.hbs", `{
  "name": "@{{projectName}}/infra",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "alchemy dev",
    "deploy": "alchemy deploy",
    "destroy": "alchemy destroy"
  }
}
`],
  ["packages/ui/components.json.hbs", `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-lyra",
  "rsc": {{#if (includes frontend "next")}}true{{else}}false{{/if}},
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@{{projectName}}/ui/components",
    "utils": "@{{projectName}}/ui/lib/utils",
    "hooks": "@{{projectName}}/ui/hooks",
    "lib": "@{{projectName}}/ui/lib",
    "ui": "@{{projectName}}/ui/components"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
`],
  ["packages/ui/package.json.hbs", `{
  "name": "@{{projectName}}/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./lib/*": "./src/lib/*.ts",
    "./components/*": "./src/components/*.tsx",
    "./hooks/*": "./src/hooks/*.ts",
    "./postcss.config": "./postcss.config.mjs"
  },
  "dependencies": {
    "@base-ui/react": "^1.6.0",
    "@shadcn/react": "^0.2.1",
    "shadcn": "^4.16.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.27.0",
    "next-themes": "^0.4.6",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.3",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "tailwindcss": "^4.3.3"
  },
  "scripts": {
    "check-types": "tsc --noEmit"
  }
}
`],
  ["packages/ui/postcss.config.mjs.hbs", `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
`],
  ["packages/ui/src/components/attachment.tsx.hbs", `import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@{{projectName}}/ui/lib/utils"
import { Button } from "@{{projectName}}/ui/components/button"

const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-none border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/50 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed",
  {
    variants: {
      size: {
        default:
          "gap-2 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
        sm: "gap-2.5 text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
        xs: "gap-1.5 rounded-none text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
      },
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 flex-col has-data-[slot=attachment-content]:w-30",
      },
    },
  }
)

function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: "idle" | "uploading" | "processing" | "error" | "done"
  }) {
  const resolvedOrientation = orientation ?? "horizontal"

  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={resolvedOrientation}
      className={cn(attachmentVariants({ size, orientation }), className)}
      {...props}
    />
  )
}

const attachmentMediaVariants = cva(
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-none bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-none group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  }
)

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
        className
      )}
      {...props}
    />
  )
}

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer",
        className
      )}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "mt-0.5 block min-w-0 truncate text-xs text-muted-foreground group-data-[state=error]/attachment:text-destructive/80",
        "max-w-full",
        className
      )}
      {...props}
    />
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1",
        className
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant,
  size = "icon-xs",
  type = "button",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      type={type}
      variant={variant ?? "ghost"}
      size={size}
      className={cn(className)}
      {...props}
    />
  )
}

function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: cn("absolute inset-0 z-10 outline-none", className),
      },
      props
    ),
    render,
    state: {
      slot: "attachment-trigger",
    },
  })
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn(
        "flex min-w-0 scroll-fade-x snap-x snap-mandatory scroll-px-1 scrollbar-none gap-3 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
        className
      )}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
}
`],
  ["packages/ui/src/components/bubble.tsx.hbs", `import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@{{projectName}}/ui/lib/utils"

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80",
        secondary:
          "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        muted:
          "*:data-[slot=bubble-content]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
        tinted:
          "*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-foreground dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)] [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]",
        outline:
          "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30",
        ghost:
          "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50",
        destructive:
          "*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive dark:*:data-[slot=bubble-content]:bg-destructive/20 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20 dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
}

function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "w-fit max-w-full min-w-0 overflow-hidden rounded-none border border-transparent px-2.5 py-2 text-xs leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end [button]:text-left [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-1 [button,a]:focus-visible:ring-ring/50",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  })
}

const bubbleReactionsVariants = cva(
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-none bg-muted px-1.5 py-0.5 text-xs ring-2 ring-card has-[button]:p-0",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4",
      },
      align: {
        start: "left-3",
        end: "right-3",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  }
)

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  )
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions }
`],
  ["packages/ui/src/components/button.tsx.hbs", `import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@{{projectName}}/ui/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-none px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-none px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs": "size-6 rounded-none [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-none",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
`],
  ["packages/ui/src/components/card.tsx.hbs", `import * as React from "react"

import { cn } from "@{{projectName}}/ui/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-none bg-card py-(--card-spacing) text-xs/relaxed text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-none *:[img:last-child]:rounded-none",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-none px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "cn-font-heading text-sm font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-xs/relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-none border-t p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
`],
  ["packages/ui/src/components/checkbox.tsx.hbs", `"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@{{projectName}}/ui/lib/utils"
import { CheckIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-none border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
`],
  ["packages/ui/src/components/dropdown-menu.tsx.hbs", `"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@{{projectName}}/ui/lib/utils"
import { ChevronRightIcon, CheckIcon } from "lucide-react"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "cn-menu-target cn-menu-translucent z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-none bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-2 text-xs text-muted-foreground data-inset:pl-7",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-none px-2 py-2 text-xs outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-none px-2 py-2 text-xs outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="cn-rtl-flip ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "cn-menu-target cn-menu-translucent w-auto min-w-[96px] rounded-none bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-none py-2 pr-8 pl-2 text-xs outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-none py-2 pr-8 pl-2 text-xs outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
`],
  ["packages/ui/src/components/empty.tsx.hbs", `import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@{{projectName}}/ui/lib/utils"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-none border-dashed p-6 text-center text-balance md:p-12",
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2", className)}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-10 shrink-0 items-center justify-center rounded-none bg-muted text-foreground [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("cn-font-heading text-sm font-medium tracking-tight", className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
`],
  ["packages/ui/src/components/input-group.tsx.hbs", `"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@{{projectName}}/ui/lib/utils"
import { Button } from "@{{projectName}}/ui/components/button"
import { Input } from "@{{projectName}}/ui/components/input"
import { Textarea } from "@{{projectName}}/ui/components/textarea"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex h-8 w-full min-w-0 items-center rounded-none border border-input bg-background shadow-xs transition-[color,box-shadow] outline-none has-[>textarea]:h-auto dark:bg-input/30",
        "has-[>[data-align=inline-start]]:[&>input]:pl-2 has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-1 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50",
        "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-1 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-xs font-medium text-muted-foreground group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-none [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
        "inline-end":
          "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement
          ?.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea")
          ?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-xs shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-none px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-7 gap-1 rounded-none px-2",
        "icon-xs": "size-6 rounded-none p-0 has-[>svg]:p-0",
        "icon-sm": "size-7 rounded-none p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-xs text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
`],
  ["packages/ui/src/components/input.tsx.hbs", `import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@{{projectName}}/ui/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-none border border-input bg-transparent px-2.5 py-1 text-xs transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-xs dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
`],
  ["packages/ui/src/components/label.tsx.hbs", `"use client"

import * as React from "react"

import { cn } from "@{{projectName}}/ui/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-xs leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
`],
  ["packages/ui/src/components/marker.tsx.hbs", `import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@{{projectName}}/ui/lib/utils"

const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-xs text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5 [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground",
  {
    variants: {
      variant: {
        default: "",
        separator:
          "before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border",
        border: "border-b border-border pb-2",
      },
    },
  }
)

function Marker({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof markerVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(markerVariants({ variant, className })),
      },
      props
    ),
    render,
    state: {
      slot: "marker",
      variant,
    },
  })
}

function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "size-3.5 shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        "min-w-0 wrap-break-word group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Marker, MarkerIcon, MarkerContent, markerVariants }
`],
  ["packages/ui/src/components/message-scroller.tsx.hbs", `"use client"

import * as React from "react"
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller"

import { cn } from "@{{projectName}}/ui/lib/utils"
import { Button } from "@{{projectName}}/ui/components/button"
import { ArrowDownIcon } from "lucide-react"

function MessageScrollerProvider(
  props: React.ComponentProps<typeof MessageScrollerPrimitive.Provider>
) {
  return <MessageScrollerPrimitive.Provider {...props} />
}

function MessageScroller({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Root>) {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      className={cn(
        "cn-message-scroller group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function MessageScrollerViewport({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Viewport>) {
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      className={cn(
        "cn-message-scroller-viewport size-full min-h-0 min-w-0 scroll-fade-b scrollbar-thin scrollbar-gutter-stable overflow-y-auto overscroll-contain contain-content data-autoscrolling:scrollbar-none",
        className
      )}
      {...props}
    />
  )
}

function MessageScrollerContent({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Content>) {
  return (
    <MessageScrollerPrimitive.Content
      data-slot="message-scroller-content"
      className={cn(
        "cn-message-scroller-content flex h-max min-h-full flex-col gap-6",
        className
      )}
      {...props}
    />
  )
}

function MessageScrollerItem({
  className,
  scrollAnchor = false,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Item>) {
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={scrollAnchor}
      className={cn(
        "cn-message-scroller-item min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
        className
      )}
      {...props}
    />
  )
}

function MessageScrollerButton({
  direction = "end",
  className,
  children,
  render,
  variant = "secondary",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Button> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <MessageScrollerPrimitive.Button
      data-slot="message-scroller-button"
      data-direction={direction}
      data-variant={variant}
      data-size={size}
      direction={direction}
      className={cn(
        "cn-message-scroller-button absolute inset-s-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180",
        className
      )}
      render={render ?? <Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon />
          <span className="sr-only">
            {direction === "end" ? "Scroll to end" : "Scroll to start"}
          </span>
        </>
      )}
    </MessageScrollerPrimitive.Button>
  )
}

export {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
}
`],
  ["packages/ui/src/components/message.tsx.hbs", `import * as React from "react"

import { cn } from "@{{projectName}}/ui/lib/utils"

function MessageGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-group"
      className={cn("flex min-w-0 flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function Message({
  className,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        "group/message relative flex w-full min-w-0 gap-1.5 text-xs data-[align=end]:flex-row-reverse",
        className
      )}
      {...props}
    />
  )
}

function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-data-[slot=message-footer]/message:-translate-y-8",
        className
      )}
      {...props}
    />
  )
}

function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "flex w-full min-w-0 flex-col gap-2 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end",
        className
      )}
      {...props}
    />
  )
}

function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "flex max-w-full min-w-0 items-center px-2.5 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0",
        className
      )}
      {...props}
    />
  )
}

function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        "flex max-w-full min-w-0 items-center px-2.5 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end",
        className
      )}
      {...props}
    />
  )
}

export {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
}
`],
  ["packages/ui/src/components/skeleton.tsx.hbs", `import { cn } from "@{{projectName}}/ui/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-none bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
`],
  ["packages/ui/src/components/sonner.tsx.hbs", `"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons=\\{{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions=\\{{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
`],
  ["packages/ui/src/components/textarea.tsx.hbs", `import * as React from "react"

import { cn } from "@{{projectName}}/ui/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full resize-none rounded-none border border-input bg-transparent px-2.5 py-2 text-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-xs dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
`],
  ["packages/ui/src/components/tooltip.tsx.hbs", `"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@{{projectName}}/ui/lib/utils"

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-none bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-none bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
`],
  ["packages/ui/src/hooks/.gitkeep", ``],
  ["packages/ui/src/lib/utils.ts.hbs", `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`],
  ["packages/ui/src/styles/globals.css.hbs", `@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css';
@source "../../../apps/**/*.{ts,tsx}";
@source "../**/*.{ts,tsx}";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.58 0.22 27);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.87 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@theme inline {
  --font-sans: 'Inter Variable', sans-serif;
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --color-foreground: var(--foreground);
  --color-background: var(--background);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply font-sans bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
`],
  ["packages/ui/tsconfig.json.hbs", `{
  "extends": "@{{projectName}}/config/tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "types": [],
    "paths": {
      "@{{projectName}}/ui/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
`]
]);

export const TEMPLATE_COUNT = 301;
