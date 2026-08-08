import { DEFAULT_STACK, type StackState, TECH_OPTIONS } from "./constant";

const validWebFrontendIds = new Set(TECH_OPTIONS.webFrontend.map((option) => option.id));
const validNativeFrontendIds = new Set(TECH_OPTIONS.nativeFrontend.map((option) => option.id));
const validAddonIds = new Set(["none", ...TECH_OPTIONS.addons.map((option) => option.id)]);
const validExampleIds = new Set(["none", ...TECH_OPTIONS.examples.map((option) => option.id)]);

type SingleSelectCategory = Exclude<
  keyof typeof TECH_OPTIONS,
  "webFrontend" | "nativeFrontend" | "addons" | "examples"
>;

function validIdsFor(category: SingleSelectCategory): ReadonlySet<string> {
  return new Set(TECH_OPTIONS[category].map((option) => option.id));
}

function sanitizeSingleValue(
  value: string,
  category: SingleSelectCategory,
  fallback: string,
): string {
  const valid = validIdsFor(category);
  if (valid.has(value)) return value;
  if (value === "trpc" && valid.has("orpc")) return "orpc";
  return fallback;
}

export const TASK_RUNNER_ADDONS = ["nx", "turborepo", "vite-plus"] as const;

function sanitizeSingleSelection(
  values: readonly string[] | null | undefined,
  validIds: ReadonlySet<string>,
  defaultValue: readonly string[],
): string[] {
  if (values == null) {
    return [...defaultValue];
  }

  const selectedValue = values.filter((value) => validIds.has(value) && value !== "none").at(-1);
  return selectedValue ? [selectedValue] : ["none"];
}

function sanitizeMultiSelection(
  values: readonly string[] | null | undefined,
  validIds: ReadonlySet<string>,
  defaultValue: readonly string[],
): string[] {
  if (values == null) {
    return [...defaultValue];
  }

  const sanitized = values.filter((value) => validIds.has(value));
  const normalized =
    sanitized.length > 1 ? sanitized.filter((value) => value !== "none") : sanitized;
  const unique = [...new Set(normalized)];

  return unique.length > 0 ? unique : ["none"];
}

function resolveMonorepoAddonConflicts(addons: readonly string[]): string[] {
  const resolved: string[] = [];
  const taskRunners = new Set<string>(TASK_RUNNER_ADDONS);

  for (const addon of addons) {
    if (taskRunners.has(addon)) {
      const existingMonorepoIndex = resolved.findIndex((value) => taskRunners.has(value));

      if (existingMonorepoIndex !== -1) {
        resolved.splice(existingMonorepoIndex, 1);
      }
    }

    if (!resolved.includes(addon)) {
      resolved.push(addon);
    }
  }

  return resolved;
}

export function sanitizeAddons(addons: readonly string[] | null | undefined): string[] {
  const sanitized = sanitizeMultiSelection(addons, validAddonIds, DEFAULT_STACK.addons);
  return resolveMonorepoAddonConflicts(sanitized);
}

export function sanitizeExamples(examples: readonly string[] | null | undefined): string[] {
  return sanitizeMultiSelection(examples, validExampleIds, DEFAULT_STACK.examples);
}

export function sanitizeWebFrontends(webFrontend: readonly string[] | null | undefined): string[] {
  return sanitizeSingleSelection(webFrontend, validWebFrontendIds, DEFAULT_STACK.webFrontend);
}

export function sanitizeNativeFrontends(
  nativeFrontend: readonly string[] | null | undefined,
): string[] {
  return sanitizeSingleSelection(
    nativeFrontend,
    validNativeFrontendIds,
    DEFAULT_STACK.nativeFrontend,
  );
}

export function sanitizeStackState(stack: StackState): StackState {
  return {
    ...stack,
    webFrontend: sanitizeWebFrontends(stack.webFrontend),
    nativeFrontend: sanitizeNativeFrontends(stack.nativeFrontend),
    addons: sanitizeAddons(stack.addons),
    examples: sanitizeExamples(stack.examples),
    runtime: sanitizeSingleValue(stack.runtime, "runtime", DEFAULT_STACK.runtime),
    backend: sanitizeSingleValue(stack.backend, "backend", DEFAULT_STACK.backend),
    api: sanitizeSingleValue(stack.api, "api", DEFAULT_STACK.api),
    database: sanitizeSingleValue(stack.database, "database", DEFAULT_STACK.database),
    orm: sanitizeSingleValue(stack.orm, "orm", DEFAULT_STACK.orm),
    dbSetup: sanitizeSingleValue(stack.dbSetup, "dbSetup", DEFAULT_STACK.dbSetup),
    auth: sanitizeSingleValue(stack.auth, "auth", DEFAULT_STACK.auth),
    packageManager: sanitizeSingleValue(
      stack.packageManager,
      "packageManager",
      DEFAULT_STACK.packageManager,
    ),
    webDeploy: sanitizeSingleValue(stack.webDeploy, "webDeploy", DEFAULT_STACK.webDeploy),
    serverDeploy: sanitizeSingleValue(
      stack.serverDeploy,
      "serverDeploy",
      DEFAULT_STACK.serverDeploy,
    ),
    git: stack.git === "true" || stack.git === "false" ? stack.git : DEFAULT_STACK.git,
    install:
      stack.install === "true" || stack.install === "false" ? stack.install : DEFAULT_STACK.install,
    payments: "none",
  };
}

export function sanitizeStackAddons(stack: StackState): StackState {
  return sanitizeStackState(stack);
}
