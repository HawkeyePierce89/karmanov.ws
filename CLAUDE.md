# CLAUDE.md

Guidance for AI agents working in this repo. See `README.md` for the human-facing overview.

## What this is

A single-page, dark, Awwwards-style personal site for Anton Karmanov. **Astro** (static output) with **React islands**. Résumé content ships as clean static HTML for SEO; the hero adds an interactive 3D blob (`@react-three/fiber` + `drei`) over a CSS-gradient fallback; the projects section is progressively enhanced with live GitHub data.

## Commands

```bash
npm run dev        # dev server with HMR
npm run build      # static build to dist/
npm run preview    # serve the production build
npm run check      # astro check (type + template diagnostics)
npm test           # vitest suite (pure src/lib/ + content.ts logic only)
npm run check:seo  # post-build SEO assertion — must run AFTER `npm run build`
```

## Core conventions

- **Single source of truth for copy: `src/content/content.ts`.** All text, experience entries, projects, contacts, and feature flags (`available`, `githubUser`, `heroVariant`) live there. Every `.astro` section is purely presentational and reads from this file — never hardcode copy into markup.
- **SEO guard:** `content.positioning` must start with `"Senior Full-Stack"`. `scripts/check-seo.mjs` greps the built `dist/index.html` for `Anton Karmanov`, `EXANTE`, `Admitad`, `its.events`, and `Senior Full-Stack`; if any is missing the build fails. This guards against a section accidentally becoming a client-only island and vanishing from server-rendered HTML.
- **Testing scope:** only the pure logic modules in `src/lib/` (and `content.ts`) are unit-tested with Vitest — currently `lib/github.ts`, `lib/shapes.ts`, `lib/lighting.ts`, `lib/spin.ts`, and `content.ts`. Component/markup correctness is verified via `npm run build` + `npm run check:seo`, not Vitest.

## Non-obvious gotchas

- **`vitest.config.ts` deliberately uses plain `defineConfig` from `vitest/config`, NOT Astro's `getViteConfig`.** `getViteConfig` fails to load in this environment with `"Unknown Error: [object Object]"`. Don't "upgrade" it back — there are no `.astro` tests that would need it.
- **3D gating:** `<HeroCanvas>` mounts with `client:media="(min-width: 768px) and (pointer: fine)"`, so three.js is never fetched on phones/touch devices. The CSS-gradient `.hero__blob` always renders underneath as the fallback. The `HeroCanvas` chunk is large (~800 kB) and triggers Vite's >500 kB warning — that is expected; it is lazy and media-gated, so it does not affect the static page or mobile.
- **Random hero geometry (`lib/shapes.ts`):** the hero crystal's geometry is picked at random on each mount, so every page load shows a different faceted shape. `lib/shapes.ts` is a pure, dependency-injected module — `pickShape(rng = Math.random)` returns one of the 5 `SHAPES` entries (`{ type, args }`), making selection unit-testable without R3F/three. `Crystal.tsx` consumes it via `React.createElement(shape.type, { args: shape.args })`, which lets R3F resolve the intrinsic three geometry by tag name without a switch in JSX. The material (`MeshTransmissionMaterial`) and `useFrame` rotation are unaffected.
- **Drag-to-spin hero (`lib/spin.ts` + `Crystal.tsx` + `HeroCanvas.tsx`):** the crystal is a flywheel — grab it with the mouse to spin any direction; a quick flick-release throws it so it keeps spinning by inertia and decays to a stop. A light idle auto-spin runs only until the first pointer-down (`hasInteracted`), so the gem is never static on load but never auto-rotates after you've touched it. The frame-rate-independent friction step lives in the pure DI module `lib/spin.ts` (`applyFriction(vel, friction, dt)` raises the per-frame `≈0.94` factor to `dt*60` so the decay feels identical at 30/60/144Hz; per-axis magnitudes below `SPIN_EPSILON` snap to 0) — unit-tested without R3F/three. `Crystal.tsx` drives rotation from R3F pointer handlers (`setPointerCapture`, `grab`/`grabbing` cursors) and applies `applyFriction` each `useFrame` while not dragging. **`<Float rotationIntensity>` in `HeroCanvas.tsx` is intentionally `0`** so drei's auto-rotation does not fight manual rotation; `speed`/`floatIntensity` are kept for a gentle bob.
- **Reduced motion:** the global scripts in `Base.astro` (scroll reveal, Lenis smooth scroll, custom cursor) all bail out under `prefers-reduced-motion` or touch. Preserve these guards when editing.
- **GitHub layer (`lib/github.ts`):** pure and fully dependency-injected (`fetchImpl`, `now`, `ttlMs`, `storage`, `user`) so it is testable without network or globals. Results cache in `localStorage` under `gh:<user>:<name>` (24h TTL) with stale-on-error fallback; corrupt/legacy cache entries are validated away in `readCache`. Failed repos are omitted so the static card still renders.

## Deployment

GitHub Pages via `.github/workflows/deploy.yml` on push to `master` (or manual `workflow_dispatch`): runs test → build → check:seo, then publishes `dist/`. Custom domain via `public/CNAME`; `public/.nojekyll` disables Jekyll. One-time manual step: repo **Settings → Pages → Source → "GitHub Actions"**.
