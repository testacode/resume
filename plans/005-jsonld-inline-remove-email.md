# Plan 005: Inline the JSON-LD in the initial HTML and stop exposing the personal email

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat ab2e8eb..HEAD -- src/app/layout.tsx src/data/resume.ts src/data/resume.test.ts src/types/resume.ts`
> Plan 001 adds `metadataBase` to `layout.tsx` — that is expected drift. Any
> other mismatch with the excerpts below is a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (001 touches `layout.tsx` too; execute 001 first to avoid conflicts)
- **Category**: bug (privacy) + SEO
- **Planned at**: commit `ab2e8eb`, 2026-06-12

## Why this matters

Two issues share the same code:

1. **Privacy (the operator's explicit decision)**: the owner does not want his
   email published on the site. Today `personal.email` from `src/data/resume.ts`
   is injected into the page's JSON-LD (`layout.tsx` builds a `Person` schema
   including `email`), and — independently — the full `personal` object is
   passed as props to client components (`Hero`), so the email ships in the
   RSC payload of every page load even though no component renders it. Removing
   the field from the data layer kills both exposures at once.
2. **SEO**: the JSON-LD is injected via `next/script` with
   `strategy="afterInteractive"`, meaning it only exists after hydration.
   Crawlers and validators that read the raw HTML never see the `Person`
   schema. The Next.js-documented pattern is a plain inline
   `<script type="application/ld+json">` rendered server-side.

## Current state

- `src/app/layout.tsx`:

```tsx
// layout.tsx:39-56 — jsonLd built from resume data, including email
const { personal } = resumeData;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: personal.name,
  jobTitle: personal.title,
  url: 'https://carlosmonti.com',
  email: personal.email,
  address: { ... },
  sameAs: personal.social.filter((s) => s.enabled).map((s) => s.url),
};
```

```tsx
// layout.tsx:66-72 — injected after hydration
<Script
  id="json-ld"
  type="application/ld+json"
  strategy="afterInteractive"
>
  {JSON.stringify(jsonLd)}
</Script>
```

`Script` is imported at `layout.tsx:4` (`import Script from 'next/script';`).

- `src/data/resume.ts:13` — `email: '[email removed]',` (only
  data-layer occurrence).
- `src/types/resume.ts:48` — `email: string;` inside `PersonalInfo`.
- `src/data/resume.test.ts:9` — `expect(resumeData.personal.email).toBeDefined();`
  (will fail after removal; must be updated in the same change).
- Verified: no component renders `email` — `grep -rn "email" src/components src/app`
  matches only the `layout.tsx` JSON-LD, the type, the data, the test, and the
  `'email'` **icon variant** in `src/types/resume.ts:4` / `SocialLinks.tsx`
  (`iconMap.email`) — the icon variant is part of the `SocialLink` union and
  must NOT be removed.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm install` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm run test` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope** (the only files you should modify):
- `src/app/layout.tsx`
- `src/data/resume.ts`
- `src/types/resume.ts`
- `src/data/resume.test.ts`

**Out of scope** (do NOT touch):
- `src/components/ui/SocialLinks/SocialLinks.tsx` and the `'email'` member of
  the `SocialLink['icon']` union — that's the icon capability, not the address.
- `public/carlos-monti-cv.pdf` / `.docx` — whatever contact info those files
  contain is the operator's call, not this plan's.
- The `metadata` export in `layout.tsx`.

## Git workflow

- Branch: `advisor/005-jsonld-email`
- Suggested commit: `fix(privacy): remove email from data layer and inline JSON-LD in HTML`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Remove `email` from the data layer

1. `src/types/resume.ts` — delete the `email: string;` line from `PersonalInfo`
   (line 48). Leave `SocialLink['icon']`'s `'email'` member alone.
2. `src/data/resume.ts` — delete the `email: '...'` line (line 13).
3. `src/data/resume.test.ts` — delete the single assertion
   `expect(resumeData.personal.email).toBeDefined();` (line 9). Keep the rest
   of that test.

**Verify**: `npx tsc --noEmit` → exit 0 (proves nothing else referenced the field — except `layout.tsx`, fixed next; if tsc reports errors anywhere OTHER than `layout.tsx`, STOP).

### Step 2: Inline the JSON-LD and drop the email field

In `src/app/layout.tsx`:

1. Remove `email: personal.email,` from the `jsonLd` object.
2. Replace the `<Script id="json-ld" ...>...</Script>` block with a plain
   server-rendered script tag:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

3. Delete the now-unused `import Script from 'next/script';` (layout.tsx:4).

(`dangerouslySetInnerHTML` with `JSON.stringify` over the static, locally-owned
`resumeData` object is the pattern Next's own docs use for JSON-LD; there is no
user input in this data.)

**Verify**: `npm run lint` → exit 0. `npx tsc --noEmit` → exit 0.

### Step 3: Confirm the schema is in the initial HTML and the email is gone

`npm run build && npm run start` (or `npm run dev`), then:

**Verify**: `curl -s http://localhost:3000 | grep -c 'application/ld+json'` → `1`
(present in raw HTML, pre-hydration).
**Verify**: `curl -s http://localhost:3000 | grep -ci '[redacted]'` → `0`
(the address appears nowhere in the served page, including the RSC payload).
Stop the server afterwards.

## Test plan

- Updated test: `src/data/resume.test.ts` no longer asserts `email` (step 1.3).
- The curl gates in step 3 are the regression checks for both the SEO and the
  privacy halves.
- **Verification**: `npm run test` → all pass.

## Done criteria

- [ ] `grep -rn "personal.email\|email:" src/app src/data src/types | grep -v "icon"` → no matches referencing an email address field
- [ ] `curl -s http://localhost:3000 | grep -ci [redacted]` → `0`
- [ ] `curl -s http://localhost:3000 | grep -c 'application/ld+json'` → `1`
- [ ] `grep -n "next/script" src/app/layout.tsx` → no matches
- [ ] `npm run lint`, `npm run test`, `npm run build`, `npx tsc --noEmit` all exit 0
- [ ] Only the four in-scope files modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `tsc --noEmit` after step 1 reports `email` usages in files other than
  `src/app/layout.tsx` (means a consumer this plan didn't map exists).
- The `jsonLd` block in `layout.tsx` no longer matches the excerpt (beyond
  plan 001's `metadataBase` addition).
- The curl check still finds the email string after step 2 (would mean another
  exposure path exists — report where the grep of `.next` output finds it).

## Maintenance notes

- Plan 009 adds a LinkedIn contact CTA precisely because email is no longer a
  contact channel — if a future maintainer re-adds `email` to `PersonalInfo`,
  they are reversing an explicit owner decision; reviewers should question it.
- The email may still exist inside `public/carlos-monti-cv.pdf`/`.docx`
  (not inspected here). The operator knows; downloading a CV is a deliberate
  act by the visitor, unlike page-source exposure.
