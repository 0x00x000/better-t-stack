import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { type TemplateData, processTemplatesFromPrefix } from "./utils";

const REACT_WEB_FRONTENDS = ["tanstack-router", "react-router", "tanstack-start", "next"] as const;

export async function processAuthTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.auth || config.auth === "none") return;

  const authProvider = config.auth;
  const hasReactWeb = config.frontend.some((f) =>
    REACT_WEB_FRONTENDS.includes(f as (typeof REACT_WEB_FRONTENDS)[number]),
  );
  const hasNativeBare = config.frontend.includes("native-bare");
  const hasUniwind = config.frontend.includes("native-uniwind");
  const hasUnistyles = config.frontend.includes("native-unistyles");
  const hasNative = hasNativeBare || hasUniwind || hasUnistyles;

  if (config.backend !== "none") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `auth/${authProvider}/server/base`,
      "packages/auth",
      config,
    );

    if (config.orm !== "none" && config.database !== "none") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `auth/${authProvider}/server/db/${config.orm}/${config.database}`,
        "packages/db",
        config,
      );
    }
  }

  if (hasReactWeb) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `auth/${authProvider}/web/react/base`,
      "apps/web",
      config,
    );

    const reactFramework = config.frontend.find((f) =>
      REACT_WEB_FRONTENDS.includes(f as (typeof REACT_WEB_FRONTENDS)[number]),
    );
    if (reactFramework) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `auth/${authProvider}/web/react/${reactFramework}`,
        "apps/web",
        config,
      );

      if (
        config.backend === "self" &&
        (reactFramework === "next" || reactFramework === "tanstack-start")
      ) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `auth/${authProvider}/fullstack/${reactFramework}`,
          "apps/web",
          config,
        );
      }
    }
  }

  if (hasNative) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      `auth/${authProvider}/native/base`,
      "apps/native",
      config,
    );

    let nativeFramework = "";
    if (hasNativeBare) nativeFramework = "bare";
    else if (hasUniwind) nativeFramework = "uniwind";
    else if (hasUnistyles) nativeFramework = "unistyles";

    if (nativeFramework) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `auth/${authProvider}/native/${nativeFramework}`,
        "apps/native",
        config,
      );
    }
  }
}
