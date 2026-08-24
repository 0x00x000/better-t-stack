import type { DesktopWebFrontend, WebFrontend } from "./types";

export const webFrontends = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
] as const satisfies readonly Exclude<WebFrontend, "none">[];

export const desktopWebFrontends = [
  "tanstack-router",
  "react-router",
  "tanstack-start",
  "next",
] as const satisfies readonly DesktopWebFrontend[];
