# Domains: resume vs project subdomains

The resume/apex and the project subdomains live on **separate domains**:

- **Resume / apex** (canonical host, metadata, sitemap, robots, CV download):
  **`carlosmonti.com`** — stays put, not migrating.
- **Project subdomains** (`blockout`, `sound-buttons`, `favicon`, `meli-trends`,
  `gastos`): **`xmontc.xyz`** — migrated here.

## Where each domain comes from

Both domains live in `src/config/site.ts` as two separate atoms:

```ts
export const SITE_DOMAIN = 'carlosmonti.com';
export const SITE_URL = `https://${SITE_DOMAIN}`;

export const PROJECTS_DOMAIN = 'xmontc.xyz';
```

Consumers:

- `SITE_URL` (carlosmonti.com) → `src/app/layout.tsx` (`metadataBase`, `canonical`,
  OpenGraph `url`, JSON-LD `url`), `src/app/sitemap.ts`, `src/app/robots.ts`.
- `PROJECTS_DOMAIN` (xmontc.xyz) → `src/data/resume.ts`, the 5 project subdomains
  (each `https://<name>.${PROJECTS_DOMAIN}`).

Static files that name a domain by hand (cannot import TS):

- `public/llms.txt` — CV line points at `https://carlosmonti.com/carlos-monti-cv.pdf`
  (resume → `carlosmonti.com`).

External project links (`testacode.github.io/*`, `eyesaver.vercel.app`) are **not**
tied to either domain and stay as-is.

## Status

- Resume/apex on `carlosmonti.com`: live (200).
- Project subdomains on `xmontc.xyz`: live (200) — `blockout`, `sound-buttons`,
  `favicon`, `meli-trends`, `gastos` all resolve and serve.

> Note: `llm-toolkit` and `cocos-capital-client` were GitHub Pages projects on
> private repos (no live web anywhere). They are listed as `coming-soon` with no
> `url` in `src/data/resume.ts`.

## If a project subdomain ever moves again

1. Change `PROJECTS_DOMAIN` in `src/config/site.ts` — moves all 5 subdomains at once.
2. **Do not flip until each app is actually live on the new subdomain**, otherwise
   the portfolio ships dead links.
3. DNS: confirm every project subdomain resolves in the new zone and points at its
   deployment.
