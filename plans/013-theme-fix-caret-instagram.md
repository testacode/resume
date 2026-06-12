# Plan 013: Theme-toggle first-click fix, blinking hero caret, remove Instagram, mobile header layout

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. Touch
> only the files in scope. If a STOP condition occurs, stop and report. Do not
> improvise. Make FOUR separate commits (one per touch) as described in Git
> workflow. When done, update the status row in `plans/README.md` — unless your
> reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 1f2c32a..HEAD -- src/components/ui/ThemeToggle/ThemeToggle.tsx src/components/sections/Hero/Hero.tsx src/components/sections/Hero/Hero.module.css src/data/resume.ts src/components/layout/Header/Header.tsx src/components/layout/Header/Header.module.css`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code; on a mismatch, STOP.

## Status

- **Priority**: P2 (contains a confirmed user-facing bug)
- **Effort**: M
- **Risk**: LOW
- **Depends on**: 011 (hero prompt), 012 (prompt username) — both DONE
- **Category**: bug (touches 1, 4) + direction (touches 2–3)
- **Planned at**: commit `1f2c32a`, 2026-06-12

## Why this matters

Four small, independent fixes requested by the owner while reviewing the live site:

1. **Theme-toggle first-click bug (confirmed in-browser).** The toggle reads
   `theme` from `useTheme()`. With `defaultTheme="system"`, `theme` can be the
   literal string `'system'`, so `isDark = theme === 'dark'` is `false` even
   when the page is actually dark. Reproduced: a fresh visitor on a dark-OS sees
   `data-theme="dark"` but the toggle shows the moon icon and
   `aria-label="Switch to dark mode"`; the **first click does not change the
   theme** (it only writes `'dark'` to localStorage), and the icon/label are
   inverted. The fix is to read `resolvedTheme` (always `'dark'` or `'light'`,
   never `'system'`).
2. **Blinking terminal caret.** The hero shows `charly@portfolio:~$ whoami`;
   the owner wants a blinking block caret after `whoami` for terminal feel.
   (Pre-specified as the opt-in caret in plan 011 — now requested.)
3. **Remove the Instagram link.** The repo toggles social links via the
   `enabled: boolean` field (per CLAUDE.md), so set Instagram's `enabled` to
   `false` — this drops it from the icon rows AND from the JSON-LD `sameAs`
   (which filters on `enabled`).
4. **Mobile header layout.** On mobile the desktop nav list is hidden, leaving
   the theme toggle and hamburger button bunched together at the LEFT of the
   header. The owner wants them on opposite ends: **hamburger on the left,
   theme toggle on the right**. Fix by reordering the DOM (menu button before
   the toggle) so visual order and tab/focus order agree, plus making the
   `.actions` row span the full width with `space-between` on mobile only.

## Current state

### Touch 1 — `src/components/ui/ThemeToggle/ThemeToggle.tsx`

```tsx
// entire current body
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Valid SSR hydration pattern
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={styles.placeholder} aria-hidden="true" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
}
```

`ThemeProvider` (`src/providers/ThemeProvider.tsx`) uses
`defaultTheme="system" enableSystem={true}` — correct, stays; the bug is only
in how the toggle reads the value.

### Touch 2 — `src/components/sections/Hero/Hero.tsx` + `Hero.module.css`

```tsx
// Hero.tsx:20-24
<motion.div initial="hidden" animate="visible" variants={heroItem(0.1)}>
  <p className={styles.greeting}>
    <span className={styles.prompt}>charly@portfolio:~$</span> whoami
  </p>
</motion.div>
```

```css
/* Hero.module.css:21-31 — greeting + prompt (current) */
.greeting {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-text-muted);
}

.prompt { color: var(--color-accent); }
```

`Hero.module.css` already has a `@media (prefers-reduced-motion: reduce)` block
at the bottom (currently disabling the `.scrollDown` pulse) — the caret's
reduced-motion rule goes in that same block.

### Touch 3 — `src/data/resume.ts`

```ts
// resume.ts:34-39
{
  name: 'Instagram',
  url: 'https://www.instagram.com/carlosmonti/',
  icon: 'instagram',
  enabled: true,
},
```

Consumers (do NOT edit): `SocialLinks.tsx` filters `links.filter(l => l.enabled)`;
`layout.tsx` JSON-LD does `social.filter(s => s.enabled).map(s => s.url)`.

### Touch 4 — `src/components/layout/Header/Header.tsx` + `Header.module.css`

```tsx
// Header.tsx:88-99 — actions group (ThemeToggle BEFORE the menu button in DOM)
<div className={styles.actions}>
  <ThemeToggle />
  <button
    type="button"
    className={styles.menuButton}
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isMenuOpen}
  >
    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
  </button>
