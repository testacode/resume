# Plan 014: Align CLAUDE.md Design Context with the redesign, and fully remove Instagram

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. Touch
> only the files in scope. If a STOP condition occurs, stop and report. Do not
> improvise. Make TWO separate commits (one per touch). When done, update the
> status row in `plans/README.md` — unless your reviewer told you they maintain
> the index.
>
> **Drift check (run first)**: `git diff --stat 6341ecf..HEAD -- CLAUDE.md src/data/resume.ts src/types/resume.ts src/components/ui/SocialLinks/SocialLinks.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code; on a mismatch, STOP.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: 010 (redesign — the system the docs must describe), 013 (Instagram already `enabled:false`)
- **Category**: docs (touch 1) + tech-debt (touch 2)
- **Planned at**: commit `6341ecf`, 2026-06-12

## Why this matters

1. **Stale design docs.** `CLAUDE.md`'s "Design Context → Aesthetic Direction"
   still describes the pre-redesign system (Inter + JetBrains Mono, hex teal
   `#0d9488`/`#2dd4bf`, "timeline with accent dots") — none of which is true
   after plan 010. A future agent reading it would reintroduce the wrong fonts
   and colors. Docs that are actively wrong are worse than missing.
2. **Instagram half-removed.** Plan 013 set Instagram's `enabled: false`, which
   hides the link and drops it from JSON-LD — but the URL still ships in the
   serialized RSC data payload, and the `'instagram'` icon plumbing is now dead
   code. The owner wants Instagram gone entirely, so delete the data entry and
   the orphaned icon wiring it leaves behind.

## Current state

### Touch 1 — `CLAUDE.md` (Design Context)

