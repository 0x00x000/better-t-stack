import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { type TemplateData, processTemplatesFromPrefix } from "./utils";

const REACT_WEB_FRONTENDS = ["tanstack-router", "react-router", "tanstack-start", "next"] as const;

export async function processApiTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (config.api === "none") return;

  processTemplatesFromPrefix(vfs, templates, `api/${config.api}/server`, "packages/api", config);

  const hasReactWeb = config.frontend.some((f) =>
    REACT_WEB_FRONTENDS.includes(f as (typeof REACT_WEB_FRONTENDS)[number]),
  );

  if (!hasReactWeb) return;

  processTemplatesFromPrefix(
    vfs,
    templates,
    `api/${config.api}/web/react/base`,
    "apps/web",
    config,
  );

  const reactFramework = config.frontend.find((f) =>
    REACT_WEB_FRONTENDS.includes(f as (typeof REACT_WEB_FRONTENDS)[number]),
  );
  if (
    config.backend === "self" &&
    reactFramework &&
    (reactFramework === "next" || reactFramework === "tanstack-start")
  ) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `api/${config.api}/fullstack/${reactFramework}`,
      "apps/web",
      config,
    );
  }
}
