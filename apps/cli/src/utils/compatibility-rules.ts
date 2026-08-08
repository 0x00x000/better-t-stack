import { Result } from "better-result";

import { ADDON_COMPATIBILITY } from "../constants";
import type {
  Addons,
  API,
  Auth,
  Backend,
  CLIInput,
  Frontend,
  Payments,
  ProjectConfig,
  Runtime,
  ServerDeploy,
  WebDeploy,
} from "../types";
import { WEB_FRAMEWORKS } from "./compatibility";
import { ValidationError } from "./errors";

type ValidationResult = Result<void, ValidationError>;
type AddonCompatibilityConfig = Pick<ProjectConfig, "frontend" | "auth" | "backend" | "runtime">;
const TASK_RUNNER_ADDONS = ["turborepo", "nx", "vite-plus"] as const satisfies readonly Addons[];
const STATIC_DESKTOP_ADDONS: readonly Addons[] = ["tauri", "electrobun"];

function validationErr(message: string): ValidationResult {
  return Result.err(new ValidationError({ message }));
}

export function isWebFrontend(value: Frontend) {
  return WEB_FRAMEWORKS.includes(value);
}

export function splitFrontends(values: Frontend[] = []): {
  web: Frontend[];
  native: Frontend[];
} {
  const web = values.filter((f) => isWebFrontend(f));
  const native = values.filter(
    (f) => f === "native-bare" || f === "native-uniwind" || f === "native-unistyles",
  );
  return { web, native };
}

export function ensureSingleWebAndNative(frontends: Frontend[]): ValidationResult {
  const { web, native } = splitFrontends(frontends);
  if (web.length > 1) {
    return validationErr(
      "Cannot select multiple web frameworks. Choose only one of: tanstack-router, tanstack-start, react-router, next",
    );
  }
  if (native.length > 1) {
    return validationErr(
      "Cannot select multiple native frameworks. Choose only one of: native-bare, native-uniwind, native-unistyles",
    );
  }
  return Result.ok(undefined);
}

const FULLSTACK_FRONTENDS: readonly Frontend[] = ["next", "tanstack-start"] as const;

const evlogCompatibilityMessage =
  "evlog addon supports Hono or backend self with Next.js or TanStack Start. Backend none is not supported yet.";

export function supportsEvlogAddon(
  frontend: Frontend[] = [],
  backend?: Backend,
  _runtime?: Runtime,
) {
  if (!backend) return true;

  if (backend === "hono") {
    return true;
  }

  if (backend === "self") {
    if (frontend.length === 0) return true;
    return frontend.some((f) => FULLSTACK_FRONTENDS.includes(f));
  }

  return false;
}

export function validateSelfBackendCompatibility(
  providedFlags: Set<string>,
  options: CLIInput,
  config: Partial<ProjectConfig>,
): ValidationResult {
  const backend = config.backend || options.backend;
  const frontends = config.frontend || options.frontend || [];

  if (backend === "self") {
    const { web, native } = splitFrontends(frontends);
    const hasSupportedWeb = web.length === 1 && FULLSTACK_FRONTENDS.includes(web[0]);

    if (!hasSupportedWeb) {
      return validationErr(
        "Backend 'self' (fullstack) currently only supports Next.js and TanStack Start. Please use --frontend next or --frontend tanstack-start.",
      );
    }

    if (native.length > 1) {
      return validationErr(
        "Cannot select multiple native frameworks. Choose only one of: native-bare, native-uniwind, native-unistyles",
      );
    }
  }

  const hasFullstackFrontend = frontends.some((f) => FULLSTACK_FRONTENDS.includes(f));
  if (providedFlags.has("backend") && !hasFullstackFrontend && backend === "self") {
    return validationErr(
      "Backend 'self' (fullstack) currently only supports Next.js and TanStack Start. Please use --frontend next or --frontend tanstack-start, or choose a different backend.",
    );
  }

  return Result.ok(undefined);
}

