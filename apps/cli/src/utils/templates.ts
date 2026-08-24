import type { CreateInput, Template } from "../types";

export const TEMPLATE_PRESETS = {
  mern: {
    database: "mongodb",
    orm: "mongoose",
    backend: "hono",
    runtime: "node",
    frontend: ["react-router"],
    api: "orpc",
    auth: "better-auth",
    payments: "none",
    addons: ["turborepo"],
    examples: ["todo"],
    dbSetup: "mongodb-atlas",
    webDeploy: "none",
    serverDeploy: "none",
  },
  pern: {
    database: "postgres",
    orm: "drizzle",
    backend: "hono",
    runtime: "node",
    frontend: ["tanstack-router"],
    api: "orpc",
    auth: "better-auth",
    payments: "none",
    addons: ["turborepo"],
    examples: ["todo"],
    dbSetup: "none",
    webDeploy: "none",
    serverDeploy: "none",
  },
  t3: {
    database: "postgres",
    orm: "prisma",
    backend: "self",
    runtime: "none",
    frontend: ["next"],
    api: "orpc",
    auth: "better-auth",
    payments: "none",
    addons: ["biome", "turborepo"],
    examples: ["none"],
    dbSetup: "none",
    webDeploy: "none",
    serverDeploy: "none",
  },
  uniwind: {
    database: "none",
    orm: "none",
    backend: "none",
    runtime: "none",
    frontend: ["native-uniwind"],
    api: "none",
    auth: "none",
    payments: "none",
    addons: ["none"],
    examples: ["none"],
    dbSetup: "none",
    webDeploy: "none",
    serverDeploy: "none",
  },
  none: null,
} satisfies Record<Template, CreateInput | null>;

export function getTemplateConfig(template: Template) {
  if (template === "none" || !template) {
    return null;
  }

  const config = TEMPLATE_PRESETS[template];
  if (!config) {
    throw new Error(`Unknown template: ${template}`);
  }

  return config;
}

export function getTemplateDescription(template: Template) {
  const descriptions = {
    mern: "MongoDB + Hono + React + Node.js - MERN-style stack",
    pern: "PostgreSQL + Hono + React + Node.js - PERN-style stack",
    t3: "T3 Stack - Next.js + oRPC + Prisma + PostgreSQL + Better Auth",
    uniwind: "Expo + Uniwind native app with no backend services",
    none: "No template - Full customization",
  } satisfies Record<Template, string>;

  return descriptions[template] || "";
}

export function listAvailableTemplates() {
  return Object.keys(TEMPLATE_PRESETS).filter((t) => t !== "none") as Template[];
}
