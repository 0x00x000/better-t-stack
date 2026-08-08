import { describe, expect, it } from "bun:test";

import { createVirtual } from "../src/index";
import { collectFiles } from "./setup";

async function generateReadme(config: Parameters<typeof createVirtual>[0]): Promise<string> {
  const result = await createVirtual({
    projectName: "readme-check",
    frontend: ["tanstack-router"],
    backend: "hono",
    runtime: "bun",
    database: "sqlite",
    orm: "drizzle",
    auth: "better-auth",
    api: "orpc",
    addons: ["turborepo"],
    examples: ["todo"],
    dbSetup: "none",
    webDeploy: "none",
    serverDeploy: "none",
    install: false,
    git: false,
    packageManager: "bun",
    payments: "none",
    ...config,
  });

  expect(result.isOk()).toBe(true);

  if (result.isErr()) {
    throw result.error;
  }

  const files = collectFiles(result.value.root, result.value.root.path);
  return files.get("README.md") ?? "";
}

describe("README generation", () => {
  it("includes project structure for a standard hono stack", async () => {
    const readme = await generateReadme({
      frontend: ["tanstack-router"],
      backend: "hono",
    });

    expect(readme).toContain("apps/web");
    expect(readme).toContain("apps/server");
  });

  it("documents optional native Vite+ hooks when no hook addon is selected", async () => {
    const readme = await generateReadme({
      addons: ["vite-plus"],
    });

    expect(readme).toContain("Optional native Vite+ hooks");
    expect(readme).toContain("`bun run hooks:setup`");
    expect(readme).toContain("https://viteplus.dev/guide/commit-hooks");
  });

  it("keeps Vite+ native hook docs out when Husky handles hooks", async () => {
    const readme = await generateReadme({
      addons: ["vite-plus", "husky"],
    });

    expect(readme).not.toContain("Optional native Vite+ hooks");
    expect(readme).toContain("Initialize hooks: `bun run prepare`");
  });
});
