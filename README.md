# karmanov.ws

Single-page, dark, Awwwards-style personal site for Anton Karmanov. Built with
[Astro](https://astro.build/) (static output) and React islands. Résumé content
ships as clean static HTML for SEO; the hero adds an interactive 3D blob
(react-three-fiber) over a CSS-gradient fallback, and the projects section is
enhanced live from the GitHub API.

## Commands

```bash
npm install        # install dependencies
npm run dev        # local dev server with HMR
npm run build      # static build to dist/
npm run preview    # serve the production build locally
npm run check      # astro check (type + template diagnostics)
npm test           # run the vitest suite (content + github + shapes logic)
npm run check:seo  # assert key résumé strings are present in dist/index.html
```

## Editing content

All editable data lives in one typed file: **`src/content/content.ts`**.

Name, positioning, experience entries, projects, contacts, and feature flags
(`available`, `githubUser`, `heroVariant`) are defined there. Every `.astro`
section is purely presentational and reads from this file, so content edits
never touch markup. Update `content.ts`, run `npm run build`, and the page
reflects the change.

## Project layout

```
src/
  content/content.ts   # single source of truth for all copy + flags
  lib/github.ts        # pure, tested GitHub fetch + cache + fallback layer
  lib/shapes.ts        # pure, tested random hero-geometry picker
  layouts/Base.astro   # SEO head, grain, reduced-motion-aware global scripts
  components/           # presentational .astro sections
  components/react/     # 3D hero island (Crystal, HeroCanvas)
  styles/global.css     # design tokens, base styles, fonts
scripts/check-seo.mjs   # post-build SEO assertion
```

## Deployment

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `master`
(or manual `workflow_dispatch`). The workflow runs the test suite, build, and
SEO check, then publishes `dist/`. The custom domain is set via
`public/CNAME` (`karmanov.ws`), and `public/.nojekyll` disables Jekyll
processing.

**One-time setup (handoff):** in the GitHub repo, go to
**Settings → Pages → Source** and switch it to **"GitHub Actions"**. This only
needs to be done once; after that every push to `master` deploys automatically.
