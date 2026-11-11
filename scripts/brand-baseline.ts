import { chromium } from "playwright";

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";

// Compare browser-computed custom properties, including inherited aliases and mixes.
const baseline = execFileSync("git", ["show", "origin/main:src/styles/styles.css"], { encoding: "utf8" });
const current = await readFile("src/styles/styles.css", "utf8");
async function expand(source: string) {
  let css = source;
  for (const name of ["presets/graphite.css", "presets/pine.css", "presets/iris.css", "brand.css"])
    css = css.replace(`@import "./${name}";`, await readFile(`src/styles/${name}`, "utf8"));
  return css.replace(/^@import .*;$/gm, "");
}
const browser = await chromium.launch();
const result = [];
try {
  const pages = await Promise.all(
    [baseline, current].map(async (source) => {
      const page = await browser.newPage();
      await page.setContent(`<style>${await expand(source)}</style>`);
      return page;
    }),
  );
  for (const preset of ["default", "graphite", "pine", "iris"])
    for (const mode of ["light", "dark"]) {
      const styles = await Promise.all(
        pages.map((page) =>
          page.evaluate(
            ({ preset, mode }) => {
              const root = document.documentElement;
              root.dataset.themePreset = preset;
              root.classList.toggle("dark", mode === "dark");
              const style = getComputedStyle(root);
              return Object.fromEntries(
                Array.from(style)
                  .filter((k) => k.startsWith("--"))
                  .sort()
                  .map((k) => [k, style.getPropertyValue(k)]),
              );
            },
            { preset, mode },
          ),
        ),
      );
      assert.deepEqual(styles[1], styles[0], `${preset}/${mode}`);
      result.push({ preset, mode, tokens: Object.keys(styles[0]).length, diff: [] });
    }
} finally {
  await browser.close();
}
await mkdir("verify/brand", { recursive: true });
await writeFile("verify/brand/computed-diff.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
