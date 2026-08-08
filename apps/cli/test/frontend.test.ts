import { describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

import { expectError, expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Frontend Configurations", () => {
  describe("Single Frontend Options", () => {
    const singleFrontends = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "native-bare",
      "native-uniwind",
      "native-unistyles",
    ] satisfies ReadonlyArray<
      | "tanstack-router"
      | "react-router"
      | "tanstack-start"
      | "next"
      | "native-bare"
      | "native-uniwind"
      | "native-unistyles"
    >;

    for (const frontend of singleFrontends) {
      it(`should work with ${frontend}`, async () => {
        const config: TestConfig = {
          projectName: `${frontend}-app`,
          frontend: [frontend],
          install: false,
          backend: frontend === "next" ? "self" : "hono",
          runtime: frontend === "next" ? "none" : "bun",
          database: "sqlite",
          orm: "drizzle",
          auth: frontend === "next" ? "better-auth" : "none",
          api: "orpc",
          addons: ["none"],
          examples: ["none"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
        };

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("Multiple Frontend Constraints", () => {
    it("should fail with multiple web frontends", async () => {
      const result = await runTRPCTest({
        projectName: "multiple-web-fail",
        frontend: ["tanstack-router", "react-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Cannot select multiple web frameworks");
    });

    it("should fail with multiple native frontends", async () => {
      const result = await runTRPCTest({
        projectName: "multiple-native-fail",
        frontend: ["native-bare", "native-unistyles"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Cannot select multiple native frameworks");
    });

    it("should work with one web + one native frontend", async () => {
      const result = await runTRPCTest({
        projectName: "web-native-combo",
        frontend: ["tanstack-router", "native-bare"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
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
  });

  describe("Native Bare Layout", () => {
    it("should keep drawer content aligned under the native header", async () => {
      const result = await runTRPCTest({
        projectName: "native-bare-layout",
        frontend: ["native-bare"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      if (!result.projectDir) {
        throw new Error("Expected projectDir to be defined");
      }

      const nativeIndexFile = await fs.readFile(
        path.join(result.projectDir, "apps/native/app/(drawer)/index.tsx"),
        "utf8",
      );
      const containerFile = await fs.readFile(
        path.join(result.projectDir, "apps/native/components/container.tsx"),
        "utf8",
      );

      expect(nativeIndexFile).toContain('contentInsetAdjustmentBehavior="never"');
      expect(nativeIndexFile).toContain("<Host style={styles.titleHost}>");
      expect(nativeIndexFile).toContain('textAlign: "center"');
      expect(nativeIndexFile).toContain("height: 34");
      expect(containerFile).toContain('edges={["left", "right", "bottom"]}');
    });
  });

  describe("Frontend with None Option", () => {
    it("should work with frontend none", async () => {
      const result = await runTRPCTest({
        projectName: "no-frontend",
        frontend: ["none"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
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

    it("should fail with none + other frontends", async () => {
      const result = await runTRPCTest({
        projectName: "none-with-other-fail",
        frontend: ["none", "tanstack-router"],
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "Cannot combine 'none' with other frontend options");
    });
  });

  describe("Next.js with Self Backend", () => {
    it("should work with Next.js and self backend", async () => {
      const result = await runTRPCTest({
        projectName: "nextjs-self-backend",
        frontend: ["next"],
        backend: "self",
        runtime: "none",
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
  });

  describe("Web Deploy Constraints", () => {
    it("should work with web frontend + web deploy", async () => {
      const result = await runTRPCTest({
        projectName: "web-deploy",
        frontend: ["tanstack-router"],
        webDeploy: "cloudflare",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should fail with web deploy but no web frontend", async () => {
      const result = await runTRPCTest({
        projectName: "web-deploy-no-frontend-fail",
        frontend: ["native-bare"],
        webDeploy: "cloudflare",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        auth: "none",
        api: "orpc",
        addons: ["none"],
        examples: ["none"],
        dbSetup: "none",
        serverDeploy: "none",
        expectError: true,
      });

      expectError(result, "'--web-deploy' requires a web frontend");
    });
  });
});
