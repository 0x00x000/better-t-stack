export type PaneDef = {
  id: string;
  label: string;
  title: string;
  width: string;
};

export const PANES: PaneDef[] = [
  { id: "pane-init", label: "init", title: "init", width: "min(92vw, 680px)" },
];
