import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { type TemplateData, processTemplatesFromPrefix } from "./utils";

const DOCKER_WEB_TEMPLATE_MAP: Record<string, string> = {
  "tanstack-router": "react/tanstack-router",
  "tanstack-start": "react/tanstack-start",
  "react-router": "react/react-router",
  next: "react/next",
};

export async function processDeployTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  const isBackendSelf = config.backend === "self";

  if (config.webDeploy === "cloudflare" || config.serverDeploy === "cloudflare") {
    processTemplatesFromPrefix(vfs, templates, "packages/infra", "packages/infra", config);
  }

  if (config.webDeploy === "docker" || config.serverDeploy === "docker") {
    processTemplatesFromPrefix(vfs, templates, "deploy/docker/compose", "", config);
  }

  if (config.webDeploy === "vercel" || config.serverDeploy === "vercel") {
    processTemplatesFromPrefix(vfs, templates, "deploy/vercel", "", config);
  }

  if (
    config.webDeploy !== "none" &&
    config.webDeploy !== "cloudflare" &&
    config.webDeploy !== "vercel"
  ) {
    for (const f of config.frontend) {
      const templatePath = DOCKER_WEB_TEMPLATE_MAP[f];
      if (templatePath) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `deploy/${config.webDeploy}/web/${templatePath}`,
          "apps/web",
          config,
        );
      }
    }
  }

  if (
    config.serverDeploy !== "none" &&
    config.serverDeploy !== "cloudflare" &&
    config.serverDeploy !== "vercel" &&
    !isBackendSelf
  ) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `deploy/${config.serverDeploy}/server`,
      "apps/server",
      config,
    );
  }
}
