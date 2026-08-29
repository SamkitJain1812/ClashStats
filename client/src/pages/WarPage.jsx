import React, { useState, useEffect } from 'react';
import { getCurrentWar, getWarLog } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Swords, Clock, Star, Flame, Trophy, ShieldAlert, CheckCircle, Crosshair, Percent, ChevronDown, ChevronUp } from 'lucide-react';

export default function WarPage({ activeTag }) {
  const [currentWar, setCurrentWar] = useState(null);
  const [warLog, setWarLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('live'); // 'live' or 'log'

  const fetchWarData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [warRes, logRes] = await Promise.allSettled([
        getCurrentWar(activeTag || 'default'),
        getWarLog(activeTag || 'default')
      ]);

      if (warRes.status === 'fulfilled' && warRes.value?.success) {
        setCurrentWar(warRes.value.data);
      }

      if (logRes.status === 'fulfilled' && logRes.value?.success) {
        setWarLog(logRes.value.data || []);
      }

      // If both rejected or 403 error
      if (warRes.status === 'rejected' && logRes.status === 'rejected') {
        setError(warRes.reason || logRes.reason);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarData();
  }, [activeTag]);

  if (loading) return <LoadingSpinner message="FETCHING CLAN WAR TELEMETRY & ATTACK TRACKER..." />;
  if (error) return <ErrorMessage error={error} onRetry={fetchWarData} />;

  const isNotInWar = !currentWar || currentWar.state === 'notInWar';
  const clan = currentWar?.clan || {};
  const opponent = currentWar?.opponent || {};

  // Compute war log statistics
  const totalLogWars = warLog.length;
  const totalWins = warLog.filter(w => w.result === 'win').length;
  const totalLosses = warLog.filter(w => w.result === 'lose').length;
  const totalTies = warLog.filter(w => w.result === 'tie').length;
  const winRate = totalLogWars > 0 ? Math.round((totalWins / totalLogWars) * 100) : 0;

  return (
    <div className="war-page-container">
      {/* Header Tabs */}
      <div className="war-header-tabs coc-card">
        <div className="tab-left">
          <div className="war-title-icon">
            <Swords size={28} className="text-red-loss" />
          </div>
          <div>
            <h1 className="font-game text-gold-gradient text-shadow-game page-title">CLAN WAR TELEMETRY</h1>
            <span className="page-subtitle font-heading">REAL-TIME BATTLE TRACKER & HISTORICAL LOG</span>
          </div>
        </div>

        <div className="tab-buttons-group">
          <button
            onClick={() => setActiveTab('live')}
            className={`coc-btn ${activeTab === 'live' ? 'coc-btn-gold' : ''}`}
          >
            <Clock size={16} />
            <span>CURRENT WAR</span>
          </button>
          <button
            onClick={() => setActiveTab('log')}
            className={`coc-btn ${activeTab === 'log' ? 'coc-btn-gold' : ''}`}
          >
            <Trophy size={16} />
            <span>WAR LOG ({warLog.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'live' && (
        <>
          {isNotInWar ? (
            <div className="coc-card not-in-war-card">
              <ShieldAlert size={48} className="text-gold-main" />
              <h2 className="font-game text-gold-gradient text-shadow-game">CLAN IS NOT CURRENTLY IN WAR</h2>
              <p>Your clan is not in an active clan war right now. Check back when a war is declared, or inspect the War Log history below!</p>
              <button onClick={() => setActiveTab('log')} className="coc-btn coc-btn-gold">
                VIEW WAR LOG HISTORY
              </button>
            </div>
          ) : (
            <div className="live-war-wrapper">
              {/* War State Banner */}
              <div className="coc-card war-banner-card">
                <div className="state-pill-row">
                  <span className={`coc-badge ${currentWar.state === 'inWar' ? 'coc-badge-win' : 'coc-badge-gold'}`}>
                    STATE: {currentWar.state?.toUpperCase()}
                  </span>
                  <span className="team-size-badge font-game">{currentWar.teamSize} VS {currentWar.teamSize}</span>
                </div>

                {/* Clan vs Opponent Match Scorecard */}
                <div className="scorecard-grid">
                  {/* Our Clan */}
                  <div className="score-clan-side our-side">
                    {clan.badgeUrls?.medium && (
                      <img src={clan.badgeUrls.medium} alt={clan.name} className="score-clan-emblem" />
                    )}
                    <h2 className="font-game clan-score-name text-gold-gradient">{clan.name}</h2>
                    <div className="score-big-stats">
                      <div className="star-tally font-game">
                        <Star size={24} className="star-gold" />
                        <span>{clan.stars || 0}</span>
                      </div>
                      <div className="dest-tally font-heading">
                        {clan.destructionPercentage ? clan.destructionPercentage.toFixed(1) : '0.0'}%
                      </div>
                    </div>
                    <div className="attacks-count font-heading">
                      Attacks Used: {clan.attacks || 0} / {currentWar.teamSize * (currentWar.attacksPerMember || 2)}
                    </div>
                  </div>

                  {/* VS Emblem Center */}
                  <div className="vs-center-column">
                    <div className="vs-badge font-game">VS</div>
                    <span className="vs-attacks-per">({currentWar.attacksPerMember || 2} attacks/player)</span>
                  </div>

                  {/* Opponent Clan */}
                  <div className="score-clan-side opponent-side">
                    {opponent.badgeUrls?.medium && (
                      <img src={opponent.badgeUrls.medium} alt={opponent.name} className="score-clan-emblem" />
                    )}
                    <h2 className="font-game clan-score-name text-red-loss">{opponent.name}</h2>
                    <div className="score-big-stats">
                      <div className="star-tally font-game">
                        <Star size={24} className="star-gold" />
                        <span>{opponent.stars || 0}</span>
                      </div>
                      <div className="dest-tally font-heading">
                        {opponent.destructionPercentage ? opponent.destructionPercentage.toFixed(1) : '0.0'}%
                      </div>
                    </div>
                    <div className="attacks-count font-heading">
                      Attacks Used: {opponent.attacks || 0} / {currentWar.teamSize * (currentWar.attacksPerMember || 2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Roster Attack Tracker Table */}
              {clan.members && clan.members.length > 0 && (
                <div className="coc-card roster-tracker-card">
                  <div className="tracker-header">
                    <Crosshair size={20} className="text-gold-main" />
                    <h3 className="font-game">OUR CLAN WAR ATTACK TRACKER</h3>
                  </div>

                  <div className="table-responsive">
                    <table className="coc-table">
                      <thead>
                        <tr>
                          <th>PLAYER</th>
                          <th>TH LEVEL</th>
                          <th>ATTACKS USED</th>
                          <th>BEST ATTACK STARS</th>
                          <th>DESTRUCTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clan.members.map((member) => {
                          const attacks = member.attacks || [];
                          const attacksUsed = attacks.length;
                          const maxAttacks = currentWar.attacksPerMember || 2;
                          const bestAttack = attacks.reduce((best, cur) => (cur.stars > (best?.stars || 0) ? cur : best), null);

                          return (
                            <tr key={member.tag} className="member-row">
                              <td>
                                <div className="player-tracker-name font-heading">{member.name}</div>
                                <div className="player-tracker-tag">{member.tag}</div>
                              </td>
                              <td><span className="th-table-badge font-game">TH {member.townHallLevel}</span></td>
                              <td>
                                <span className={`coc-badge ${attacksUsed >= maxAttacks ? 'coc-badge-win' : 'coc-badge-gold'}`}>
                                  {attacksUsed} / {maxAttacks}
                                </span>
                              </td>
                              <td className="font-game text-gold-main">
                                {bestAttack ? `★ ${bestAttack.stars}` : '—'}
                              </td>
                              <td className="font-heading">
                                {bestAttack ? `${bestAttack.destructionPercentage}%` : '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'log' && (
        <div className="war-log-wrapper">
          {/* Summary Cards */}
          <div className="log-summary-grid">
            <div className="coc-card summary-card">
              <span className="summary-lbl">HISTORICAL WIN RATE</span>
              <span className="summary-val font-game text-green">{winRate}%</span>
              <span className="summary-sub">{totalWins} Wins out of {totalLogWars} Wars</span>
            </div>

            <div className="coc-card summary-card">
              <span className="summary-lbl">TOTAL WINS / LOSSES / TIES</span>
              <div className="wins-losses-row font-game">
                <span className="text-green">{totalWins}W</span>
                <span>/</span>
                <span className="text-red-loss">{totalLosses}L</span>
                <span>/</span>
                <span className="text-gold-main">{totalTies}T</span>
              </div>
            </div>
          </div>

          {/* War Log List */}
          <div className="coc-card log-list-card">
            <div className="tracker-header">
              <Trophy size={20} className="text-gold-main" />
              <h3 className="font-game">RECENT CLAN WAR MATCHES</h3>
            </div>

            {warLog.length === 0 ? (
              <p className="no-data-text">No war log data available for this clan.</p>
            ) : (
              <div className="log-items-list">
                {warLog.map((match, idx) => {
                  const isWin = match.result === 'win';
                  const isLoss = match.result === 'lose';

                  return (
                    <div key={idx} className={`log-item-card ${isWin ? 'win-card' : isLoss ? 'loss-card' : 'tie-card'}`}>
                      <div className="match-result-badge">
                        <span className={`result-label font-game ${isWin ? 'text-green' : isLoss ? 'text-red-loss' : 'text-gold-main'}`}>
                          {match.result?.toUpperCase()}
                        </span>
                        <span className="match-size">{match.teamSize} vs {match.teamSize}</span>
                      </div>

                      <div className="match-opponent-info">
                        {match.opponent?.badgeUrls?.small && (
                          <img src={match.opponent.badgeUrls.small} alt="Opponent" className="opponent-mini-badge" />
                        )}
                        <div>
                          <h4 className="opponent-name font-heading">{match.opponent?.name || 'Enemy Clan'}</h4>
                          <span className="opponent-tag">{match.opponent?.tag}</span>
                        </div>
                      </div>

                      <div className="match-scores-grid font-game">
                        <div className="our-score-col">
                          <div className="score-stars">★ {match.clan?.stars}</div>
                          <div className="score-dest">{match.clan?.destructionPercentage?.toFixed(1)}%</div>
                        </div>
                        <div className="vs-divider">VS</div>
                        <div className="opp-score-col">
                          <div className="score-stars">★ {match.opponent?.stars}</div>
                          <div className="score-dest">{match.opponent?.destructionPercentage?.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .war-page-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .war-header-tabs {
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .tab-left { display: flex; align-items: center; gap: 16px; }
        .war-title-icon {
          width: 54px; height: 54px; background: rgba(255, 59, 48, 0.15); border: 2px solid var(--red-loss); border-radius: 14px; display: flex; align-items: center; justify-content: center;
        }
        .page-title { font-size: 2rem; line-height: 1.1; }
        .page-subtitle { font-size: 0.75rem; color: var(--text-muted); letter-spacing: 1px; }

        .tab-buttons-group { display: flex; gap: 10px; }

        /* Not in war state */
        .not-in-war-card {
          padding: 60px 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          max-width: 700px;
          margin: 20px auto;
        }

        /* Live War Scorecard */
        .war-banner-card {
          padding: 32px;
          background: linear-gradient(135deg, #151e2b 0%, #1e2e42 50%, #0d141e 100%);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .state-pill-row { display: flex; align-items: center; justify-content: space-between; }
        .team-size-badge { background: rgba(0,0,0,0.4); padding: 4px 12px; border-radius: 12px; border: 1px solid var(--border-dark); color: var(--gold-light); font-size: 0.85rem; }

        .scorecard-grid {
          display: grid;
          grid-template-columns: 1fr 100px 1fr;
          gap: 20px;
          align-items: center;
        }
        .score-clan-side {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.3);
          padding: 24px;
          border-radius: 16px;
          border: 1px solid var(--border-dark);
        }
        .our-side { border-color: var(--gold-border); }
        .opponent-side { border-color: rgba(255, 59, 48, 0.4); }
        .score-clan-emblem { width: 72px; height: 72px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5)); }
        .clan-score-name { font-size: 1.6rem; }
        .score-big-stats { display: flex; align-items: center; gap: 16px; margin: 8px 0; }
        .star-tally { font-size: 1.8rem; display: flex; align-items: center; gap: 6px; color: var(--gold-main); }
        .dest-tally { font-size: 1.8rem; color: #fff; }
        .attacks-count { font-size: 0.85rem; color: var(--text-muted); }

        .vs-center-column { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .vs-badge { width: 56px; height: 56px; background: var(--gold-gradient); color: #121a24; font-size: 1.4rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--gold-shadow); }
        .vs-attacks-per { font-size: 0.7rem; color: var(--text-muted); text-align: center; }

        /* Tracker */
        .roster-tracker-card { padding: 28px; margin-top: 24px; }
        .tracker-header { display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border-dark); padding-bottom: 14px; margin-bottom: 18px; color: var(--gold-light); }
        .player-tracker-name { font-size: 1rem; color: #fff; }
        .player-tracker-tag { font-size: 0.75rem; color: var(--text-muted); }

        /* War Log List */
        .log-summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .summary-card { padding: 24px; text-align: center; display: flex; flex-direction: column; gap: 6px; }
        .summary-lbl { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); }
        .summary-val { font-size: 2.5rem; }
        .summary-sub { font-size: 0.85rem; color: var(--text-muted); }
        .wins-losses-row { font-size: 2rem; display: flex; justify-content: center; gap: 8px; }

        .log-list-card { padding: 28px; }
        .log-items-list { display: flex; flex-direction: column; gap: 12px; }
        .log-item-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-dark);
          padding: 16px 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .win-card { border-left: 4px solid var(--green-win); }
        .loss-card { border-left: 4px solid var(--red-loss); }
        .tie-card { border-left: 4px solid var(--gold-main); }

        .match-result-badge { display: flex; flex-direction: column; gap: 2px; }
        .result-label { font-size: 1.3rem; }
        .match-size { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; }

        .match-opponent-info { display: flex; align-items: center; gap: 12px; }
        .opponent-mini-badge { width: 36px; height: 36px; }
        .opponent-name { font-size: 1.1rem; color: #fff; }
        .opponent-tag { font-size: 0.75rem; color: var(--text-muted); }

        .match-scores-grid { display: flex; align-items: center; gap: 16px; background: rgba(0,0,0,0.4); padding: 8px 16px; border-radius: 10px; border: 1px solid var(--border-dark); }
        .our-score-col, .opp-score-col { text-align: center; }
        .score-stars { font-size: 1.1rem; color: var(--gold-main); }
        .score-dest { font-size: 0.8rem; color: var(--text-muted); }
        .vs-divider { font-size: 0.75rem; color: var(--text-muted); opacity: 0.5; }
      `}</style>
    </div>
  );
}
