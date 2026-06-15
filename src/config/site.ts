// Single source of truth for the site domain.
//
// CUTOVER to xmontc.xyz: on migration day, change BASE_DOMAIN to 'xmontc.xyz'.
// That one edit moves the apex site and every project subdomain at once.
// Full checklist (static files, wrangler, DNS): docs/domain-cutover.md
export const BASE_DOMAIN = 'carlosmonti.com';

export const SITE_URL = `https://${BASE_DOMAIN}`;
