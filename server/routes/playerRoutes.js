const express = require('express');
const router = express.Router();
const { normalizeTag, getCocAxiosInstance } = require('../services/cocClient');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');
const { CACHE_TTL } = require('../config/constants');

/**
 * GET /api/v1/player/:tag
 * Fetches player profile, trophies, TH level, stats, and troop/hero levels.
 */
router.get('/:tag', cacheMiddleware(CACHE_TTL.PLAYER), async (req, res, next) => {
  try {
    let rawTag = req.params.tag;
    if (rawTag === 'default') {
      rawTag = process.env.DEFAULT_PLAYER_TAG || '#2PP0LP0C';
    }

    const encodedTag = normalizeTag(rawTag);
    const cocClient = getCocAxiosInstance();
    
    const response = await cocClient.get(`/players/${encodedTag}`);
    return res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
