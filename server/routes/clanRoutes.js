const express = require('express');
const router = express.Router();
const { normalizeTag, getCocAxiosInstance } = require('../services/cocClient');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');
const { CACHE_TTL } = require('../config/constants');

/**
 * GET /api/v1/clan/:tag
 * Fetches clan profile, badges, clan level, points, war win streak.
 */
router.get('/:tag', cacheMiddleware(CACHE_TTL.CLAN), async (req, res, next) => {
  try {
    let rawTag = req.params.tag;
    if (rawTag === 'default') {
      rawTag = process.env.DEFAULT_CLAN_TAG || '#2Y8LJR80';
    }

    const encodedTag = normalizeTag(rawTag);
    const cocClient = getCocAxiosInstance();

    const response = await cocClient.get(`/clans/${encodedTag}`);
    return res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/clan/:tag/members
 * Fetches clan roster list with roles, trophies, TH levels, donations.
 */
router.get('/:tag/members', cacheMiddleware(CACHE_TTL.CLAN_MEMBERS), async (req, res, next) => {
  try {
    let rawTag = req.params.tag;
    if (rawTag === 'default') {
      rawTag = process.env.DEFAULT_CLAN_TAG || '#2Y8LJR80';
    }

    const encodedTag = normalizeTag(rawTag);
    const cocClient = getCocAxiosInstance();

    const response = await cocClient.get(`/clans/${encodedTag}/members`);
    return res.json({
      success: true,
      count: response.data.items ? response.data.items.length : 0,
      data: response.data.items || []
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/clan/:tag/currentwar
 * Fetches current active war status (opponent, state, stars, destruction, attacks).
 * Soft-handles 404 for clans not in active war or with private war log.
 */
router.get('/:tag/currentwar', cacheMiddleware(CACHE_TTL.CURRENT_WAR), async (req, res, next) => {
  try {
    let rawTag = req.params.tag;
    if (rawTag === 'default') {
      rawTag = process.env.DEFAULT_CLAN_TAG || '#2Y8LJR80';
    }

    const encodedTag = normalizeTag(rawTag);
    const cocClient = getCocAxiosInstance();

    const response = await cocClient.get(`/clans/${encodedTag}/currentwar`);
    return res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    if (error.response && (error.response.status === 404 || error.response.status === 403)) {
      return res.json({
        success: true,
        data: { state: 'notInWar', message: 'Clan is not currently in a war or war log is private.' }
      });
    }
    next(error);
  }
});

/**
 * GET /api/v1/clan/:tag/warlog
 * Fetches historical war log.
 * Soft-handles 404/403 for private war logs.
 */
router.get('/:tag/warlog', cacheMiddleware(CACHE_TTL.WAR_LOG), async (req, res, next) => {
  try {
    let rawTag = rawTag = req.params.tag;
    if (rawTag === 'default') {
      rawTag = process.env.DEFAULT_CLAN_TAG || '#2Y8LJR80';
    }

    const encodedTag = normalizeTag(rawTag);
    const cocClient = getCocAxiosInstance();

    const response = await cocClient.get(`/clans/${encodedTag}/warlog`);
    return res.json({
      success: true,
      count: response.data.items ? response.data.items.length : 0,
      data: response.data.items || []
    });
  } catch (error) {
    if (error.response && (error.response.status === 404 || error.response.status === 403)) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }
    next(error);
  }
});

module.exports = router;
