# Plan 001: Add Open Graph image and metadataBase so shared links show a preview card

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat ab2e8eb..HEAD -- src/app/layout.tsx src/app/opengraph-image.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW (additive; only risk is OpenNext/Cloudflare compatibility, covered by a STOP condition)
- **Depends on**: none
- **Category**: direction (SEO/UX)
- **Planned at**: commit `ab2e8eb`, 2026-06-12

## Why this matters

This is a resume/portfolio site whose #1 sharing context is a recruiter pasting
the URL into LinkedIn, Slack, or Twitter/X. The metadata declares
`twitter.card: 'summary_large_image'` but **no image exists anywhere**: there is
no `images` field in `openGraph`, no `opengraph-image` file convention, and no
image asset in `public/` (verified: only `carlos-monti-cv.docx`, `carlos-monti-cv.pdf`,
`favicon.ico`, `llms.txt`, `robots.txt`). There is also no `metadataBase`, so any
relative image URL would not resolve to absolute in the OG tags. Today every
share renders as a bare text link.

## Current state

- `src/app/layout.tsx` — only metadata source in the repo. Lines 9–37 export `metadata`:

```ts
// src/app/layout.tsx:9-37 (excerpt)
export const metadata: Metadata = {
  title: 'Carlos Monti | Senior Front End Developer',
  ...
  alternates: {
    canonical: 'https://carlosmonti.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://carlosmonti.com',
    siteName: 'Carlos Monti Portfolio',
    title: 'Carlos Monti | Senior Front End Developer',
    description: '...',
  },
  twitter: {
    card: 'summary_large_image',
    ...
  },
```

- There is no `src/app/opengraph-image.*` file.
- Design tokens (use these values in the image to match the brand):
  dark background `oklch(0.14 0.012 175)` ≈ `#1a2322`, teal accent in dark mode
  `oklch(0.80 0.14 175)` ≈ `#5fd4c0`, near-white text `oklch(0.96 0.006 175)` ≈ `#f2f5f4`.
  Aesthetic per `CLAUDE.md`: modern, minimalist; Inter-like sans for body, mono accents.
- The site deploys to Cloudflare Workers via `@opennextjs/cloudflare` (see
  `package.json` scripts `build:cloudflare` / `deploy:cloudflare`). `next/og`
  `ImageResponse` is supported by recent `@opennextjs/cloudflare` versions, but
  this must be verified in step 4.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm install` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Tests | `npm run test` | exit 0, all pass |
| Build (Next) | `npm run build` | exit 0; route list includes `/opengraph-image` |
| Build (Cloudflare) | `npm run build:cloudflare` | exit 0 |

## Scope

**In scope** (the only files you should modify/create):
- `src/app/layout.tsx` (add `metadataBase`)
- `src/app/opengraph-image.tsx` (create)

**Out of scope** (do NOT touch):
- `src/app/sitemap.ts`, `public/robots.txt` — unrelated SEO surface.
- The JSON-LD block in `layout.tsx` (lines 41–56 and the `<Script>` at 66–72) — plan 005 owns it.
- Do not add image assets to `public/` (the file-convention route generates the image).

## Git workflow

- Branch: `advisor/001-og-image`
- Conventional commits (repo convention, e.g. `f1efbde chore(deps): ...`). Suggested: `feat(seo): add opengraph image and metadataBase`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add `metadataBase`

In `src/app/layout.tsx`, add as the FIRST property of the `metadata` object:

```ts
metadataBase: new URL('https://carlosmonti.com'),
```

**Verify**: `npm run lint` → exit 0.

### Step 2: Create `src/app/opengraph-image.tsx`

Create the file using Next's file convention with `ImageResponse` from `next/og`.
Target shape (1200×630, dark brand background, name large, title below, teal
accent line — mirrors the Hero section hierarchy):

```tsx
import { ImageResponse } from 'next/og';
import { resumeData } from '@/data/resume';

export const alt = 'Carlos Monti — Senior Front End Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const { name, title } = resumeData.personal;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#1a2322',
        }}
      >
        <div style={{ fontSize: 28, color: '#5fd4c0', letterSpacing: 4, textTransform: 'uppercase' }}>
          Hello, I&apos;m
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, color: '#f2f5f4', marginTop: 16 }}>{name}</div>
        <div style={{ fontSize: 40, color: '#9fb0ad', marginTop: 12 }}>{title}</div>
        <div style={{ width: 120, height: 4, backgroundColor: '#5fd4c0', marginTop: 40 }} />
      </div>
    ),
    size
  );
}
```

Do not pass a `fonts` option — `next/og` ships a bundled default font; the
local `src/app/fonts/*.woff2` files are woff2, which satori cannot load.

**Verify**: `npm run build` → exit 0 and the build output route table includes `/opengraph-image`.

### Step 3: Confirm the tags render

Start the dev server (`npm run dev`), then:

**Verify**: `curl -s http://localhost:3000 | grep -o 'og:image[^>]*'` → at least one
match containing an **absolute** URL (`https://carlosmonti.com/opengraph-image...`
or the localhost equivalent resolved via metadataBase).
**Verify**: `curl -s -o /dev/null -w "%{http_code} %{content_type}" http://localhost:3000/opengraph-image` → `200 image/png`.
Stop the dev server afterwards.

### Step 4: Cloudflare build gate

**Verify**: `npm run build:cloudflare` → exit 0. (This catches OpenNext
incompatibility with `ImageResponse` before deploy. Do NOT run `deploy:cloudflare`.)

## Test plan

No new unit tests: the route is framework-generated and exercised by the build +
curl gates above. Run `npm run test` to confirm nothing regressed (the suite
imports `resumeData`, which this plan reads but does not modify).

## Done criteria

- [ ] `npm run lint` exits 0
- [ ] `npm run test` exits 0
- [ ] `npm run build` exits 0 and lists `/opengraph-image`
- [ ] `npm run build:cloudflare` exits 0
- [ ] `curl http://localhost:3000/opengraph-image` returns `200` with `image/png`
- [ ] Rendered HTML contains `og:image` and `twitter:image` absolute URLs
- [ ] Only `src/app/layout.tsx` and `src/app/opengraph-image.tsx` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `npm run build:cloudflare` fails with an error mentioning `ImageResponse`,
  `satori`, `wasm`, or `next/og`. Report the error; the fallback (a static
  `src/app/opengraph-image.png`) is a design-asset decision for the operator.
- The `metadata` export in `layout.tsx` no longer matches the excerpt above.
- `next/og` import fails to resolve (would indicate a Next 16 API change).

## Maintenance notes

- If the accent/background tokens in `src/app/globals.css` change, the hex
  values hardcoded in `opengraph-image.tsx` will drift from the brand —
  there is no mechanism linking them; note this in review.
- If a custom domain other than `carlosmonti.com` is added, `metadataBase`
  must follow.
