import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

export interface EnvVariable {
  key: string;
  value: string | null | undefined;
  condition: boolean;
  comment?: string;
}

type AddEnvVariablesOptions = {
  commentOutEmptyValues?: boolean;
};

function generateRandomString(length: number, charset: string) {
  let result = "";
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues === "function"
  ) {
    const values = new Uint8Array(length);
    globalThis.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      const value = values[i];
      if (value !== undefined) {
        result += charset[value % charset.length];
      }
    }
    return result;
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
  }
}

function generateAuthSecret() {
  return generateRandomString(32, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
}

function getClientServerVar(frontend: string[], backend: ProjectConfig["backend"]) {
  const hasNextJs = frontend.includes("next");

  if (backend === "self") {
    return { key: "", value: "", write: false } as const;
  }

  const key = hasNextJs ? "NEXT_PUBLIC_SERVER_URL" : "VITE_SERVER_URL";
  return { key, value: "http://localhost:3000", write: true } as const;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addEnvVariablesToContent(
  currentContent: string,
  variables: EnvVariable[],
  options: AddEnvVariablesOptions = {},
): string {
  let envContent = currentContent || "";
  let contentToAdd = "";

  for (const { key, value, condition, comment } of variables) {
    if (condition) {
      const valueToWrite = value ?? "";
      const shouldComment = options.commentOutEmptyValues === true && valueToWrite.trim() === "";
      const lineToWrite = shouldComment ? `# ${key}=${valueToWrite}` : `${key}=${valueToWrite}`;
      const lineRegex = new RegExp(`^\\s*#?\\s*${escapeRegExp(key)}=.*$`, "m");

      if (lineRegex.test(envContent)) {
        const existingMatch = envContent.match(lineRegex);
        if (existingMatch && existingMatch[0] !== lineToWrite) {
          envContent = envContent.replace(lineRegex, lineToWrite);
        }
      } else {
        if (comment) {
          contentToAdd += `# ${comment}\n`;
        }
        contentToAdd += `${lineToWrite}\n`;
      }
    }
  }

  if (contentToAdd) {
    if (envContent.length > 0 && !envContent.endsWith("\n")) {
      envContent += "\n";
    }
    envContent += contentToAdd;
  }

  return `${envContent.trimEnd()}\n`;
}

function writeEnvFile(
  vfs: VirtualFileSystem,
  envPath: string,
  variables: EnvVariable[],
  options: AddEnvVariablesOptions = {},
): void {
  let currentContent = "";
  if (vfs.exists(envPath)) {
    currentContent = vfs.readFile(envPath) || "";
  }
  const newContent = addEnvVariablesToContent(currentContent, variables, options);
  vfs.writeFile(envPath, newContent);
}

function buildClientVars(
  frontend: string[],
  backend: ProjectConfig["backend"],
  _auth: ProjectConfig["auth"],
): EnvVariable[] {
  const baseVar = getClientServerVar(frontend, backend);

  return [
    {
      key: baseVar.key,
      value: baseVar.value,
      condition: baseVar.write,
    },
  ];
}

function buildNativeVars(
  _frontend: string[],
  backend: ProjectConfig["backend"],
  _auth: ProjectConfig["auth"],
): EnvVariable[] {
  const envVarName = "EXPO_PUBLIC_SERVER_URL";
  const serverUrl = backend === "self" ? "http://localhost:3001" : "http://localhost:3000";

  return [
    {
      key: envVarName,
      value: serverUrl,
      condition: true,
    },
  ];
}

function buildServerVars(
  backend: ProjectConfig["backend"],
  frontend: string[],
  _projectName: string,
  auth: ProjectConfig["auth"],
  _api: ProjectConfig["api"],
  database: ProjectConfig["database"],
  dbSetup: ProjectConfig["dbSetup"],
  runtime: ProjectConfig["runtime"],
  webDeploy: ProjectConfig["webDeploy"],
  serverDeploy: ProjectConfig["serverDeploy"],
  _payments: ProjectConfig["payments"],
  examples: ProjectConfig["examples"],
): EnvVariable[] {
  const hasReactRouter = frontend.includes("react-router");
  const hasNative =
    frontend.includes("native-bare") ||
    frontend.includes("native-uniwind") ||
    frontend.includes("native-unistyles");

  let corsOrigin = "http://localhost:3001";
  if (hasReactRouter) {
    corsOrigin = "http://localhost:5173";
  }
  const betterAuthUrl = backend === "self" ? "http://localhost:3001" : "http://localhost:3000";

  let databaseUrl: string | null = null;
  if (database !== "none" && dbSetup === "none") {
    switch (database) {
      case "postgres":
        databaseUrl = "postgresql://postgres:password@localhost:5432/postgres";
        break;
      case "mysql":
        databaseUrl = "mysql://root:password@localhost:3306/mydb";
        break;
      case "mongodb":
        databaseUrl = "mongodb://localhost:27017/mydatabase";
        break;
      case "sqlite":
        if (runtime === "workers" || webDeploy === "cloudflare" || serverDeploy === "cloudflare") {
          databaseUrl = "http://127.0.0.1:8080";
        } else {
          databaseUrl = "file:../../local.db";
        }
        break;
    }
  }

  const hasBetterAuth = auth === "better-auth";

  return [
    {
      key: "BETTER_AUTH_SECRET",
      value: generateAuthSecret(),
      condition: hasBetterAuth,
    },
    {
      key: "BETTER_AUTH_URL",
      value: betterAuthUrl,
      condition: hasBetterAuth,
    },
    {
      key: "CORS_ORIGIN",
      value: corsOrigin,
      condition: true,
    },
    {
      key: "GOOGLE_GENERATIVE_AI_API_KEY",
      value: "",
      condition: examples?.includes("ai") || false,
    },
    {
      key: "DATABASE_URL",
      value: databaseUrl,
      condition: database !== "none" && dbSetup === "none",
    },
  ];
}

export function processEnvVariables(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const {
    backend,
    frontend,
    projectName,
    database,
    auth,
    api,
    examples,
    dbSetup,
    webDeploy,
    serverDeploy,
    runtime,
    payments,
  } = config;

  const hasReactRouter = frontend.includes("react-router");
  const hasTanStackRouter = frontend.includes("tanstack-router");
  const hasTanStackStart = frontend.includes("tanstack-start");
  const hasNextJs = frontend.includes("next");
  const hasWebFrontend = hasReactRouter || hasTanStackRouter || hasTanStackStart || hasNextJs;

  // --- Client App .env ---
  if (hasWebFrontend) {
    const clientDir = "apps/web";
    if (vfs.directoryExists(clientDir)) {
      const envPath = `${clientDir}/.env`;
      const clientVars = buildClientVars(frontend, backend, auth);
      writeEnvFile(vfs, envPath, clientVars);
    }
  }

  // --- Native App .env ---
  if (
    frontend.includes("native-bare") ||
    frontend.includes("native-uniwind") ||
    frontend.includes("native-unistyles")
  ) {
    const nativeDir = "apps/native";
    if (vfs.directoryExists(nativeDir)) {
      const envPath = `${nativeDir}/.env`;
      const nativeVars = buildNativeVars(frontend, backend, auth);
      writeEnvFile(vfs, envPath, nativeVars);
    }
  }

  // --- Server App .env ---
  const serverVars = buildServerVars(
    backend,
    frontend,
    projectName,
    auth,
    api,
    database,
    dbSetup,
    runtime,
    webDeploy,
    serverDeploy,
    payments,
    examples,
  );

  if (backend === "self") {
    const webDir = "apps/web";
    if (vfs.directoryExists(webDir)) {
      const envPath = `${webDir}/.env`;
      writeEnvFile(vfs, envPath, serverVars);
    }
  } else if (vfs.directoryExists("apps/server")) {
    const envPath = "apps/server/.env";
    writeEnvFile(vfs, envPath, serverVars);
  }

  // --- Alchemy Infra .env ---
  const isUnifiedAlchemy = webDeploy === "cloudflare" && serverDeploy === "cloudflare";
  const isIndividualAlchemy = webDeploy === "cloudflare" || serverDeploy === "cloudflare";

  if (isUnifiedAlchemy || isIndividualAlchemy) {
    const infraDir = "packages/infra";
    if (vfs.directoryExists(infraDir)) {
      const envPath = `${infraDir}/.env`;
      const infraAlchemyVars: EnvVariable[] = [
        {
          key: "ALCHEMY_PASSWORD",
          value: "please-change-this",
          condition: true,
        },
      ];
      writeEnvFile(vfs, envPath, infraAlchemyVars);
    }
  }
}
