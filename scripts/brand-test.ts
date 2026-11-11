import { contrast, gamut, parseColor, toLch, toRgb } from "./brand/color.ts";
import { derive } from "./brand/derive.ts";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const matrix = [
  "#facc15",
  "#22c55e",
  "#000000",
  "#ffffff",
  "#7c3aed",
  "#e11d48",
  "#0ea5e9",
  "#1e40af",
  "oklch(0.7 0.15 200)",
  "rgb(255 128 0)",
];
for (const input of matrix) {
  const { modes, reports } = derive(input);
  if (input === "#facc15" || input === "#ffffff") {
    assert.equal(modes.dark["primary-foreground"], "#111318");
    assert(Math.abs(parseColor(modes.dark.primary)[0] - gamut(parseColor(input))[0]) <= 0.05);
  }
  if (["#7c3aed", "#e11d48", "#1e40af"].includes(input)) assert.equal(modes.dark["primary-foreground"], "#ffffff");
  for (const report of reports.filter((line) => line.includes("adjusted ΔL=")))
    assert.match(
      report,
      /\((contrast vs (foreground #[a-f0-9]{6}|bg|surface|surface-raised) [\d.]+→[\d.]+|dark-mode derivation|hover derivation|sRGB gamut clamp)\)$/,
    );
  for (const [mode, roles] of Object.entries(modes)) {
    const fg = toRgb(parseColor(roles["primary-foreground"]));
    for (const role of ["primary", "primary-hover", "primary-top"])
      assert(contrast(toRgb(parseColor(roles[role])), fg) >= 4.5, `${input} ${mode} ${role}`);
    for (const surface of mode === "dark" ? ["#111318", "#191d25", "#252b36"] : ["#f8f9fb", "#ffffff", "#f0f2f5"])
      for (const role of ["action-accent", "ring", "filter-edge"])
        assert(contrast(toRgb(parseColor(roles[role])), toRgb(parseColor(surface))) >= 4.5);
    for (const role of ["primary", "action-accent", "ring", "chart-1", "primary-hover", "primary-top"]) {
      const original = parseColor(input),
        actual = parseColor(roles[role]);
      const rgb = toRgb(actual);
      assert(rgb.every((channel) => channel >= -0.000001 && channel <= 1.000001));
      const roundtrip = toLch(rgb);
      if (original[1] > 0.00001 && roundtrip[1] > 0.00001)
        assert(Math.min(Math.abs(original[2] - roundtrip[2]), 360 - Math.abs(original[2] - roundtrip[2])) <= 2);
    }
  }
  console.log(`PASS ${input}: light/dark contrast and hue`);
}
for (const color of ["#facc15", "#ffffff"]) assert.throws(() => derive(color, true), /--exact/);
const files = ["tenboards.config.ts", "src/styles/brand.css"];
const before = files.map((f) => readFileSync(f, "utf8"));
for (const input of ["blue-ish", "#12", "oklch(2 0 0)"]) {
  const result = spawnSync(process.execPath, ["--experimental-strip-types", "scripts/brand.ts", input], {
    encoding: "utf8",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Invalid colour/);
  assert.deepEqual(
    files.map((f) => readFileSync(f, "utf8")),
    before,
  );
}
console.log("PASS exact rejection and invalid input no-write checks");

// Exercise the actual CLI in an isolated copy so development servers stay unchanged.
const { mkdtempSync, mkdirSync, cpSync, writeFileSync, rmSync } = await import("node:fs");
const { tmpdir } = await import("node:os");
const { join } = await import("node:path");
const scratch = mkdtempSync(join(tmpdir(), "tenboards-brand-"));
try {
  for (const dir of ["scripts", "src/lib", "src/styles"]) mkdirSync(join(scratch, dir), { recursive: true });
  for (const file of ["scripts/brand.ts", "scripts/brand", "src/lib/tenboards-config.ts", "tenboards.config.ts"])
    cpSync(file, join(scratch, file), { recursive: true });
  writeFileSync(join(scratch, "package.json"), '{"type":"module"}');
  const run = (...args: string[]) =>
    spawnSync(process.execPath, ["--experimental-strip-types", "scripts/brand.ts", ...args], {
      cwd: scratch,
      encoding: "utf8",
    });
  assert.equal(run("--reset").status, 0);
  const unset = readFileSync(join(scratch, "src/styles/brand.css"), "utf8");
  assert.equal(run("#7c3aed").status, 0);
  assert.equal(run("--check").status, 0);
  writeFileSync(join(scratch, "src/styles/brand.css"), "/* hand edited */");
  assert.equal(run("--check").status, 1);
  assert.equal(run("--reset").status, 0);
  assert.equal(readFileSync(join(scratch, "src/styles/brand.css"), "utf8"), unset);
  assert.equal(run("#ffffff", "--exact").status, 1);
  assert.equal(readFileSync(join(scratch, "src/styles/brand.css"), "utf8"), unset);
  console.log("PASS CLI set/check/stale/reset/exact roundtrip");
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
