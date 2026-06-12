# Plan 003: Restore native anchor navigation (hash URLs, reduced-motion, focus) in the header

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat ab2e8eb..HEAD -- src/components/layout/Header/Header.tsx src/app/globals.css`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW (deletes a JS override in favor of standard browser behavior)
- **Depends on**: none (but plan 004 edits the same file — execute 003 before 004)
- **Category**: bug (accessibility/UX)
- **Planned at**: commit `ab2e8eb`, 2026-06-12

## Why this matters

The header nav intercepts every anchor click with `e.preventDefault()` +
`element.scrollIntoView({ behavior: 'smooth' })`. This breaks three standard
behaviors at once:

1. **The URL hash never updates** — sections can't be deep-linked or shared,
   and the back button doesn't restore position.
2. **Reduced motion is ignored** — `scrollIntoView({ behavior: 'smooth' })`
   explicitly requests smooth scrolling regardless of OS preference. The CSS
   override that exists for this (`globals.css` sets `scroll-behavior: auto`
   under `prefers-reduced-motion`) only governs *CSS-triggered* scrolling, so
   it never applies to this JS call.
3. **Keyboard/screen-reader focus stays on the nav link** — native anchor
   navigation moves the sequential focus point to the target; the JS version
   doesn't.

The repo already has everything needed for the native path to work perfectly:
`html { scroll-behavior: smooth }` (globals.css:81) provides smooth scrolling,
the reduced-motion media query (globals.css:167) disables it for those users,
and every target section has ≥8rem top padding so content never hides under the
70px fixed header. The fix is **deletion**, not addition.

## Current state

- `src/components/layout/Header/Header.tsx` — the only file with this pattern:

```tsx
// Header.tsx:63-70
const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  closeMenu();
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
```

Used twice: desktop list (`Header.tsx:81` `onClick={(e) => handleNavClick(e, item.href)}`)
and mobile list (`Header.tsx:113`, same shape).

- `src/app/globals.css:81` — `html { scroll-behavior: smooth; }`
- `src/app/globals.css:161-168` — reduced-motion block ending in `html { scroll-behavior: auto; }`
- Target sections and their top padding (for the no-overlap claim):
  `#home` (Hero, first section), `#about` (`About.module.css:2` padding `--space-32` = 8rem),
  `#experience` (`Experience.module.css:2`, same), `#projects` (`Projects.module.css:2`, same).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm install` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm run test` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope** (the only file you should modify):
- `src/components/layout/Header/Header.tsx`

**Out of scope** (do NOT touch):
- `src/app/globals.css` — the smooth-scroll + reduced-motion CSS is already correct.
- The scroll-spy effect (`Header.tsx:26-45`) — audited and deliberately left as is.
- The body-overflow effect (`Header.tsx:47-61`) — plan 004 owns it.
- `src/hooks/useFocusTrap.ts`.

## Git workflow

- Branch: `advisor/003-native-anchors`
- Suggested commit: `fix(a11y): use native anchor navigation for hash, focus and reduced motion`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Delete the interception, keep the menu close

In `Header.tsx`:

1. Delete the `handleNavClick` function (lines 63–70 in the excerpt above).
2. Desktop link: replace `onClick={(e) => handleNavClick(e, item.href)}` with
   `onClick={closeMenu}`. (Harmless no-op on desktop, keeps both lists identical.)
3. Mobile link: replace `onClick={(e) => handleNavClick(e, item.href)}` with
   `onClick={closeMenu}`.

Nothing else changes — the `<a href="#...">` elements now navigate natively:
the browser updates the hash, scrolls (smooth via CSS, instant under reduced
motion), and moves the sequential focus point.

**Verify**: `grep -n "preventDefault\|scrollIntoView" src/components/layout/Header/Header.tsx` → no matches.
**Verify**: `npm run lint` → exit 0 (also confirms no unused-variable leftovers).

### Step 2: Behavior check in the browser

Run `npm run dev`, open http://localhost:3000:

- Click "About" → URL becomes `http://localhost:3000/#about`, page scrolls smoothly.
- Press the browser Back button → returns to the previous position/hash.
- (If a browser-automation tool such as `npx agent-browser` or the
  chrome-devtools MCP is available, verify `location.hash === '#about'` after
  the click programmatically; otherwise record the manual observation.)

**Verify**: hash updates on click; `npm run build` → exit 0.

## Test plan

No new unit tests: the changed behavior is native browser navigation, which
jsdom does not implement meaningfully (jsdom neither scrolls nor honors
`scroll-behavior`). The deletion is gated by the grep + lint + manual hash
check above. Run `npm run test` to confirm the existing suite passes.

## Done criteria

- [ ] `grep -rn "scrollIntoView" src/` returns no matches
- [ ] `grep -n "preventDefault" src/components/layout/Header/Header.tsx` returns no matches
- [ ] Clicking a nav item updates `location.hash` (manual or automated check recorded)
- [ ] `npm run lint`, `npm run test`, `npm run build` all exit 0
- [ ] Only `src/components/layout/Header/Header.tsx` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `Header.tsx` no longer matches the excerpt (drifted).
- After the change, clicking a nav link visibly hides a section heading under
  the fixed header (would mean the padding assumption broke — the remedy,
  `scroll-margin-top` on sections, touches files out of scope).
- Smooth scrolling stops working entirely in a normal-motion browser profile
  (would indicate the `globals.css:81` rule changed).

## Maintenance notes

- If a section's top padding is ever reduced below ~80px, add
  `scroll-margin-top: var(--header-height)` to section styles — that is the
  standard companion to fixed headers with native anchors.
- Plan 008 (Education section) adds a nav item; it inherits this native
  behavior with zero extra work — that's the point of this plan.
- Reviewer note: the diff should be pure deletion plus two `onClick` swaps; any
  added scroll JS is scope creep.
