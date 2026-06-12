# Plan 010: Editorial-minimal redesign — Bricolage/Instrument/Plex type system, list-based layouts, rationed accent

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless your reviewer told you they maintain the index.
>
> **Drift check (run first)**: this plan was written at commit `0a6a93c` and
> REQUIRES plan 006 (MotionConfig refactor) to be DONE first — check
> `plans/README.md`. After 006, section components use `motion.*` directly with
> no `prefersReducedMotion` branching. Run
> `grep -rn "useReducedMotion" src/` → must return nothing before you start.

## Status

- **Priority**: P1 (operator-requested redesign)
- **Effort**: L
- **Risk**: MED — full visual overhaul; mitigated by screenshot gates and an unchanged color system
- **Depends on**: plans/006-motionconfig-reduced-motion.md (DONE required). Supersedes plan 007 (its fixes are folded into Step 6 here).
- **Category**: direction (design)
- **Planned at**: commit `0a6a93c`, 2026-06-12

## Why this matters

The owner reviewed the current design and judged it generic ("AI slop"):
card grids with hover borders, underlined tech tags that read as links, flat
hierarchy, a teal accent sprayed everywhere, and Geist — now a
second-generation default font. The agreed direction (operator-approved,
2026-06-12) is **editorial minimalism** in the register of emilkowal.ski /
Linear: typography and spacing do the work, decoration is removed, the accent
is rationed. The agreed type system is **Pair C**: Bricolage Grotesque
(display), Instrument Sans (body), IBM Plex Mono (technical labels) — all SIL
OFL, self-hosted at build time via `next/font/google`.

Design rules this plan implements (apply them when any detail is ambiguous):
1. **Remove, don't add** — no new decorative elements anywhere.
2. **Accent rationing** — teal appears ONLY in: section-number kickers, links
   (nav active state, Demo/GitHub/social/footer links, download links), and
   the hero accent line + greeting. Nothing else. Company names and tech tags
   lose their accent/teal colors.
3. **Mono = signal** — IBM Plex Mono only for: kicker numbers, dates, tech
   labels, link labels. Never for body copy.
4. **Color tokens are FROZEN** — `globals.css` color values passed WCAG AA in
   plan 002; do not change any `--color-*` value.

## Current state

All paths relative to repo root. After plan 006, every section component is a
plain `motion.*` tree (no reduced-motion branching).

- `src/app/layout.tsx:1-3` — fonts today:
  ```tsx
  import { GeistSans } from 'geist/font/sans';
  import { GeistMono } from 'geist/font/mono';
  ```
  applied at `<body className={`${GeistSans.variable} ${GeistMono.variable}`}>`.
- `src/app/globals.css:84-85` — font stacks consume the Geist variables:
  ```css
  --font-sans: var(--font-geist-sans), -apple-system, ...;
  --font-mono: var(--font-geist-mono), 'Fira Code', 'Consolas', monospace;
  ```
- `src/app/fonts/InterVariable.woff2` and `src/app/fonts/JetBrainsMono-Variable.woff2`
  — orphans from a pre-Geist design (verify with
  `grep -rn "InterVariable\|JetBrainsMono" src/ next.config.* 2>/dev/null` → expect no matches; if matches exist, STOP).
- `package.json` — `"geist": "^1.7.0"` dependency (to remove).
- `src/components/sections/Projects/Projects.module.css` — card grid: `.grid`
  (1/2/3 columns), `.card` (background, border, border-left accent on hover,
  `transform: scale(1.01)`), `.badge` (Coming Soon pill), `.tech` (mono with
  `border-bottom` — the "underlined tags" the owner flagged), `.link` (mono +
  arrow `::after`).
- `src/components/sections/Projects/Projects.tsx` — maps projects into cards;
  per project renders name, optional `status === 'coming-soon'` badge,
  description, technologies array as `.tech` spans, Demo/GitHub links.
- `src/components/sections/Experience/Experience.module.css` — `.timeline`
  (left border + 6px margin), `.dot` (absolute accent circles), `.company`
  (accent color), `.tech` (same underlined-tag recipe), `.dates` (mono muted).
- `src/components/sections/Experience/Experience.tsx` — exports `formatDate`
  (KEEP — it has tests) and maps jobs: jobHeader (title/company/dates/
  contractor), description, technologies spans.
- `src/components/sections/Hero/Hero.module.css` — `.hero` (`min-height: 100vh`,
  NO `position` property — bug: `.scrollDown` is `position:absolute` against
  the viewport, works only by coincidence), `.name` (`--text-hero` =
  `clamp(2.5rem, 8vw, 4.5rem)`).
