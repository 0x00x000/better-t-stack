import type { ProjectConfig, Frontend, API, Backend } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

const REACT_WEB_FRONTENDS = ["tanstack-router", "react-router", "tanstack-start", "next"] as const;

function hasReactWeb(frontend: Frontend[]) {
  return frontend.some((f) =>
    REACT_WEB_FRONTENDS.includes(f as (typeof REACT_WEB_FRONTENDS)[number]),
  );
}

function hasNative(frontend: Frontend[]) {
  return frontend.some((f) => ["native-bare", "native-uniwind", "native-unistyles"].includes(f));
}

export function processApiDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { api, backend, frontend } = config;

  if (api === "none") return;

  addApiPackageDeps(vfs, backend, frontend);
  addServerDeps(vfs, api, backend);
  addSelfBackendWebDeps(vfs, api, backend);
  addWebClientDeps(vfs, api, backend, frontend);
  if (hasNative(frontend)) addNativeDeps(vfs, api);
  addQueryDeps(vfs, frontend, backend);
}

function addApiPackageDeps(vfs: VirtualFileSystem, backend: Backend, frontend: Frontend[]): void {
  const pkgPath = "packages/api/package.json";
  if (!vfs.exists(pkgPath)) return;

  addPackageDependency({
    vfs,
    packagePath: pkgPath,
    dependencies: ["@orpc/server", "@orpc/client", "@orpc/openapi", "@orpc/zod", "zod"],
  });

  if (backend === "self" && frontend.includes("next")) {
    addPackageDependency({ vfs, packagePath: pkgPath, dependencies: ["next"] });
  }

  if (backend === "hono") {
    addPackageDependency({ vfs, packagePath: pkgPath, devDependencies: ["hono"] });
  }
}

function addServerDeps(vfs: VirtualFileSystem, api: API, backend: Backend): void {
  const serverPath = "apps/server/package.json";
  if (!vfs.exists(serverPath) || backend !== "hono") return;

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
  if (!vfs.exists(webPath) || api !== "orpc") return;

  addPackageDependency({
    vfs,
    packagePath: webPath,
    dependencies: ["@orpc/server", "@orpc/client", "@orpc/openapi", "@orpc/zod"],
  });
}

function addWebClientDeps(
  vfs: VirtualFileSystem,
  api: API,
  backend: Backend,
  frontend: Frontend[],
): void {
  const webPath = "apps/web/package.json";
  if (!vfs.exists(webPath) || api !== "orpc" || !hasReactWeb(frontend)) return;

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

function addNativeDeps(vfs: VirtualFileSystem, api: API): void {
  const nativePath = "apps/native/package.json";
  if (!vfs.exists(nativePath) || api !== "orpc") return;

  addPackageDependency({
    vfs,
    packagePath: nativePath,
    dependencies: ["@orpc/tanstack-query", "@orpc/client"],
  });
}

function addQueryDeps(vfs: VirtualFileSystem, frontend: Frontend[], backend: Backend): void {
  const webPath = "apps/web/package.json";
  const nativePath = "apps/native/package.json";

  if (hasReactWeb(frontend) && vfs.exists(webPath) && backend !== "none") {
    addPackageDependency({
      vfs,
      packagePath: webPath,
      dependencies: ["@tanstack/react-query"],
      devDependencies: ["@tanstack/react-query-devtools"],
    });
  }

  if (hasNative(frontend) && vfs.exists(nativePath) && backend !== "none") {
    addPackageDependency({
      vfs,
      packagePath: nativePath,
      dependencies: ["@tanstack/react-query"],
    });
  }
}
