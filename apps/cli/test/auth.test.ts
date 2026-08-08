import { describe, expect, it } from "bun:test";
import path from "node:path";

import fs from "fs-extra";

import type { Backend, Database, Frontend, ORM } from "../src/types";
import { expectSuccess, runTRPCTest, type TestConfig } from "./test-utils";

describe("Authentication Configurations", () => {
  describe("Better-Auth Provider", () => {
    const databases = ["sqlite", "postgres", "mysql"];
    for (const database of databases) {
      it(`should work with better-auth + ${database}`, async () => {
        const result = await runTRPCTest({
          projectName: `better-auth-${database}`,
          auth: "better-auth",
          backend: "hono",
          runtime: "bun",
          database: database as Database,
          orm: "drizzle",
          api: "orpc",
          frontend: ["tanstack-router"],
          addons: ["turborepo"],
          examples: ["todo"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }

    it("should work with better-auth + mongodb + mongoose", async () => {
      const result = await runTRPCTest({
        projectName: "better-auth-mongodb",
        auth: "better-auth",
        backend: "hono",
        runtime: "bun",
        database: "mongodb",
        orm: "mongoose",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      expect(result.projectDir).toBeDefined();
      const projectDir = result.projectDir as string;
      const authPackageJson = await fs.readJson(
        path.join(projectDir, "packages/auth/package.json"),
      );
      expect(authPackageJson.dependencies.mongodb).toBe("^7.5.0");

      const dbIndex = await fs.readFile(path.join(projectDir, "packages/db/src/index.ts"), "utf8");
      expect(dbIndex).toContain("await mongoose.connect(env.DATABASE_URL);");
      expect(dbIndex).toContain("mongoose.connection.getClient().db()");
      expect(dbIndex).not.toContain(".catch(");
      expect(dbIndex).not.toContain("myDB");

      const todosRoute = await fs.readFile(
        path.join(projectDir, "apps/web/src/routes/todos.tsx"),
        "utf8",
      );
      expect(todosRoute).toContain("handleToggleTodo = (id: TodoId");
      expect(todosRoute).toContain("const handleToggleTodo = (id: TodoId");
      expect(todosRoute).toContain("const handleDeleteTodo = (id: TodoId");

      const todoRouter = await fs.readFile(
        path.join(projectDir, "packages/api/src/routers/todo.ts"),
        "utf8",
      );
      expect(todoRouter).toContain('import "@better-auth-mongodb/db";');
      expect(todoRouter).toContain("id: todo.id");

      const authModels = await fs.readFile(
        path.join(projectDir, "packages/db/src/models/auth.model.ts"),
        "utf8",
      );
      expect(authModels).toContain("const { ObjectId } = Schema.Types");
      expect(authModels).toContain("_id: { type: ObjectId, auto: true }");
      expect(authModels).toContain('userId: { type: ObjectId, ref: "User", required: true }');
      expect(authModels).toContain("sessionSchema.index({ userId: 1 })");
      expect(authModels).toContain("verificationSchema.index({ identifier: 1 })");
    });

    it("should add nextCookies plugin for Next.js self backend", async () => {
      const result = await runTRPCTest({
        projectName: "better-auth-next-self-plugins",
        auth: "better-auth",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "drizzle",
        api: "orpc",
        frontend: ["next"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "cloudflare",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
      if (!result.projectDir) {
        throw new Error("Expected projectDir to be defined");
      }

      const authFile = await fs.readFile(
        path.join(result.projectDir, "packages/auth/src/index.ts"),
        "utf8",
      );

      expect(authFile).toContain('import { nextCookies } from "better-auth/next-js";');
      expect(authFile).toContain("nextCookies()");
    });

    it("should add tanstackStartCookies plugin for TanStack Start self backend", async () => {
      const result = await runTRPCTest({
        projectName: "better-auth-tanstack-start-self-plugins",
        auth: "better-auth",
        backend: "self",
        runtime: "none",
        database: "postgres",
        orm: "drizzle",
        api: "orpc",
        frontend: ["tanstack-start"],
        addons: ["turborepo"],
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

      const authFile = await fs.readFile(
        path.join(result.projectDir, "packages/auth/src/index.ts"),
        "utf8",
      );

      expect(authFile).toContain(
        'import { tanstackStartCookies } from "better-auth/tanstack-start";',
      );
      expect(authFile).toContain("tanstackStartCookies()");
    });

    const compatibleFrontends = [
      "tanstack-router",
      "react-router",
      "tanstack-start",
      "next",
      "native-bare",
      "native-uniwind",
      "native-unistyles",
    ];

    for (const frontend of compatibleFrontends) {
      it(`should work with better-auth + ${frontend}`, async () => {
        const config: TestConfig = {
          projectName: `better-auth-${frontend}`,
          auth: "better-auth",
          backend: "hono",
          runtime: "bun",
          database: "sqlite",
          orm: "drizzle",
          frontend: [frontend as Frontend],
          addons: ["turborepo"],
          examples: ["todo"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
          api: "orpc",
        };

        const result = await runTRPCTest(config);
        expectSuccess(result);
        if (!result.projectDir) {
          throw new Error("Expected projectDir to be defined");
        }
        const packageJson = JSON.parse(
          await fs.readFile(path.join(result.projectDir, "package.json"), "utf8"),
        );
        expect(packageJson.workspaces.catalog["better-auth"]).toBe("1.6.25");
      });
    }
  });

  describe("No Authentication", () => {
    it("should work with auth none", async () => {
      const result = await runTRPCTest({
        projectName: "no-auth",
        auth: "none",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should work with auth none + no database", async () => {
      // When backend is 'none', examples are automatically cleared
      const result = await runTRPCTest({
        projectName: "no-auth-no-db",
        auth: "none",
        backend: "none",
        runtime: "none",
        database: "none",
        orm: "none",
        api: "none",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["none"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });
  });

  describe("Authentication with Different Backends", () => {
    const backends = ["hono", "self"] as const;

    for (const backend of backends) {
      it(`should work with better-auth + ${backend}`, async () => {
        const config: TestConfig = {
          projectName: `better-auth-${backend}`,
          auth: "better-auth",
          backend: backend as Backend,
          database: "sqlite",
          orm: "drizzle",
          api: "orpc",
          frontend: backend === "self" ? ["next"] : ["tanstack-router"],
          addons: ["turborepo"],
          examples: ["todo"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        };

        if (backend === "self") {
          config.runtime = "none";
        } else {
          config.runtime = "bun";
        }

        const result = await runTRPCTest(config);
        expectSuccess(result);
      });
    }
  });

  describe("Authentication with Different ORMs", () => {
    const ormCombinations = [
      { database: "sqlite", orm: "drizzle" },
      { database: "sqlite", orm: "prisma" },
      { database: "postgres", orm: "drizzle" },
      { database: "postgres", orm: "prisma" },
      { database: "mysql", orm: "drizzle" },
      { database: "mysql", orm: "prisma" },
      { database: "mongodb", orm: "mongoose" },
      { database: "mongodb", orm: "prisma" },
    ];

    for (const { database, orm } of ormCombinations) {
      it(`should work with better-auth + ${database} + ${orm}`, async () => {
        const result = await runTRPCTest({
          projectName: `better-auth-${database}-${orm}`,
          auth: "better-auth",
          backend: "hono",
          runtime: "bun",
          database: database as Database,
          orm: orm as ORM,
          api: "orpc",
          frontend: ["tanstack-router"],
          addons: ["turborepo"],
          examples: ["todo"],
          dbSetup: "none",
          webDeploy: "none",
          serverDeploy: "none",
          install: false,
        });

        expectSuccess(result);
      });
    }
  });

  describe("Auth Edge Cases", () => {
    it("should handle auth with complex frontend combinations", async () => {
      const result = await runTRPCTest({
        projectName: "auth-web-native-combo",
        auth: "better-auth",
        backend: "hono",
        runtime: "bun",
        database: "sqlite",
        orm: "drizzle",
        api: "orpc",
        frontend: ["tanstack-router", "native-bare"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "none",
        install: false,
      });

      expectSuccess(result);
    });

    it("should handle auth constraints with workers runtime", async () => {
      const result = await runTRPCTest({
        projectName: "auth-workers",
        auth: "better-auth",
        backend: "hono",
        runtime: "workers",
        database: "sqlite",
        orm: "drizzle",
        api: "orpc",
        frontend: ["tanstack-router"],
        addons: ["turborepo"],
        examples: ["todo"],
        dbSetup: "none",
        webDeploy: "none",
        serverDeploy: "cloudflare",
        install: false,
      });

      expectSuccess(result);
    });
  });
});
