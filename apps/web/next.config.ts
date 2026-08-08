import type { NextConfig } from "next";

const config: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "abs.twimg.com" },
      { protocol: "https", hostname: "r2.better-t-stack.dev" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  outputFileTracingExcludes: {
    "*": ["./**/*.js.map", "./**/*.mjs.map", "./**/*.cjs.map"],
  },
  serverExternalPackages: ["create-better-t-stack", "fs-extra", "tinyglobby", "handlebars"],
};

export default config;
