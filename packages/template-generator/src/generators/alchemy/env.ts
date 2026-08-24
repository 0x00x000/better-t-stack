import type { ProjectConfig } from "@better-t-stack/types";

import type { AlchemyDeploymentPlan, DeployedWebFramework } from "./plan";

function hasExample(
  plan: AlchemyDeploymentPlan,
  example: ProjectConfig["examples"][number],
): boolean {
  return plan.config.examples.includes(example);
}

export function databaseBindingEntries(plan: AlchemyDeploymentPlan): string[] {
  const { config } = plan;

  if (config.dbSetup === "d1") return ["DB: db,"];
  if (plan.hasAlchemyManagedDatabase) return ["...databaseBindings,"];
  if (config.database !== "none") return ['DATABASE_URL: Config.redacted("DATABASE_URL"),'];
  return [];
}

function commonRuntimeEntries(plan: AlchemyDeploymentPlan, includeCorsOrigin = true): string[] {
  const { auth } = plan.config;
  const entries = [...databaseBindingEntries(plan)];

  if (includeCorsOrigin) {
    entries.push('CORS_ORIGIN: Config.string("CORS_ORIGIN"),');
  }

  if (auth === "better-auth") {
    entries.push(
      'BETTER_AUTH_SECRET: Config.redacted("BETTER_AUTH_SECRET"),',
      "BETTER_AUTH_URL: Cloudflare.Worker.URL,",
    );
  }
  if (hasExample(plan, "ai")) {
    entries.push('GOOGLE_GENERATIVE_AI_API_KEY: Config.redacted("GOOGLE_GENERATIVE_AI_API_KEY"),');
  }

  return entries;
}

export function cloudflareServerEnvEntries(plan: AlchemyDeploymentPlan): string[] {
  return commonRuntimeEntries(plan);
}

export function prismaServerEnvEntries(plan: AlchemyDeploymentPlan): string[] {
  const { auth } = plan.config;
  const entries = ["...resolvedDatabaseEnv,", 'CORS_ORIGIN: Config.string("CORS_ORIGIN"),'];

  if (auth === "better-auth") {
    entries.push(
      'BETTER_AUTH_SECRET: Config.redacted("BETTER_AUTH_SECRET"),',
      'BETTER_AUTH_URL: Config.string("BETTER_AUTH_URL"),',
    );
  }
  if (hasExample(plan, "ai")) {
    entries.push('GOOGLE_GENERATIVE_AI_API_KEY: Config.redacted("GOOGLE_GENERATIVE_AI_API_KEY"),');
  }

  return entries;
}

export function selfCloudflareWebEnvEntries(
  plan: AlchemyDeploymentPlan,
  framework: DeployedWebFramework,
): string[] {
  const entries: string[] = [];

  if (framework === "next") entries.push("IMAGES: Cloudflare.Images.Images(),");

  entries.push(...commonRuntimeEntries(plan, false));

  return entries;
}

function prismaPublicEnvEntries(
  plan: AlchemyDeploymentPlan,
  framework: DeployedWebFramework,
): string[] {
  const { backend } = plan.config;
  const deployedUrl = plan.server.target === "none" ? undefined : "deployedServer.url";
  const entries: string[] = [];

  if (framework === "next") {
    if (backend !== "self") {
      entries.push(
        `NEXT_PUBLIC_SERVER_URL: ${deployedUrl ?? 'Config.string("NEXT_PUBLIC_SERVER_URL")'},`,
      );
    }
    return entries;
  }

  if (backend !== "self") {
    entries.push(`VITE_SERVER_URL: ${deployedUrl ?? 'Config.string("VITE_SERVER_URL")'},`);
  }
  return entries;
}

export function prismaWebEnvEntries(
  plan: AlchemyDeploymentPlan,
  framework: DeployedWebFramework,
): string[] {
  const { auth } = plan.config;
  const entries: string[] = [];

  if (plan.web.target !== "none" && plan.web.topology === "self") {
    entries.push("...resolvedDatabaseEnv,");
    if (auth === "better-auth") {
      entries.push(
        'BETTER_AUTH_SECRET: Config.redacted("BETTER_AUTH_SECRET"),',
        'BETTER_AUTH_URL: Config.string("BETTER_AUTH_URL"),',
      );
    }
    if (hasExample(plan, "ai")) {
      entries.push(
        'GOOGLE_GENERATIVE_AI_API_KEY: Config.redacted("GOOGLE_GENERATIVE_AI_API_KEY"),',
      );
    }
  }

  entries.push(...prismaPublicEnvEntries(plan, framework));
  return entries;
}

export function splitCloudflareWebEnvEntries(
  plan: AlchemyDeploymentPlan,
  framework: DeployedWebFramework,
): string[] {
  const { backend } = plan.config;
  const serverValue = plan.server.target === "none" ? undefined : "serverWorker.url.as<string>()";
  const entries: string[] = [];

  if (framework === "next") entries.push("IMAGES: Cloudflare.Images.Images(),");

  const prefix = framework === "next" ? "NEXT_PUBLIC" : "VITE";
  entries.push(`${prefix}_SERVER_URL: ${serverValue ?? `Config.string("${prefix}_SERVER_URL")`},`);

  return entries;
}
