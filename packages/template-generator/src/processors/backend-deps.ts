import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processBackendDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { backend, runtime, api, auth } = config;

  const serverPath = "apps/server/package.json";
  if (!vfs.exists(serverPath) || backend === "self" || backend === "none") return;

  const deps: AvailableDependencies[] = [];
  const devDeps: AvailableDependencies[] = [];

  if (backend === "hono") {
    deps.push("hono");
    if (runtime === "node") deps.push("@hono/node-server");
  }

  if (backend === "nest") {
    deps.push(
      "@nestjs/common",
      "@nestjs/core",
      "@nestjs/platform-fastify",
      "fastify",
      "@fastify/cors",
      "reflect-metadata",
      "rxjs",
    );
    devDeps.push("@nestjs/cli", "@nestjs/schematics");
  }

  if (api === "orpc" && backend !== "nest") {
    deps.push("@orpc/server", "@orpc/openapi", "@orpc/zod");
  }

  if (auth === "better-auth") deps.push("better-auth");

  if (runtime === "node") devDeps.push("tsx", "@types/node");
  else if (runtime === "bun") devDeps.push("@types/bun");

  if (deps.length > 0 || devDeps.length > 0) {
    addPackageDependency({
      vfs,
      packagePath: serverPath,
      dependencies: deps,
      devDependencies: devDeps,
    });
  }
}
