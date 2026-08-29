import axios from 'axios';

// Configurable API base URL: defaults to local /api/v1 or VITE_API_URL in production
const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

/**
 * Normalizes tag for API requests (URL encodes # to %23).
 */
export function formatTag(tag) {
  if (!tag) return 'default';
  let clean = tag.trim().toUpperCase();
  if (clean === 'DEFAULT') return 'default';
  if (!clean.startsWith('#')) {
    clean = '#' + clean;
  }
  return encodeURIComponent(clean);
}

/**
 * Fetch Player Profile by tag.
 */
export async function getPlayerProfile(tag) {
  const formatted = formatTag(tag);
  const response = await axios.get(`${API_BASE}/player/${formatted}`);
  return response.data;
}

/**
 * Fetch Clan Details by tag.
 */
export async function getClanDetails(tag) {
  const formatted = formatTag(tag);
  const response = await axios.get(`${API_BASE}/clan/${formatted}`);
  return response.data;
}

/**
 * Fetch Clan Members roster by tag.
 */
export async function getClanMembers(tag) {
  const formatted = formatTag(tag);
  const response = await axios.get(`${API_BASE}/clan/${formatted}/members`);
  return response.data;
}

/**
 * Fetch Current Clan War by tag.
 */
export async function getCurrentWar(tag) {
  const formatted = formatTag(tag);
  const response = await axios.get(`${API_BASE}/clan/${formatted}/currentwar`);
  return response.data;
}

/**
 * Fetch Clan War Log by tag.
 */
export async function getWarLog(tag) {
  const formatted = formatTag(tag);
  const response = await axios.get(`${API_BASE}/clan/${formatted}/warlog`);
  return response.data;
}

/**
 * Fetch CWL Group by tag.
 */
export async function getCwlGroup(tag) {
  const formatted = formatTag(tag);
  const response = await axios.get(`${API_BASE}/cwl/group/${formatted}`);
  return response.data;
}
