# Plan 012: Change the hero terminal-prompt username from `carlos` to `charly`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. Touch
> only the file in scope. If a STOP condition occurs, stop and report. When
> done, update the status row in `plans/README.md` — unless your reviewer told
> you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 2fbd3cd..HEAD -- src/components/sections/Hero/Hero.tsx`
> If the file changed since this plan was written, compare the "Current state"
> excerpt against the live code; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S (one-word literal change)
- **Risk**: LOW
- **Depends on**: 011 DONE (introduced the prompt)
- **Category**: direction (copy)
- **Planned at**: commit `2fbd3cd`, 2026-06-12

## Why this matters

The hero terminal prompt added in plan 011 reads `carlos@portfolio:~$`. The
owner wants the prompt username to be `charly` (his handle). Constraint from
the owner: the displayed full name must stay "Carlos Monti" and must NOT become
"Charly Monti" — so ONLY the prompt's username literal changes; the `<h1>` name
(driven by `resume.ts`) is untouched. Result: `charly` lives only in the
prompt, "Carlos Monti" remains the rendered name.

## Current state

```tsx
// src/components/sections/Hero/Hero.tsx:20-24
<motion.div initial="hidden" animate="visible" variants={heroItem(0.1)}>
  <p className={styles.greeting}>
    <span className={styles.prompt}>carlos@portfolio:~$</span> whoami
  </p>
</motion.div>
```

The `<h1 className={styles.name}>{name}</h1>` two lines below renders `name`
from `resumeData.personal.name` (`'Carlos Monti'`) — this is OUT of scope and
must not change.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `npm run lint` | exit 0 |
| Tests | `npm run test` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**: `src/components/sections/Hero/Hero.tsx` — the prompt literal only.

**Out of scope** (do NOT touch):
- `src/data/resume.ts` / the `{name}` expression — the full name stays "Carlos Monti".
- `Hero.module.css`, the `whoami` text, any other component.

## Git workflow

- Work on `master` directly. One commit: `feat(hero): change prompt username to charly`.
- Stage only `src/components/sections/Hero/Hero.tsx`, never `plans/`.

## Steps

### Step 1: Change the username literal

In `Hero.tsx`, change `carlos@portfolio:~$` to `charly@portfolio:~$` inside the
`.prompt` span. Nothing else on the line or in the file changes.

**Verify**:
- `grep -c "charly@portfolio:~\$" src/components/sections/Hero/Hero.tsx` → `1`
- `grep -c "carlos@portfolio" src/components/sections/Hero/Hero.tsx` → `0`
- `grep -c "{name}" src/components/sections/Hero/Hero.tsx` → `1` (the h1 name expression is untouched)
- `npm run lint` → exit 0

### Step 2: Confirm the rendered name is still "Carlos Monti"

Build and check the static HTML (no behavior depends on a running server here).

**Verify**: `npm run build` → exit 0, then
`grep -c "Carlos Monti" .next/server/app/index.html` → `≥1` (the h1 still
renders the full name), and
`grep -c "Charly Monti" .next/server/app/index.html` → `0`.

## Test plan

No new test — this is a copy change to static JSX, and no existing test asserts
the prompt string. Run `npm run test` to confirm nothing regressed.

## Done criteria

- [ ] `grep -c "charly@portfolio" src/components/sections/Hero/Hero.tsx` → `1`
- [ ] `grep -c "carlos@portfolio" src/components/sections/Hero/Hero.tsx` → `0`
- [ ] `grep -c "Charly Monti" .next/server/app/index.html` → `0`
- [ ] `npm run lint`, `npm run test`, `npm run build` all exit 0
- [ ] Only `src/components/sections/Hero/Hero.tsx` modified (`git status`)
- [ ] `plans/README.md` status row updated (or reviewer notified)

## STOP conditions

Stop and report back if:
- The prompt span no longer matches the "Current state" excerpt (drift).
- Changing the username would require touching `resume.ts` or the `{name}`
  expression (it must not — they are separate).

## Maintenance notes

- The prompt username (`charly`) and the displayed full name ("Carlos Monti",
  from `resume.ts`) are intentionally decoupled. A reviewer should reject any
  future change that derives one from the other or makes the h1 read "Charly".
