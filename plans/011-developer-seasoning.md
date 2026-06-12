# Plan 011: Developer seasoning — terminal prompt, live status dots, version-string footer, link-arrow hover

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. Where the plan gives target CSS/TSX, reproduce it
> faithfully — these are deliberate, operator-approved design decisions; do not
> add flourishes beyond what is specified. When done, update the status row for
> this plan in `plans/README.md` — unless your reviewer told you they maintain
> the index.
>
> **Drift check (run first)**: `git diff --stat 0e6176b..HEAD -- src/components/sections/Hero src/components/sections/Projects src/components/layout/Footer`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3 (polish; operator-requested)
- **Effort**: M
- **Risk**: LOW — additive cosmetic touches, color tokens unchanged, all motion gated by existing reduced-motion handling
- **Depends on**: plan 010 DONE (post-redesign editorial system is the baseline). 008/009 also DONE — no conflict.
- **Category**: direction (design polish)
- **Planned at**: commit `0e6176b`, 2026-06-12

## Why this matters

The owner approved the editorial redesign (plan 010) but flagged it as a touch
bland for a developer's site ("medio insulsa para un developer pero sobria").
The agreed fix is **four small, high-signal touches** that read as "a developer
built this" without returning to additive decoration (the "AI slop" the
redesign removed). Each replaces nothing-or-generic with a developer-native
signal:

1. **Terminal prompt** — the hero kicker `Hello, I'm` becomes a shell prompt.
2. **Live status dots** — each project gets a status indicator (uptime/monitoring vibe), backed by the real `status` field already in the data.
3. **Version-string footer** — `Built with Next.js` becomes a stack/runtime version string.
4. **Link-arrow hover** — restore the sliding `→` micro-interaction on project links (the arrow glyph is already in the markup; only its motion was lost in the redesign).

**Design guardrails** (apply when any detail is ambiguous):
- Color tokens are FROZEN — use existing `--color-*` only, change no values.
- Mono = signal — the new mono text (prompt, version string) is consistent with
  the redesign's rule that IBM Plex Mono marks technical elements.
- Accent rationing holds — the prompt's `$` and the live dot are sanctioned
  accent uses (like kickers and links); do not add teal elsewhere.
- Everything animated must be invisible to `prefers-reduced-motion` users — the
  global kill switch in `globals.css` (`@media (prefers-reduced-motion: reduce)`
  zeroes all `transition-duration`/`animation`) already covers CSS transitions;
  do not add JS-driven motion.

## Current state

All paths relative to repo root. HEAD is `0e6176b`.

### Touch 1 — Hero kicker (`src/components/sections/Hero/Hero.tsx` + `.module.css`)

```tsx
// Hero.tsx:20-22
<motion.div initial="hidden" animate="visible" variants={heroItem(0.1)}>
  <p className={styles.greeting}>Hello, I&apos;m</p>
</motion.div>
```

```css
/* Hero.module.css:21-27 */
.greeting {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-accent);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

### Touch 2 + 4 — Projects (`src/components/sections/Projects/Projects.tsx` + `.module.css`)

```tsx
// Projects.tsx:30-37 — project article + name (status field already drives the "coming soon" label)
<motion.article key={project.id} variants={scaleIn} className={styles.row}>
  <div className={styles.main}>
    <h3 className={styles.projectName}>
      {project.name}
      {project.status === 'coming-soon' && (
        <span className={styles.soon}>coming soon</span>
      )}
    </h3>
```

```tsx
// Projects.tsx:39-52 — links already contain the arrow glyph as an aria-hidden span
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
```

```css
/* Projects.module.css:44-75 — name, links, link recipe */
.projectName {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--color-text-display);
}
/* ... */
.links { display: flex; gap: var(--space-6); margin-top: var(--space-3); }

.link {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-accent);
}

.link:hover { color: var(--color-accent-hover); }
```

- `Project.status` type is `'live' | 'coming-soon'` (`src/types/resume.ts`).
  The data (`src/data/resume.ts`) currently has 8 `live` and 1 `coming-soon`?
  — verify with `grep -c "status: 'live'" src/data/resume.ts` and
  `grep -c "coming-soon" src/data/resume.ts`. (At planning time: all entries
  are `live`. The dot logic must still handle both.)
- Projects has NO existing test file.

### Touch 3 — Footer (`src/components/layout/Footer/Footer.tsx` + `.module.css`)

```tsx
// Footer.tsx (entire body)
export function Footer({ social, name }: Props) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <SocialLinks links={social} size="sm" />
        <p className={styles.copyright}>
          © {currentYear} {name}. Built with Next.js
        </p>
      </div>
    </footer>
  );
}
```

```css
/* Footer.module.css:16-20 */
.copyright {
  font-size: var(--text-xs);
  font-weight: 300;
  color: var(--color-text-muted);
}
```

- `package.json`: `"version": "2.0.0"`, `"next": "^16.1.6"`. Deploy target is
  Cloudflare Workers (per CLAUDE.md). Footer has NO existing test file.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Tests | `npm run test` | exit 0 |
| Build | `npm run build` | exit 0 |
| Contrast audit | `npx -y lighthouse http://localhost:<PORT> --only-audits=color-contrast --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh.json && node -e "const r=require('/tmp/lh.json');console.log(r.audits['color-contrast'].score)"` | prints `1` (run with `--force-dark-mode` too) |

