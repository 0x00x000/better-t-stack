import type { DesktopWebFrontend } from "./types";

export const desktopWebFrontends = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
] as const satisfies readonly DesktopWebFrontend[];
