import { Terminal } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative w-full border-border border-t">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 grid gap-8 sm:mb-12 lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold font-mono text-base text-foreground sm:mb-4">
              <Terminal className="h-4 w-4 text-primary" />
              <span>BETTER_T_STACK.INFO</span>
            </h3>
            <p className="font-mono text-muted-foreground text-sm leading-relaxed sm:text-base lg:pr-4">
              Type-safe, modern TypeScript scaffolding for full-stack web development
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold font-mono text-base text-foreground sm:mb-4">
              CONTACT.ENV
            </h3>
            <div className="space-y-3 font-mono text-muted-foreground text-sm sm:space-y-4 sm:text-base">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="inline-flex w-fit rounded bg-muted px-2 py-1 font-mono text-xs sm:text-sm">
                  $
                </span>
                <span className="break-all sm:break-normal">amanvarshney.work@gmail.com</span>
              </div>
              <p className="text-sm leading-relaxed sm:text-base">
                Have questions or feedback? Feel free to reach out by email.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-border border-t pt-6 sm:flex-row sm:gap-6 sm:pt-8">
          <p className="text-center font-mono text-muted-foreground text-xs sm:text-left sm:text-sm">
            © {new Date().getFullYear()} Better-T-Stack. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 font-mono text-muted-foreground text-xs sm:text-sm">
            <span className="text-primary">$</span> Built with{" "}
            <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text font-medium text-transparent">
              TypeScript
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
