// TechCategory for the stack builder UI
export type TechCategory =
  | "api"
  | "webFrontend"
  | "nativeFrontend"
  | "runtime"
  | "backend"
  | "database"
  | "orm"
  | "dbSetup"
  | "webDeploy"
  | "serverDeploy"
  | "auth"
  | "packageManager"
  | "addons"
  | "examples"
  | "git"
  | "install";

export type TechEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
};
