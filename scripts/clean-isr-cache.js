const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const NEXT_DIR = path.join(ROOT_DIR, '.next');
const PRERENDER_MANIFEST_PATH = path.join(NEXT_DIR, 'prerender-manifest.json');
const SERVER_APP_DIR = path.join(NEXT_DIR, 'server', 'app');
const SERVER_PAGES_DIR = path.join(NEXT_DIR, 'server', 'pages');
const CUSTOM_CACHE_DIR = path.join(NEXT_DIR, 'cache', 'custom-isr-cache');
const INCREMENTAL_CACHE_DIR = path.join(NEXT_DIR, 'cache', 'incremental-cache');

function getPrerenderedRoutes() {
  if (!fs.existsSync(PRERENDER_MANIFEST_PATH)) {
    console.warn(`Prerender manifest not found at ${PRERENDER_MANIFEST_PATH}`);
    return new Set();
  }
  try {
    const content = fs.readFileSync(PRERENDER_MANIFEST_PATH, 'utf8');
    const manifest = JSON.parse(content);
    return new Set(Object.keys(manifest.routes || {}));
  } catch (e) {
    console.error('Error reading prerender manifest:', e);
    return new Set();
  }
}

function pathToRoute(relativeFile) {
  let route = relativeFile.replace(/\.(html|rsc|json)$/, '');
  if (route.endsWith('/index')) {
    route = route.slice(0, -6);
  }
  if (!route.startsWith('/')) {
    route = '/' + route;
  }
  return route;
}

function walkAndClean(dir, relativeBase, prerenderedRoutes, dryRun = false) {
  let filesDeleted = 0;
  let bytesSaved = 0;

  if (!fs.existsSync(dir)) return { filesDeleted, bytesSaved };

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(relativeBase, entry.name);

    if (entry.isDirectory()) {
      const res = walkAndClean(fullPath, relPath, prerenderedRoutes, dryRun);
      filesDeleted += res.filesDeleted;
      bytesSaved += res.bytesSaved;
      
      // Clean up empty directories
      try {
        if (!dryRun && fs.readdirSync(fullPath).length === 0) {
          fs.rmdirSync(fullPath);
        }
      } catch (e) {}
    } else if (entry.isFile()) {
      // ONLY target html, rsc, and json cache files.
      // NEVER delete javascript files, maps, metadata, or manifests!
      if (entry.name.endsWith('.html') || entry.name.endsWith('.rsc') || (entry.name.endsWith('.json') && !entry.name.endsWith('.nft.json') && !entry.name.endsWith('.bootstrap.json'))) {
        const route = pathToRoute(relPath);
        
        // If this is a dynamic route not pre-rendered at build time
        if (!prerenderedRoutes.has(route)) {
          try {
            const stat = fs.statSync(fullPath);
            bytesSaved += stat.size;
            filesDeleted++;
            if (!dryRun) {
              fs.unlinkSync(fullPath);
            }
          } catch (e) {
            console.error(`Failed to delete ${fullPath}:`, e.message);
          }
        }
      }
    }
  }

  return { filesDeleted, bytesSaved };
}

function cleanCustomCache(dir, dryRun = false) {
  let filesDeleted = 0;
  let bytesSaved = 0;
  if (!fs.existsSync(dir)) return { filesDeleted, bytesSaved };

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.json')) {
      const fullPath = path.join(dir, entry.name);
      try {
        const stat = fs.statSync(fullPath);
        bytesSaved += stat.size;
        filesDeleted++;
        if (!dryRun) {
          fs.unlinkSync(fullPath);
        }
      } catch (e) {
        console.error(`Failed to delete cache file ${fullPath}:`, e.message);
      }
    }
  }
  return { filesDeleted, bytesSaved };
}

function run() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log(`Starting ISR cache cleanup...${dryRun ? ' (DRY RUN)' : ''}`);
  
  const prerenderedRoutes = getPrerenderedRoutes();
  console.log(`Loaded ${prerenderedRoutes.size} pre-rendered routes from manifest.`);

  // 1. Clean up Server App Directory (App Router)
  console.log('Cleaning server app directory...');
  const appRes = walkAndClean(SERVER_APP_DIR, '', prerenderedRoutes, dryRun);
  console.log(`App directory: Deleted ${appRes.filesDeleted} files (${(appRes.bytesSaved / 1024 / 1024).toFixed(2)} MB saved).`);

  // 2. Clean up Server Pages Directory (Pages Router, if any)
  console.log('Cleaning server pages directory...');
  const pagesRes = walkAndClean(SERVER_PAGES_DIR, '', prerenderedRoutes, dryRun);
  console.log(`Pages directory: Deleted ${pagesRes.filesDeleted} files (${(pagesRes.bytesSaved / 1024 / 1024).toFixed(2)} MB saved).`);

  // 3. Clean up Custom ISR cache
  console.log('Cleaning custom ISR cache...');
  const customRes = cleanCustomCache(CUSTOM_CACHE_DIR, dryRun);
  console.log(`Custom Cache: Deleted ${customRes.filesDeleted} files (${(customRes.bytesSaved / 1024 / 1024).toFixed(2)} MB saved).`);

  // 4. Clean up default Incremental cache folder if exists
  console.log('Cleaning default incremental cache...');
  const incRes = cleanCustomCache(INCREMENTAL_CACHE_DIR, dryRun);
  console.log(`Default Incremental Cache: Deleted ${incRes.filesDeleted} files (${(incRes.bytesSaved / 1024 / 1024).toFixed(2)} MB saved).`);

  const totalFiles = appRes.filesDeleted + pagesRes.filesDeleted + customRes.filesDeleted + incRes.filesDeleted;
  const totalBytes = appRes.bytesSaved + pagesRes.bytesSaved + customRes.bytesSaved + incRes.bytesSaved;

  console.log(`\nCleanup completed! Total files deleted: ${totalFiles}, total space reclaimed: ${(totalBytes / 1024 / 1024).toFixed(2)} MB.`);
}

run();
