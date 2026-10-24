import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

import { authConfiguration } from "./src/lib/auth/config.ts";

const config = defineConfig(({ command }) => {
  // Builds contain no deployment credentials; validate Node development only.
  if (command !== "build") authConfiguration(process.env);
  return {
    resolve: { tsconfigPaths: true },
    plugins: [
      devtools({
        injectSource: {
          enabled: true,
          ignore: {
            components: ["FullCalendar"],
          },
        },
      }),
      tailwindcss(),
      tanstackStart(),
      // Preserve zero-config Node development; build and preview the Worker with Wrangler.
      nitro({ preset: command === "build" ? "cloudflare-module" : undefined }),
      viteReact(),
    ],
  };
});

export default config;
