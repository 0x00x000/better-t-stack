import { getLocalD1Owner, type ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency } from "../utils/add-deps";

export function processDeployDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { webDeploy, serverDeploy, frontend, backend, addons, orm } = config;

  const isCloudflareWeb = webDeploy === "cloudflare";
  const isCloudflareServer = serverDeploy === "cloudflare";
  const isPrismaWeb = webDeploy === "prisma";
  const isPrismaServer = serverDeploy === "prisma";
  const isDockerWeb = webDeploy === "docker";
  const isVercelWeb = webDeploy === "vercel";
  const isVercelServer = serverDeploy === "vercel";
  const isBackendSelf = backend === "self";

  if (
    !isCloudflareWeb &&
    !isCloudflareServer &&
    !isPrismaWeb &&
    !isPrismaServer &&
    !isDockerWeb &&
    !isVercelWeb &&
    !isVercelServer
  ) {
    return;
  }

  if (isPrismaWeb && frontend.includes("react-router")) {
    addPackageDependency({
      vfs,
      packagePath: "apps/web/package.json",
      dependencies: ["@react-router/express", "express"],
      devDependencies: ["@types/express"],
    });
  }

  if (isCloudflareWeb && isBackendSelf && orm === "prisma" && frontend.includes("tanstack-start")) {
    addPackageDependency({
      vfs,
      packagePath: "apps/web/package.json",
      devDependencies: ["unwasm"],
    });
  }

  if (isVercelWeb || isVercelServer) {
    // dotenv is already a root dependency via workspace-deps
    addPackageDependency({
      vfs,
      packagePath: "package.json",
      devDependencies: ["@types/node", "tsx", "vercel"],
    });
  }

  if ((isVercelWeb || isPrismaWeb) && frontend.includes("tanstack-start")) {
    // Nitro emits the standalone server artifact consumed by both deployment providers.
    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath)) {
      addPackageDependency({ vfs, packagePath: webPkgPath, dependencies: ["nitro"] });
    }
  }

  if (isDockerWeb) {
    const webPkgPath = "apps/web/package.json";
    if (vfs.exists(webPkgPath) && frontend.includes("tanstack-start")) {
      // Same section as the evlog addon so the two never duplicate nitro
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies: ["nitro"],
      });
    }
  }

  if (isCloudflareWeb || isCloudflareServer) {
    addPackageDependency({
      vfs,
      packagePath: "package.json",
      devDependencies: ["@cloudflare/workers-types"],
    });
  }

  if (isCloudflareServer && !isBackendSelf) {
    const serverPkgPath = "apps/server/package.json";
    if (vfs.exists(serverPkgPath)) {
      addPackageDependency({
        vfs,
        packagePath: serverPkgPath,
        devDependencies: ["@types/node", "@cloudflare/workers-types"],
      });
    }
  }

  if (isCloudflareWeb) {
    const webPkgPath = "apps/web/package.json";
    if (!vfs.exists(webPkgPath)) return;

    if (frontend.includes("next")) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies: ["@opennextjs/cloudflare"],
        devDependencies: ["wrangler", "@cloudflare/workers-types"],
      });
    }
  }
}
