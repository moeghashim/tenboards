import packageJson from "../../package.json";

export const APP_CONFIG = {
  name: "tenboards",
  version: packageJson.version,
  copyright: (year: number) => `© ${year}, tenboards.`,
  meta: {
    // Set an absolute URL on your own origin if your social crawler requires it.
    image: "/og.png",
    title: "tenboards - Modern TanStack Start Dashboard Starter Template",
    description:
      "tenboards is a modern, open-source dashboard starter template built with TanStack Start, Tailwind CSS v4, and shadcn/ui. A customizable demo foundation for SaaS apps, admin panels, and internal tools.",
  },
};
