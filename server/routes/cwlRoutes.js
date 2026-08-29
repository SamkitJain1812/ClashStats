const express = require('express');
const router = express.Router();
const { normalizeTag, getCocAxiosInstance } = require('../services/cocClient');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');
const { CACHE_TTL } = require('../config/constants');

/**
 * GET /api/v1/cwl/group/:tag
 * Fetches CWL season group standings and round war tags for a clan.
 * Returns state: 'notInWar' gracefully on 404 when CWL season is inactive.
 */
router.get('/group/:tag', cacheMiddleware(CACHE_TTL.CWL_GROUP), async (req, res, next) => {
  try {
    let rawTag = req.params.tag;
    if (rawTag === 'default') {
      rawTag = process.env.DEFAULT_CLAN_TAG || '#2Y8LJR80';
    }

    const encodedTag = normalizeTag(rawTag);
    const cocClient = getCocAxiosInstance();

    const response = await cocClient.get(`/clans/${encodedTag}/currentwar/leaguegroup`);
    return res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    // If CoC returns 404 (clan not in active CWL season group), return soft status
    if (error.response && error.response.status === 404) {
      return res.json({
        success: true,
        data: { state: 'notInWar', message: 'Clan is not currently in an active CWL season group.' }
      });
    }
    next(error);
  }
});

/**
 * GET /api/v1/cwl/war/:warTag
 * Fetches individual CWL round war match details.
 */
router.get('/war/:warTag', cacheMiddleware(CACHE_TTL.CWL_WAR), async (req, res, next) => {
  try {
    const rawTag = req.params.warTag;
    const encodedTag = normalizeTag(rawTag);
    const cocClient = getCocAxiosInstance();

    const response = await cocClient.get(`/clanwarleagues/wars/${encodedTag}`);
    return res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.json({
        success: true,
        data: { state: 'notInWar', message: 'CWL round war details not found.' }
      });
    }
    next(error);
  }
});

module.exports = router;