Port note: 3000 is often occupied by another project; stray servers may idle on
3098/3099. Read your own dev server's startup output for the real port.

## Scope

**In scope** (the only files you may modify/create):
- `src/components/sections/Hero/Hero.tsx`, `Hero.module.css`
- `src/components/sections/Projects/Projects.tsx`, `Projects.module.css`
- `src/components/sections/Projects/Projects.test.tsx` (create)
- `src/components/layout/Footer/Footer.tsx`, `Footer.module.css`

**Out of scope** (do NOT touch):
- `src/app/globals.css` — no color/token changes.
- `src/lib/animations.ts` — hero entrance variants stay as is.
- About/Experience/Education components and their `.link`/`.contactButton`
  recipes — the arrow hover is scoped to PROJECT links only.
- `src/data/resume.ts`, `src/types/resume.ts` — the `status` field already exists.

## Git workflow

- Work on `master` directly (operator's standing instruction). One commit:
  `feat(design): add developer-signal touches (prompt, status dots, version footer, link hover)`.
- Stage only in-scope files explicitly, never `plans/`.

## Steps

### Step 1: Terminal prompt in the hero

`Hero.tsx`: replace the greeting text. Keep the `motion.div` wrapper and
`heroItem(0.1)` variant exactly.

```tsx
<motion.div initial="hidden" animate="visible" variants={heroItem(0.1)}>
  <p className={styles.greeting}>
    <span className={styles.prompt}>carlos@portfolio:~$</span> whoami
  </p>
</motion.div>
```

`Hero.module.css`: `.greeting` loses the uppercase/letter-spacing (those were
the old kicker style) and becomes mono; the `$` prompt carries the accent:

```css
.greeting {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-text-muted);
}

.prompt { color: var(--color-accent); }
```

**Optional caret (DO NOT implement by default — opt-in only).** The operator
deferred a blinking caret as opt-in. Leave it out. If — and only if — a future
request asks for it, the gated recipe is: append
`<span className={styles.caret} aria-hidden="true" />` after `whoami`, with
```css
.caret { display: inline-block; width: 0.5em; height: 1em; margin-left: 2px;
  background: var(--color-accent); vertical-align: text-bottom;
  animation: blink 1.1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .caret { animation: none; } }
```
Do not add this now.

**Verify**: `npm run lint` → exit 0; `grep -c "whoami" src/components/sections/Hero/Hero.tsx` → `1`.

### Step 2: Live status dots on projects

`Projects.tsx`: add a status dot as the first child of `.projectName`, before
`{project.name}`. It is decorative (`aria-hidden`) — the `coming soon` text
label already conveys that state to assistive tech; a `live` project needs no
spoken announcement.

```tsx
<h3 className={styles.projectName}>
  <span
    className={`${styles.statusDot} ${project.status === 'live' ? styles.live : styles.comingSoon}`}
    aria-hidden="true"
  />
  {project.name}
  {project.status === 'coming-soon' && (
    <span className={styles.soon}>coming soon</span>
  )}
</h3>
```

`Projects.module.css`: add after `.projectName`:

```css
.statusDot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  margin-right: var(--space-3);
  vertical-align: middle;
}

.live { background-color: var(--color-accent); }

.comingSoon {
  background-color: transparent;
  border: 1px solid var(--color-text-muted);
}
```

If `vertical-align: middle` leaves the dot visibly off-center against the
`--text-xl` display heading, nudge with a small `transform: translateY(...)`
or adjust `vertical-align` — this is the one place to use visual judgment;
keep the dot optically centered on the cap height of the name.

**Verify**: `npm run lint` → exit 0;
`grep -c "statusDot" src/components/sections/Projects/Projects.tsx` → `1`.

### Step 3: Link-arrow hover on project links

`Projects.module.css` only (the `→` span already exists in the TSX — do NOT
edit `Projects.tsx` for this touch). Make the arrow glyph animate on hover via
a descendant selector:

```css
.link span {
  display: inline-block;
  transition: transform var(--transition-fast);
}

.link:hover span {
  transform: translateX(4px);
}
```

The global reduced-motion media query already neutralizes this transition for
users who opt out — no extra gating needed (do NOT duplicate the media query
here). The `transition-fast` token already exists in `globals.css`.

**Verify**: `npm run lint` → exit 0;
`grep -c "translateX(4px)" src/components/sections/Projects/Projects.module.css` → `1`.

### Step 4: Version-string footer

`Footer.tsx`: replace the `Built with Next.js` copy with a mono version string.
Keep the dynamic year. The string is intentionally hardcoded (a portfolio's
stack changes rarely; reading `package.json` into the client bundle is
overkill) — but factor the parts into a small const so the maintenance note
has an obvious anchor:

```tsx
export function Footer({ social, name }: Props) {
  const currentYear = new Date().getFullYear();
  const buildInfo = 'v2.0.0 · next 16 · cloudflare workers';
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <SocialLinks links={social} size="sm" />
        <p className={styles.copyright}>
          <span className={styles.build}>{buildInfo}</span>
          © {currentYear} {name}
        </p>
      </div>
    </footer>
  );
}
```

`Footer.module.css`: keep `.copyright` as is, add a mono build span. Stack the
two lines on mobile, inline them with a separator gap on wider screens:

```css
.copyright {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--text-xs);
  font-weight: 300;
  color: var(--color-text-muted);
}

.build {
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
}

@media (min-width: 768px) {
  .copyright { flex-direction: row; gap: var(--space-3); align-items: baseline; }
}
```

**Verify**: `npm run lint` → exit 0;
`grep -c "Built with Next.js" src/components/layout/Footer/Footer.tsx` → `0`.

### Step 5: Full verification battery

1. `npx tsc --noEmit` → exit 0; `npm run test` → exit 0 (after step 6's test).
2. `npm run build` → exit 0.
3. Start dev server; Lighthouse contrast audit → `1` in light AND
   `--force-dark-mode` (the new mono text on muted/secondary tokens must still
   pass — `.greeting` is `--color-text-muted`, `.build` is
   `--color-text-secondary`).
4. Screenshots (chrome-devtools MCP), both themes, full page, saved INSIDE the
   repo working tree (the MCP only writes within workspace roots) as
   `/Users/carlosmonti/Projects/github/resume/seasoning-light.png` and
   `seasoning-dark.png` — your reviewer deletes them after the visual check.
   Confirm: hero shows the `$ whoami` prompt; each project name has a leading
   dot; footer shows the version string.

**Verify**: all four recorded; note the screenshot paths in your report.

## Test plan

Create `src/components/sections/Projects/Projects.test.tsx` — the status-dot
logic is the only new conditional worth testing (the prompt and footer are
static copy; the arrow hover is CSS). Stub `IntersectionObserver` in a
`beforeAll` exactly as `src/components/sections/About/About.test.tsx` and
`Education.test.tsx` do (JSDOM lacks it; `motion.section` uses `whileInView`).
Cases:

1. a `live` project's name has a dot element carrying the `live` class;
2. a `coming-soon` project's dot carries the `comingSoon` class AND the
   `coming soon` text label still renders;
3. the dot is `aria-hidden` (query by test id or class, assert the attribute).

Use a minimal `Project[]` fixture with one `live` and one `coming-soon` entry.
Model file structure on `Education.test.tsx`.

**Verification**: `npm run test` → all pass, including the 3 new cases.

## Done criteria

- [ ] `grep -c "whoami" src/components/sections/Hero/Hero.tsx` → `1`
- [ ] `grep -c "statusDot" src/components/sections/Projects/Projects.tsx` → `1`
- [ ] `grep -c "translateX(4px)" src/components/sections/Projects/Projects.module.css` → `1`
- [ ] `grep -c "Built with Next.js" src/components/layout/Footer/Footer.tsx` → `0`
- [ ] Lighthouse color-contrast = `1` in both themes
- [ ] No color token VALUES changed: `git diff 0e6176b..HEAD -- src/app/globals.css` → empty
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build` all exit 0
- [ ] New `Projects.test.tsx` with the 3 cases passes
- [ ] Both screenshots exist and show the four touches
- [ ] Only in-scope files modified/created (`git status`)
- [ ] `plans/README.md` status row updated (or reviewer notified)

## STOP conditions

Stop and report back (do not improvise) if:

- Any in-scope file no longer matches its "Current state" excerpt (drift).
- Lighthouse contrast drops below `1` after the changes (the new mono text uses
  muted/secondary tokens — if one fails, report which element; do NOT change
  token values, that's out of scope).
- Making the status dot align with the heading would require touching the
  heading's font-size or the `.soon` span (it should not — only the dot's own
  CSS).
- A verification fails twice after a reasonable fix attempt.

## Maintenance notes

- The footer version string is **hardcoded** in `Footer.tsx` (`buildInfo`
  const). When the stack bumps (Next major, project version in `package.json`,
  or deploy target), update it by hand — there is no automated link. A reviewer
  should check it still matches reality.
- The status dot maps `status === 'live'` → filled, else hollow. If a third
  `status` value is ever added to the `Project` type, the ternary collapses it
  into the hollow/coming-soon branch — revisit the mapping then.
- The arrow-hover uses a `.link span` descendant selector; if a future change
  puts another `<span>` inside a project `.link`, it would also animate. Keep
  the arrow the only span in those anchors, or switch to an explicit `.arrow`
  class.
- Accent budget after this plan: prompt `$`, live dots, links, kickers, hero
  accent line. That is the ceiling — further teal additions break the
  redesign's rationing rule.
