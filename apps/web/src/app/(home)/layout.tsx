import type { ReactNode } from "react";

import { HomeSiteHeader } from "@/components/site-header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <HomeSiteHeader />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
