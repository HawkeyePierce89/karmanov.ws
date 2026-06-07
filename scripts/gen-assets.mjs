/**
 * Generate raster brand assets (OG image + icons) from inline SVGs.
 *
 * Run locally (`node scripts/gen-assets.mjs`) and commit the PNGs in public/.
 * We rasterize on the dev machine rather than in CI so font rendering is
 * consistent; the committed PNGs are plain static assets at deploy time.
 *
 * Requires `sharp` (already a transitive dep via Astro).
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const pub = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

// --- Open Graph image (1200×630) ---------------------------------------
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="blob" cx="78%" cy="42%" r="55%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="#6d28d9" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#070709" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blob2" cx="92%" cy="78%" r="40%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#070709" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0.15" stop-color="#f4f4f6"/>
      <stop offset="0.7" stop-color="#c4b5fd"/>
      <stop offset="1" stop-color="#67e8f9"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#070709"/>
  <rect width="1200" height="630" fill="url(#blob)"/>
  <rect width="1200" height="630" fill="url(#blob2)"/>

  <text x="90" y="150" font-family="${FONT}" font-size="26" font-weight="700"
        letter-spacing="6" fill="#8a8a96">SENIOR FULL-STACK / TYPESCRIPT</text>

  <text x="84" y="320" font-family="${FONT}" font-size="150" font-weight="800"
        letter-spacing="-6" fill="url(#name)">Anton</text>
  <text x="84" y="450" font-family="${FONT}" font-size="150" font-weight="800"
        letter-spacing="-6" fill="url(#name)">Karmanov<tspan fill="#a855f7">.</tspan></text>

  <text x="90" y="540" font-family="${FONT}" font-size="30" font-weight="500"
        fill="#c7c7d1">Ex-EXANTE · FinTech · Next.js &amp; NestJS</text>

  <text x="1110" y="585" text-anchor="end" font-family="${FONT}" font-size="26"
        font-weight="700" letter-spacing="1" fill="#8a8a96">karmanov.ws</text>
</svg>`;

// --- Apple touch icon / PNG favicon (square monogram) ------------------
const icon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="a" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f4f4f6"/>
      <stop offset="0.6" stop-color="#a855f7"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#070709"/>
  <text x="32" y="47" text-anchor="middle" font-family="${FONT}" font-size="46"
        font-weight="800" fill="url(#a)">A</text>
  <circle cx="50" cy="44" r="3.2" fill="#a855f7"/>
</svg>`;

await sharp(Buffer.from(og)).png().toFile(pub("og.png"));
await sharp(Buffer.from(icon(180))).png().toFile(pub("apple-touch-icon.png"));
await sharp(Buffer.from(icon(32))).png().toFile(pub("favicon-32.png"));

console.log("✓ Generated public/og.png, apple-touch-icon.png, favicon-32.png");