```md
// CLAUDE.md:68-72 (stale Aesthetic Direction)
### Aesthetic Direction
- **Color**: Teal accent (`#0d9488` light / `#2dd4bf` dark) on neutral slate palette
- **Typography**: Inter (body) + JetBrains Mono (code/technical elements)
- **Motion**: Subtle fade-in and stagger. Always respect `prefers-reduced-motion`
- **Details**: Numbered section headings with decorative line, timeline with accent dots, mono-font tech tags
```

```md
// CLAUDE.md:74-79 (Design Principles — principle 3 references the old identity cues)
### Design Principles
1. **Content first** — Design serves the content, never competes with it
2. **Quiet confidence** — Professional polish without excess
3. **Developer identity** — Mono font accents, numbered sections signal "I build things"
4. **Consistent tokens** — All values from CSS custom properties, no magic numbers
5. **Accessible by default** — WCAG AA, focus-visible, skip-to-content, reduced motion
```

Ground truth of the live system (from `src/app/globals.css` + components):
- Fonts via `next/font/google`: **Bricolage Grotesque** (display/headings/name),
  **Instrument Sans** (body), **IBM Plex Mono** (technical: kickers, dates, tech
  tags, links, hero terminal prompt, version footer).
- Color: teal accent in **OKLCH** on teal-tinted neutrals — light accent
  `oklch(0.58 0.1 175)`, dark `oklch(0.80 0.14 175)` — **rationed** (kickers,
  links, hero accent line + prompt `$`, project status dots only).
- Layout: editorial — Projects is a divided **list** (no cards), Experience is a
  **date-column** grid (no timeline/dots).
- Motion: Motion library with a single `<MotionConfig reducedMotion="user">`.
- Developer signals: hero terminal prompt (`charly@portfolio:~$ whoami` + caret),
  project status dots, version-string footer.

### Touch 2 — Instagram removal

```ts
// src/data/resume.ts:34-39 (entry to delete)
{
  name: 'Instagram',
  url: 'https://www.instagram.com/carlosmonti/',
  icon: 'instagram',
  enabled: false,
},
```

```ts
// src/types/resume.ts:4 (union still lists 'instagram')
icon: 'linkedin' | 'github' | 'gitlab' | 'instagram' | 'email';
```

```tsx
// src/components/ui/SocialLinks/SocialLinks.tsx:3 + iconMap
import { FaLinkedinIn, FaGithub, FaGitlab, FaInstagram } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
// ...
const iconMap: Record<IconName, React.ComponentType<{ size?: number }>> = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
  gitlab: FaGitlab,
  instagram: FaInstagram,
  email: HiOutlineMail,
};
```

Because `iconMap` is typed `Record<IconName, ...>`, removing `'instagram'` from
the `IconName` union (touch 2) **forces** removing the `instagram:` map entry,
which **forces** dropping the now-unused `FaInstagram` import — a clean cascade.
`resume.test.ts` only asserts the social array is non-empty and each entry
well-formed, so it still passes with one fewer entry.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Tests | `npm run test` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:
- `CLAUDE.md` (Design Context → Aesthetic Direction + Design Principles only)
- `src/data/resume.ts` (delete the Instagram entry)
- `src/types/resume.ts` (drop `'instagram'` from the icon union)
- `src/components/ui/SocialLinks/SocialLinks.tsx` (drop `FaInstagram` import + map entry)

**Out of scope** (do NOT touch):
- Any other section of `CLAUDE.md` (Users, Brand Personality, Emotional Goal,
  Commands, Architecture, etc. — they are still accurate).
- Other social entries; component styles; `globals.css`.

## Git workflow

- Work on `master` directly. TWO commits, staging only the relevant file(s):
  1. `docs: align design context with the editorial redesign` — `CLAUDE.md`
  2. `refactor: remove Instagram social link and its icon plumbing` — `resume.ts` + `types/resume.ts` + `SocialLinks.tsx`
- Do NOT push or open a PR (the reviewer/owner handles the push).

## Steps

### Step 1: Update CLAUDE.md Design Context (touch 1)

Replace the "Aesthetic Direction" block (lines 68-72) with:

```md
### Aesthetic Direction
- **Color**: Teal accent in OKLCH on teal-tinted neutral palette — light `oklch(0.58 0.1 175)`, dark `oklch(0.80 0.14 175)`. Accent is **rationed**: section-number kickers, links, the hero accent line + prompt `$`, and project status dots only.
- **Typography** (via `next/font/google`): **Bricolage Grotesque** for display/headings/name, **Instrument Sans** for body, **IBM Plex Mono** for technical signals (kickers, dates, tech tags, links, the hero terminal prompt, version footer)
- **Motion**: Subtle fade-in and stagger via the Motion library, centralized through a single `<MotionConfig reducedMotion="user">` — preserves opacity fades, suppresses positional movement for reduced-motion users
- **Layout**: Editorial, no cards — Projects is a divided list, Experience a date-column grid
- **Developer signals**: hero terminal prompt (`charly@portfolio:~$ whoami` + blinking caret), project status dots, version-string footer
```

Then update Design Principle 3 (line 77) to reflect the current cues, and add a
principle for the rationing rule. Replace lines 74-79 with:

```md
### Design Principles
1. **Content first** — Design serves the content, never competes with it
2. **Quiet confidence** — Professional polish without excess
3. **Developer identity** — Mono signals (terminal prompt, status dots, version string), numbered section kickers
4. **Consistent tokens** — All values from CSS custom properties, no magic numbers
5. **Accent rationing** — Teal appears only where listed in Aesthetic Direction; adding it elsewhere breaks the restraint
6. **Accessible by default** — WCAG AA, focus-visible, skip-to-content, reduced motion
```

**Verify**:
- `grep -c "Bricolage" CLAUDE.md` → `1`; `grep -c "Inter (body)" CLAUDE.md` → `0`
- `grep -c "#0d9488" CLAUDE.md` → `0`
- **Commit 1**.

### Step 2: Remove Instagram entirely (touch 2)

1. `src/data/resume.ts`: delete the entire Instagram object (the 5 lines shown
   in Current state, plus its trailing comma handling — ensure the resulting
   array is valid: the entry before it, GitLab/`enabled:true`, keeps its comma
   only if another entry follows; after deleting Instagram, GitLab becomes the
   last entry, so it may keep or drop a trailing comma — both are valid JS).
2. `src/types/resume.ts`: change the union to
   `icon: 'linkedin' | 'github' | 'gitlab' | 'email';` (remove `'instagram' | `).
3. `src/components/ui/SocialLinks/SocialLinks.tsx`: remove `FaInstagram` from the
   `react-icons/fa` import, and delete the `instagram: FaInstagram,` line from
   `iconMap`.

**Verify**:
- `grep -rci "instagram" src/` → `0` (gone from all of src)
- `npx tsc --noEmit` → exit 0 (proves the `Record<IconName>` is still exhaustive and nothing references the dropped variant)
- `npm run lint` → exit 0 (proves no unused `FaInstagram` import remains)
- `npm run build` → exit 0, then `grep -ci "instagram" .next/server/app/index.html` → `0` (URL gone from the payload too)
- `npm run test` → exit 0
- **Commit 2**.

### Step 3: Final battery

**Verify**: `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build`
all exit 0. `git log --oneline -2` shows the two commits in order. `git status`
shows only the four in-scope files changed (no others).

## Test plan

- No new tests. Touch 1 is docs. Touch 2 is covered by the cascade of
  `tsc`/lint/build/grep checks in step 2 (the type system itself enforces
  correctness here) and the existing `resume.test.ts` (still green with one
  fewer social entry).

## Done criteria

- [ ] `grep -c "Bricolage" CLAUDE.md` → `1`; `grep -c "#0d9488" CLAUDE.md` → `0`
- [ ] `grep -rci "instagram" src/` → `0`
- [ ] `grep -ci "instagram" .next/server/app/index.html` → `0` (after build)
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build` all exit 0
- [ ] Two commits in order; only the four in-scope files changed (`git status`)
- [ ] `plans/README.md` status row updated (or reviewer notified)

## STOP conditions

Stop and report back if:
- Any in-scope file no longer matches its "Current state" excerpt (drift).
- Removing `'instagram'` from the union surfaces a `tsc` error somewhere other
  than `SocialLinks.tsx`'s `iconMap` (would mean another consumer references
  the variant — report it).
- `grep -rci instagram src/` is still > 0 after step 2 (a reference was missed).

## Maintenance notes

- Instagram is now fully removed (data, type variant, icon, import). Re-adding
  it later means restoring all four: the array entry, the union member, the map
  entry, and the import.
- If more social platforms are added, the pattern is the inverse cascade: union
  member → `iconMap` entry (TS will demand it) → import → data entry.
- CLAUDE.md's Aesthetic Direction now hardcodes the two OKLCH accent values; if
  `globals.css` accent tokens change, this doc drifts again — a reviewer should
  keep them in sync (or a future pass could reference the token names instead of
  values).
