import type { ComponentProps } from "react";

import { ArrowRight, ArrowUpRight } from "lucide-react";

import { PageHeader } from "@/components/blocks";
import { Brand } from "@/components/brand/brand";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { buttonVariants } from "@/components/ui/button";
import { CodeBlock, CodeBlockContent, CodeBlockHeader, CodeBlockTitle } from "@/components/ui/code-block";
import { APP_LANDING_ROUTE } from "@/navigation/landing";

import { QuickStart } from "./quick-start";

const repository = "https://github.com/moeghashim/tenboards";
const textLink = "inline-flex min-h-6 items-center gap-1 rounded-sm text-primary underline underline-offset-4";

function ExternalLink({ children, ...props }: ComponentProps<"a">) {
  return (
    <a {...props}>
      {children}
      <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
      <span className="sr-only"> (external)</span>
    </a>
  );
}

function RepositoryLink({ compact = false }: { compact?: boolean }) {
  return (
    <ExternalLink href={repository} className={buttonVariants({ size: compact ? "default" : "lg" })}>
      {compact ? "GitHub" : "View on GitHub"}
    </ExternalLink>
  );
}

const dashboards = [
  ["Default", "default"],
  ["CRM", "crm"],
  ["Finance", "finance"],
  ["Analytics", "analytics"],
  ["Productivity", "productivity"],
  ["E-commerce", "ecommerce"],
  ["Academy", "academy"],
  ["Logistics", "logistics"],
  ["Infrastructure", "infrastructure"],
  ["Patient Monitoring", "patient-monitoring"],
];
const stack = [
  "TanStack Start (SSR)",
  "React 19",
  "TypeScript (strict)",
  "Tailwind CSS v4",
  "shadcn/ui on Base UI",
  "TanStack Table",
  "Recharts",
  "Drizzle + Postgres",
  "Better Auth",
  "Cloudflare Workers",
];

