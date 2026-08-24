import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { type TemplateData, processTemplatesFromPrefix } from "./utils";

export async function processAuthTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (config.auth !== "better-auth") return;

  const hasReactWeb = config.frontend.some((f) =>
    ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
  );
  const hasNativeBare = config.frontend.includes("native-bare");
  const hasUniwind = config.frontend.includes("native-uniwind");
  const hasUnistyles = config.frontend.includes("native-unistyles");
  const hasNative = hasNativeBare || hasUniwind || hasUnistyles;

  if (config.backend !== "none") {
    processTemplatesFromPrefix(
      vfs,
      templates,
      "auth/better-auth/server/base",
      "packages/auth",
      config,
    );

    if (config.orm !== "none" && config.database !== "none") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `auth/better-auth/server/db/${config.orm}/${config.database}`,
        "packages/db",
        config,
      );
    }
  }

  if (hasReactWeb) {
    processTemplatesFromPrefix(
      vfs,
      templates,
      "auth/better-auth/web/react/base",
      "apps/web",
      config,
    );

    const reactFramework = config.frontend.find((f) =>
      ["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
    );
    if (reactFramework) {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `auth/better-auth/web/react/${reactFramework}`,
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
          `auth/better-auth/fullstack/${reactFramework}`,
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
      "auth/better-auth/native/base",
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
        `auth/better-auth/native/${nativeFramework}`,
        "apps/native",
        config,
      );
    }
  }
}
