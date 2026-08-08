export const dynamic = "force-static";

import Pane from "./_components/rail/pane";
import { PANES } from "./_components/rail/panes-config";
import InitPane from "./_components/rail/panes/init-pane";
import Rail from "./_components/rail/rail";

export default function HomePage() {
  return (
    <Rail>
      {PANES.map((pane, index) => (
        <Pane key={pane.id} id={pane.id} index={index} title={pane.title} width={pane.width}>
          {pane.id === "pane-init" ? <InitPane /> : null}
        </Pane>
      ))}
    </Rail>
  );
}
