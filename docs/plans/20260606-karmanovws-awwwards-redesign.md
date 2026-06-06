# karmanov.ws Awwwards-style Redesign (Astro)

## Overview
Rebuild karmanov.ws as a single-page, dark, Awwwards-style personal site. Résumé content ships as clean static HTML (SEO), with an interactive 3D hero as a React island (react-three-fiber) over a CSS-gradient fallback, and a live GitHub-powered projects section. Deployed to GitHub Pages via Actions. All editable data lives in one typed `src/content/content.ts`; a pure, tested `src/lib/github.ts` powers the projects enhancement.

## Context
- Files involved (replaced): root `index.html`, `styles.css`, `CNAME`
- New app under `src/` (Astro islands), `public/`, `scripts/`, `.github/workflows/`
- Stack: Astro (static), @astrojs/react, react, react-dom, three, @react-three/fiber, @react-three/drei, lenis, @fontsource/inter; vitest + jsdom for tests
- Source-of-truth content provided verbatim in the spec (name, positioning, 4 experience entries, 5 curated projects, contacts). Telegram handle: `@HawkeyePierce89`
- Design taste on record: dark, big type, 3D, anti-minimalist — matches this brief

## Development Approach
- **Testing approach**: TDD for the two pure logic modules (`content.ts`, `github.ts`); component/markup tasks verified via build + SEO grep assertions
- Each `.astro` section is presentational, driven entirely by `content.ts` — content edits never touch markup
- Complete each task fully (build green) before the next
- CRITICAL: every code task includes new/updated tests or an automatable build/grep assertion
- CRITICAL: all tests must pass before starting the next task
- Manual browser checks (3D render, smooth scroll, Lighthouse) and the one-time GitHub Pages UI switch are in Post-Completion (cannot be automated by the agent)

## Implementation Steps

### Task 1: Scaffold Astro + React + TS project

**Files:** Delete `index.html`, `styles.css` (root); Create `package.json`, `astro.config.mjs`, `tsconfig.json`, `public/CNAME`, `public/.nojekyll`, `src/pages/index.astro` (placeholder), `src/styles/global.css` (placeholder), `src/test/setup.ts`, `vitest.config.ts`; update `.gitignore`

- [x] Remove legacy `index.html`, `styles.css`, and root `CNAME` (replaced by `public/CNAME`)
- [x] Init `package.json` (type=module, scripts: dev/build/preview/check/test/test:watch); install runtime + dev deps per spec
- [x] Write `tsconfig.json` (extends astro/tsconfigs/strict, react-jsx, vitest globals)
- [x] Write `astro.config.mjs` (site `https://karmanov.ws`, output static, react integration)
- [x] Write `public/CNAME` (`karmanov.ws`), `public/.nojekyll` (empty)
- [x] Write placeholder `src/styles/global.css`, `src/pages/index.astro`
- [x] Write `src/test/setup.ts` (localStorage.clear in beforeEach), `vitest.config.ts` (getViteConfig, jsdom, globals)
- [x] Append `node_modules/`, `dist/`, `.astro/` to `.gitignore` if absent
- [x] Run `npm run build` — `dist/index.html` and `dist/CNAME` exist
- [x] Run `npx vitest run` — exits 0 (no test files yet acceptable; `test` script uses `--passWithNoTests`)

### Task 2: Design tokens, base styles, fonts

**Files:** Modify `src/styles/global.css`

- [x] Replace with full token set: colors (`--bg #070709`, `--fg`, `--muted`, `--accent #a855f7`, `--accent-2 #22d3ee`), layout vars, grain, `.label`, `section`, `.reveal`, keyframes (blob-spin, marquee-slide), `prefers-reduced-motion` block; import Inter weights 400–900
- [x] Run `npm run build` — passes (confirms @fontsource/inter imports resolve)

### Task 3: Content config with types + test (TDD)

**Files:** Create `src/content/content.ts`, `src/content/content.test.ts`

- [x] Write failing test asserting: name, positioning, 4 experience entries newest-first (EXANTE first, Wow last), non-empty projects with repo/title, flags (available boolean, githubUser `HawkeyePierce89`)
- [x] Run test — fails (cannot resolve `./content`)
- [x] Write `content.ts` with `Content`/`ExperienceEntry`/`Project`/`SocialLink` types and the verbatim source-of-truth data; set Telegram social to `https://t.me/HawkeyePierce89`; flags `{ available:true, githubUser:'HawkeyePierce89', heroVariant:'blob' }`
- [x] Run test — passes

### Task 4: GitHub data layer with cache + fallback (TDD)

**Files:** Create `src/lib/github.ts`, `src/lib/github.test.ts`

- [ ] Write failing tests: field mapping + input-order preservation; localStorage cache reuse within TTL; refetch after TTL; omit on network failure with no cache; stale-on-error returns cached
- [ ] Run tests — fail
- [ ] Implement `RepoMeta`, `FetchOptions` (inject fetchImpl/now/ttlMs/storage/user), `fetchRepoMeta(names, options)` keyed `gh:<user>:<name>`, 24h TTL, stale-on-error
- [ ] Run tests — pass (5 tests)

### Task 5: Base layout (SEO head, grain, global scripts)

**Files:** Create `src/layouts/Base.astro`

