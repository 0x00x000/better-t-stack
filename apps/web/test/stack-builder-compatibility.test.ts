import { describe, expect, test } from "bun:test";

import {
  ADDONS_VALUES,
  SERVER_DEPLOY_VALUES,
  WEB_DEPLOY_VALUES,
} from "../../../packages/types/src/schemas";
import {
  applyStackUpdate,
  getSelectedTechRemovalUpdate,
  getTechSelectionUpdate,
  resolveStackCompatibility,
} from "../src/app/(home)/new/_components/stack-builder/use-stack-builder";
import {
  analyzeStackCompatibility,
  getDisabledReason,
} from "../src/app/(home)/new/_components/utils";
import { DEFAULT_STACK, type StackState, TECH_OPTIONS } from "../src/lib/constant";
import { sanitizeAddons } from "../src/lib/sanitize-stack-addons";
import { formatStackCommandForDisplay, generateStackCommand } from "../src/lib/stack-utils";

function createStack(overrides: Partial<StackState> = {}): StackState {
  return {
    ...DEFAULT_STACK,
    ...overrides,
    webFrontend: [...(overrides.webFrontend ?? DEFAULT_STACK.webFrontend)],
    nativeFrontend: [...(overrides.nativeFrontend ?? DEFAULT_STACK.nativeFrontend)],
    addons: [...(overrides.addons ?? DEFAULT_STACK.addons)],
    examples: [...(overrides.examples ?? DEFAULT_STACK.examples)],
  };
}

