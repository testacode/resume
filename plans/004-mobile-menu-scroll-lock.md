# Plan 004: Release the body scroll-lock when the mobile menu becomes desktop, and complete the dialog semantics

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat ab2e8eb..HEAD -- src/components/layout/Header/Header.tsx`
> Plan 003 also edits this file (it removes `handleNavClick`). That change is
> expected drift — proceed if the only differences from the excerpts below are
> the ones plan 003 describes. Any OTHER mismatch is a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/003-native-anchor-navigation.md (same file; execute 003 first to avoid conflicts)
- **Category**: bug (accessibility)
- **Planned at**: commit `ab2e8eb`, 2026-06-12

## Why this matters

Opening the mobile menu sets `document.body.style.overflow = 'hidden'` and the
cleanup only runs when `isMenuOpen` flips. The menu UI itself, however, is
hidden by CSS above 640px (`Header.module.css` shows `.mobileMenu`/`.overlay`
only inside `@media (max-width: 640px)`). So: open the menu on a narrow
viewport, rotate a tablet or resize past 640px → the menu and its close button
disappear, but the scroll-lock persists. The page is now unscrollable with no
visible way out except the Escape key, which nothing hints at.

Secondary fix in the same component: the mobile menu container has
`role="dialog"` but no `aria-modal="true"`, so screen readers don't treat the
content behind the overlay as inert even though a focus trap
(`useFocusTrap`) enforces that for keyboard users.

## Current state

- `src/components/layout/Header/Header.tsx`:

```tsx
// Header.tsx:47-61 — the lock effect (cleanup only on isMenuOpen change)
useEffect(() => {
  if (!isMenuOpen) return;

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeMenu();
  };

  document.addEventListener('keydown', handleEscape);
  document.body.style.overflow = 'hidden';

  return () => {
    document.removeEventListener('keydown', handleEscape);
    document.body.style.overflow = '';
  };
}, [isMenuOpen, closeMenu]);
```

```tsx
// Header.tsx:106 — dialog without aria-modal
<div ref={mobileMenuRef} className={styles.mobileMenu} role="dialog" aria-label="Navigation menu">
```

- `src/components/layout/Header/Header.module.css:85` — the breakpoint:
  `@media (max-width: 640px)` contains all mobile-menu styles. Desktop is
  therefore `min-width: 641px`.
- `closeMenu` already exists: `const closeMenu = useCallback(() => setIsMenuOpen(false), []);` (Header.tsx:24).

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
- `src/components/layout/Header/Header.module.css` — the 640px breakpoint is
  the source of truth; do not move it.
- `src/hooks/useFocusTrap.ts` — works as designed.
- The scroll-spy effect (`Header.tsx:26-45`).

## Git workflow

- Branch: `advisor/004-menu-scroll-lock`
- Suggested commit: `fix(a11y): close mobile menu on desktop resize and add aria-modal`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Close the menu when the viewport becomes desktop

Inside the existing `isMenuOpen` effect (excerpt above), after the Escape
listener setup, add a media-query listener that closes the menu the moment the
desktop breakpoint matches:

```tsx
const desktopQuery = window.matchMedia('(min-width: 641px)');
const handleDesktop = (e: MediaQueryListEvent) => {
  if (e.matches) closeMenu();
};
desktopQuery.addEventListener('change', handleDesktop);
```

and remove it in the same effect's cleanup:

```tsx
desktopQuery.removeEventListener('change', handleDesktop);
```

Closing the menu flips `isMenuOpen`, which runs the existing cleanup and
restores `document.body.style.overflow` — no second lock-management path is
introduced. (641px pairs with the CSS `max-width: 640px`; `rem`-based queries
are not used elsewhere in this repo, so match the px convention.)

**Verify**: `npm run lint` → exit 0.

### Step 2: Add `aria-modal`

On the mobile menu container (Header.tsx:106 in the excerpt), add
`aria-modal="true"` next to `role="dialog"`.

**Verify**: `grep -n 'aria-modal="true"' src/components/layout/Header/Header.tsx` → 1 match, on the same element as `role="dialog"`.

### Step 3: Behavior check

`npm run dev`, open http://localhost:3000 with a narrow window (<640px wide):

1. Open the hamburger menu → background does not scroll.
2. Widen the window past 640px → menu state closes, and the page scrolls
   normally (this is the bug being fixed — before the change, scrolling stays
   locked).

**Verify**: scrolling works after resize; `npm run build` → exit 0.

## Test plan

No new unit tests: jsdom's `matchMedia` does not fire `change` events on
resize, so a meaningful automated test would require mocking the exact
behavior under test (testing the mock). The manual gate in step 3 plus
lint/build cover it. Run `npm run test` to confirm the existing suite passes.

## Done criteria

- [ ] `grep -n "matchMedia" src/components/layout/Header/Header.tsx` → 1 match inside the menu effect
- [ ] `grep -n 'aria-modal="true"' src/components/layout/Header/Header.tsx` → 1 match
- [ ] Manual check from step 3 recorded: scroll restored after crossing the breakpoint with the menu open
- [ ] `npm run lint`, `npm run test`, `npm run build` all exit 0
- [ ] Only `src/components/layout/Header/Header.tsx` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The `isMenuOpen` effect no longer matches the excerpt beyond plan 003's
  documented changes.
- The CSS breakpoint in `Header.module.css` is no longer `max-width: 640px`
  (the 641px constant in step 1 would then be wrong — report, don't guess).
- jsdom test failures appear that mention `matchMedia` (would mean a test
  somewhere renders Header with the menu open; report which test).

## Maintenance notes

- If the mobile breakpoint ever changes in `Header.module.css`, the
  `(min-width: 641px)` literal in `Header.tsx` must change in lockstep — they
  are intentionally the same number expressed from both sides. A reviewer
  should flag any future divergence.
- If more overlays are added to the site (modals, lightboxes), consider
  extracting the scroll-lock into a shared hook then — not now, single
  consumer.
