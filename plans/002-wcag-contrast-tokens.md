# Plan 002: Fix WCAG AA contrast failures in muted text and warm-accent CTA tokens

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat ab2e8eb..HEAD -- src/app/globals.css`
> If the file changed since this plan was written, compare the "Current state"
> excerpts against the live code before proceeding; on a mismatch, treat it as
> a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW (token-value-only change; no selectors or markup touched)
- **Depends on**: none
- **Category**: bug (accessibility)
- **Planned at**: commit `ab2e8eb`, 2026-06-12

## Why this matters

`--color-text-muted` in light mode is `oklch(0.7 0.012 175)` on a near-white
background (`oklch(0.995 0.002 175)`) — roughly **2.8:1**, far below the WCAG AA
minimum of 4.5:1 for normal-size text. This token styles content a recruiter
actually reads: the **dates on every experience entry** (`Experience.module.css`
`.dates`, rendered at `--text-sm` weight 300), the "via Globant" contractor lines,
the hero location, the badge text, and the footer copyright (at `--text-xs`
weight 300 — the worst combination). Dark mode muted (`oklch(0.55 ...)` on
`oklch(0.14 ...)`) fails too (~3.8:1). Separately, the PDF/DOCX download CTAs use
`--color-accent-warm` `oklch(0.65 0.17 75)` at `--text-sm`, also below 4.5:1 on
the `--color-background-alt` section background. The site's own CLAUDE.md states
"Accessible by default — WCAG AA" as a design principle; this is the gap.

## Current state

- `src/app/globals.css` — single source of all color tokens. Light mode block:

```css
/* src/app/globals.css:2-16 (excerpt) */
:root {
  --color-background: oklch(0.995 0.002 175);
  --color-background-alt: oklch(0.975 0.006 175);
  --color-text-primary: oklch(0.25 0.012 175);
  --color-text-secondary: oklch(0.55 0.015 175);
  --color-text-muted: oklch(0.7 0.012 175);
  ...
  --color-accent-warm: oklch(0.65 0.17 75);
```

Dark mode block:

```css
/* src/app/globals.css:58-71 (excerpt) */
[data-theme='dark'] {
  --color-background: oklch(0.14 0.012 175);
  --color-background-alt: oklch(0.21 0.015 175);
  ...
  --color-text-secondary: oklch(0.7 0.012 175);
  --color-text-muted: oklch(0.55 0.012 175);
  ...
  --color-accent-warm: oklch(0.80 0.15 85);
```

- Consumers of `--color-text-muted` (do NOT edit these files; listed so you can
  spot-check visually): `Experience.module.css:77-89` (`.dates`, `.contractor`),
  `Hero.module.css:62-66` (`.location`), `Footer.module.css:16-20` (`.copyright`),
  `Projects.module.css:83-92` (`.badge`), `About.module.css:47-68` (`.info h3`,
  `.downloadSection h3`).
- Consumer of `--color-accent-warm`: `About.module.css:75-92` (`.downloadButton`,
  text + 2px border on the `--color-background-alt` section).
- Visual hierarchy intent: `muted` must remain perceptibly lighter than
  `secondary`, which must remain lighter than `primary`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm install` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm run test` | exit 0 |
| Dev server | `npm run dev` | serves on http://localhost:3000 |
| Contrast audit | `npx -y lighthouse http://localhost:3000 --only-audits=color-contrast --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh.json && node -e "const r=require('/tmp/lh.json');console.log(r.audits['color-contrast'].score)"` | prints `1` |

## Scope

**In scope** (the only file you should modify):
- `src/app/globals.css` — token VALUES only, inside `:root` and `[data-theme='dark']`.

**Out of scope** (do NOT touch):
- Every `*.module.css` — consumers must keep referencing the same token names.
- `--color-text-secondary` in dark mode and `--color-accent-warm` in dark mode —
  measure them in step 1; only adjust if the audit flags them.
- Token names, selectors, or any non-color declaration.

## Git workflow

- Branch: `advisor/002-wcag-contrast`
- Suggested commit: `fix(a11y): raise muted and warm-accent tokens to WCAG AA contrast`
  (matches repo style, cf. `8d87c3c fix(a11y): harden UI resilience ...`)
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Capture the failing baseline

Start `npm run dev`. Run the contrast audit command from the table above.

**Verify**: the score prints a value **less than 1** and
`node -e "const r=require('/tmp/lh.json');r.audits['color-contrast'].details.items.forEach(i=>console.log(i.node?.snippet))"`
lists elements styled by muted/warm tokens (dates, copyright, download buttons).
If the baseline already prints `1`, STOP — the premise is wrong (tokens already
fixed or Lighthouse sampling changed); report instead of changing values.

### Step 2: Darken light-mode tokens

In the `:root` block change ONLY:

```css
--color-text-muted: oklch(0.55 0.012 175);   /* was 0.7  — target ≥4.5:1 on 0.995 bg */
--color-text-secondary: oklch(0.48 0.015 175); /* was 0.55 — keeps one visible step below muted */
--color-accent-warm: oklch(0.53 0.14 75);    /* was 0.65 0.17 — target ≥4.5:1 on 0.975 alt bg */
```

These are starting values, not gospel: if the audit in step 4 still flags one of
them, lower its L in steps of 0.02 (keep hue and chroma) until it passes.
Preserve ordering: muted L > secondary L > primary L (0.25).

**Verify**: `npm run lint` → exit 0.

### Step 3: Lighten dark-mode muted token

In the `[data-theme='dark']` block change ONLY:

```css
--color-text-muted: oklch(0.65 0.012 175);   /* was 0.55 — target ≥4.5:1 on 0.14 bg */
```

Keep it below dark `secondary` (0.7). If the audit later flags dark `secondary`
or dark `accent-warm`, raise L in steps of 0.02 and re-run.

**Verify**: `npm run lint` → exit 0.

### Step 4: Re-run the audit, both themes

Light mode: re-run the contrast audit command → prints `1`.

Dark mode: Lighthouse renders the default theme. The site uses
`next-themes` with `defaultTheme="system"` (`src/providers/ThemeProvider.tsx`),
so force dark by emulating: add `--emulated-form-factor=desktop` is not enough —
instead verify dark mode manually or via a headless check that sets the theme:

```bash
npx -y lighthouse http://localhost:3000 --only-audits=color-contrast \
  --chrome-flags="--headless=new --force-dark-mode" \
  --output=json --output-path=/tmp/lh-dark.json && \
  node -e "const r=require('/tmp/lh-dark.json');console.log(r.audits['color-contrast'].score)"
```

(`--force-dark-mode` makes `prefers-color-scheme: dark` match, which next-themes'
`system` default follows.)

**Verify**: both audits print `1`.

### Step 5: Visual hierarchy spot-check

Open http://localhost:3000 in both themes and confirm muted text (dates,
location, copyright) still reads as *de-emphasized* relative to body text —
distinct, not identical. This is the one judgment call in the plan; if muted and
secondary have become visually indistinguishable, increase the gap (darken
secondary further in light mode / raise secondary in dark mode is OUT of scope
for dark — in that case STOP and report the conflict).

## Test plan

No component logic changes — no new unit tests. The Lighthouse color-contrast
audit (steps 1 and 4) is the regression gate: baseline `<1`, post-change `1`
in both themes. Run `npm run test` to confirm the existing suite still passes.

## Done criteria

- [ ] Lighthouse `color-contrast` score is `1` in light mode
- [ ] Lighthouse `color-contrast` score is `1` with `--force-dark-mode`
- [ ] `npm run lint` exits 0
- [ ] `npm run test` exits 0
- [ ] `git diff --stat` shows ONLY `src/app/globals.css` modified, and the diff
      touches only the token values named in steps 2–3 (plus any L-step
      adjustments from step 4)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The baseline audit in step 1 already scores `1`.
- After 3 L-adjustment iterations a token still fails the audit (suggests the
  audit is flagging something other than these tokens — report the flagged
  snippets).
- Passing the audit requires making muted visually identical to secondary
  (hierarchy conflict — needs a design decision, e.g. differentiating by
  weight instead of color).
- `npx lighthouse` cannot run (no Chrome available) — report; do not substitute
  eyeball judgment for the gate.

## Maintenance notes

- Any future token change in `globals.css` should re-run the Lighthouse
  color-contrast audit in both themes; consider wiring it into CI later
  (deferred — out of scope here).
- Plan 009 (LinkedIn CTA) reuses the `.downloadButton` pattern; it inherits
  whatever `--color-accent-warm` value lands here.
- The OG image (plan 001) hardcodes hex approximations of these tokens; if you
  changed dark-mode values, that's fine (001 uses dark background + light text,
  both untouched here), but flag it in review if dark `secondary` moved.
