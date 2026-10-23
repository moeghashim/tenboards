import { chromium } from "playwright";

import { captureRoutes } from "./screenshot-routes.ts";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    "base-url": { type: "string", default: "http://127.0.0.1:3000" },
    routes: { type: "string" },
    output: { type: "string", default: "screenshots" },
    preset: { type: "string", default: "default" },
    list: { type: "boolean", default: false },
  },
});
const baseURL = new URL(values["base-url"]);
if (!["http:", "https:"].includes(baseURL.protocol)) throw new Error("Base URL must use HTTP(S).");
const generated = await readFile("src/routeTree.gen.ts", "utf8");
const routeBlock = generated.split("export interface FileRoutesByFullPath {")[1]?.split("\n}")[0];
if (!routeBlock) throw new Error("Missing generated route inventory. Run npm run generate-routes.");
const generatedRoutes = [...routeBlock.matchAll(/^\s*'([^']+)':/gm)].map((match) => match[1]);
const missing = generatedRoutes.filter((route) => !captureRoutes.some((entry) => entry.route === route));
const stale = captureRoutes.filter((entry) => !generatedRoutes.includes(entry.route));
if (missing.length || stale.length) {
  throw new Error(`Route inventory mismatch: missing=${JSON.stringify(missing)}, stale=${JSON.stringify(stale)}`);
}
const requested = values.routes?.split(",");
const selected: Array<{ route: string; path: string; ready?: string; status?: number }> = captureRoutes.filter(
  (entry) => !requested || requested.includes(entry.route),
);
const unknown = requested?.filter((route) => !captureRoutes.some((entry) => entry.route === route));
if (unknown?.length || !selected.length) throw new Error(`Unknown/empty route subset: ${unknown?.join(",")}`);
if (values.list) {
  console.log(JSON.stringify(selected, null, 2));
  process.exit(0);
}
const output = path.resolve(values.output);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results: Array<{ route: string; theme: string; viewport: string; file: string; errors: string[] }> = [];
try {
  for (const entry of selected) {
    for (const theme of ["light", "dark"] as const) {
      for (const [viewportName, viewport] of Object.entries({
        desktop: { width: 1440, height: 900 },
        mobile: { width: 390, height: 844 },
      })) {
        const context = await browser.newContext({
          viewport,
          colorScheme: theme,
          reducedMotion: "reduce",
          locale: "en-US",
          timezoneId: "America/Chicago",
        });
        await context.addCookies([
          { name: "theme_mode", value: theme, url: baseURL.origin },
          { name: "theme_preset", value: values.preset, url: baseURL.origin },
          { name: "font", value: "geist", url: baseURL.origin },
        ]);
        const page = await context.newPage();
        const errors: string[] = [];
        page.on("console", (message) => {
          if (message.type() === "error") errors.push(`console: ${message.text()}`);
        });
        page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
        page.on("requestfailed", (request) => {
          if (request.failure()?.errorText !== "net::ERR_ABORTED") {
            errors.push(`request: ${request.url()} ${request.failure()?.errorText}`);
          }
        });
        const file = `${entry.route.replaceAll(/[^a-z0-9-]/gi, "_") || "root"}-${theme}-${viewportName}.png`;
        try {
          const response = await page.goto(new URL(entry.path, baseURL).href, { waitUntil: "domcontentloaded" });
          if (!response || response.status() !== (entry.status ?? 200)) {
            throw new Error(`Unexpected HTTP status ${response?.status()}`);
          }
          // React adds these DOM bindings during hydration; SSR markup alone cannot satisfy this gate.
          await page.waitForFunction(() =>
            Array.from(document.querySelectorAll("body *")).some((node) =>
              Object.keys(node).some((key) => key.startsWith("__reactFiber$")),
            ),
          );
          await page.waitForFunction(() => document.fonts.status === "loaded");
          await page.waitForFunction(
            ({ mode, preset }) =>
              document.documentElement.classList.contains("dark") === (mode === "dark") &&
              document.documentElement.dataset.themePreset === preset,
            { mode: theme, preset: values.preset },
          );
          if (entry.ready) await page.getByText(entry.ready, { exact: true }).first().waitFor();
          await page.waitForLoadState("networkidle");
          // Allow JS chart animations to finish too; reduced-motion CSS does not stop every chart library.
          await page.waitForTimeout(1800);
          await page.evaluate(async () => {
            await document.fonts.ready;
            await Promise.all(
              Array.from(document.images).map((img) => (img.complete ? Promise.resolve() : img.decode())),
            );
            window.scrollTo(0, 0);
          });
          let previous = "";
          let stable = 0;
          for (let attempt = 0; attempt < 20 && stable < 3; attempt++) {
            const current = await page.evaluate(() =>
              JSON.stringify({ text: document.body.textContent, height: document.body.scrollHeight }),
            );
            stable = current === previous ? stable + 1 : 0;
            previous = current;
            await page.waitForTimeout(150);
          }
          if (stable < 3) throw new Error("Content did not stabilize before capture.");
          await page.screenshot({ path: path.join(output, file), fullPage: true, animations: "disabled" });
        } catch (error) {
          errors.push(error instanceof Error ? error.message : String(error));
        } finally {
          await context.close();
        }
        results.push({ route: entry.route, theme, viewport: viewportName, file, errors });
        console.log(`${errors.length ? "FAIL" : "PASS"} ${entry.route} ${theme}/${viewportName}`);
        if (errors.length) console.error(errors.join("\n"));
      }
    }
  }
} finally {
  await browser.close();
  await writeFile(
    path.join(output, "report.json"),
    `${JSON.stringify({ baseURL, preset: values.preset, results }, null, 2)}\n`,
  );
}
if (results.some((result) => result.errors.length)) process.exitCode = 1;
