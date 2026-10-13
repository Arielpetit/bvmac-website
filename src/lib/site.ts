/**
 * Public address of the site, used for canonical links, the sitemap and share previews.
 * Set SITE_URL at build time (see .env.production); the real domain is the default.
 */
export const SITE_URL = (process.env.SITE_URL ?? "https://www.bvmac.cm").replace(/\/$/, "");
