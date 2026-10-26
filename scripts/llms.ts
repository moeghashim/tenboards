import { registrySchema } from "shadcn/schema";

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const check = process.argv.includes("--check");
const registry = registrySchema.parse(JSON.parse(await readFile("registry.json", "utf8")));
const docs = [
  "AGENTS.md",
  "DESIGN.md",
  "docs/data-layer.md",
  "docs/deploy.md",
  ".agents/skills/tenboards-build-ui/references/blocks.md",
];
const skills = [];
for (const name of (await readdir(".agents/skills")).sort()) {
  const file = `.agents/skills/${name}/SKILL.md`;
  const content = await readFile(file, "utf8");
  const description = content.match(/^description: (.+)$/m)?.[1];
  if (!description) throw new Error(`Missing skill description: ${file}`);
  skills.push({ name, file, description });
  docs.push(file);
}
const commands = JSON.parse(await readFile("package.json", "utf8")).scripts as Record<string, string>;
const generators = Object.keys(commands)
  .filter((name) => name.startsWith("new:"))
  .sort();
const docUrl = (file: string) => `/agent-docs/${file.replace(/^\.agents\//, "agents/")}`;
const intro = `# tenboards\n\n> A React 19, TanStack Start and Tailwind v4 admin template with reusable shadcn/Base UI blocks, typed demo/database reads and zero-config demo mode.\n\nGenerated from registry.json, source blocks, package scripts, adopter guidance and Agent Skills. Do not edit generated assets.\n\n## Install and build\n\nUse Node 22+ and npm. In this repository, import from @/components/blocks and use the generators. External React 19 + Tailwind v4 projects must initialize shadcn first, then run npx shadcn add <absolute-registry-url>. Items include their exact primitive/chart dependencies and the global default light/dark theme, typography, density, focus and motion rules. Review the CSS changes. Installed modules live in components/tenboards; table helpers live in lib/tenboards.\n\nURLs beginning with / are relative to the origin serving this file. Resolve them with new URL(path, llmsUrl).href before passing them to shadcn; for example, resolve /r/stat-card.json against the URL from which you fetched /llms.txt. The kit computes absolute commands from its current browser origin after hydration. No production hostname is baked into installs.\n\n## Blocks\n\n${registry.items.map((item) => `- [${item.title}](/r/${item.name}.json): ${item.description}`).join("\n")}\n\n## Generators\n\n${generators.map((name) => `- npm run ${name} <slug>: ${name === "new:dashboard" ? "Metrics and charts" : "Listing page"}; creates /dashboard/<slug>, navigation, guarded loader and typed illustrative demo/database reads.`).join("\n")}\n\n## Agent Skills\n\n${skills.map((skill) => `- [${skill.name}](${docUrl(skill.file)}): ${skill.description}`).join("\n")}\n\n## Documentation\n\n- [Live block kit](/dashboard/kit): examples, source and installation commands.\n${docs
  .filter((file) => !file.endsWith("SKILL.md"))
  .map((file) => `- [${file}](${docUrl(file)})`)
  .join(
    "\n",
  )}\n- [Expanded source and guidance](/llms-full.txt)\n\n## Verification\n\nRun npm run build, npm run check, npm run typecheck and npm run verify:page -- /dashboard/<slug>. Keep fixtures server-side and requireSession() inside each app-data server function. A configured failing database must show an error. Use seriesConfig and useChartMotion for charts and preserve accessible data alternatives.\n`;
const outputs = new Map<string, string>([["public/llms.txt", intro]]);
let full = intro;
for (const file of docs) {
  const content = await readFile(file, "utf8");
  outputs.set(`public${docUrl(file)}`, content);
  full += `\n## Source: ${file}\n\n${content}\n`;
}
for (const file of [...new Set(registry.items.flatMap((item) => item.files?.map((file) => file.path) ?? []))].sort()) {
  full += `\n## Source: ${file}\n\n\`\`\`tsx\n${await readFile(file, "utf8")}\n\`\`\`\n`;
}
outputs.set("public/llms-full.txt", full);
for (const [target, content] of outputs) {
  if (check) {
    if ((await readFile(target, "utf8").catch(() => "")) !== content)
      throw new Error(`Stale ${target}; run npm run llms:build`);
  } else {
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, content);
  }
}
console.log(`PASS llms ${check ? "freshness" : "build"}: ${outputs.size} source-derived assets`);
