// Site domains. Resume/apex and project subdomains live on SEPARATE domains.
//
// - Resume/apex (canonical host, metadata, sitemap, robots, CV): carlosmonti.com — stays put.
// - Project subdomains (blockout, sound-buttons, favicon, meli-trends, gastos): xmontc.xyz.
// Details: docs/domain-cutover.md
export const SITE_DOMAIN = 'carlosmonti.com';
export const SITE_URL = `https://${SITE_DOMAIN}`;

export const PROJECTS_DOMAIN = 'xmontc.xyz';
