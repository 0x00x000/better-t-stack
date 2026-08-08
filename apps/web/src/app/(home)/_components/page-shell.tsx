import type { ReactNode } from "react";

import Footer from "./footer";

/** Shared page shell for secondary marketing routes. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-svh bg-fd-background">
      <div className="container mx-auto flex flex-col gap-10 px-4 pt-16 pb-16 font-mono font-normal text-fd-foreground">
        {children}
      </div>
      <Footer />
    </main>
  );
}
