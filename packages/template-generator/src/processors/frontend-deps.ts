import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

/** Astro frontend is no longer generated; keep hook for future deploy-specific deps. */
export function processFrontendDeps(_vfs: VirtualFileSystem, _config: ProjectConfig): void {}