export function validateWorkersCompatibility(
  providedFlags: Set<string>,
  options: CLIInput,
  config: Partial<ProjectConfig>,
): ValidationResult {
  if (
    providedFlags.has("runtime") &&
    options.runtime === "workers" &&
    config.backend &&
    config.backend !== "hono"
  ) {
    return validationErr(
      `Cloudflare Workers runtime (--runtime workers) is only supported with Hono backend (--backend hono). Current backend: ${config.backend}. Please use '--backend hono' or choose a different runtime.`,
    );
  }

  if (
    providedFlags.has("backend") &&
    config.backend &&
    config.backend !== "hono" &&
    config.runtime === "workers"
  ) {
    return validationErr(
      `Backend '${config.backend}' is not compatible with Cloudflare Workers runtime. Cloudflare Workers runtime is only supported with Hono backend. Please use '--backend hono' or choose a different runtime.`,
    );
  }

  if (
    providedFlags.has("runtime") &&
    options.runtime === "workers" &&
    config.database === "mongodb"
  ) {
    return validationErr(
      "Cloudflare Workers runtime (--runtime workers) is not compatible with MongoDB database. MongoDB requires Prisma or Mongoose ORM, but Workers runtime only supports Drizzle or Prisma ORM. Please use a different database or runtime.",
    );
  }

  if (
    providedFlags.has("database") &&
    config.database === "mongodb" &&
    config.runtime === "workers"
  ) {
    return validationErr(
      "MongoDB database is not compatible with Cloudflare Workers runtime. MongoDB requires Prisma or Mongoose ORM, but Workers runtime only supports Drizzle or Prisma ORM. Please use a different database or runtime.",
    );
  }

  return Result.ok(undefined);
}

export function validateApiFrontendCompatibility(
  _api: API | undefined,
  _frontends: Frontend[] = [],
): ValidationResult {
  return Result.ok(undefined);
}

export function isFrontendAllowedWithBackend(
  _frontend: Frontend,
  _backend?: ProjectConfig["backend"],
  _auth?: string,
) {
  return true;
}

export function allowedApisForFrontends(_frontends: Frontend[] = []) {
  return ["orpc", "none"] as const satisfies readonly API[];
}

export function isExampleTodoAllowed(
  _backend?: ProjectConfig["backend"],
  database?: ProjectConfig["database"],
  api?: API,
) {
  if (database === "none" || api === "none") return false;
  return true;
}

export function isExampleAIAllowed(
  backend?: ProjectConfig["backend"],
  _frontends: Frontend[] = [],
) {
  if (backend === "none") return false;
  return true;
}

export function validateWebDeployRequiresWebFrontend(
  webDeploy: WebDeploy | undefined,
  hasWebFrontendFlag: boolean,
): ValidationResult {
  if (webDeploy && webDeploy !== "none" && !hasWebFrontendFlag) {
    return validationErr(
      "'--web-deploy' requires a web frontend. Please select a web frontend or set '--web-deploy none'.",
    );
  }
  return Result.ok(undefined);
}

export function validateServerDeployRequiresBackend(
  serverDeploy: ServerDeploy | undefined,
  backend: Backend | undefined,
): ValidationResult {
  if (serverDeploy && serverDeploy !== "none" && (!backend || backend === "none")) {
    return validationErr(
      "'--server-deploy' requires a backend. Please select a backend or set '--server-deploy none'.",
    );
  }
  return Result.ok(undefined);
}

export function validateDockerServerDeploy(
  serverDeploy: ServerDeploy | undefined,
  backend: Backend | undefined,
  runtime: Runtime | undefined,
): ValidationResult {
  if (serverDeploy !== "docker") return Result.ok(undefined);

  if (backend === "self") {
    return validationErr(
      "'--server-deploy docker' requires a separate server backend (hono). For a fullstack 'self' backend, use '--web-deploy docker' instead.",
    );
  }

  if (runtime === "workers") {
    return validationErr(
      "'--server-deploy docker' is not compatible with '--runtime workers'. Use '--runtime bun' or '--runtime node', or choose '--server-deploy cloudflare'.",
    );
  }

  return Result.ok(undefined);
}

export function validateVercelServerDeploy(
  serverDeploy: ServerDeploy | undefined,
  backend: Backend | undefined,
  runtime: Runtime | undefined,
): ValidationResult {
  if (serverDeploy !== "vercel") return Result.ok(undefined);

  if (backend === "self") {
    return validationErr(
      "'--server-deploy vercel' requires a separate server backend (hono). For a fullstack 'self' backend, use '--web-deploy vercel' instead.",
    );
  }

  if (runtime === "workers") {
    return validationErr(
      "'--server-deploy vercel' is not compatible with '--runtime workers'. Use '--runtime bun' or '--runtime node', or choose '--server-deploy cloudflare'.",
    );
  }

  return Result.ok(undefined);
}

const DOCKER_SERVER_OUTPUT_FRONTENDS: readonly Frontend[] = ["next", "react-router"];

export function validateDockerWebDeployDesktopAddons(
  webDeploy: WebDeploy | undefined,
  addons: Addons[] | undefined,
  frontend: Frontend[] | undefined,
  _backend: Backend | undefined,
  _auth: Auth | undefined,
): ValidationResult {
  if (webDeploy !== "docker" || !addons || !frontend) return Result.ok(undefined);

  const desktopAddons = addons.filter((addon) => STATIC_DESKTOP_ADDONS.includes(addon));
  if (desktopAddons.length === 0) return Result.ok(undefined);

  const affected = frontend.find((f) => DOCKER_SERVER_OUTPUT_FRONTENDS.includes(f));
  if (!affected) return Result.ok(undefined);

  return validationErr(
    `'--web-deploy docker' is not compatible with the ${desktopAddons.join(", ")} addon on '${affected}' because desktop addons switch the web build to a static export, which the docker image cannot serve. Remove the addon or use a static-serving frontend (tanstack-router).`,
  );
}

