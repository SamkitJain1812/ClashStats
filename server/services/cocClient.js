const axios = require('axios');
const { COC_API_BASE_URL } = require('../config/constants');

/**
 * Normalizes a Clash of Clans tag.
 * Ensures the tag starts with '#' and returns the URL-encoded string (e.g. '%232PP0LP0C').
 * @param {string} tag 
 * @returns {string} Encoded tag for URL path
 */
function normalizeTag(tag) {
  if (!tag) return '';
  let cleanTag = tag.trim().toUpperCase();
  if (!cleanTag.startsWith('#')) {
    cleanTag = '#' + cleanTag;
  }
  return encodeURIComponent(cleanTag);
}

/**
 * Creates an Axios client pre-configured with Bearer token and CoC API Base URL.
 */
function getCocAxiosInstance() {
  const token = process.env.COC_API_TOKEN;
  
  return axios.create({
    baseURL: COC_API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token || ''}`,
      'Accept': 'application/json'
    },
    timeout: 10000 // 10 seconds timeout
  });
}

module.exports = {
  normalizeTag,
  getCocAxiosInstance
};
