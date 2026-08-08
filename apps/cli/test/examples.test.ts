import { describe, expect, it } from "bun:test";

import { expectError, expectSuccess, runTRPCTest } from "./test-utils";

describe("Example Configurations", () => {
  describe("Todo Example", () => {
    it("should work with todo example + database + backend", async () => {
      const result = await runTRPCTest({
        projectName: "todo-with-db",
        examples: ["todo"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with todo example + no backend", async () => {
      const result = await runTRPCTest({
        projectName: "todo-no-backend",
        examples: ["none"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with todo example + backend + no database", async () => {
      const result = await runTRPCTest({
        projectName: "todo-backend-no-db-fail",
        examples: ["todo"],
        backend: "hono",
        runtime: "bun",
        database: "none",
        orm: "none",
        auth: "none",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "The 'todo' example requires a database");
    });
  });

  describe("AI Example", () => {
    it("should work with AI example + React frontend", async () => {
      const result = await runTRPCTest({
        projectName: "ai-react",
        examples: ["ai"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with AI example + Next.js", async () => {
      const result = await runTRPCTest({
        projectName: "ai-next",
        examples: ["ai"],
        backend: "self",
        runtime: "none",
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "orpc",
        frontend: ["next"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with AI example + no backend", async () => {
      const result = await runTRPCTest({
        projectName: "ai-no-backend-fail",
        examples: ["ai"],
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        auth: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "The 'ai' example requires a backend");
    });
  });

  describe("Multiple Examples", () => {
    it("should work with both todo and AI examples", async () => {
      const result = await runTRPCTest({
        projectName: "todo-ai-combo",
        examples: ["todo", "ai"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Examples with None Option", () => {
    it("should work with examples none", async () => {
      const result = await runTRPCTest({
        projectName: "no-examples",
        examples: ["none"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with none + other examples", async () => {
      const result = await runTRPCTest({
        projectName: "none-with-examples-fail",
        examples: ["none", "todo"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Cannot combine 'none' with other examples");
    });
  });

  describe("Examples with API None", () => {
    it("should fail with todo when API is none", async () => {
      const result = await runTRPCTest({
        projectName: "examples-api-none-fail",
        examples: ["todo"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Cannot use '--examples todo' when '--api' is set to 'none'");
    });
  });
});
