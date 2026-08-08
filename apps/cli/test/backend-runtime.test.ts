import { describe, it } from "bun:test";

import type { Backend, Frontend, Runtime } from "../src/types";
import { expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Backend and Runtime Combinations", () => {
  describe("Valid Backend-Runtime Combinations", () => {
    const validCombinations = [
      // Standard backend-runtime combinations
      { backend: "hono" as const, runtime: "bun" as const },
      { backend: "hono" as const, runtime: "node" as const },
      { backend: "hono" as const, runtime: "workers" as const },

      { backend: "hono" as const, runtime: "bun" as const },
      { backend: "hono" as const, runtime: "node" as const },

      { backend: "hono" as const, runtime: "bun" as const },
      { backend: "hono" as const, runtime: "node" as const },

      { backend: "hono" as const, runtime: "bun" as const },

      // Special cases
      { backend: "none" as const, runtime: "none" as const },
      { backend: "self" as const, runtime: "none" as const },
    ];

    for (const { backend, runtime } of validCombinations) {
      it(`should work with ${backend} + ${runtime}`, async () => {
        const config: TestConfig = {
          projectName: `${backend}-${runtime}`,
          backend,
          runtime,
          frontend: ["tanstack-router"],
          webDeploy: "none",
          serverDeploy: "none",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          install: false,
        };

        // Set appropriate defaults based on backend
        if (backend === "none") {
          config.database = "none";
          config.orm = "none";
          config.auth = "none";
          config.api = "none";
        } else if (backend === "self") {
          config.frontend = ["next"];
          config.database = "sqlite";
          config.orm = "drizzle";
          config.auth = "better-auth";
          config.api = "orpc";
        } else {
          config.database = "sqlite";
          config.orm = "drizzle";
          config.auth = "none";
          config.api = "orpc";
        }

        // Set server deployment for workers runtime
        if (runtime === "workers") {
          config.serverDeploy = "cloudflare";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("Invalid Backend-Runtime Combinations", () => {
    const invalidCombinations = [
      // Workers runtime only works with Hono
      {
        backend: "hono" as const,
        runtime: "workers" as const,
        error: "Cloudflare Workers runtime (--runtime workers) is only supported with Hono backend",
      },
      {
        backend: "hono",
        runtime: "workers",
        error: "Cloudflare Workers runtime (--runtime workers) is only supported with Hono backend",
      },
      {
        backend: "hono",
        runtime: "workers",
        error: "Cloudflare Workers runtime (--runtime workers) is only supported with Hono backend",
      },

      // Backend none requires runtime none
      {
        backend: "none",
        runtime: "bun",
        error: "Backend 'none' requires '--runtime none'",
      },
      {
        backend: "none",
        runtime: "node",
        error: "Backend 'none' requires '--runtime none'",
      },
      {
        backend: "none",
        runtime: "workers",
        error: "Backend 'none' requires '--runtime none'",
      },

      // Self backend requires runtime none
      {
        backend: "self",
        runtime: "bun",
        error: "Backend 'self' (fullstack) requires '--runtime none'",
        frontend: ["next"], // Need to specify Next.js frontend for self backend
      },
      {
        backend: "self",
        runtime: "node",
        error: "Backend 'self' (fullstack) requires '--runtime none'",
        frontend: ["next"], // Need to specify Next.js frontend for self backend
      },
      {
        backend: "self",
        runtime: "workers",
        error: "Backend 'self' (fullstack) requires '--runtime none'",
        frontend: ["next"], // Need to specify Next.js frontend for self backend
      },

      // Runtime none only works with none or self backend
      {
        backend: "hono",
        runtime: "none",
        error: "'--runtime none' is only supported with '--backend none', or '--backend self'",
      },
    ];

    for (const { backend, runtime, error, frontend } of invalidCombinations) {
      it(`should fail with ${backend} + ${runtime}`, async () => {
        const config: TestConfig = {
          projectName: `invalid-${backend}-${runtime}`,
          backend: backend as Backend,
          runtime: runtime as Runtime,
          frontend: (frontend || ["tanstack-router"]) as Frontend[],
          auth: "none",
          api: "orpc",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          expectError: true,
        };

        // Set appropriate defaults based on backend
        if (backend === "none") {
          config.database = "none";
          config.orm = "none";
          config.auth = "none";
          config.api = "none";
        } else if (backend === "self") {
          config.database = "sqlite";
          config.orm = "drizzle";
          config.auth = "better-auth";
          config.api = "orpc";
        } else {
          config.database = "sqlite";
          config.orm = "drizzle";
          config.auth = "none";
          config.api = "orpc";
        }

        const result = await runTRPCTest(config);
        expectError(result, error);
      });
    }
  });

  describe("Workers Runtime Constraints", () => {
    it("should work with workers + hono + compatible database", async () => {
      const result = await runTRPCTest({
        projectName: "workers-compatible",
        backend: "hono",
        runtime: "workers",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "cloudflare", // Workers requires server deployment
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail workers with mongodb", async () => {
      const result = await runTRPCTest({
        projectName: "workers-mongodb",
        backend: "hono",
        runtime: "workers",
        database: "mongodb",
        orm: "prisma",
        auth: "none",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(
        result,
        "Cloudflare Workers runtime (--runtime workers) is not compatible with MongoDB database",
      );
    });

    it("should fail workers without server deployment", async () => {
      const result = await runTRPCTest({
        projectName: "workers-no-deploy",
        backend: "hono",
        runtime: "workers",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Cloudflare Workers runtime requires a server deployment");
    });
  });

  describe("Self Backend Constraints", () => {
    it("should work with self backend and Next.js frontend", async () => {
      const result = await runTRPCTest({
        projectName: "self-backend-success",
        backend: "self",
        runtime: "none",
        frontend: ["next"],
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail self backend with non-Next.js frontend", async () => {
      const result = await runTRPCTest({
        projectName: "self-backend-invalid-frontend",
        backend: "self",
        runtime: "none",
        frontend: ["tanstack-router"], // Invalid frontend for self backend
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
        install: false,
      });

      expectError(
        result,
        "Backend 'self' (fullstack) currently only supports Next.js and TanStack Start. Please use --frontend next or --frontend tanstack-start.",
      );
    });

    it("should fail self backend with non-none runtime", async () => {
      const result = await runTRPCTest({
        projectName: "self-backend-invalid-runtime",
        backend: "self",
        runtime: "bun", // Invalid runtime for self backend
        frontend: ["next"],
        database: "sqlite",
        orm: "drizzle",
        auth: "better-auth",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
        install: false,
      });

      expectError(result, "Backend 'self' (fullstack) requires '--runtime none'");
    });
  });
});
