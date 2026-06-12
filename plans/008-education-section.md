# Plan 008: Render the Education section that already exists in the data layer

> **REFRESHED 2026-06-12** against the post-redesign editorial system
> (plan 010, commits `1a8a279` + `9ab97da`). The original version of this plan
> targeted the pre-redesign card/timeline visual system and is obsolete.
>
> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless your reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9ab97da..HEAD -- src/app/page.tsx src/components/layout/Header/Header.tsx src/components/sections/Experience src/data/resume.ts src/types/resume.ts`
> Any change since `9ab97da` in these paths is unexpected — compare against the
> excerpts below; on a mismatch, STOP.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: LOW (additive feature; mirrors the post-redesign Experience pattern 1:1)
- **Depends on**: 003, 004, 006, 010 — ALL DONE as of this refresh
- **Category**: direction
- **Planned at**: commit `9ab97da`, 2026-06-12 (refreshed; originally `ab2e8eb`)

## Why this matters

`src/data/resume.ts` defines an `education` array (two entries) and
`src/types/resume.ts` defines the `Education` type, but `src/app/page.tsx`
never renders them — dead data shipped in the bundle. The owner decided to
render it. Education completes the standard resume structure recruiters
expect, and the section system (numbered kickers 01/02/03) trivially extends
to 04.

## Current state

- `src/types/resume.ts:25-30`:

```ts
export type Education = {
  school: string;
  degree: string;
  graduationDate: string;
  description?: string;
};
```

- `src/data/resume.ts` (`education:` array, two entries) — note `graduationDate`
  is a **free-form display string** (`'Not graduated (3 years)'`,
  `'March 2002'`) — render it verbatim, do NOT date-parse it.
- `src/app/page.tsx` — renders `Hero → About → Experience → Projects` inside
  `<main id="main-content">`, destructuring
  `const { personal, experience, projects } = resumeData;`.
- `src/components/layout/Header/Header.tsx` — `navItems` array with 4 entries
  ending in `{ href: '#projects', label: 'Projects' }`. Nav clicks are native
  anchors (`onClick={closeMenu}` only); the scroll-spy derives section ids from
  `navItems`, so a new entry is picked up automatically.
- **The pattern to copy — post-redesign Experience** (READ BOTH FILES FIRST,
  they are the source of truth for every styling decision):
  - `src/components/sections/Experience/Experience.tsx`: `motion.section` with
    `initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer}`;
    heading group (`.number` kicker + `<h2 className={styles.heading}>`); items
    are `motion.article` with `variants={fadeInUp}` in a date-column grid.
  - `src/components/sections/Experience/Experience.module.css`: `.job` is
    `display: grid; grid-template-columns: 1fr` collapsing to `180px 1fr` at
    `min-width: 768px`, `padding: var(--space-8) 0`,
    `border-top: 1px solid var(--color-border)`; `.dates` mono/sm/muted;
    `.jobTitle` `font-family: var(--font-display)`, `--text-xl`, 600,
    `letter-spacing: -0.01em`, `--color-text-display`.
- Section background rhythm (alternating): About `--color-background-alt` →
  Experience plain → Projects `--color-background-alt` → **Education plain**
  (no `background-color` declaration).
- Repo conventions: CSS Modules + tokens only (no literal colors/px);
  tests beside the file; folder = `Component.tsx` + `Component.module.css` +
  `index.ts` re-export.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Tests | `npm run test` | exit 0 |
| Build | `npm run build` | exit 0 |

Port note: port 3000 is often occupied by another project — read the
dev-server output for the actual port.

## Scope

**In scope** (the only files you may modify/create):
- `src/components/sections/Education/Education.tsx` (create)
- `src/components/sections/Education/Education.module.css` (create)
- `src/components/sections/Education/index.ts` (create)
- `src/components/sections/Education/Education.test.tsx` (create)
- `src/app/page.tsx`
- `src/components/layout/Header/Header.tsx` (navItems array ONLY)

**Out of scope** (do NOT touch):
- `src/data/resume.ts`, `src/types/resume.ts` — already correct.
- `src/components/sections/Experience/**` — copy its pattern, don't modify it.
- `src/lib/animations.ts`, `src/app/globals.css`.

## Git workflow

- Work on `master` directly (operator's standing instruction). One commit:
  `feat(education): render education section from existing data`.
- Stage only in-scope files, never `plans/`.

## Steps

### Step 1: Create the component

`src/components/sections/Education/Education.tsx`:

```tsx
'use client';

import { motion } from 'motion/react';
import { fadeInUp, fadeInLeft, staggerContainer } from '@/lib/animations';
import type { Education as EducationType } from '@/types/resume';
import styles from './Education.module.css';

type Props = {
  data: EducationType[];
};

export function Education({ data }: Props) {
  return (
    <motion.section
      id="education"
      className={styles.education}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
    >
      <div className={styles.container}>
        <motion.div variants={fadeInLeft} className={styles.headingGroup}>
          <span className={styles.number}>04</span>
          <h2 className={styles.heading}>Education</h2>
        </motion.div>

        <div className={styles.list}>
          {data.map((entry) => (
            <motion.article key={entry.school} variants={fadeInUp} className={styles.entry}>
              <p className={styles.date}>{entry.graduationDate}</p>
              <div className={styles.entryContent}>
                <h3 className={styles.school}>{entry.school}</h3>
                <p className={styles.degree}>{entry.degree}</p>
                {entry.description && <p className={styles.description}>{entry.description}</p>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
```

`src/components/sections/Education/index.ts`:
`export { Education } from './Education';`

**Verify**: `npx tsc --noEmit` → exit 0.

### Step 2: Create the CSS module

`src/components/sections/Education/Education.module.css` — copy the
heading-group recipe verbatim from the CURRENT `Experience.module.css`
(`.education` gets `padding: var(--space-32) var(--space-6);` and NO
background-color; `.container`, `.headingGroup`, `.number`, `.heading`
identical to Experience's). Entries mirror the `.job` date-column recipe:

```css
.list {
  display: flex;
  flex-direction: column;
}

.entry {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-2) var(--space-8);
  padding: var(--space-8) 0;
  border-top: 1px solid var(--color-border);
}

@media (min-width: 768px) {
  .entry { grid-template-columns: 180px 1fr; }
}

.date {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.entryContent { min-width: 0; }

.school {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.4;
  color: var(--color-text-display);
}

.degree {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
}

.description {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-top: var(--space-3);
}
```

Note `.date` has NO `white-space: nowrap` (unlike Experience's `.dates`) —
`'Not graduated (3 years)'` must wrap inside the 180px column rather than
overflow.

**Verify**: `npm run lint` → exit 0;
`grep -En "#[0-9a-f]{3}|[0-9]+px" src/components/sections/Education/Education.module.css | grep -v "768px\|180px"` → no matches
(the grid breakpoint and date column are the only sanctioned px literals —
they mirror Experience).

### Step 3: Render it and add the nav item

1. `src/app/page.tsx`: destructure `education` from `resumeData`, import
   `Education` from `@/components/sections/Education`, render
   `<Education data={education} />` AFTER `<Projects ...>` (last section
   before the footer; kicker 04 encodes this order).
2. `Header.tsx`: append `{ href: '#education', label: 'Education' }` to
   `navItems`.

**Verify**: `npm run build` → exit 0. Then start the dev server and
`curl -s http://localhost:<PORT> | grep -c 'id="education"'` → `1`.

### Step 4: Visual check

On the dev server: section appears after Projects with kicker 04; entries use
the same date-column rhythm as Experience; school names render in Bricolage;
"Education" nav link scrolls and highlights; the long date string wraps within
its column at desktop width; mobile menu shows the fifth item.

**Verify**: observations recorded (screenshot welcome but not required).

## Test plan

New `src/components/sections/Education/Education.test.tsx`, modeled
structurally on `src/components/ui/SocialLinks/SocialLinks.test.tsx`. Cases:

1. renders the "Education" heading and all schools passed in `data`;
2. renders the `description` paragraph when present and omits it when absent
   (build fixtures for both — the real data's second entry has none);
3. renders `graduationDate` verbatim (assert the literal
   `'Not graduated (3 years)'` survives un-parsed).

**Verification**: `npm run test` → all pass, including the 3 new cases.

## Done criteria

- [ ] `curl -s http://localhost:<PORT> | grep -c 'id="education"'` → `1`
- [ ] `grep -n "#education" src/components/layout/Header/Header.tsx` → 1 match
- [ ] New test file exists with the 3 cases; `npm run test` exits 0
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` all exit 0
- [ ] Only the six in-scope files modified/created (`git status`)
- [ ] `plans/README.md` status row updated (or reviewer notified)

## STOP conditions

Stop and report back (do not improvise) if:

- The drift check shows changes in in-scope paths since `9ab97da`.
- `Experience.module.css` does NOT contain the date-column grid recipe
  described in "Current state" (would mean the redesign was reverted or this
  plan is stale again).
- The `education` data shape differs from the `Education` type excerpt.

## Maintenance notes

- This is the worked example for adding sections post-redesign: folder +
  kicker number + `navItems` entry + `page.tsx` line, styled by mirroring
  Experience. Numbers are manual; inserting mid-order means renumbering.
- The free-form `graduationDate` is deliberate; don't "normalize" it later
  without checking what `formatDate` would do to `'Not graduated (3 years)'`.