- [ ] Write head (charset, viewport, description, canonical, OG/Twitter meta, title from content), grain div, `<slot/>`, and three reduced-motion-aware client scripts: IntersectionObserver reveal, Lenis smooth scroll (dynamic import), custom cursor (skip on touch)
- [ ] Run `npm run build` — passes (lenis dynamic import resolves)

### Task 6: Nav + Available badge

**Files:** Create `src/components/AvailableBadge.astro`, `src/components/Nav.astro`

- [ ] Write `AvailableBadge.astro` (green glass pill)
- [ ] Write sticky `Nav.astro` (logo, About/Experience/Projects anchors, badge gated on `content.flags.available`)
- [ ] Run `npm run build` — passes

### Task 7: 3D hero island (Blob + Canvas)

**Files:** Create `src/components/react/Blob.tsx`, `src/components/react/HeroCanvas.tsx`

- [ ] Write `Blob.tsx` (distorted sphere via MeshDistortMaterial, pointer-reactive rotation in useFrame)
- [ ] Write `HeroCanvas.tsx` (default export; R3F Canvas, lights, Float-wrapped Blob)
- [ ] Run `npm run build` — passes

### Task 8: Hero section (static overlay + island mount)

**Files:** Create `src/components/Hero.astro`; Modify `src/pages/index.astro` (temporary mount)

- [ ] Write `Hero.astro`: static overlay (positioning, name h1, subtitle, stack pills, badge) + CSS-gradient blob as `slot="fallback"` inside `<HeroCanvas client:only="react">`
- [ ] Mount Base+Nav+Hero in `index.astro` for smoke build
- [ ] Run `npm run build`; `grep -c "Karmanov" dist/index.html` ≥ 1 (proves hero text is static HTML)

### Task 9: About section

**Files:** Create `src/components/About.astro`

- [ ] Render label, lead statement, 14/7/4 stats, principle pills from content
- [ ] Run `npm run build` — passes

### Task 10: Stack marquee

**Files:** Create `src/components/Stack.astro`

- [ ] Render duplicated stack list with marquee-slide animation, alternating color
- [ ] Run `npm run build` — passes

### Task 11: Experience timeline

**Files:** Create `src/components/Experience.astro`

- [ ] Render the four roles (period / company / role / location / summary / bullets) from content
- [ ] Run `npm run build`; `grep -c "EXANTE" dist/index.html` ≥ 1

### Task 12: Projects section (static cards + live stars)

**Files:** Create `src/components/Projects.astro`

- [ ] Render static cards (title, blurb, GitHub/href link, `data-repo`, empty `data-stars`/`data-lang`)
- [ ] Add component `<script>` importing `fetchRepoMeta` to populate stars/language progressively
- [ ] Run `npm run build`; `grep -c "its.events" dist/index.html` ≥ 1

### Task 13: Contact + Footer

**Files:** Create `src/components/Contact.astro`, `src/components/Footer.astro`

- [ ] Write Contact (gradient-clipped CTA, mailto, social links from content)
- [ ] Write Footer ("Europe · Remote", © 2026 Anton Karmanov)
- [ ] Run `npm run build` — passes

### Task 14: Assemble full page

**Files:** Modify `src/pages/index.astro`

- [ ] Import and order all sections: Nav → Hero → About → Stack → Experience → Projects → Contact → Footer
- [ ] Run `npx vitest run` — all green
- [ ] Run `npm run check` — 0 errors
- [ ] Run `npm run build` — passes

### Task 15: Mobile 3D gating + SEO check script

**Files:** Modify `src/components/Hero.astro`, `package.json`; Create `scripts/check-seo.mjs`

- [ ] Gate the island with `client:media="(min-width: 768px) and (pointer: fine)"` so three.js never loads on phones/touch (CSS fallback remains)
- [ ] Write `scripts/check-seo.mjs` asserting `Anton Karmanov`, `EXANTE`, `Admitad`, `its.events`, `Senior Full-Stack` in `dist/index.html`
- [ ] Add `check:seo` npm script
- [ ] Run `npm run build && npm run check:seo` — passes

### Task 16: GitHub Pages deployment workflow

**Files:** Create `.github/workflows/deploy.yml`

- [ ] Write workflow (push to master + workflow_dispatch; pages permissions; build job runs test/build/check:seo then upload-pages-artifact; deploy job)
- [ ] Run `npm run build` then verify `dist/CNAME` contains `karmanov.ws`

### Task 17: Verify acceptance criteria

**Files:** as needed across `src/`

- [ ] Run full suite: `npx vitest run && npm run check && npm run build && npm run check:seo` — all pass
- [ ] Confirm reduced-motion CSS block and `client:media` gating are present (static review)
- [ ] Commit any polish changes

### Task 18: Update documentation

- [ ] Add a brief README.md (dev/build/test commands, content.ts as edit point, deploy notes)
- [ ] Note the one-time GitHub Pages Source → "GitHub Actions" switch for the handoff

## Post-Completion (manual — not agent-automatable)
- Browser smoke test (`npm run dev`): hero CSS blob → 3D mount on desktop; smooth scroll; reveals; custom cursor; no console errors
- Reduced-motion OS check: no Lenis/cursor/reveal, CSS blob only
- Narrow-viewport (375px) check: no three.js network request, no horizontal scroll
- Lighthouse on `npm run preview`: Performance ≥ 90, Accessibility ≥ 95, SEO = 100
- GitHub repo → Settings → Pages → Source: switch to "GitHub Actions" (one-time)
