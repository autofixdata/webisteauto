#!/usr/bin/env node
/**
 * Production performance + SEO smoke test. Start the site first:
 *   npm run build && npm run start
 * Then:
 *   npm run perf:audit
 * Override URL: LH_URL=http://127.0.0.1:3000/fr npm run perf:audit
 */
import { spawnSync } from 'node:child_process';

const url = process.env.LH_URL || 'http://127.0.0.1:3000/en';

const args = [
  '--yes',
  'lighthouse',
  url,
  '--only-categories=performance,seo,best-practices',
  '--preset=desktop',
  '--chrome-flags=--headless --no-sandbox',
  '--quiet',
];

const bin = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const r = spawnSync(bin, args, { stdio: 'inherit' });
process.exit(r.status === null ? 1 : r.status);
