import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";
import { type TemplateData, processTemplatesFromPrefix } from "./utils";

const REACT_WEB_FRONTENDS = ["tanstack-router", "react-router", "tanstack-start", "next"] as const;

export async function processExampleTemplates(
  vfs: VirtualFileSystem,
  templates: TemplateData,
  config: ProjectConfig,
): Promise<void> {
  if (!config.examples || config.examples.length === 0 || config.examples[0] === "none") return;

  const hasReactWeb = config.frontend.some((f) =>
    REACT_WEB_FRONTENDS.includes(f as (typeof REACT_WEB_FRONTENDS)[number]),
  );
  const hasNativeBare = config.frontend.includes("native-bare");
  const hasUniwind = config.frontend.includes("native-uniwind");
  const hasUnistyles = config.frontend.includes("native-unistyles");
  const hasNative = hasNativeBare || hasUniwind || hasUnistyles;

  for (const example of config.examples) {
    if (example === "none") continue;

    if (config.backend !== "none" && config.api !== "none") {
      processTemplatesFromPrefix(
        vfs,
        templates,
        `examples/${example}/server/${config.orm}/base`,
        "packages/api",
        config,
      );

      if (config.orm !== "none" && config.database !== "none") {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `examples/${example}/server/${config.orm}/${config.database}`,
          "packages/db",
          config,
        );
      }
    }

    if (hasReactWeb) {
      const reactFramework = config.frontend.find((f) =>
        REACT_WEB_FRONTENDS.includes(f as (typeof REACT_WEB_FRONTENDS)[number]),
      );
      if (reactFramework) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `examples/${example}/web/react/${reactFramework}`,
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
            `examples/${example}/fullstack/${reactFramework}`,
            "apps/web",
            config,
          );
        }
      }
    }

    if (hasNative) {
      let nativeFramework = "";
      if (hasNativeBare) nativeFramework = "bare";
      else if (hasUniwind) nativeFramework = "uniwind";
      else if (hasUnistyles) nativeFramework = "unistyles";

      if (nativeFramework) {
        processTemplatesFromPrefix(
          vfs,
          templates,
          `examples/${example}/native/${nativeFramework}`,
          "apps/native",
          config,
        );
      }
    }
  }
}
