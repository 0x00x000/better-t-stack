import { describe, expect, it } from "bun:test";

import {
  getRecommendedSourceKeys,
  NEST_REQUIRED_SOURCE_KEYS,
  setupRequiredNestSkills,
} from "../src/helpers/addons/skills-setup";
import { createVirtual } from "../src/index";
import type { ProjectConfig } from "../src/types";
import { runWithContextAsync } from "../src/utils/context";
import { collectFiles } from "./setup";
import { expectError, expectSuccess, runTRPCTest } from "./test-utils";

const nestCleanConfig = {
  projectName: "nest-clean",
  backend: "nest" as const,
  runtime: "bun" as const,
  api: "none" as const,
  auth: "none" as const,
  database: "none" as const,
  orm: "none" as const,
  frontend: ["none"] as const,
  addons: ["none"] as const,
  examples: ["none"] as const,
  dbSetup: "none" as const,
  webDeploy: "none" as const,
  serverDeploy: "none" as const,
  payments: "none" as const,
  install: false,
  git: false,
  packageManager: "bun" as const,
};

function nestProjectConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  return {
    projectName: "nest-app",
    projectDir: "/virtual",
    relativePath: ".",
    database: "none",
    orm: "none",
    backend: "nest",
    runtime: "bun",
    frontend: [],
    addons: [],
    examples: [],
    auth: "none",
    payments: "none",
    git: false,
    packageManager: "bun",
    install: false,
    dbSetup: "none",
    api: "none",
    webDeploy: "none",
    serverDeploy: "none",
    ...overrides,
  };
}

describe("NestJS backend (phase 1)", () => {
  it("scaffolds a clean Nest Fastify app", async () => {
    const result = await createVirtual(nestCleanConfig);
    expect(result.isOk()).toBe(true);
    if (result.isErr()) throw result.error;

    const files = collectFiles(result.value.root, result.value.root.path);

    expect(files.has("apps/server/src/main.ts")).toBe(true);
    expect(files.has("apps/server/src/index.ts")).toBe(false);
    expect(files.has("apps/server/tsdown.config.ts")).toBe(false);
    expect(files.has("apps/server/build.ts")).toBe(true);
    expect(files.has("packages/api/package.json")).toBe(false);

    const main = files.get("apps/server/src/main.ts");
    expect(main).toContain("FastifyAdapter");
    expect(main).toContain("bodyParser: false");
    expect(main).not.toContain("@nestjs/platform-express");

    const pkg = JSON.parse(files.get("apps/server/package.json") ?? "{}") as {
      type?: string;
      main?: string;
      scripts?: Record<string, string>;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    expect(pkg.type).toBe("module");
    expect(pkg.main).toBe("src/main.ts");
    expect(pkg.scripts?.dev).toBe("bun run --hot src/main.ts");
    expect(pkg.scripts?.start).toBe("bun dist/main.js");
    expect(pkg.scripts?.build).toBe("tsc --noEmit && bun build.ts");
    expect(pkg.dependencies?.["@nestjs/platform-fastify"]).toBeDefined();
    expect(pkg.dependencies?.fastify).toBeDefined();
    expect(pkg.dependencies?.["@nestjs/platform-express"]).toBeUndefined();
    expect(pkg.devDependencies?.tsdown).toBeUndefined();

    const health = files.get("apps/server/src/modules/health/health.controller.ts");
    expect(health).toContain('return "OK"');
  });

  it("creates a nest project through the CLI API", async () => {
    const result = await runTRPCTest({
      ...nestCleanConfig,
      projectName: "nest-cli-create",
    });

    expectSuccess(result);
    expect(result.result?.projectConfig.backend).toBe("nest");
    expect(result.result?.projectConfig.runtime).toBe("bun");
  });

  it("rejects nest + node", async () => {
    const result = await runTRPCTest({
      ...nestCleanConfig,
      projectName: "nest-node-invalid",
      runtime: "node",
      expectError: true,
    });

    expectError(result, "NestJS backend (--backend nest) requires Bun runtime");
  });

  it("rejects nest + workers", async () => {
    const result = await runTRPCTest({
      ...nestCleanConfig,
      projectName: "nest-workers-invalid",
      runtime: "workers",
      expectError: true,
    });

    expectError(result, "NestJS backend (--backend nest) requires Bun runtime");
  });

  it("keeps hono generation unchanged", async () => {
    const result = await createVirtual({
      projectName: "hono-regression",
      backend: "hono",
      runtime: "bun",
      api: "none",
      auth: "none",
      database: "none",
      orm: "none",
      frontend: ["none"],
      addons: [],
      examples: [],
      dbSetup: "none",
      webDeploy: "none",
      serverDeploy: "none",
      payments: "none",
      packageManager: "bun",
    });

    expect(result.isOk()).toBe(true);
    if (result.isErr()) throw result.error;

    const files = collectFiles(result.value.root, result.value.root.path);
    expect(files.has("apps/server/src/index.ts")).toBe(true);
    expect(files.has("apps/server/src/main.ts")).toBe(false);
    expect(files.has("apps/server/tsdown.config.ts")).toBe(true);

    const index = files.get("apps/server/src/index.ts");
    expect(index).toContain("Hono");
    expect(index).toContain('return c.text("OK")');
  });

  it("recommends nest skills and never hono-skill", () => {
    const nestSources = getRecommendedSourceKeys(nestProjectConfig());
    for (const source of NEST_REQUIRED_SOURCE_KEYS) {
      expect(nestSources).toContain(source);
    }
    expect(nestSources).not.toContain("yusukebe/hono-skill");

    const honoSources = getRecommendedSourceKeys(nestProjectConfig({ backend: "hono" }));
    expect(honoSources).toContain("yusukebe/hono-skill");
    expect(honoSources).not.toContain("anasx7/skills");
    expect(honoSources).not.toContain("0x00x000/skills");
  });

  it("skips required nest skill install when external commands are disabled", async () => {
    const result = await runWithContextAsync({ silent: true }, () =>
      setupRequiredNestSkills(nestProjectConfig()),
    );

    expect(result.isOk()).toBe(true);
  });
});
