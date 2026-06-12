# Plan 009: Give the "Contact" block a real contact channel — a LinkedIn CTA (no email exposure)

> **REFRESHED 2026-06-12** against the post-redesign editorial system
> (plan 010, commits `1a8a279` + `9ab97da`). The original version cloned the
> old bordered `.downloadButton` recipe, which no longer exists.
>
> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless your reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9ab97da..HEAD -- src/components/sections/About`
> Any change since `9ab97da` is unexpected (plan 008 does not touch About) —
> compare against the excerpts below; on a mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: 005 (email removed — this is the replacement channel), 006, 010 — ALL DONE as of this refresh
- **Category**: direction (UX)
- **Planned at**: commit `9ab97da`, 2026-06-12 (refreshed; originally `ab2e8eb`)

## Why this matters

The About section has a block headed **"Contact"** that contains a name and a
city — no actual way to contact anyone. The owner explicitly does NOT want his
email published (plan 005 removed it from the data layer and JSON-LD), and
chose LinkedIn as the contact channel: it's already in the data
(`resume.ts` social array, `enabled: true`), recruiters live there, zero
backend. This plan turns the dead "Contact" block into a working CTA in the
post-redesign editorial style.

## Current state

- `src/components/sections/About/About.tsx` — the Contact block (wrappers are
  `motion.div` since plan 006):

```tsx
<div className={styles.info}>
  <h3>Contact</h3>
  <p>{name}</p>
  <p>
    {address.city}, {address.country}
  </p>
</div>
```

The component destructures
`const { name, bio, address, resumePdfUrl, resumeDocxUrl } = data;` —
`social` is available on `data` but not destructured. `FiDownload` is imported
from `'react-icons/fi'` for the resume links.

- `src/components/sections/About/About.module.css` — post-redesign
  `.downloadButton` is a plain mono accent link (THE recipe to clone):

```css
.downloadButton {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-accent);
}

.downloadButton:hover { color: var(--color-accent-hover); }
```

- `src/data/resume.ts` — the LinkedIn entry:
  `{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/carlosmonti/', icon: 'linkedin', enabled: true }`.
- LinkedIn icon convention: `FaLinkedinIn` from `'react-icons/fa'` (already
  used in `src/components/ui/SocialLinks/SocialLinks.tsx`).
- Post-plan-005, `PersonalInfo` has NO `email` field — test fixtures must not
  include one.
- Accent-rationing rule from the redesign: links are a sanctioned accent use —
  this CTA uses `--color-accent` like the download links. Do NOT use
  `--color-accent-warm` (zero consumers post-redesign, intentionally dormant).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Tests | `npm run test` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope** (the only files you may modify/create):
- `src/components/sections/About/About.tsx`
- `src/components/sections/About/About.module.css`
- `src/components/sections/About/About.test.tsx` (create)

**Out of scope** (do NOT touch):
- `src/data/resume.ts` / `src/types/resume.ts` — the LinkedIn data already exists.
- `src/components/ui/SocialLinks/**` — the icon row stays as is.
- Re-adding any email/mailto anywhere — explicitly against the owner's decision.
- `globals.css` tokens.

## Git workflow

- Work on `master` directly (operator's standing instruction). One commit:
  `feat(about): add LinkedIn contact CTA to the Contact block`.
- Stage only in-scope files, never `plans/`.

## Steps

### Step 1: Add the CTA to the Contact block

In `About.tsx`:

1. Destructure `social`: `const { name, bio, address, social, resumePdfUrl, resumeDocxUrl } = data;`
2. Resolve: `const linkedin = social.find((s) => s.icon === 'linkedin' && s.enabled);`
3. Import `FaLinkedinIn` from `'react-icons/fa'`.
4. Extend the Contact block:

```tsx
<div className={styles.info}>
  <h3>Contact</h3>
  <p>{name}</p>
  <p>
    {address.city}, {address.country}
  </p>
  {linkedin && (
    <a
      href={linkedin.url}
      className={styles.contactButton}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get in touch with me on LinkedIn"
    >
      <FaLinkedinIn size={14} aria-hidden="true" />
      Get in touch <span aria-hidden="true">→</span>
    </a>
  )}
</div>
```

**Verify**: `npx tsc --noEmit` → exit 0.

### Step 2: Style it — clone the mono-link recipe

In `About.module.css`, add after the `.info p` rule:

```css
.contactButton {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-accent);
  margin-top: var(--space-3);
}

.contactButton:hover { color: var(--color-accent-hover); }
```

(Identical to `.downloadButton` plus the `margin-top` separating it from the
city line. Visual kinship between the two link families is the point.)

**Verify**: `npm run lint` → exit 0.

### Step 3: Visual + behavior check

On the dev server (read the real port from startup output), at `#about`:

1. "Get in touch →" renders under the city in Plex Mono + teal, same register
   as the PDF/DOCX links.
2. Tab reaches it; the global `:focus-visible` outline shows.
3. Click opens LinkedIn in a new tab.
4. Both themes look correct (token swap is automatic).

**Verify**: observations recorded.

## Test plan

New `src/components/sections/About/About.test.tsx`, modeled on
`src/components/ui/SocialLinks/SocialLinks.test.tsx`. Fixture must satisfy the
CURRENT `PersonalInfo` (no `email` field). Cases:

1. renders the "Get in touch" link with `href` equal to the enabled LinkedIn
   URL from the fixture;
2. omits the link when no enabled linkedin entry exists (`enabled: false`);
3. the link has `target="_blank"` and `rel` containing `noopener`.

**Verification**: `npm run test` → all pass, including 3 new cases.

## Done criteria

- [ ] `grep -n "Get in touch" src/components/sections/About/About.tsx` → 1 match
- [ ] `grep -rn "mailto:" src/` → no matches
- [ ] `grep -n "accent-warm" src/components/sections/About/About.module.css` → no matches
- [ ] New `About.test.tsx` exists with the 3 cases; `npm run test` exits 0
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` all exit 0
- [ ] Only the three in-scope files modified/created (`git status`)
- [ ] `plans/README.md` status row updated (or reviewer notified)

## STOP conditions

Stop and report back (do not improvise) if:

- The Contact block or `.downloadButton` recipe doesn't match the excerpts
  (post-`9ab97da` drift).
- `PersonalInfo` has an `email` field (inconsistent with plan 005 DONE —
  report, don't guess).
- The LinkedIn entry in `resume.ts` is disabled or missing.

## Maintenance notes

- If the owner later wants a contact form (Cloudflare Worker + Resend was
  evaluated and deferred for maintenance cost), this CTA is what it replaces.
- `.downloadButton` and `.contactButton` are intentionally identical recipes;
  if one changes, change both or extract a shared class then (not now).
- `--color-accent-warm` remains consumer-less after this plan — candidate for
  token cleanup in a future pass.
