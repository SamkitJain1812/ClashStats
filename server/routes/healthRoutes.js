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

module.exports = router;
