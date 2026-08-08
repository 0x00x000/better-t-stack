import { describe, it } from "bun:test";

import { expectError, runTRPCTest } from "./test-utils";

describe("Integration Tests - Real World Scenarios", () => {
  describe("Complex Error Scenarios", () => {
    it("should fail with incompatible stack combination", async () => {
      const result = await runTRPCTest({
        projectName: "incompatible-stack-fail",
        backend: "hono",
        runtime: "bun",
        database: "mongodb",
        orm: "drizzle",
        auth: "better-auth",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Drizzle ORM does not support MongoDB");
    });

    it("should fail with workers + incompatible database", async () => {
      const result = await runTRPCTest({
        projectName: "workers-mongodb-fail",
        backend: "hono",
        runtime: "workers",
        database: "mongodb",
        orm: "mongoose",
        auth: "none",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "cloudflare",
        expectError: true,
      });

      expectError(
        result,
        "Cloudflare Workers runtime (--runtime workers) is not compatible with MongoDB database",
      );
    });

    it("should fail with addon incompatibility", async () => {
      const result = await runTRPCTest({
        projectName: "pwa-native-fail",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["native-bare"],
        addons: ["pwa"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "pwa addon requires one of these frontends");
    });

    it("should fail with deployment constraint violation", async () => {
      const result = await runTRPCTest({
        projectName: "web-deploy-no-frontend-fail",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["native-bare"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "cloudflare",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "'--web-deploy' requires a web frontend");
    });
  });
});
