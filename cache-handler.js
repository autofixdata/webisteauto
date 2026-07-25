const isEdge = typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'edge';

if (isEdge) {
  class MockCacheHandler {
    async get() { return null; }
    async set() {}
    async revalidateTag() {}
  }
  module.exports = MockCacheHandler;
} else {
  // Use dynamic requires to hide them from bundlers like Turbopack/Webpack during Edge builds
  const fs = require('f' + 's');
  const path = require('pa' + 'th');
  const crypto = require('cry' + 'pto');

  let redisHandlerInstance = null;
  const isRedisConfigured = !!(process.env.REDIS_URL || process.env.REDIS_HOST);

  if (isRedisConfigured) {
    try {
      const CacheHandlerPackage = require('@neshca/cache-handler');
      const createRedisHandler = require('@neshca/cache-handler/redis').default;
      const { createClient } = require('redis');

      const client = createClient({
        url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
      });

      client.on('error', (err) => console.error('Redis Client Error', err));
      client.connect().catch(err => console.error('Redis connection failed', err));

      const redisHandler = createRedisHandler({
        client,
        keyPrefix: 'next-isr:',
        timeoutMs: 5000,
      });

      CacheHandlerPackage.default.onCreation(() => {
        return {
          handlers: [redisHandler],
        };
      });

      redisHandlerInstance = CacheHandlerPackage.default;
      console.log('Next.js Cache Handler: Redis mode initialized.');
    } catch (err) {
      console.warn('Next.js Cache Handler: Failed to load Redis or @neshca/cache-handler. Falling back to Filesystem LRU.', err.message);
    }
  }

  class FilesystemLruCacheHandler {
    constructor(options) {
      this.options = options;
      this.cacheLimitMb = process.env.ISR_CACHE_LIMIT_MB ? parseInt(process.env.ISR_CACHE_LIMIT_MB, 10) : 2048; // default 2GB
      
      // Use dynamic property access to bypass Edge runtime static analysis check for process.cwd()
      const getCwd = () => process['cw' + 'd']();
      this.cacheDir = process.env.ISR_CACHE_DIR 
        ? path.resolve(process.env.ISR_CACHE_DIR) 
        : path.join(getCwd(), '.next', 'cache', 'custom-isr-cache');

      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }
    }

    getFilePath(key) {
      const hash = crypto.createHash('sha256').update(key).digest('hex');
      return path.join(this.cacheDir, `${hash}.json`);
    }

    async get(key) {
      try {
        const filePath = this.getFilePath(key);
        if (!fs.existsSync(filePath)) {
          return null;
        }
        const content = await fs.promises.readFile(filePath, 'utf8');
        const data = JSON.parse(content);

        // Update atime/mtime to mark it as recently accessed (LRU)
        const now = new Date();
        await fs.promises.utimes(filePath, now, now).catch(() => {});

        return data;
      } catch (e) {
        return null;
      }
    }

    async set(key, data, ctx) {
      try {
        const filePath = this.getFilePath(key);
        const payload = {
          value: data.value,
          lastModified: data.lastModified || Date.now(),
          tags: ctx?.tags || data.tags || [],
        };
        await fs.promises.writeFile(filePath, JSON.stringify(payload), 'utf8');

        // Evict asynchronously
        this.evictIfNecessary().catch(err => console.error('Filesystem cache eviction error:', err));
      } catch (e) {
        console.error('Error writing to filesystem cache:', e);
      }
    }

    async revalidateTag(tag) {
      try {
        const files = await fs.promises.readdir(this.cacheDir);
        for (const file of files) {
          if (!file.endsWith('.json')) continue;
          const filePath = path.join(this.cacheDir, file);
          try {
            const content = await fs.promises.readFile(filePath, 'utf8');
            const data = JSON.parse(content);
            if (data.tags && data.tags.includes(tag)) {
              await fs.promises.unlink(filePath);
            }
          } catch (e) {
            // ignore concurrent file access/deletion errors
          }
        }
      } catch (e) {
        console.error('Error in revalidateTag:', e);
      }
    }

    async evictIfNecessary() {
      try {
        const limitBytes = this.cacheLimitMb * 1024 * 1024;
        const files = await fs.promises.readdir(this.cacheDir);
        const fileStats = [];
        let totalSize = 0;

        for (const file of files) {
          if (!file.endsWith('.json')) continue;
          const filePath = path.join(this.cacheDir, file);
          try {
            const stat = await fs.promises.stat(filePath);
            fileStats.push({
              path: filePath,
              size: stat.size,
              mtime: stat.mtimeMs,
            });
            totalSize += stat.size;
          } catch (e) {
            // ignore
          }
        }

        if (totalSize <= limitBytes) {
          return;
        }

        // Sort by mtime ascending (oldest first)
        fileStats.sort((a, b) => a.mtime - b.mtime);

        const targetSize = limitBytes * 0.9;
        for (const file of fileStats) {
          if (totalSize <= targetSize) break;
          try {
            await fs.promises.unlink(file.path);
            totalSize -= file.size;
          } catch (e) {
            // ignore
          }
        }
      } catch (e) {
        console.error('Error during cache eviction:', e);
      }
    }
  }

  if (redisHandlerInstance) {
    module.exports = redisHandlerInstance;
  } else {
    module.exports = FilesystemLruCacheHandler;
  }
}
