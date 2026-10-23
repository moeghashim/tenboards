import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "tenboards",
  version: packageJson.version,
  copyright: `© ${currentYear}, tenboards.`,
  meta: {
    image: "https://tenboards.mohanadgh.workers.dev/og.png",
    title: "tenboards - Modern TanStack Start Dashboard Starter Template",
    description:
      "tenboards is a modern, open-source dashboard starter template built with TanStack Start, Tailwind CSS v4, and shadcn/ui. A customizable demo foundation for SaaS apps, admin panels, and internal tools.",
  },
};