export function validateAddonCompatibility(
  addon: Addons,
  frontend: Frontend[],
  auth?: Auth,
  backend?: Backend,
  runtime?: Runtime,
): { isCompatible: boolean; reason?: string } {
  if (addon === "evlog" && !supportsEvlogAddon(frontend, backend, runtime)) {
    return {
      isCompatible: false,
      reason: evlogCompatibilityMessage,
    };
  }

  if (backend === "self" && STATIC_DESKTOP_ADDONS.includes(addon)) {
    return {
      isCompatible: false,
      reason: `${addon} addon requires a separate backend or no backend because backend 'self' emits server routes that cannot be bundled as static desktop assets.`,
    };
  }

  const compatibleFrontends = ADDON_COMPATIBILITY[addon];

  if (compatibleFrontends.length > 0) {
    const hasCompatibleFrontend = frontend.some((f) =>
      (compatibleFrontends as readonly string[]).includes(f),
    );

    if (!hasCompatibleFrontend) {
      const frontendList = compatibleFrontends.join(", ");
      return {
        isCompatible: false,
        reason: `${addon} addon requires one of these frontends: ${frontendList}`,
      };
    }
  }

  return { isCompatible: true };
}

export function getCompatibleAddons(
  allAddons: Addons[],
  frontend: Frontend[],
  existingAddons: Addons[] = [],
  auth?: Auth,
  backend?: Backend,
  runtime?: Runtime,
) {
  return allAddons.filter((addon) => {
    if (existingAddons.includes(addon)) return false;

    if (addon === "none") return false;

    if (
      (TASK_RUNNER_ADDONS as readonly Addons[]).includes(addon) &&
      existingAddons.some((existingAddon) =>
        (TASK_RUNNER_ADDONS as readonly Addons[]).includes(existingAddon),
      )
    ) {
      return false;
    }

    const { isCompatible } = validateAddonCompatibility(addon, frontend, auth, backend, runtime);
    return isCompatible;
  });
}

export function validateAddonsAgainstFrontends(
  addons: Addons[] = [],
  frontends: Frontend[] = [],
  auth?: Auth,
  backend?: Backend,
  runtime?: Runtime,
): ValidationResult {
  const selectedTaskRunners = addons.filter((addon) =>
    (TASK_RUNNER_ADDONS as readonly Addons[]).includes(addon),
  );
  if (selectedTaskRunners.length > 1) {
    return validationErr(
      "Cannot combine 'turborepo', 'nx', and 'vite-plus' addons. Choose one task runner.",
    );
  }

  for (const addon of addons) {
    if (addon === "none") continue;
    const { isCompatible, reason } = validateAddonCompatibility(
      addon,
      frontends,
      auth,
      backend,
      runtime,
    );
    if (!isCompatible) {
      return validationErr(`Incompatible addon/frontend combination: ${reason}`);
    }
  }
  return Result.ok(undefined);
}

export function validateAddonsAgainstConfig(
  addons: Addons[] = [],
  config: Partial<AddonCompatibilityConfig>,
): ValidationResult {
  return validateAddonsAgainstFrontends(
    addons,
    config.frontend ?? [],
    config.auth,
    config.backend,
    config.runtime,
  );
}

export function validatePaymentsCompatibility(
  payments: Payments | undefined,
  _auth: Auth | undefined,
  _backend: Backend | undefined,
  _frontends: Frontend[] = [],
): ValidationResult {
  if (!payments || payments === "none") return Result.ok(undefined);
  return Result.ok(undefined);
}

export function validateExamplesCompatibility(
  examples: string[] | undefined,
  backend: ProjectConfig["backend"] | undefined,
  database: ProjectConfig["database"] | undefined,
  _frontend?: Frontend[],
  api?: API,
): ValidationResult {
  const examplesArr = examples ?? [];
  if (examplesArr.length === 0 || examplesArr.includes("none")) return Result.ok(undefined);

  if (examplesArr.includes("todo")) {
    if (database === "none") {
      return validationErr(
        "The 'todo' example requires a database. Cannot use --examples todo when database is 'none'.",
      );
    }
    if (api === "none") {
      return validationErr(
        "The 'todo' example requires an API layer (oRPC). Cannot use --examples todo when api is 'none'.",
      );
    }
  }

  if (examplesArr.includes("ai") && backend === "none") {
    return validationErr("The 'ai' example requires a backend.");
  }

  return Result.ok(undefined);
}
