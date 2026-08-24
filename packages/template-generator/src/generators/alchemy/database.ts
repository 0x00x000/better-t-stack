import { assertNever, type AlchemyDeploymentPlan, type ManagedDatabasePlan } from "./plan";
import { writeObject, type AlchemyWriter } from "./writer";

function writesDatabaseMigrations(database: ManagedDatabasePlan): boolean {
  return (
    database.kind === "prisma-postgres" || (database.kind !== "none" && database.orm === "prisma")
  );
}

function writeNeon(
  writer: AlchemyWriter,
  database: Extract<ManagedDatabasePlan, { kind: "neon" }>,
) {
  writeObject(
    writer,
    'const database = yield* Neon.Project("database", {',
    () => {
      if (database.orm === "drizzle") {
        writer.writeLine('migrationsDir: "../../packages/db/src/migrations",');
      }
    },
    "});",
  );
  writer.writeLine(
    "const runtimeUrl = database.pooledConnectionUri.pipe(Output.map(Redacted.make));",
  );
  if (database.orm === "prisma") {
    writer.writeLine(
      "const migrationUrl = database.connectionUri.pipe(Output.map(Redacted.make));",
    );
  }
}

function writePrismaPostgres(writer: AlchemyWriter): void {
  writer.writeLine("const project = yield* prismaProject;");
  writer.writeLine('const database = yield* Prisma.Postgres("database", { project });');
  writer.writeLine(
    'const connection = yield* Prisma.Connection("database-connection", { database });',
  );
  writer.writeLine(
    "const runtimeUrl = Output.all(connection.directConnectionString, connection.databaseUrl).pipe(",
  );
  writer.indent(() => {
    writer.writeLine("Output.map(([directUrl, fallbackUrl]) => {");
    writer.indent(() => {
      writer.writeLine("const url = directUrl ?? fallbackUrl;");
      writer.writeLine("if (!url) {");
      writer.indent(() => {
        writer.writeLine('throw new Error("Prisma did not return a database connection URL");');
      });
      writer.writeLine("}");
      writer.writeLine("return url;");
    });
    writer.writeLine("}),");
  });
  writer.writeLine(");");
  writer.writeLine("const migrationUrl = runtimeUrl;");
}

function writeMigrationCommand(
  writer: AlchemyWriter,
  plan: AlchemyDeploymentPlan,
  database: Exclude<ManagedDatabasePlan, { kind: "none" }>,
): void {
  if (!writesDatabaseMigrations(database)) return;

  writer.blankLine();
  writeObject(
    writer,
    'yield* Command.Exec("database-migrations", {',
    () => {
      writer.writeLine(`command: "${plan.config.packageManager} run db:migrate:deploy",`);
      writer.writeLine('cwd: "../../packages/db",');
      writer.writeLine("env: { DATABASE_URL: migrationUrl },");
      writeObject(
        writer,
        "memo: {",
        () => {
          writer.writeLine("include: [");
          writer.indent(() => {
            if (database.orm === "prisma") {
              writer.writeLine('"prisma/migrations/**",');
              writer.writeLine('"prisma/schema/**",');
            } else {
              writer.writeLine('"src/migrations/**",');
              writer.writeLine('"src/schema/**",');
            }
          });
          writer.writeLine("],");
        },
        "},",
      );
    },
    "});",
  );
}

function writeManagedDatabase(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  const database = plan.managedDatabase;
  if (database.kind === "none") return;

  writer.writeLine("const managedDatabase = Effect.gen(function* () {");
  writer.indent(() => {
    switch (database.kind) {
      case "neon":
        writeNeon(writer, database);
        break;
      case "prisma-postgres":
        writePrismaPostgres(writer);
        break;
      default:
        assertNever(database);
    }

    writeMigrationCommand(writer, plan, database);
    writer.blankLine();
    writer.writeLine("return {");
    writer.indent(() => {
      writer.writeLine("runtimeEnv: { DATABASE_URL: runtimeUrl },");
    });
    writer.writeLine("};");
  });
  writer.writeLine("});");
  writer.blankLine();
  writer.writeLine(
    "export const databaseEnv = managedDatabase.pipe(Effect.map(({ runtimeEnv }) => runtimeEnv));",
  );
  writer.blankLine();
  writeObject(
    writer,
    "export const databaseBindings = {",
    () => {
      writer.writeLine(
        "DATABASE_URL: databaseEnv.pipe(Effect.map(({ DATABASE_URL }) => DATABASE_URL)),",
      );
    },
    "};",
  );
  writer.blankLine();
  writer.writeLine("export const databaseProviders = Layer.mergeAll(");
  writer.indent(() => {
    if (writesDatabaseMigrations(database)) writer.writeLine("Command.providers(),");
    if (database.kind === "neon") writer.writeLine("Neon.providers(),");
    else writer.writeLine("Prisma.providers(),");

    if (plan.hasPrismaDeploy && database.kind !== "prisma-postgres") {
      writer.writeLine("Prisma.providers(),");
    }
  });
  writer.writeLine(");");
}

function writeExternalDatabaseEnv(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  if (!plan.hasPrismaDeploy || plan.hasAlchemyManagedDatabase) return;
  const { config } = plan;

  writeObject(
    writer,
    "export const databaseEnv = Effect.succeed({",
    () => {
      if (config.dbSetup === "d1") return;

      if (config.database !== "none") {
        writer.writeLine('DATABASE_URL: Config.redacted("DATABASE_URL"),');
      }
    },
    "});",
  );
  writer.blankLine();
  writer.writeLine("export const databaseProviders = Prisma.providers();");
}

function writeD1(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  if (!plan.hasD1Resource) return;

  writeObject(
    writer,
    'export const db = Cloudflare.D1.Database("database", {',
    () => {
      if (plan.config.orm === "prisma") {
        writer.writeLine('migrationsDir: "../../packages/db/prisma/migrations",');
      } else if (plan.config.orm === "drizzle") {
        writer.writeLine('migrationsDir: "../../packages/db/src/migrations",');
      }
    },
    "});",
  );
}

export function writeDatabaseResources(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  if (plan.hasPrismaDeploy || plan.managedDatabase.kind === "prisma-postgres") {
    writeObject(
      writer,
      'export const prismaProject = Prisma.Project("project", {',
      () => {
        writer.writeLine("createDatabase: false,");
        writer.writeLine('region: "us-east-1",');
      },
      "});",
    );
    writer.blankLine();
  }

  writeManagedDatabase(writer, plan);
  writeExternalDatabaseEnv(writer, plan);
  if (plan.hasAlchemyManagedDatabase || plan.hasPrismaDeploy) writer.blankLine();
  writeD1(writer, plan);
}
