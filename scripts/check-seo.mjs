/**
 * SEO smoke check: assert that key résumé content survives as static HTML in
 * the built `dist/index.html`. Guards against regressions where a section is
 * accidentally turned into a client-only island and disappears from the
 * server-rendered markup (hurting SEO and no-JS readers).
 *
 * Run after `npm run build`. Exits non-zero (failing CI) if any term is missing.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const distFile = fileURLToPath(new URL("../dist/index.html", import.meta.url));

const REQUIRED = [
  "Anton Karmanov",
  "EXANTE",
  "Admitad",
  "Loymax",
  "NestJS",
  "Senior Full-Stack",
];

let html;
try {
  html = await readFile(distFile, "utf8");
} catch {
  console.error(`✗ SEO check: ${distFile} not found — run \`npm run build\` first.`);
  process.exit(1);
}

const missing = REQUIRED.filter((term) => !html.includes(term));

if (missing.length > 0) {
  console.error("✗ SEO check failed — missing from dist/index.html:");
  for (const term of missing) console.error(`  - ${term}`);
  process.exit(1);
}

console.log(`✓ SEO check passed — all ${REQUIRED.length} required terms present.`);
