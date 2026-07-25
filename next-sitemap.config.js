/**
 * Static sitemap + robots.txt generated at build time (npm run build → postbuild).
 * Domain comes from site.config.js — change it there when deploying to a new domain.
 */
const { SITE_URL } = require('./site.config.js');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  // Hreflang lives in per-page metadata + /sitemap/[chunk] (avoid duplicate homepage alternates).
};
