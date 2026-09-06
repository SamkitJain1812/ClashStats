const express = require('express');
const router = express.Router();
const { apiCache } = require('../middleware/cacheMiddleware');

/**
 * GET /api/v1/health
 * Returns status, active cached items, and default configuration.
 */
router.get('/', (req, res) => {
  const tokenConfigured = Boolean(process.env.COC_API_TOKEN && process.env.COC_API_TOKEN !== 'your_clash_of_clans_jwt_token_here');
  
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    cocTokenConfigured: tokenConfigured,
    defaultPlayerTag: process.env.DEFAULT_PLAYER_TAG || '#2PP0LP0C',
    defaultClanTag: process.env.DEFAULT_CLAN_TAG || '#2Y8LJR80',
    cachedKeysCount: apiCache.keys().length
  });
});

/**
 * GET /api/v1/health/ping
 * Lightweight keepalive ping endpoint (used by monthly cron triggers)
 */
router.get('/ping', async (req, res) => {
  const renderBackendUrl = process.env.RENDER_BACKEND_URL;
  let renderWakeResult = null;

  if (renderBackendUrl && !req.query.skip_forward) {
    try {
      const target = renderBackendUrl.replace(/\/$/, '') + '/api/v1/health/ping?skip_forward=true';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(target, { signal: controller.signal });
      clearTimeout(timeoutId);
      renderWakeResult = `Render pinged: status ${response.status}`;
    } catch (err) {
      renderWakeResult = `Render ping attempted: ${err.message}`;
    }
  }

  res.json({
    status: 'ok',
    message: 'Monthly keepalive ping successful',
    timestamp: new Date().toISOString(),
    renderWakeResult
  });
});

module.exports = router;