- `src/components/sections/About/About.module.css:75-113` — `.downloadButton`:
  heavy 2px-bordered button with sliding-fill `::before`, in
  `--color-accent-warm`.
- `src/components/ui/SocialLinks/SocialLinks.module.css:20-24` — hover:
  `transform: rotate(-5deg) scale(1.15)` (gimmick — remove).
- `src/components/ui/ThemeToggle/ThemeToggle.module.css:16-20` — hover
  `rotate(15deg)` (borderline; KEEP — it's a control, not content).
- Section headings pattern (`About|Experience|Projects.module.css`): `.number`
  (mono accent) + `.heading` (`--text-3xl`). The pattern STAYS; only its
  typography changes (heading → display font).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Tests | `npm run test` | exit 0 |
| Build | `npm run build` | exit 0 |
| CF build gate | `npm run build:cloudflare` | exit 0 |
| Contrast audit | `npx -y lighthouse http://localhost:<PORT> --only-audits=color-contrast --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh.json && node -e "const r=require('/tmp/lh.json');console.log(r.audits['color-contrast'].score)"` | prints `1` (repeat with `--force-dark-mode` for dark theme) |

Port note: port 3000 is often occupied by another project — always read the
dev-server output for the actual port.

## Suggested executor toolkit

- chrome-devtools MCP for the screenshot gates (resize_page emulation may fail
  on a maximized window — take viewport screenshots at default size if so).
- The `frontend-design` skill, if available, for craft judgment within this
  spec — the spec wins on any conflict.

## Scope

**In scope** (the only files you may modify/create/delete):
- `src/app/layout.tsx` (font system swap)
- `src/app/globals.css` (font tokens, type scale — NOT color values)
- `src/app/fonts/InterVariable.woff2`, `src/app/fonts/JetBrainsMono-Variable.woff2` (delete after verifying orphaned)
- `package.json`, `package-lock.json` (remove `geist`)
- `src/components/sections/Projects/Projects.tsx` + `Projects.module.css`
- `src/components/sections/Experience/Experience.tsx` + `Experience.module.css`
- `src/components/sections/Hero/Hero.module.css`
- `src/components/sections/About/About.module.css`
- `src/components/ui/SocialLinks/SocialLinks.module.css`

**Out of scope** (do NOT touch):
- Any `--color-*` token VALUE in `globals.css` (WCAG-audited in plan 002).
- `src/lib/animations.ts`, `src/providers/ThemeProvider.tsx` (plan 006 owns them).
- `src/components/layout/Header/Header.tsx` logic (plans 003/004 landed there);
  `Header.module.css` only inherits the new `--font-sans` automatically — no edits.
- `Experience.tsx`'s `formatDate` function and its tests.
- `src/app/opengraph-image.tsx` — its hardcoded look is fine for now.
- `ThemeToggle` files.
- `src/data/resume.ts`, `src/types/resume.ts`.

## Git workflow

- Work on `master` directly (operator's standing instruction), conventional
  commits, NO push. Suggested: TWO commits —
  `feat(design): swap type system to Bricolage/Instrument/Plex via next/font`
  (steps 1–2) and
  `feat(design): editorial-minimal restyle of all sections` (steps 3–7).
- Stage only in-scope files, never `plans/`.

## Steps

### Step 1: Swap the font system

In `src/app/layout.tsx` replace the two geist imports with:

```tsx
import { Bricolage_Grotesque, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});
```

and the body: `<body className={`${display.variable} ${sans.variable} ${mono.variable}`}>`.

In `src/app/globals.css` (body block, lines ~84-85) replace the stacks and add
a display token:

```css
--font-sans: var(--font-instrument), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: var(--font-plex-mono), 'Fira Code', 'Consolas', monospace;
--font-display: var(--font-bricolage), var(--font-sans);
```

Note: `--font-display` is consumed by module CSS in later steps; headings
h1–h6 in globals.css get `font-family: var(--font-display);` added to the
existing rule. IMPORTANT: the `--font-*` custom properties from next/font are
set on `<body>` via the className, so `--font-display` must stay defined
inside the `body` block (as `--font-sans`/`--font-mono` already are), NOT in
`:root`.

Then remove the dependency: `npm uninstall geist`.

**Verify**: `grep -rn "geist" src/ package.json` → no matches (case-insensitive: `grep -rni geist src/ package.json`).
**Verify**: `npm run build` → exit 0 (next/font downloads and self-hosts at build).

### Step 2: Delete orphaned font files

**Verify FIRST**: `grep -rn "InterVariable\|JetBrainsMono" src/ *.config.* 2>/dev/null` → no matches. (If any: STOP.)
Delete `src/app/fonts/InterVariable.woff2` and `src/app/fonts/JetBrainsMono-Variable.woff2`.
If `src/app/fonts/` is now empty, remove the directory.

**Verify**: `npm run build` → exit 0.

### Step 3: Projects — cards become an editorial list

`Projects.tsx` — new per-project markup (keep the section/heading wrapper and
motion variants exactly as they are; `scaleIn` item variant is fine):

```tsx
<motion.article key={project.id} variants={scaleIn} className={styles.row}>
  <div className={styles.main}>
    <h3 className={styles.projectName}>
      {project.name}
      {project.status === 'coming-soon' && (
        <span className={styles.soon}>coming soon</span>
      )}
    </h3>
    <p className={styles.description}>{project.description}</p>
    <div className={styles.links}>
      {project.url && (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.link}
           aria-label={`View ${project.name} demo`}>
          Demo <span aria-hidden="true">→</span>
        </a>
      )}
      {project.githubUrl && (
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.link}
           aria-label={`View ${project.name} on GitHub`}>
          GitHub <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  </div>
  <p className={styles.tech}>{project.technologies.join(' · ')}</p>
</motion.article>
```

`Projects.module.css` — replace `.grid`, `.card`, `.cardHeader`, `.badge`,
`.technologies`, `.tech`, `.links`, `.link` with:

```css
.list { display: flex; flex-direction: column; }

.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-8);
  padding: var(--space-8) 0;
  border-top: 1px solid var(--color-border);
}

.main { max-width: 560px; }

.projectName {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--color-text-display);
}

.soon {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--color-text-muted);
  margin-left: var(--space-3);
}

.description {
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-top: var(--space-2);
}

.links { display: flex; gap: var(--space-6); margin-top: var(--space-3); }

.link {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-accent);
}

.link:hover { color: var(--color-accent-hover); }

.tech {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  white-space: nowrap;
  text-align: right;
}

@media (max-width: 640px) {
  .row { flex-direction: column; gap: var(--space-3); }
  .tech { text-align: left; white-space: normal; }
}
```

The grid wrapper div in the TSX becomes `className={styles.list}`. No card
background, no hover transform, no border-left, no underlined tags.

**Verify**: `npm run lint` → exit 0; `grep -n "card\|badge\|grid" src/components/sections/Projects/Projects.module.css` → no matches.

### Step 4: Experience — timeline becomes date-column rows

`Experience.tsx` — new per-job markup (keep section wrapper, heading group,
`fadeInUp` variants, and `formatDate` untouched):

```tsx
<motion.article key={job.id} variants={fadeInUp} className={styles.job}>
  <p className={styles.dates}>
    {formatDate(job.startDate)} — {formatDate(job.endDate)}
  </p>
  <div className={styles.jobContent}>
    <h3 className={styles.jobTitle}>
      {job.title} <span className={styles.company}>· {job.company}</span>
    </h3>
    {job.isContractor && job.contractorCompany && (
      <p className={styles.contractor}>via {job.contractorCompany}</p>
    )}
    <p className={styles.description}>{job.description}</p>
    <p className={styles.tech}>{job.technologies.join(' · ')}</p>
  </div>
</motion.article>
```

`Experience.module.css` — replace `.timeline`, `.job`, `.dot`, `.jobHeader`,
`.company`, `.dates`, `.technologies`, `.tech` with:

```css
.timeline { display: flex; flex-direction: column; }

.job {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-2) var(--space-8);
  padding: var(--space-8) 0;
  border-top: 1px solid var(--color-border);
}

@media (min-width: 768px) {
  .job { grid-template-columns: 180px 1fr; }
}

.dates {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.jobContent { min-width: 0; }

.jobTitle {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.4;
  overflow-wrap: break-word;
  color: var(--color-text-display);
}

.company { font-weight: 400; color: var(--color-text-secondary); }

.contractor {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-style: italic;
  margin-top: var(--space-1);
}

.description {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-top: var(--space-3);
}

.tech {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-top: var(--space-3);
}
```

Company loses its accent (design rule 2); dots and the vertical border are gone.

**Verify**: `npm run lint` → exit 0; `npm run test` → exit 0 (formatDate tests still pass); `grep -n "dot\b" src/components/sections/Experience/Experience.module.css` → no matches.

### Step 5: Headings, hero scale, About links, social hover

1. `globals.css`: in the existing `h1, h2, h3, h4, h5, h6` rule add
   `font-family: var(--font-display);` and change `--text-hero` to
   `clamp(3rem, 9vw, 5.5rem)` (bigger display presence for Bricolage).
2. Section heading modules (`About|Experience|Projects.module.css` `.heading`):
   add `letter-spacing: -0.02em;` (display font tightening). `.number` stays
   mono + accent (it's a sanctioned accent use).
3. `About.module.css`: replace the entire `.downloadButton` block (rules at
   ~75–113: base, `::before`, hover/focus pairs) with editorial mono links:

```css
.downloadButton {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-accent);
}

.downloadButton:hover { color: var(--color-accent-hover); }
```

   (The `FiDownload` icon in the TSX stays — it becomes the `↓` signal. The
   TSX is not edited in this step; only the CSS module. `--color-accent-warm`
   loses its last consumer — LEAVE the token in globals.css; plan 009 may use
   it, and globals.css color edits are out of scope.)
4. `SocialLinks.module.css` `.link:hover`: remove the
   `transform: rotate(-5deg) scale(1.15)` line; keep color + background change.
5. `Hero.module.css` (this folds in superseded plan 007):
   - Add `position: relative;` to `.hero`.
   - Replace `min-height: 100vh;` with the pair `min-height: 100vh;` +
     `min-height: 100svh;` (fallback order matters).
   - `.name`: add `font-family: var(--font-display);` (h1 already inherits it
     from globals, but the module is explicit elsewhere — keep consistent)
     and `letter-spacing: -0.03em;`.
   - `.title`: `font-weight: 400;` (Instrument Sans has no 300 by default in
     the loaded range — verify rendering; if 300 renders fine via variable
     font, keep 300).

**Verify**: `npm run lint` → exit 0; `npm run build` → exit 0.

### Step 6: Full verification battery

1. `npx tsc --noEmit` → exit 0. `npm run test` → exit 0.
2. `npm run build:cloudflare` → exit 0 (fonts + OpenNext gate).
3. Start dev server; Lighthouse contrast audit (command table) → `1` in light
   AND with `--force-dark-mode`. (Tech tags moved from `--color-accent-soft`
   to `--color-text-muted`, dates/company changed colors — this re-checks them.)
4. Screenshots (chrome-devtools MCP), both themes, full page, saved to
   `/tmp/redesign-light.png` and `/tmp/redesign-dark.png` — the reviewer and
   owner judge the craft from these.

**Verify**: all four recorded.

## Test plan

No component logic changed except markup structure; existing tests
(`formatDate`, SocialLinks, resume data, useFocusTrap) must pass unmodified —
if a test references removed CSS classes (none do at planning time), STOP.
The design gates are the Lighthouse audit + screenshots in step 6.

## Done criteria

- [ ] `grep -rni "geist" src/ package.json` → no matches
- [ ] `src/app/fonts/` no longer contains woff2 files
- [ ] `grep -n "border-bottom" src/components/sections/{Projects,Experience}/{Projects,Experience}.module.css` → no `.tech` underline rules remain (hairline `.row`/`.job` `border-top` is expected)
- [ ] `grep -n "scale(1.01)\|rotate(-5deg)" src/components -r` → no matches
- [ ] Lighthouse color-contrast = `1` in both themes
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build`, `npm run build:cloudflare` all exit 0
- [ ] Both screenshots exist and show: no cards in Projects, date-column Experience, Bricolage headings
- [ ] Only in-scope files modified (`git status`)
- [ ] `plans/README.md` status row updated (or reviewer notified)

## STOP conditions

Stop and report back (do not improvise) if:

- Plan 006 is not DONE, or `grep -rn "useReducedMotion" src/` returns matches.
- `next/font/google` errors on any of the three family names (API/name drift —
  report the exact error; do NOT substitute fonts).
- The orphan-check grep in step 2 finds references to the woff2 files.
- Lighthouse contrast fails after the restyle (a token consumer changed in a
  way plan 002 didn't cover — report which element; color-token edits are out
  of scope for you).
- `npm run build:cloudflare` fails after the font swap.
- Any existing test fails.

## Maintenance notes

- Plans 008 (Education) and 009 (LinkedIn CTA) were specced against the OLD
  visual system. After this lands they need a refresh pass before execution:
  008's entry styles should match the new Experience date-column recipe;
  009's `.contactButton` should clone the NEW `.downloadButton` (mono link),
  not the old bordered button. The reviewer handles this reconciliation.
- The OG image (`src/app/opengraph-image.tsx`) still renders the old
  hex-coded look with the default font — acceptable, but a follow-up could
  align it with Bricolage (satori needs a TTF/OTF/WOFF — NOT woff2 — loaded
  via fetch or file read).
- `--color-accent-warm` may end up with zero consumers after 009's refresh —
  candidate for token cleanup then, not now.
