import type { ProjectConfig, Frontend, API, Backend } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

function getFrontendType(frontend: Frontend[]) {
  return {
    hasReactWeb: frontend.some((f) =>
      ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
    ),
    hasNative: frontend.some((f) =>
      ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
    ),
  };
}

export function processApiDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { api, backend, frontend } = config;
  const frontendType = getFrontendType(frontend);

  if (api === "none") return;

  addApiPackageDeps(vfs, api, backend, frontend);
  addServerDeps(vfs, api);
  addSelfBackendWebDeps(vfs, api, backend);
  addWebClientDeps(vfs, api, backend, frontend, frontendType);
  if (frontendType.hasNative) addNativeDeps(vfs, api);
  addQueryDeps(vfs, frontendType, backend);
}

function addApiPackageDeps(
  vfs: VirtualFileSystem,
  api: API,
  backend: Backend,
  frontend: Frontend[],
): void {
  const pkgPath = "packages/api/package.json";
  if (!vfs.exists(pkgPath)) return;

  if (api === "orpc") {
    addPackageDependency({
      vfs,
      packagePath: pkgPath,
      dependencies: ["@orpc/server", "@orpc/client", "@orpc/openapi", "@orpc/zod", "zod"],
    });
  }

  if (backend === "self" && frontend.includes("next")) {
    addPackageDependency({ vfs, packagePath: pkgPath, dependencies: ["next"] });
  }

  if (backend === "hono") {
    addPackageDependency({ vfs, packagePath: pkgPath, devDependencies: ["hono"] });
  }
}

function addServerDeps(vfs: VirtualFileSystem, api: API): void {
  const serverPath = "apps/server/package.json";
  if (!vfs.exists(serverPath)) return;

  if (api === "orpc") {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: ["@orpc/server", "@orpc/openapi"],
    });
  }
}

function addSelfBackendWebDeps(vfs: VirtualFileSystem, api: API, backend: Backend): void {
  if (backend !== "self") return;

  const webPath = "apps/web/package.json";
  if (!vfs.exists(webPath)) return;

  if (api === "orpc") {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@orpc/server", "@orpc/client", "@orpc/openapi", "@orpc/zod"],
    });
  }
}

function addWebClientDeps(
  vfs: VirtualFileSystem,
  api: API,
  backend: Backend,
  frontend: Frontend[],
  frontendType: ReturnType<typeof getFrontendType>,
): void {
  const webPath = "apps/web/package.json";
  if (!vfs.exists(webPath)) return;

  if (api === "orpc" && frontendType.hasReactWeb) {
    const deps: AvailableDependencies[] = ["@orpc/tanstack-query", "@orpc/client", "@orpc/server"];
    if (frontend.includes("tanstack-start")) {
      deps.push("@tanstack/react-router-ssr-query");
    }
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: deps,
    });
  }
}

function addNativeDeps(vfs: VirtualFileSystem, api: API): void {
  const nativePath = "apps/native/package.json";
  if (!vfs.exists(nativePath)) return;

  if (api === "orpc") {
    addPackageDependency({
      vfs,
      packagePath: nativePath,
      dependencies: ["@orpc/tanstack-query", "@orpc/client"],
    });
  }
}

function addQueryDeps(
  vfs: VirtualFileSystem,
  frontendType: ReturnType<typeof getFrontendType>,
  backend: Backend,
): void {
  const webPath = "apps/web/package.json";
  const nativePath = "apps/native/package.json";

  if (frontendType.hasReactWeb && vfs.exists(webPath)) {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@tanstack/react-query"],
      devDependencies: ["@tanstack/react-query-devtools"],
    });
  }

  if (frontendType.hasNative && vfs.exists(nativePath)) {
    addPackageDependency({
      vfs,
      packagePath: nativePath,
      dependencies: ["@tanstack/react-query"],
    });
  }
}
