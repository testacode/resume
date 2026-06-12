# Plan 006: Replace the per-component reduced-motion branching with MotionConfig

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat ab2e8eb..HEAD -- src/components/sections src/providers/ThemeProvider.tsx src/hooks/useReducedMotion.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED — intentionally changes what reduced-motion users see (opacity
  fades remain, positional movement goes away); requires visual verification
- **Depends on**: none (execute before 008 and 009, which build on the simplified pattern)
- **Category**: tech-debt (accessibility-adjacent)
- **Planned at**: commit `ab2e8eb`, 2026-06-12

## Why this matters

All four section components hand-roll the same reduced-motion fallback: read a
custom `useReducedMotion` hook, conditionally swap `motion.section`/`motion.div`
for plain elements, and conditionally spread animation props (~15 lines of
boilerplate per component, 4×). The Motion library solves this in one line:
`<MotionConfig reducedMotion="user">` makes every descendant `motion.*`
component automatically drop transform/layout animations while keeping opacity
fades when the OS requests reduced motion.

Three concrete wins:

1. **~60 lines of duplicated branching deleted**; new sections (plan 008) write
   plain `motion.*` code with no ceremony.
2. **Better reduced-motion UX**: today the custom branching kills *all*
   animation, including harmless opacity fades; `reducedMotion="user"` keeps
   fades (the WCAG concern is motion, not opacity). This semantic change is
   deliberate and operator-approved.
3. **Removes a hydration hazard**: the custom hook's `getServerSnapshot()`
   returns `false`, so the server always renders the animated variant; a
   reduced-motion client then renders the plain-element variant on hydration,
   mismatching props. MotionConfig keeps the tree identical on both sides.

## Current state

The same pattern appears in four components; `About.tsx` shown in full,
the others vary only in variants used:

```tsx
// src/components/sections/About/About.tsx:14-31 (Hero.tsx:16-20, Experience.tsx:22-37, Projects.tsx:14-29 are analogous)
export function About({ data }: Props) {
  const prefersReducedMotion = useReducedMotion();
  ...
  const MS = prefersReducedMotion ? 'section' : motion.section;
  const M = prefersReducedMotion ? 'div' : motion.div;

  const sectionProps = prefersReducedMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-100px' },
        variants: staggerContainer,
      };

  const itemProps = prefersReducedMotion ? {} : { variants: fadeInUp };
  const headingProps = prefersReducedMotion ? {} : { variants: fadeInLeft };
```

`Hero.tsx` uses inline ternaries instead (`Hero.tsx:19-57`):

```tsx
const M = prefersReducedMotion ? 'div' : motion.div;
const noMotion = prefersReducedMotion;
...
<M {...(noMotion ? {} : { initial: 'hidden', animate: 'visible', variants: heroItem(0.1) })}>
```

- `src/hooks/useReducedMotion.ts` — custom `useSyncExternalStore` hook; its ONLY
  consumers are these four components (verify with
  `grep -rln "useReducedMotion" src/` → the hook file + 4 section components).
- `src/providers/ThemeProvider.tsx` — existing client-side provider wrapper,
  the natural place to add `MotionConfig`:

```tsx
// src/providers/ThemeProvider.tsx (entire current body)
'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
...
export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem={true} disableTransitionOnChange={false}>
      {children}
    </NextThemesProvider>
  );
}
```

- `src/lib/animations.ts` — variants (`fadeInUp`, `fadeInLeft`, `scaleIn`,
  `heroName`, `heroItem`, `staggerContainer`). Untouched by this plan.
- CSS-side reduced-motion handling (`globals.css:161-168` global kill switch for
  CSS animations, `Hero.module.css:110-114` disables the scroll-arrow pulse) is
  separate and stays.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm install` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm run test` | exit 0 |
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Build | `npm run build` | exit 0 |

## Suggested executor toolkit

- If the `emilkowal-animations` or `ui-animation` skill is available in your
  environment, you may consult it for `MotionConfig` semantics — but the steps
  below are self-sufficient.

## Scope

**In scope** (the only files you should modify/delete):
- `src/providers/ThemeProvider.tsx`
- `src/components/sections/Hero/Hero.tsx`
- `src/components/sections/About/About.tsx`
- `src/components/sections/Experience/Experience.tsx`
- `src/components/sections/Projects/Projects.tsx`
- `src/hooks/useReducedMotion.ts` (delete — orphaned by this change)

**Out of scope** (do NOT touch):
- `src/lib/animations.ts` — variants are shared and correct.
- `src/hooks/useFocusTrap.ts` and its test — unrelated hook.
- All `*.module.css` files — CSS reduced-motion handling stays as is.
- `src/components/layout/Header/Header.tsx` — uses no motion.

## Git workflow

- Branch: `advisor/006-motionconfig`
- Suggested commit: `refactor(a11y): centralize reduced-motion handling via MotionConfig`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add MotionConfig at the provider level

