const NodeCache = require('node-cache');

// Global cache instance with standard check period
const apiCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

/**
 * Express middleware factory for caching API route responses.
 * @param {number} ttlSeconds - Time-to-live in seconds for cached resource
 */
function cacheMiddleware(ttlSeconds = 60) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = apiCache.get(key);

    if (cachedResponse) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}`);
      return res.json(cachedResponse);
    }

    // Intercept res.json to cache response body before sending
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Only cache successful 200 responses
      if (res.statusCode === 200 && body && !body.error) {
        apiCache.set(key, body, ttlSeconds);
      }
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}`);
      return originalJson(body);
    };

    next();
  };
}

module.exports = {
  apiCache,
  cacheMiddleware
};
