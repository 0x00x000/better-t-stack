import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

export function processPaymentsDeps(_vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.payments || config.payments === "none") return;
}