describe("stack builder D1 compatibility", () => {
  test("supports TanStack Start as a self-hosted fullstack backend", () => {
    const stack = createStack({
      webFrontend: ["tanstack-start"],
      backend: "self-tanstack-start",
      runtime: "none",
      api: "orpc",
      serverDeploy: "none",
    });

    expect(getDisabledReason(stack, "backend", "self-tanstack-start")).toBeNull();
    expect(analyzeStackCompatibility(stack).adjustedStack).toBeNull();

    const command = generateStackCommand(stack);
    expect(command).toContain("--frontend tanstack-start");
    expect(command).toContain("--backend self");
  });

  test("keeps self fullstack backends on the D1 + Cloudflare path", () => {
    const stack = createStack({
      backend: "self-next",
      webFrontend: ["next"],
      runtime: "none",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "d1",
      webDeploy: "none",
      serverDeploy: "none",
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack).toMatchObject({
      backend: "self-next",
      runtime: "none",
      database: "sqlite",
      dbSetup: "d1",
      webDeploy: "cloudflare",
      serverDeploy: "none",
    });
  });

  test("still routes non-self D1 stacks through workers + cloudflare", () => {
    const stack = createStack({
      backend: "hono",
      runtime: "bun",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "d1",
      serverDeploy: "none",
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack).toMatchObject({
      backend: "hono",
      runtime: "workers",
      database: "sqlite",
      dbSetup: "d1",
      serverDeploy: "cloudflare",
    });
  });

  test("allows selecting D1 for self fullstack backends", () => {
    const stack = createStack({
      backend: "self-next",
      webFrontend: ["next"],
      runtime: "none",
      database: "sqlite",
    });

    expect(getDisabledReason(stack, "dbSetup", "d1")).toBeNull();
  });

  test("blocks non-cloudflare web deployment for self fullstack D1 stacks", () => {
    const stack = createStack({
      backend: "self-next",
      webFrontend: ["next"],
      runtime: "none",
      database: "sqlite",
      dbSetup: "d1",
      webDeploy: "cloudflare",
    });

    expect(getDisabledReason(stack, "webDeploy", "none")).toBe(
      "D1 with a self fullstack backend requires Cloudflare web deployment",
    );
  });

  test("keeps only the latest selected task-runner addon", () => {
    expect(sanitizeAddons(["turborepo", "vite-plus"])).toEqual(["vite-plus"]);
    expect(sanitizeAddons(["vite-plus", "nx"])).toEqual(["nx"]);
    expect(sanitizeAddons(["nx", "turborepo"])).toEqual(["turborepo"]);

    const sanitizedAddons = sanitizeAddons(["turborepo", "vite-plus"]);
    const command = generateStackCommand(createStack({ addons: sanitizedAddons }));

    expect(command).toContain("--addons vite-plus");
    expect(command).not.toContain("turborepo");

    expect(
      getDisabledReason(createStack({ addons: ["turborepo"] }), "addons", "vite-plus"),
    ).toBeNull();
    expect(getDisabledReason(createStack({ addons: ["vite-plus"] }), "addons", "nx")).toBeNull();
  });

  test("renders long CLI commands with visible flag separators", () => {
    const command = generateStackCommand(
      createStack({ addons: ["vite-plus"], examples: ["none"] }),
    );
    const displayCommand = formatStackCommandForDisplay(command);

    expect(command).toContain("my-better-t-app --frontend");
    expect(displayCommand).toContain(`my-better-t-app ${"\\"}\n  --frontend`);
    expect(displayCommand).toContain(`tanstack-router ${"\\"}\n  --backend`);
  });

  test("quotes project names as a single shell argument", () => {
    expect(generateStackCommand(createStack({ projectName: "name; echo INJECTED" }))).toContain(
      "'name; echo INJECTED' --yes",
    );
    expect(generateStackCommand(createStack({ projectName: "name$(echo INJECTED)" }))).toContain(
      "'name$(echo INJECTED)' --yes",
    );
    expect(generateStackCommand(createStack({ projectName: "project's app\nnext" }))).toContain(
      "'project'\\''s app\nnext' --yes",
    );
  });

  test("reapplies the same D1 adjustment after leaving and returning to it", () => {
    const initialRawD1Stack = createStack({
      backend: "self-next",
      webFrontend: ["next"],
      runtime: "none",
      database: "sqlite",
      dbSetup: "d1",
      webDeploy: "none",
      serverDeploy: "none",
    });

    const firstD1Selection = applyStackUpdate(initialRawD1Stack, {});
    const neonSelection = applyStackUpdate(firstD1Selection.stack, {
      dbSetup: "neon",
      webDeploy: "none",
    });
    const secondD1Selection = applyStackUpdate(neonSelection.stack, { dbSetup: "d1" });

    expect(firstD1Selection.stack.webDeploy).toBe("cloudflare");
    expect(neonSelection.stack).toMatchObject({ dbSetup: "neon", webDeploy: "none" });
    expect(secondD1Selection.stack).toMatchObject({
      dbSetup: "d1",
      webDeploy: "cloudflare",
    });
  });

  test("keeps native Expo when paired with TanStack Router", () => {
    const stack = applyStackUpdate(createStack(), (currentStack) =>
      getTechSelectionUpdate(currentStack, "nativeFrontend", "native-bare"),
    ).stack;

    expect(stack).toMatchObject({
      webFrontend: ["tanstack-router"],
      nativeFrontend: ["native-bare"],
      api: "orpc",
    });
    expect(getDisabledReason(stack, "nativeFrontend", "native-bare")).toBeNull();
    expect(generateStackCommand(stack)).toContain("--frontend tanstack-router native-bare");
  });

  test("removes a compatibility-adjusted badge against the effective stack", () => {
    const rawStack = createStack({
      webFrontend: ["tanstack-router"],
      nativeFrontend: ["native-bare"],
      api: "orpc",
    });

    expect(getSelectedTechRemovalUpdate(rawStack, "api", "orpc")).toEqual({ api: "none" });

    const adjustedStack = applyStackUpdate(rawStack, (currentStack) =>
      getSelectedTechRemovalUpdate(currentStack, "api", "orpc"),
    ).stack;

    expect(adjustedStack).toMatchObject({
      webFrontend: ["tanstack-router"],
      nativeFrontend: ["native-bare"],
      api: "none",
    });
  });

  test("matches the CLI by disabling every ORM when no database is selected", () => {
    const stack = resolveStackCompatibility(
      createStack({ database: "none", orm: "none", dbSetup: "none" }),
    ).stack;

    expect(getDisabledReason(stack, "orm", "drizzle")).toBe("Select a database first");
    expect(getDisabledReason(stack, "orm", "prisma")).toBe("Select a database first");
    expect(getDisabledReason(stack, "orm", "mongoose")).toBe("Select a database first");
    expect(getDisabledReason(stack, "orm", "none")).toBeNull();
  });

  test("blocks the AI example when no backend is selected", () => {
    const stack = createStack({
      webFrontend: ["next"],
      backend: "none",
      api: "none",
    });

    expect(getDisabledReason(stack, "examples", "ai")).toBe("The 'ai' example requires a backend.");

    const result = analyzeStackCompatibility({
      ...stack,
      examples: ["ai"],
    });

    expect(result.adjustedStack?.examples).toEqual(["none"]);
  });

  test("blocks Evlog when backend is none", () => {
    const stack = createStack({
      webFrontend: ["tanstack-router"],
      backend: "none",
      runtime: "none",
      addons: ["turborepo"],
    });

    expect(getDisabledReason(stack, "addons", "evlog")).toBe(
      "evlog addon supports Hono or backend self with Next.js or TanStack Start. Backend none is not supported yet.",
    );
  });

  test("removes Evlog when backend is none", () => {
    const stack = createStack({
      webFrontend: ["tanstack-router"],
      backend: "none",
      runtime: "none",
      addons: ["turborepo", "evlog"],
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack?.addons).toEqual(["turborepo"]);
    expect(result.changes).toContainEqual({
      category: "addons",
      message: "evlog removed (requires a server or fullstack backend)",
    });
  });

  test("allows Evlog for server and fullstack stacks", () => {
    const serverStack = createStack({
      backend: "hono",
      runtime: "bun",
    });
    const fullstackStack = createStack({
      webFrontend: ["tanstack-start"],
      backend: "self-tanstack-start",
      runtime: "none",
    });

    expect(getDisabledReason(serverStack, "addons", "evlog")).toBeNull();
    expect(getDisabledReason(fullstackStack, "addons", "evlog")).toBeNull();
  });
});

describe("stack builder Docker deployment compatibility", () => {
  test("allows Docker web deploy with a web frontend", () => {
    const stack = createStack({
      webFrontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
    });

    expect(getDisabledReason(stack, "webDeploy", "docker")).toBeNull();

    const command = generateStackCommand({
      ...stack,
      webDeploy: "docker",
    });
    expect(command).toContain("--web-deploy docker");
  });

  test("allows Docker server deploy on bun/node runtimes only", () => {
    const bunStack = createStack({
      backend: "hono",
      runtime: "bun",
    });
    const workersStack = createStack({
      backend: "hono",
      runtime: "workers",
      serverDeploy: "cloudflare",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "d1",
    });

    expect(getDisabledReason(bunStack, "serverDeploy", "docker")).toBeNull();
    expect(getDisabledReason(workersStack, "serverDeploy", "docker")).toBe(
      "Docker server deployment requires the Bun or Node runtime",
    );
  });

  test("switches Docker server deploy to Cloudflare when runtime becomes workers", () => {
    const stack = createStack({
      backend: "hono",
      runtime: "workers",
      serverDeploy: "docker",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "d1",
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack).toMatchObject({
      serverDeploy: "cloudflare",
    });
  });

  test("clears Docker server deploy for backends without a server app", () => {
    const stack = createStack({
      webFrontend: ["next"],
      backend: "self-next",
      runtime: "none",
      serverDeploy: "docker",
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack).toMatchObject({
      serverDeploy: "none",
    });
  });

  test("blocks Docker web deploy when desktop addons require static server output", () => {
    const stack = createStack({
      webFrontend: ["next"],
      addons: ["electrobun"],
      webDeploy: "none",
    });

    expect(getDisabledReason(stack, "webDeploy", "docker")).toBe(
      "Docker cannot serve the static output required by electrobun on next",
    );
    expect(resolveStackCompatibility({ ...stack, webDeploy: "docker" }).stack.webDeploy).toBe(
      "none",
    );
  });
});

describe("stack builder Vercel deployment compatibility", () => {
  test("allows Vercel web deploy with a web frontend", () => {
    const stack = createStack({
      webFrontend: ["tanstack-router"],
      backend: "hono",
      runtime: "bun",
    });

    expect(getDisabledReason(stack, "webDeploy", "vercel")).toBeNull();

    const command = generateStackCommand({
      ...stack,
      webDeploy: "vercel",
    });
    expect(command).toContain("--web-deploy vercel");
  });

  test("allows Vercel server deploy on bun/node runtimes only", () => {
    const bunStack = createStack({
      backend: "hono",
      runtime: "bun",
    });
    const workersStack = createStack({
      backend: "hono",
      runtime: "workers",
      serverDeploy: "cloudflare",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "d1",
    });

    expect(getDisabledReason(bunStack, "serverDeploy", "vercel")).toBeNull();
    expect(getDisabledReason(workersStack, "serverDeploy", "vercel")).toBe(
      "Vercel server deployment requires the Bun or Node runtime",
    );
  });

  test("switches Vercel server deploy to Cloudflare when runtime becomes workers", () => {
    const stack = createStack({
      backend: "hono",
      runtime: "workers",
      serverDeploy: "vercel",
      database: "sqlite",
      orm: "drizzle",
      dbSetup: "d1",
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack).toMatchObject({
      serverDeploy: "cloudflare",
    });
  });

  test("clears Vercel server deploy for backends without a server app", () => {
    const stack = createStack({
      webFrontend: ["next"],
      backend: "self-next",
      runtime: "none",
      serverDeploy: "vercel",
    });

    const result = analyzeStackCompatibility(stack);

    expect(result.adjustedStack).toMatchObject({
      serverDeploy: "none",
    });
  });
});

describe("stack builder NestJS backend", () => {
  test("exposes NestJS next to Hono", () => {
    expect(TECH_OPTIONS.backend.map((option) => option.id)).toContain("nest");
  });

  test("locks NestJS to the Bun runtime", () => {
    const nestStack = createStack({ backend: "nest", runtime: "bun" });

    expect(getDisabledReason(nestStack, "runtime", "bun")).toBeNull();
    expect(getDisabledReason(nestStack, "runtime", "node")).toBe("NestJS requires Bun runtime");
    expect(getDisabledReason(nestStack, "runtime", "workers")).toBe("NestJS requires Bun runtime");
    expect(getDisabledReason(nestStack, "backend", "nest")).toBeNull();
  });

  test("switches workers stacks to bun when NestJS is selected", () => {
    const result = analyzeStackCompatibility(
      createStack({
        backend: "nest",
        runtime: "workers",
        serverDeploy: "cloudflare",
      }),
    );

    expect(result.adjustedStack).toMatchObject({
      backend: "nest",
      runtime: "bun",
      serverDeploy: "none",
    });
  });

  test("emits --backend nest in the generated command", () => {
    const command = generateStackCommand(createStack({ backend: "nest", runtime: "bun" }));

    expect(command).toContain("--backend nest");
    expect(command).toContain("--runtime bun");
  });
});

describe("stack builder option parity", () => {
  test("exposes every CLI addon and deployment option", () => {
    expect(TECH_OPTIONS.addons.map((option) => option.id).sort()).toEqual(
      ADDONS_VALUES.filter((value) => value !== "none").sort(),
    );
    expect(TECH_OPTIONS.webDeploy.map((option) => option.id).sort()).toEqual(
      [...WEB_DEPLOY_VALUES].sort(),
    );
    expect(TECH_OPTIONS.serverDeploy.map((option) => option.id).sort()).toEqual(
      [...SERVER_DEPLOY_VALUES].sort(),
    );
  });

  test("marks only Vercel deployment as experimental", () => {
    for (const category of [TECH_OPTIONS.webDeploy, TECH_OPTIONS.serverDeploy]) {
      expect(category.find((option) => option.id === "vercel")).toMatchObject({
        experimental: true,
      });
      for (const option of category) {
        const isExperimental = "experimental" in option && option.experimental === true;
        expect(isExperimental).toBe(option.id === "vercel");
      }
    }
  });
});

describe("stack builder Prisma deployment compatibility", () => {
  test("allows Prisma web deployment only for supported SSR frontends", () => {
    for (const frontend of ["next", "react-router", "tanstack-start"]) {
      expect(
        getDisabledReason(createStack({ webFrontend: [frontend] }), "webDeploy", "prisma"),
      ).toBeNull();
    }

    for (const frontend of ["tanstack-router"]) {
      expect(
        getDisabledReason(createStack({ webFrontend: [frontend] }), "webDeploy", "prisma"),
      ).toBe("Prisma requires Next.js, React Router, or TanStack Start");
    }
  });

  test("blocks Prisma web deploy when desktop addons replace its server artifact", () => {
    const stack = createStack({
      webFrontend: ["react-router"],
      addons: ["tauri"],
      webDeploy: "none",
    });

    expect(getDisabledReason(stack, "webDeploy", "prisma")).toBe(
      "Prisma cannot deploy the static output required by tauri on react-router",
    );
    expect(resolveStackCompatibility({ ...stack, webDeploy: "prisma" }).stack.webDeploy).toBe(
      "none",
    );
  });

  test("generates Prisma web and server deployment flags", () => {
    const command = generateStackCommand(
      createStack({
        webFrontend: ["next"],
        backend: "hono",
        runtime: "bun",
        webDeploy: "prisma",
        serverDeploy: "prisma",
      }),
    );

    expect(command).toContain("--web-deploy prisma");
    expect(command).toContain("--server-deploy prisma");
  });

  test("requires Bun or Node for Prisma server deployment", () => {
    expect(
      getDisabledReason(createStack({ backend: "hono", runtime: "bun" }), "serverDeploy", "prisma"),
    ).toBeNull();
    expect(
      getDisabledReason(
        createStack({ backend: "hono", runtime: "workers" }),
        "serverDeploy",
        "prisma",
      ),
    ).toBe("Prisma server deployment requires the Bun or Node runtime");
  });

  test("repairs invalid Prisma deployment state", () => {
    expect(
      resolveStackCompatibility(
        createStack({ webFrontend: ["tanstack-router"], webDeploy: "prisma" }),
      ).stack.webDeploy,
    ).toBe("none");
    expect(
      resolveStackCompatibility(
        createStack({
          backend: "hono",
          runtime: "workers",
          serverDeploy: "prisma",
          database: "sqlite",
          orm: "drizzle",
          dbSetup: "d1",
        }),
      ).stack.serverDeploy,
    ).toBe("cloudflare");
  });

  test("blocks the known Next.js Cloudflare PostgreSQL conflict", () => {
    const postgresStack = createStack({
      webFrontend: ["next"],
      backend: "self-next",
      runtime: "none",
      database: "postgres",
      orm: "prisma",
      dbSetup: "none",
    });

    expect(getDisabledReason(postgresStack, "webDeploy", "cloudflare")).toBe(
      "This Prisma PostgreSQL setup with Next.js is temporarily unavailable on Cloudflare",
    );
  });
});
