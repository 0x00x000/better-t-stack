import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

function hasReactWeb(frontend: ProjectConfig["frontend"]): boolean {
  return frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );
}

function hasNative(frontend: ProjectConfig["frontend"]): boolean {
  return frontend.some((f) => ["native-bare", "native-uniwind", "native-unistyles"].includes(f));
}

export function processAuthDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { auth, frontend, orm } = config;
  if (auth !== "better-auth") return;

  const authPath = "packages/auth/package.json";
  const webPath = "apps/web/package.json";
  const nativePath = "apps/native/package.json";

  const authExists = vfs.exists(authPath);
  const webExists = vfs.exists(webPath);
  const nativeExists = vfs.exists(nativePath);

  const reactWeb = hasReactWeb(frontend);
  const native = hasNative(frontend);
  const hasReactWebAuthForms = frontend.some((f) =>
    ["react-router", "tanstack-router", "tanstack-start", "next"].includes(f),
  );

  if (authExists) {
    const authDependencies: AvailableDependencies[] = ["better-auth"];
    if (orm === "mongoose") {
      authDependencies.push("mongodb");
    }
    addPackageDependency({ vfs, packagePath: authPath, dependencies: authDependencies });
    if (native) {
      addPackageDependency({ vfs, packagePath: authPath, dependencies: ["@better-auth/expo"] });
    }
  }

  if (reactWeb && webExists) {
    addPackageDependency({ vfs, packagePath: webPath, dependencies: ["better-auth"] });

    if (hasReactWebAuthForms) {
      addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@tanstack/react-form"] });
    }
  }

  if (native && nativeExists) {
    addPackageDependency({
      vfs,
      packagePath: nativePath,
      dependencies: ["better-auth", "@better-auth/expo", "@tanstack/react-form"],
    });
  }
}
