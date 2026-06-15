# Domain cutover: carlosmonti.com → xmontc.xyz

Runbook for the migration day. The code is already prepared so the switch is
essentially **one line plus infra**. Canonical host decided: **apex
`xmontc.xyz`** (no `www`).

## What's already centralized

All site URLs derive from a single atom in `src/config/site.ts`:

```ts
export const BASE_DOMAIN = 'carlosmonti.com';
export const SITE_URL = `https://${BASE_DOMAIN}`;
```

Consumers that update automatically when `BASE_DOMAIN` changes:

- `src/app/layout.tsx` — `metadataBase`, `canonical`, OpenGraph `url`, JSON-LD `url`
- `src/app/sitemap.ts` — sitemap entry
- `src/app/robots.ts` — `Sitemap:` line (migrated from the old static `public/robots.txt`)
- `src/data/resume.ts` — the 5 project subdomains: `blockout`, `sound-buttons`,
  `favicon`, `meli-trends`, `gastos` (each `https://<name>.${BASE_DOMAIN}`)

External project links (`testacode.github.io/*`, `eyesaver.vercel.app`) are **not**
tied to the domain and stay as-is.

## Cutover steps (in order)

1. **Code switch** — in `src/config/site.ts`, change `BASE_DOMAIN` to `'xmontc.xyz'`.
   This moves the apex site **and** all 5 project subdomains at once.
2. **Static file** — `public/llms.txt`, the CV line (`https://carlosmonti.com/carlos-monti-cv.pdf`)
   → `https://xmontc.xyz/carlos-monti-cv.pdf`. Plain text, cannot import TS; edit by hand.
3. **Worker route** — `wrangler.toml`: change the route from `www.xmontc.xyz/*` to
   `xmontc.xyz/*` (apex is now canonical).
4. **Redirect Rule (Cloudflare)** — invert the current rule so `www.xmontc.xyz` → `xmontc.xyz`
   (today it's apex → www).
5. **DNS / deployments** — confirm the apex and every project subdomain
   (`blockout`, `sound-buttons`, `favicon`, `meli-trends`, `gastos`) resolve in the
   `xmontc.xyz` zone and point at their deployments. **Do not flip the resume links
   until each app is actually live on its new subdomain** — otherwise the portfolio
   ships dead links.

## Post-deploy verification

- `https://xmontc.xyz/robots.txt` → `Sitemap: https://xmontc.xyz/sitemap.xml`
- `https://xmontc.xyz/sitemap.xml` → lists the new apex
- `curl -I https://www.xmontc.xyz` → 301 to apex
- View source: `og:url`, `<link rel="canonical">` and JSON-LD `url` all point to `xmontc.xyz`
- Every project link in the Projects section opens without a 404
- Google Search Console: add `xmontc.xyz` property, submit the sitemap, file a
  Change of Address from `carlosmonti.com`
- Keep a `carlosmonti.com → xmontc.xyz` redirect alive for a while to preserve SEO
  and inbound links