In `src/providers/ThemeProvider.tsx`, import `MotionConfig` from
`'motion/react'` and wrap the children:

```tsx
<NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem={true} disableTransitionOnChange={false}>
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
</NextThemesProvider>
```

**Verify**: `npx tsc --noEmit` → exit 0.

### Step 2: Simplify the three scroll-reveal sections

In `About.tsx`, `Experience.tsx`, `Projects.tsx` (one commit each or one for
all three — keep them mechanically identical):

1. Remove the `useReducedMotion` import and call.
2. Remove the `MS`/`M` conditional assignments; use `motion.section` /
   `motion.div` directly in the JSX.
3. Inline the props unconditionally — target shape for the section element:

```tsx
<motion.section
  id="about"
  className={styles.about}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-100px' }}
  variants={staggerContainer}
>
```

and for items: `<motion.div variants={fadeInUp} className={styles.bio}>` etc.
Preserve EXACTLY the same variant assignments each component uses today
(`About`/`Experience`: `fadeInUp` items + `fadeInLeft` heading;
`Projects`: `scaleIn` items + `fadeInLeft` heading).

**Verify**: `npm run lint` → exit 0 (catches unused imports). `npx tsc --noEmit` → exit 0.

### Step 3: Simplify Hero

Same operation in `Hero.tsx`: drop the hook, replace each
`<M {...(noMotion ? {} : {...})}>` with `<motion.div initial="hidden" animate="visible" variants={...}>`
keeping the existing variants/delays (`heroItem(0.1)`, `heroName`,
`heroItem(0.5)`, `heroItem(0.7)`, the inline accent-line animation,
`heroItem(1.0)`) exactly as they are.

**Verify**: `npm run lint` && `npx tsc --noEmit` → exit 0.

### Step 4: Delete the orphaned hook

**Verify**: `grep -rln "useReducedMotion" src/` → only `src/hooks/useReducedMotion.ts` itself.
Then delete `src/hooks/useReducedMotion.ts`.

**Verify**: `npx tsc --noEmit` → exit 0; `npm run build` → exit 0.

### Step 5: Visual verification, both motion modes

`npm run dev`, open http://localhost:3000:

1. **Normal mode**: hero staggers in; About/Experience/Projects fade-and-rise
   on scroll — identical to before the change.
2. **Reduced motion** (macOS: System Settings → Accessibility → Display →
  Reduce motion; or DevTools → Rendering → emulate `prefers-reduced-motion`):
  reload — content must appear with **no positional movement** (no slide/rise/
  scale). Opacity fades are EXPECTED and correct under `reducedMotion="user"`;
  do not "fix" them.

**Verify**: both observations recorded.

## Test plan

- Existing suite must stay green: `npm run test` → all pass. (Current tests —
  `resume.test.ts`, `Experience.test.ts` (formatDate), `SocialLinks.test.tsx`,
  `useFocusTrap.test.ts` — don't exercise the motion branching, so no test
  updates are expected; if one fails, treat it as a real regression.)
- No new unit tests: the changed behavior is Motion-library-internal
  (`reducedMotion="user"`), and jsdom cannot meaningfully exercise
  IntersectionObserver-driven `whileInView`. Step 5 is the gate.

## Done criteria

- [ ] `grep -rn "useReducedMotion\|prefersReducedMotion" src/` → no matches
- [ ] `src/hooks/useReducedMotion.ts` no longer exists
- [ ] `grep -n "MotionConfig" src/providers/ThemeProvider.tsx` → 2 matches (import + JSX)
- [ ] `grep -c "motion.section" src/components/sections/About/About.tsx` → ≥1 (same for Experience, Projects), with no ternary element swapping left: `grep -rn "? 'div' : motion\|? 'section' : motion" src/` → no matches
- [ ] `npm run lint`, `npm run test`, `npx tsc --noEmit`, `npm run build` all exit 0
- [ ] Step 5 observations recorded (normal + reduced motion)
- [ ] Only the six in-scope files modified/deleted (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `MotionConfig` is not exported from `'motion/react'` (would indicate a
  motion-package API change; check `node_modules/motion/dist` exports and report).
- Under reduced-motion emulation, elements still visibly translate/slide
  (means `reducedMotion="user"` did not take effect through the provider —
  do not start adding per-component fallbacks; report).
- Any existing test fails after the refactor.
- Hero/section content becomes invisible (stuck at `opacity: 0`) in either
  mode — variants/props were not transcribed exactly; revert the file and re-do
  the step rather than debugging by trial.

## Maintenance notes

- New animated components must NOT reintroduce per-component reduced-motion
  branching — `MotionConfig` already covers them; this is the pattern plans
  008/009 assume.
- The CSS kill switch in `globals.css:161-168` still hard-disables CSS
  animations under reduced motion; it is intentionally redundant with
  MotionConfig (covers non-Motion animations like the scrollbar/pulse).
- Reviewer focus: diff should be net-negative (~60 lines removed); any added
  conditional logic is a smell.
