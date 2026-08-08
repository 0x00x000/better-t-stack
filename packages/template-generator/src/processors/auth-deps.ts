import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

const REACT_WEB_AUTH_FRONTENDS = [
  "react-router",
  "tanstack-router",
  "tanstack-start",
  "next",
] as const;

export function processAuthDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { auth, backend, frontend, orm } = config;
  if (!auth || auth === "none" || auth !== "better-auth") return;
  if (backend === "none") return;

  const authPath = "packages/auth/package.json";
  const webPath = "apps/web/package.json";
  const nativePath = "apps/native/package.json";

  const authExists = vfs.exists(authPath);
  const webExists = vfs.exists(webPath);
  const nativeExists = vfs.exists(nativePath);

  const hasNative = frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );
  const hasReactWebAuthForms = frontend.some((f) =>
    REACT_WEB_AUTH_FRONTENDS.includes(f as (typeof REACT_WEB_AUTH_FRONTENDS)[number]),
  );

  if (authExists) {
    const authDependencies: AvailableDependencies[] = ["better-auth"];
    if (orm === "mongoose") {
      authDependencies.push("mongodb");
    }
    addPackageDependency({ vfs, packagePath: authPath, dependencies: authDependencies });
    if (hasNative) {
      addPackageDependency({ vfs, packagePath: authPath, dependencies: ["@better-auth/expo"] });
    }
  }

  if (hasReactWebAuthForms && webExists) {
    addPackageDependency({ vfs, packagePath: webPath, dependencies: ["better-auth"] });
    addPackageDependency({ vfs, packagePath: webPath, dependencies: ["@tanstack/react-form"] });
  }

  if (hasNative && nativeExists) {
    addPackageDependency({
      vfs,
      packagePath: nativePath,
      dependencies: ["better-auth", "@better-auth/expo", "@tanstack/react-form"],
    });
  }
}
