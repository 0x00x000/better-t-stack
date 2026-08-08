import { describe, expect, it } from "bun:test";

import type { ProjectConfig } from "@better-t-stack/types";

import { generateNxConfig } from "../../../packages/template-generator/src/processors/nx-generator";

const baseConfig: ProjectConfig = {
  projectName: "nx-test",
  projectDir: "/tmp/nx-test",
  relativePath: "nx-test",
  frontend: ["tanstack-router"],
  database: "sqlite",
  orm: "drizzle",
  auth: "none",
  payments: "none",
  addons: ["nx"],
  examples: [],
  git: false,
  packageManager: "bun",
  install: false,
  dbSetup: "none",
  backend: "hono",
  runtime: "bun",
  api: "orpc",
  webDeploy: "none",
  serverDeploy: "none",
};

function configWith(overrides: Partial<ProjectConfig>): ProjectConfig {
  return { ...baseConfig, ...overrides };
}

describe("Nx config generator", () => {
  it("excludes stack-generated frontend, backend, and database paths from production inputs", () => {
    const productionInputs = generateNxConfig(baseConfig).namedInputs.production;

    expect(productionInputs).toContain("!{workspaceRoot}/apps/web/dist/**");
    expect(productionInputs).toContain("!{workspaceRoot}/apps/web/.tanstack/**");
    expect(productionInputs).toContain("!{workspaceRoot}/apps/web/src/routeTree.gen.ts");
    expect(productionInputs).toContain("!{workspaceRoot}/apps/server/dist/**");
    expect(productionInputs).toContain("!{workspaceRoot}/packages/db/dist/**");
    expect(productionInputs).toContain("!{workspaceRoot}/packages/db/local.db*");
    expect(productionInputs).not.toContain("!{workspaceRoot}/apps/web/.next/**");
    expect(productionInputs).not.toContain("!{workspaceRoot}/packages/db/prisma/generated/**");
    expect(productionInputs).not.toContain("!{workspaceRoot}/.wrangler/**");
  });

  it("excludes Prisma and local SQLite paths only for matching stacks", () => {
    const prismaInputs = generateNxConfig(
      configWith({
        dbSetup: "neon",
        orm: "prisma",
      }),
    ).namedInputs.production;

    expect(prismaInputs).toContain("!{workspaceRoot}/packages/db/prisma/generated/**");
    expect(prismaInputs).toContain("!{workspaceRoot}/packages/db/prisma/**/*.db*");
    expect(prismaInputs).toContain("!{workspaceRoot}/packages/db/local.db*");
    expect(prismaInputs).not.toContain("!{workspaceRoot}/apps/server/dist/**");
  });

  it("excludes Cloudflare generated paths only for Cloudflare stacks", () => {
    const nextCloudflareInputs = generateNxConfig(
      configWith({
        frontend: ["next"],
        backend: "self",
        database: "none",
        orm: "none",
        api: "none",
        webDeploy: "cloudflare",
      }),
    ).namedInputs.production;

    expect(nextCloudflareInputs).toContain("!{workspaceRoot}/apps/web/.next/**");
    expect(nextCloudflareInputs).toContain("!{workspaceRoot}/apps/web/.open-next/**");
    expect(nextCloudflareInputs).toContain("!{workspaceRoot}/.alchemy/**");
    expect(nextCloudflareInputs).toContain("!{workspaceRoot}/.wrangler/**");
    expect(nextCloudflareInputs).not.toContain("!{workspaceRoot}/apps/server/dist/**");
    expect(nextCloudflareInputs).not.toContain("!{workspaceRoot}/packages/db/dist/**");
  });
});