export function Homepage() {
  return (
    <div className="bg-background text-foreground">
      <a
        href="#main-content"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <a href="/" aria-label="tenboards homepage" className="rounded-sm text-lg">
            <Brand />
          </a>
          <nav aria-label="Homepage" className="order-last flex w-full gap-5 text-sm sm:order-none sm:w-auto">
            <a href="#workflow" className="inline-flex min-h-6 items-center hover:underline">
              Workflow
            </a>
            <a href="#included" className="inline-flex min-h-6 items-center hover:underline">
              What’s included
            </a>
            <a href="#quick-start" className="inline-flex min-h-6 items-center hover:underline">
              Quick start
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={APP_LANDING_ROUTE}
              className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex" })}
            >
              Live demo
            </a>
            <ThemeSwitcher />
            <RepositoryLink compact />
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-5 sm:px-8">
        <section aria-label="Introduction" className="space-y-8 py-10 sm:py-16">
          <div className="grid items-start gap-6 md:grid-cols-2 md:gap-12">
            <PageHeader
              title="An agent-ready foundation for your next dashboard."
              className="max-w-xl [&_h1]:text-4xl [&_h1]:text-balance"
            />
            <div className="space-y-5">
              <p className="text-muted-foreground max-w-xl text-lg">
                An MIT-licensed dashboard template that gives Codex, Claude Code and you a clear path from prompt to
                working page. Real screens, reusable blocks and checks that keep new UI on-system.
              </p>
              <div className="flex flex-wrap gap-3">
                <RepositoryLink />
                <a href={APP_LANDING_ROUTE} className={buttonVariants({ variant: "outline", size: "lg" })}>
                  Open live demo <ArrowRight aria-hidden="true" />
                </a>
              </div>
              <p className="text-muted-foreground text-sm">Zero-config demo. Your code to build on.</p>
            </div>
          </div>
          <figure className="bg-surface overflow-hidden rounded-xl border">
            <div className="text-muted-foreground border-b px-4 py-3 text-sm">Default dashboard · Sample data</div>
            <img
              src="/homepage/default-light.webp"
              width={1440}
              height={900}
              alt="tenboards Default dashboard in light mode, with the workspace sidebar, revenue cards, a customer activity chart and customer records."
              fetchPriority="high"
              className="block h-auto w-full dark:hidden"
            />
            <img
              src="/homepage/default-dark.webp"
              width={1440}
              height={900}
              alt="tenboards Default dashboard in dark mode, with the workspace sidebar, revenue cards, a customer activity chart and customer records."
              className="hidden h-auto w-full dark:block"
            />
            <figcaption className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-sm">
              <span>The actual template, ready to explore.</span>
              <a href={APP_LANDING_ROUTE} className={textLink}>
                Explore Default <ArrowRight className="size-3.5" aria-hidden="true" />
              </a>
            </figcaption>
          </figure>
        </section>
        <section
          id="workflow"
          aria-labelledby="workflow-title"
          className="scroll-mt-6 space-y-8 border-t py-10 sm:py-14"
        >
          <div className="max-w-2xl space-y-3">
            <h2 id="workflow-title" className="text-3xl font-medium tracking-tight">
              A shorter path from prompt to page.
            </h2>
            <p className="text-muted-foreground text-base">
              The build workflow is part of the template. Your agent gets instructions, working examples and a way to
              check its work.
            </p>
          </div>
          <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
            <ol className="space-y-6">
              {[
                ["Describe the page", "“Add a Sales dashboard with revenue KPIs and a top-products table.”"],
                [
                  "Read the project’s instructions",
                  "The agent reads AGENTS.md and the tenboards-build-ui skill before changing code.",
                ],
                [
                  "Generate, then compose",
                  "Run new:dashboard, adapt the typed fixtures and compose @/components/blocks. Use the data skill when connecting Postgres.",
                ],
                [
                  "Check and inspect",
                  "Run build, check and typecheck, then verify:page for accessibility and runtime errors. Inspect all four renders and keyboard behavior.",
                ],
              ].map(([title, description], index) => (
                <li key={title} className="flex gap-4">
                  <span
                    className="text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-md border text-sm"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-base font-medium">{title}</h3>
                    <p className="text-muted-foreground text-sm">{description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <CodeBlock className="bg-card">
              <CodeBlockHeader>
                <CodeBlockTitle>From the project root</CodeBlockTitle>
              </CodeBlockHeader>
              <CodeBlockContent
                wrap
                role="region"
                aria-label="Agent build workflow commands"
              >{`npm run new:dashboard sales

# Adapt the generated page and typed fixtures.
# Import UI from @/components/blocks.

npm run build
npm run check
npm run typecheck
npm run verify:page -- /dashboard/sales`}</CodeBlockContent>
            </CodeBlock>
          </div>
        </section>
        <section aria-labelledby="agent-title" className="space-y-8 border-t py-10 sm:py-14">
          <h2 id="agent-title" className="text-3xl font-medium tracking-tight">
            Agent-ready, in the repository.
          </h2>
          <dl className="grid gap-x-12 sm:grid-cols-2">
            {[
              [
                "Instructions that travel with the code",
                <>
                  AGENTS.md maps the stack, build loop and invariants. CLAUDE.md imports the same guide.{" "}
                  <ExternalLink href={`${repository}/blob/main/AGENTS.md`} className={textLink}>
                    Read the agent guide
                  </ExternalLink>
                </>,
              ],
              [
                "Two focused Agent Skills",
                <>
                  tenboards-build-ui covers page composition; tenboards-connect-data covers typed reads and database
                  parity. Canonical skills live in .agents/skills, with mirrors in .claude/skills.
                </>,
              ],
              [
                "Generators with the wiring included",
                <>
                  new:dashboard and new:page scaffold the route, navigation, guarded loader, typed reads and
                  illustrative fixtures. Existing slugs are never overwritten.
                </>,
              ],
              [
                "Public blocks, working examples",
                <>
                  Build with PageHeader, StatCard, DashboardCard, DataTable and chart helpers from @/components/blocks.{" "}
                  <a href="/dashboard/kit" className={textLink}>
                    Open the blocks kit <ArrowRight className="size-3.5" aria-hidden="true" />
                  </a>
                </>,
              ],
              [
                "Guardrails with a verification loop",
                <>
                  check:design catches raw colors, arbitrary sizes and block bypasses. verify:page captures light/dark ×
                  desktop/mobile and fails on axe violations, console and hydration errors.
                </>,
              ],
              [
                "Useful beyond this clone",
                <>
                  <a href="/llms.txt" className={textLink}>
                    llms.txt
                  </a>{" "}
                  and{" "}
                  <a href="/llms-full.txt" className={textLink}>
                    llms-full.txt
                  </a>{" "}
                  expose the guidance. A shadcn registry lets other projects install blocks and the global tenboards
                  theme.{" "}
                  <a href="/r/stat-card.json" className={textLink}>
                    View StatCard registry JSON
                  </a>
                </>,
              ],
            ].map(([title, description]) => (
              <div key={String(title)} className="min-w-0 space-y-2 border-t py-5">
                <dt className="text-base font-medium">{title}</dt>
                <dd className="text-muted-foreground text-sm leading-relaxed wrap-break-word">{description}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section
          id="included"
          aria-labelledby="included-title"
          className="scroll-mt-6 space-y-8 border-t py-10 sm:py-14"
        >
          <div className="max-w-2xl space-y-3">
            <h2 id="included-title" className="text-3xl font-medium tracking-tight">
              A working template to build from.
            </h2>
            <p className="text-muted-foreground text-base">
              Explore the included screens with sample data. Connect your own services when you’re ready; the demo needs
              no environment variables.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Ten dashboards</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                {dashboards.map(([name, slug]) => (
                  <li key={slug}>
                    <a className={textLink} href={`/dashboard/${slug}`}>
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">The workspace around them</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Home, Projects with Overview, Board, List, Timeline and Files views, AI Assistant, Mail, Chat,
                  Invoice, Products, Users, Roles, Profile, auth and system pages.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">One design system</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Light and dark themes, color presets, compact tokens, a ⌘K command palette and layout settings. New
                  pages use the same blocks as the demo.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Optional integrations</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Postgres with Drizzle, Better Auth, Assistant providers and Cloudflare Workers deployment. The live
                  demo uses sample data, recorded Assistant replies and no authentication. Generated DB reads are
                  illustrative stubs until you implement them.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section aria-labelledby="stack-title" className="space-y-6 border-t py-10 sm:py-14">
          <h2 id="stack-title" className="text-3xl font-medium tracking-tight">
            Built with a familiar stack.
          </h2>
          <ul className="flex flex-wrap gap-3">
            {stack.map((name) => (
              <li key={name} className="rounded-md border px-3 py-2 text-sm">
                {name}
              </li>
            ))}
          </ul>
        </section>
        <section
          id="quick-start"
          aria-labelledby="quick-start-title"
          className="grid scroll-mt-6 gap-8 border-t py-10 sm:py-14 md:grid-cols-2 md:gap-12"
        >
          <div className="space-y-3">
            <h2 id="quick-start-title" className="text-3xl font-medium tracking-tight">
              Clone it. Make it yours.
            </h2>
            <p className="text-muted-foreground max-w-md text-base">
              Use Node 22+ and npm. No database or API keys required. Open localhost:3000 to get started.
            </p>
            <ExternalLink href={`${repository}/blob/main/docs/reference.md`} className={textLink}>
              Read the reference
            </ExternalLink>
          </div>
          <QuickStart />
        </section>
        <section
          aria-labelledby="start-title"
          className="flex flex-wrap items-center justify-between gap-6 border-t py-10 sm:py-14"
        >
          <div className="space-y-2">
            <h2 id="start-title" className="text-3xl font-medium tracking-tight">
              Give your next build a head start.
            </h2>
            <p className="text-muted-foreground text-base">
              Explore the code, then ask your agent for the page you need.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <RepositoryLink />
            <a href={APP_LANDING_ROUTE} className={buttonVariants({ variant: "outline", size: "lg" })}>
              Open live demo <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-6 px-5 py-8 sm:px-8">
          <div className="space-y-3">
            <Brand />
            <p className="text-muted-foreground max-w-md text-sm">
              MIT licensed. Based on{" "}
              <ExternalLink href="https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard" className={textLink}>
                Studio Admin
              </ExternalLink>{" "}
              by Mohammed Arham Khan.
            </p>
          </div>
          <nav aria-label="Project resources" className="flex flex-wrap items-start gap-5 text-sm">
            <ExternalLink href={`${repository}/blob/main/docs/reference.md`} className={textLink}>
              Docs
            </ExternalLink>
            <ExternalLink href={`${repository}/blob/main/CHANGELOG.md`} className={textLink}>
              Changelog
            </ExternalLink>
            <ExternalLink href={`${repository}/blob/main/LICENSE`} className={textLink}>
              MIT license
            </ExternalLink>
          </nav>
        </div>
      </footer>
    </div>
  );
}
