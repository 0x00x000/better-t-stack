import Image from "next/image";

import mainLogoDark from "@/public/logo-dark.svg";
import mainLogoLight from "@/public/logo-light.svg";

export const logo = (
  <>
    <Image alt="better-t-stack" src={mainLogoLight} className="w-8 dark:hidden" />
    <Image alt="better-t-stack" src={mainLogoDark} className="hidden w-8 dark:block" />
  </>
);

export type SiteNavLink = {
  text: string;
  url: string;
  external?: boolean;
};

export const navLinks: SiteNavLink[] = [
  {
    text: "Builder",
    url: "/new",
  },
];

export const navTitle = (
  <>
    {logo}
    <span className="inline shrink-0 whitespace-nowrap font-medium font-mono text-base tracking-tighter md:hidden xl:inline">
      Better T Stack
    </span>
  </>
);
