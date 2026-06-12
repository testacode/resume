# Plan 007: Anchor the hero scroll-down arrow to its section and stabilize the hero height on mobile

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat ab2e8eb..HEAD -- src/components/sections/Hero/Hero.module.css`
> If the file changed since this plan was written, compare the "Current state"
> excerpt against the live code before proceeding; on a mismatch, treat it as
> a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug (CSS)
- **Planned at**: commit `ab2e8eb`, 2026-06-12

## Why this matters

The hero's scroll-down arrow (`.scrollDown`) is `position: absolute` with
`bottom: var(--space-8)`, but **no ancestor establishes a positioning context** —
`.hero` has no `position` set, and neither does anything above it. The arrow is
therefore positioned against the initial containing block (a viewport-sized box
at the top of the document). It *looks* right today only because the hero is the
first section and is `min-height: 100vh` — pure coincidence. The moment the hero
content exceeds one viewport (small phones, large text-zoom, longer tagline),
the arrow detaches from the hero's bottom and floats mid-content.

Related, same file: `min-height: 100vh` on mobile means the hero is measured
against the *largest* viewport (URL bar collapsed), so on initial load (URL bar
visible) the hero overflows and the arrow sits below the fold; as the bar
collapses the layout shifts. The modern unit for a stable full-screen hero is
`svh` (smallest viewport height), with a `vh` fallback line for older browsers.

## Current state

- `src/components/sections/Hero/Hero.module.css`:

```css
/* Hero.module.css:1-8 — no position property */
.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding: var(--header-height) var(--space-6) var(--space-16);
  text-align: center;
}
```

```css
/* Hero.module.css:68-79 — absolute with no positioned ancestor */
.scrollDown {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  ...
}
```

- `src/components/sections/Hero/Hero.tsx:23` — `<section id="home" className={styles.hero}>`
  wraps both `.content` and the `.scrollDown` anchor; once `.hero` is
  `position: relative`, the arrow anchors to the section, which is the intent.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm install` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm run test` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope** (the only file you should modify):
- `src/components/sections/Hero/Hero.module.css`

**Out of scope** (do NOT touch):
- `src/components/sections/Hero/Hero.tsx` — markup is correct.
- Other sections' `min-height`s — only the hero is full-screen.
- The `pulse` animation and its reduced-motion override (lines 85–88, 110–114).

## Git workflow

- Branch: `advisor/007-hero-position`
- Suggested commit: `fix(hero): anchor scroll arrow to section and use svh for stable height`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Establish the positioning context and stabilize the height

In `.hero` (Hero.module.css:1-8), add `position: relative;` and replace the
single `min-height` line with the fallback pair:

```css
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;   /* fallback for browsers without svh */
  min-height: 100svh;
  padding: var(--header-height) var(--space-6) var(--space-16);
  text-align: center;
}
```

(Repeated-property fallback is the standard pattern: browsers that understand
`svh` use the second declaration; older ones keep `100vh`. Keep both lines in
this order.)

**Verify**: `npm run lint` → exit 0; `npm run build` → exit 0.

### Step 2: Visual check

`npm run dev`, open http://localhost:3000:

1. Desktop: arrow sits near the bottom of the hero, as before (no regression).
2. Narrow/mobile viewport (DevTools device emulation, e.g. iPhone SE 375×667):
   the arrow is visible at the bottom of the first screen without scrolling.
3. Zoom test (desktop, Cmd/Ctrl + to 200%): hero grows beyond one viewport —
   the arrow must now stick to the hero's bottom edge (scrolls with the
   section), NOT hover over mid-hero content. This is the bug being fixed.

**Verify**: all three observations recorded.

## Test plan

Pure CSS positioning — no unit tests apply (jsdom does no layout). The
three-point visual check in step 2 is the gate; lint/test/build confirm no
collateral damage. Run `npm run test` → all pass.

## Done criteria

- [ ] `grep -n "position: relative" src/components/sections/Hero/Hero.module.css` → 1 match inside `.hero`
- [ ] `grep -c "min-height" src/components/sections/Hero/Hero.module.css` → `2` (vh fallback + svh)
- [ ] Step 2 observations recorded (desktop, mobile emulation, 200% zoom)
- [ ] `npm run lint`, `npm run test`, `npm run build` all exit 0
- [ ] Only `src/components/sections/Hero/Hero.module.css` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `.hero` already has a `position` property (drift — re-evaluate whether the
  bug still exists before changing anything).
- After step 1 the arrow overlaps the hero's text content on iPhone-SE-sized
  emulation (would mean the hero content + bottom padding leaves no room; the
  fix would be spacing changes that need a design decision).

## Maintenance notes

- Anything later added to the hero as `position: absolute` (decorative
  elements, backgrounds) now anchors to the section — that's the new, correct
  context.
- If a visual diff/screenshot tool enters CI someday, the 200%-zoom case from
  step 2 is the regression worth pinning.
