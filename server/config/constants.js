module.exports = {
  COC_API_BASE_URL: 'https://api.clashofclans.com/v1',
  DEFAULT_PORT: 5000,
  CACHE_TTL: {
    PLAYER: 60,         // 60 seconds for player profiles
    CLAN: 60,           // 60 seconds for clan details
    CLAN_MEMBERS: 60,   // 60 seconds for clan roster
    CURRENT_WAR: 30,    // 30 seconds for live war updates
    WAR_LOG: 180,       // 3 minutes for historical war log
    CWL_GROUP: 300,     // 5 minutes for CWL standings
    CWL_WAR: 120        // 2 minutes for CWL round war details
  }
};
