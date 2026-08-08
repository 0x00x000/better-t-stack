"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentProps, useEffect, useState } from "react";

import { navLinks, navTitle, type SiteNavLink } from "@/app/layout.config";
import { cn } from "@/lib/utils";

const labelClass = "font-mono text-[11px] uppercase tracking-[0.08em]";
const iconButtonClass =
  "inline-flex size-7 shrink-0 items-center justify-center rounded-[4px] p-0 text-fd-muted-foreground transition-colors hover:bg-transparent hover:text-fd-foreground [&_svg]:size-4";

function Sep({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("h-3 w-px shrink-0 bg-fd-border", className)} />;
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  className,
  onClick,
}: {
  item: SiteNavLink;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = !item.external && isActive(pathname, item.url);

  return (
    <Link
      href={item.url}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        labelClass,
        "text-fd-muted-foreground transition-colors hover:text-fd-foreground",
        active && "text-primary",
        className,
      )}
    >
      {item.text}
    </Link>
  );
}

function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(iconButtonClass, className)}
    >
      {isDark ? <Moon /> : <Sun />}
    </button>
  );
}

export function SiteHeader({ className, ...props }: ComponentProps<"header">) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header {...props} className={cn("h-14 shrink-0", className)}>
      <div className="flex h-14 items-center gap-2 border-b px-4 md:px-6">
        <Link
          aria-label="Better T Stack home"
          className="inline-flex shrink-0 items-center gap-2.5 text-fd-foreground"
          href="/"
        >
          {navTitle}
        </Link>

        <Sep className="mx-1 max-md:hidden" />

        <nav aria-label="Main" className="flex items-center gap-4 max-md:hidden">
          {navLinks.map((item) => (
            <NavLink item={item} key={item.url} />
          ))}
        </nav>

        <span className="flex-1" />

        <ThemeToggle className="max-md:hidden" />

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-header-menu"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(iconButtonClass, "md:hidden")}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-x-0 top-14 h-svh cursor-default"
          />
          <div
            id="site-header-menu"
            className="absolute inset-x-0 top-14 max-h-[calc(100svh-3.5rem)] overflow-y-auto border-b bg-fd-background px-4 pt-1 pb-3"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {navLinks.map((item) => (
                <NavLink
                  className="py-2.5"
                  item={item}
                  key={item.url}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
            <div className="mt-1 flex items-center justify-end border-t pt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function HomeSiteHeader(props: ComponentProps<"header">) {
  return (
    <SiteHeader
      {...props}
      id="site-header"
      className={cn("sticky top-0 z-40 bg-fd-background/80 backdrop-blur-lg", props.className)}
    />
  );
}