</div>
```

```css
/* Header.module.css:51-55 — actions (desktop) */
.actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
```

```css
/* Header.module.css:85-92 — mobile block (start) */
@media (max-width: 640px) {
  .navList {
    display: none;
  }

  .menuButton {
    display: flex;
  }
  /* ... overlay / mobileMenu rules continue ... */
```

Why it bunches left today: in `.nav` (`justify-content: space-between`) the
desktop `.navList` is `display:none` on mobile, leaving `.actions` as the only
visible child — a single space-between child sits at flex-start (left). Inside
`.actions`, DOM order is ThemeToggle then menu button, so the toggle is
leftmost.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Tests | `npm run test` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:
- `src/components/ui/ThemeToggle/ThemeToggle.tsx`
- `src/components/sections/Hero/Hero.tsx`, `Hero.module.css`
- `src/data/resume.ts` (Instagram `enabled` flag only)
- `src/components/layout/Header/Header.tsx` (the `.actions` block order only)
- `src/components/layout/Header/Header.module.css` (mobile `.actions` rule only)

**Out of scope** (do NOT touch):
- `src/providers/ThemeProvider.tsx` — provider config is correct.
- `src/components/ui/SocialLinks/**`, `src/app/layout.tsx` — react to `enabled` automatically.
- Any other social entry; only flip Instagram's `enabled`.
- The Header scroll-spy, focus-trap, menu effects, and nav-list markup — only
  the `.actions` children order changes.

## Git workflow

- Work on `master` directly. FOUR commits, in this order, staging only the
  relevant file(s) each time (never `git add -A`, never `plans/`):
  1. `fix(theme): use resolvedTheme so the toggle flips on first click` — `ThemeToggle.tsx`
  2. `feat(hero): add blinking terminal caret after whoami` — `Hero.tsx` + `Hero.module.css`
  3. `chore(data): disable Instagram social link` — `resume.ts`
  4. `fix(header): split menu button and theme toggle to opposite ends on mobile` — `Header.tsx` + `Header.module.css`
- Do NOT push or open a PR.

## Steps

### Step 1: Fix the theme toggle (touch 1)

In `ThemeToggle.tsx`:
- Line 9: `const { resolvedTheme, setTheme } = useTheme();`
- Line 22: `const isDark = resolvedTheme === 'dark';`

Everything else stays (the `mounted` guard already prevents a hydration
mismatch; `resolvedTheme` is defined after mount). `onClick`, `aria-label`, and
the icon now derive from the real theme, so each click inverts it.

**Verify**:
- `grep -c "resolvedTheme" src/components/ui/ThemeToggle/ThemeToggle.tsx` → `2`
- `grep -c "theme === 'dark'" src/components/ui/ThemeToggle/ThemeToggle.tsx` → `0`
- `npm run lint` → exit 0; `npx tsc --noEmit` → exit 0
- **Commit 1**.

### Step 2: Add the blinking caret (touch 2)

In `Hero.tsx`, add a caret span after `whoami` inside the greeting `<p>`:

```tsx
<p className={styles.greeting}>
  <span className={styles.prompt}>charly@portfolio:~$</span> whoami
  <span className={styles.caret} aria-hidden="true" />
</p>
```

In `Hero.module.css`, add the caret style and keyframes (place `.caret` near
`.prompt`, `@keyframes blink` at top level):

```css
.caret {
  display: inline-block;
  width: 0.55em;
  height: 1em;
  margin-left: 2px;
  background-color: var(--color-accent);
  vertical-align: text-bottom;
  animation: blink 1.1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

Add the caret to the EXISTING reduced-motion block at the bottom of the file
(do not create a second `@media` block):

```css
@media (prefers-reduced-motion: reduce) {
  .scrollDown {
    animation: none;
  }
  .caret {
    animation: none;
  }
}
```

If the caret looks visually off against the mono text, nudge
`height`/`vertical-align` — keep it reading as a terminal block cursor.

**Verify**:
- `grep -c "caret" src/components/sections/Hero/Hero.tsx` → `1`
- `grep -c "@keyframes blink" src/components/sections/Hero/Hero.module.css` → `1`
- `grep -c "animation: none" src/components/sections/Hero/Hero.module.css` → `2`
- `npm run lint` → exit 0
- **Commit 2**.

### Step 3: Disable Instagram (touch 3)

In `resume.ts`, change ONLY the Instagram entry's `enabled: true` to
`enabled: false`. Leave `name`/`url`/`icon` intact (toggle, not delete).

**Verify**:
- `git diff src/data/resume.ts` shows exactly one line changed, inside the Instagram object.
- `npm run build` → exit 0, then `grep -c "instagram.com" .next/server/app/index.html` → `0`.
- **Commit 3**.

### Step 4: Mobile header layout (touch 4)

In `Header.tsx`, **reorder** the `.actions` children so the menu button comes
BEFORE `<ThemeToggle />` in the DOM (this makes visual order and tab order agree
once mobile uses `space-between`):

```tsx
<div className={styles.actions}>
  <button
    type="button"
    className={styles.menuButton}
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isMenuOpen}
  >
    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
  </button>
  <ThemeToggle />
</div>
```

(Desktop is unaffected: the menu button is `display:none` there, so only the
toggle shows, still at the right.)

In `Header.module.css`, inside the EXISTING `@media (max-width: 640px)` block,
add a rule making `.actions` span the full width and push its two children
apart:

```css
@media (max-width: 640px) {
  .actions {
    width: 100%;
    justify-content: space-between;
  }
  /* ...existing .navList / .menuButton / overlay / mobileMenu rules stay... */
```

Result on mobile: menu button at the left edge, theme toggle at the right edge.
Do NOT use a CSS `order` property — the DOM reorder already gives the correct
visual + focus order.

**Verify**:
- In `Header.tsx`, the menu `<button>` appears before `<ThemeToggle />` inside `.actions`:
  `awk '/className=\{styles.actions\}/,/<\/div>/' src/components/layout/Header/Header.tsx` shows `menuButton` before `ThemeToggle`.
- `grep -c "width: 100%" src/components/layout/Header/Header.module.css` → `1` (inside the mobile block)
- `grep -c "order:" src/components/layout/Header/Header.module.css` → `0` (no order hack)
- `npm run lint` → exit 0; `npm run build` → exit 0
- **Commit 4**.

### Step 5: Final battery + visual checks

1. `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build` all exit 0.
2. `git log --oneline -4` shows the four commits in order.
3. If a browser tool is available, on a ≤640px viewport confirm: hamburger at
   left edge, theme toggle at right edge; on desktop confirm the toggle is still
   at the right and the nav list at the left (no regression). Record the checks.

## Test plan

- Touch 1 (theme): no unit test — `next-themes` + `matchMedia` + `resolvedTheme`
  are not faithfully mockable in jsdom (you'd test the mock). Verified in a real
  browser during planning; the reviewer re-verifies the same way (fresh visitor
  on dark OS: first click flips the theme; icon/label match the active theme).
- Touch 2 (caret) and Touch 4 (header layout): cosmetic/CSS, no unit test;
  covered by the grep checks and the optional viewport check in step 5.
- Touch 3 (Instagram): covered by the built-HTML grep in step 3. Existing
  `resume.test.ts` only asserts the social array is non-empty/well-formed, so it
  still passes.
- Run `npm run test` → all pass (no count change expected).

## Done criteria

- [ ] `grep -c "resolvedTheme" src/components/ui/ThemeToggle/ThemeToggle.tsx` → `2`
- [ ] `grep -c "@keyframes blink" src/components/sections/Hero/Hero.module.css` → `1`
- [ ] Instagram entry `enabled: false`; `grep -c "instagram.com" .next/server/app/index.html` → `0`
- [ ] In `Header.tsx`, menu button precedes `<ThemeToggle />` in `.actions`; `grep -c "order:" src/components/layout/Header/Header.module.css` → `0`; `grep -c "width: 100%" src/components/layout/Header/Header.module.css` → `1`
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build` all exit 0
- [ ] Four commits exist in the specified order
- [ ] Only the six in-scope files modified (`git status`)
- [ ] `plans/README.md` status row updated (or reviewer notified)

## STOP conditions

Stop and report back if:
- Any in-scope file no longer matches its "Current state" excerpt (drift).
- `resolvedTheme` is not exported by the installed `next-themes` (it is in all
  modern versions; if `tsc` complains, report — do not fall back to `theme`).
- Disabling Instagram requires touching `SocialLinks` or `layout.tsx` (it must not).
- Making the header layout work requires touching the nav list, scroll-spy, or
  menu logic (it must not — only `.actions` child order + the mobile CSS rule).

## Maintenance notes

- The `mounted` guard in `ThemeToggle` is still required: `resolvedTheme` is
  `undefined` during SSR, so rendering the button before mount would mismatch.
- Instagram is disabled, not deleted — re-enabling is a one-word flip.
- The caret uses `--color-accent`; it counts against the redesign's accent
  budget (prompt `$`, caret, live dots, links, kickers) — that is the ceiling.
- Header `.actions` deliberately keeps the menu button first in the DOM so the
  mobile `space-between` layout has matching visual and tab order; do not
  "tidy" it back to toggle-first with a CSS `order` later — that reintroduces
  the focus-order mismatch.
