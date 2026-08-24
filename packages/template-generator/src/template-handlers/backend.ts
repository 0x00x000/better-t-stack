import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processBackendTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (config.backend === "none" || config.backend === "self") return;

  processTemplatesFromPrefix(vfs, templates, "backend/server/base", "apps/server", config);

  // Nest uses Bun.build, not tsdown — DI tokens break if Nest packages are bundled.
  if (config.backend === "nest") {
    vfs.deleteFile("apps/server/tsdown.config.ts");
  }

  processTemplatesFromPrefix(
    vfs,
    templates,
    `backend/server/${config.backend}`,
    "apps/server",
    config,
  );
}
