import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processExamplesDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.examples || config.examples.length === 0 || config.examples[0] === "none") return;

  if (config.examples.includes("todo") && config.backend !== "none") {
    setupTodoDependencies(vfs, config);
  }

  if (config.examples.includes("ai")) {
    setupAIDependencies(vfs, config);
  }
}

function setupTodoDependencies(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { orm, database, backend } = config;
  const apiPkgPath = "packages/api/package.json";
  if (!vfs.exists(apiPkgPath) || backend === "none") return;

  if (orm === "drizzle") {
    const deps: AvailableDependencies[] = ["drizzle-orm"];
    if (database === "postgres") deps.push("@types/pg");
    addPackageDependency({ vfs, packagePath: apiPkgPath, dependencies: deps });
  } else if (orm === "prisma") {
    addPackageDependency({ vfs, packagePath: apiPkgPath, dependencies: ["@prisma/client"] });
  } else if (orm === "mongoose") {
    addPackageDependency({ vfs, packagePath: apiPkgPath, dependencies: ["mongoose"] });
  }
}

function setupAIDependencies(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { frontend, backend } = config;

  const webPkgPath = "apps/web/package.json";
  const nativePkgPath = "apps/native/package.json";
  const serverPkgPath = "apps/server/package.json";

  const webExists = vfs.exists(webPkgPath);
  const nativeExists = vfs.exists(nativePkgPath);
  const serverExists = vfs.exists(serverPkgPath);

  const hasReactWeb = frontend.some((f) =>
    ["react-router", "tanstack-router", "next", "tanstack-start"].includes(f),
  );
  const hasReactNative = frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );

  if (backend === "self" && webExists) {
    addPackageDependency({
      vfs,
      packagePath: webPkgPath,
      dependencies: ["ai", "@ai-sdk/google", "@ai-sdk/devtools"],
    });
  } else if (serverExists && backend !== "none") {
    addPackageDependency({
      vfs,
      packagePath: serverPkgPath,
      dependencies: ["ai", "@ai-sdk/google", "@ai-sdk/devtools"],
    });
  }

  if (webExists && hasReactWeb) {
    addPackageDependency({
      vfs,
      packagePath: webPkgPath,
      dependencies: ["ai", "@ai-sdk/react", "streamdown"],
    });
  }

  if (nativeExists && hasReactNative) {
    addPackageDependency({
      vfs,
      packagePath: nativePkgPath,
      dependencies: ["ai", "@ai-sdk/react"],
    });
  }
}
