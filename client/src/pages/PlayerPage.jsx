import React, { useState, useEffect } from 'react';
import { getPlayerProfile } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Shield, Trophy, Swords, Zap, Award, Star, Heart, CheckCircle2, ArrowUpRight, Flame, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PlayerPage({ activeTag, setActiveClanTag }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPlayer = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPlayerProfile(activeTag || 'default');
      if (res && res.success) {
        setPlayer(res.data);
        // Automatically sync player's clan tag to App state for Clan/War/CWL screens
        if (res.data.clan?.tag && setActiveClanTag) {
          setActiveClanTag(res.data.clan.tag);
        }
      } else {
        setError(res || { message: 'Failed to load player statistics.' });
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayer();
  }, [activeTag]);

  if (loading) return <LoadingSpinner message="LOADING PLAYER TELEMETRY & HERO ARSENAL..." />;
  if (error) return <ErrorMessage error={error} onRetry={fetchPlayer} />;
  if (!player) return null;

  // Compute donation ratio
  const donated = player.donations || 0;
  const received = player.donationsReceived || 0;
  const totalDonations = donated + received;
  const donationPercent = totalDonations > 0 ? Math.round((donated / totalDonations) * 100) : 50;

  let donorStatus = 'BALANCED';
  let donorClass = 'coc-badge-gold';
  if (donated > received * 1.5 && donated > 100) {
    donorStatus = 'GENEROUS DONOR';
    donorClass = 'coc-badge-win';
  } else if (received > donated * 2 && received > 100) {
    donorStatus = 'HIGH RECEIVER';
    donorClass = 'coc-badge-loss';
  }

  // Achievements
  const achievements = player.achievements || [];
  const completedAchievements = achievements.filter(a => a.value >= a.target);

  return (
    <div className="player-page-container">
      {/* Player Header Banner */}
      <div className="player-hero-card coc-card coc-card-gold">
        <div className="player-hero-main">
          {/* Town Hall Badge */}
          <div className="th-shield-badge">
            <span className="th-label">TOWN HALL</span>
            <span className="th-level font-game">{player.townHallLevel}</span>
            {player.townHallWeaponLevel && (
              <span className="th-weapon font-game">★ {player.townHallWeaponLevel}</span>
            )}
          </div>

          {/* Identity & Clan */}
          <div className="player-identity">
            <div className="player-title-row">
              <span className="xp-badge">EXP {player.expLevel}</span>
              <span className="player-tag-text">{player.tag}</span>
            </div>
            <h1 className="font-game text-gold-gradient text-shadow-game player-name">{player.name}</h1>

            {/* Clan Affiliation Pill */}
            {player.clan ? (
              <div
                className="player-clan-pill"
                onClick={() => {
                  if (setActiveClanTag) setActiveClanTag(player.clan.tag);
                  navigate('/clan');
                }}
              >
                {player.clan.badgeUrls?.small && (
                  <img src={player.clan.badgeUrls.small} alt="Clan Badge" className="clan-mini-badge" />
                )}
                <span className="clan-pill-name">{player.clan.name}</span>
                <span className="clan-pill-role">({player.role?.toUpperCase() || 'MEMBER'})</span>
                <ArrowUpRight size={14} className="text-gold-main" />
              </div>
            ) : (
              <span className="no-clan-pill">NO CLAN</span>
            )}
          </div>
        </div>

        {/* Primary League Card */}
        <div className="league-hero-badge">
          {player.league?.iconUrls?.medium ? (
            <img src={player.league.iconUrls.medium} alt={player.league.name} className="league-icon-img" />
          ) : (
            <Trophy size={48} className="text-gold-gradient" />
          )}
          <div className="league-text-box">
            <span className="league-name font-game">{player.league?.name || 'Unranked'}</span>
            <div className="trophy-count-row">
              <Trophy size={18} className="text-gold-main" />
              <span className="trophy-number font-game">{player.trophies?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="player-stats-grid">
        {/* Trophies & Records */}
        <div className="coc-card player-card-box">
          <div className="card-title-bar">
            <Trophy size={20} className="text-gold-main" />
            <h3 className="font-game">TROPHIES & RECORDS</h3>
          </div>
          <div className="stat-rows-container">
            <div className="stat-row">
              <span className="stat-row-label">Current Trophies</span>
              <span className="stat-row-value font-game text-gold-gradient">{player.trophies?.toLocaleString()}</span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">All-Time Best Trophies</span>
              <span className="stat-row-value font-game">{player.bestTrophies?.toLocaleString()}</span>
            </div>
            {player.builderHallLevel && (
              <>
                <div className="stat-row">
                  <span className="stat-row-label">Builder Hall Level</span>
                  <span className="stat-row-value font-game">BH {player.builderHallLevel}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-row-label">Versus Trophies</span>
                  <span className="stat-row-value font-game">{player.versusTrophies?.toLocaleString() || 0}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-row-label">Best Versus Trophies</span>
                  <span className="stat-row-value font-game">{player.bestVersusTrophies?.toLocaleString() || 0}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Battle Performance */}
        <div className="coc-card player-card-box">
          <div className="card-title-bar">
            <Swords size={20} className="text-gold-main" />
            <h3 className="font-game">BATTLE STATISTICS</h3>
          </div>
          <div className="stat-rows-container">
            <div className="stat-row">
              <span className="stat-row-label">Attacks Won (Season)</span>
              <span className="stat-row-value font-game text-green">{player.attackWins?.toLocaleString() || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">Defenses Won (Season)</span>
              <span className="stat-row-value font-game">{player.defenseWins?.toLocaleString() || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">War Stars Earned</span>
              <span className="stat-row-value font-game text-gold-gradient">★ {player.warStars?.toLocaleString() || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">Clan Capital Contributions</span>
              <span className="stat-row-value font-game">{player.clanCapitalContributions?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Donation Ratio & Activity */}
        <div className="coc-card player-card-box">
          <div className="card-title-bar">
            <Heart size={20} className="text-gold-main" />
            <h3 className="font-game">DONATION RATIO</h3>
            <span className={`coc-badge ${donorClass} donor-status-badge`}>{donorStatus}</span>
          </div>

          <div className="donation-telemetry-body">
            <div className="donation-numbers-grid">
              <div className="donated-box">
                <span className="don-num font-game text-green">{donated.toLocaleString()}</span>
                <span className="don-lbl">DONATED</span>
              </div>
              <div className="donated-box">
                <span className="don-num font-game text-gold-main">{received.toLocaleString()}</span>
                <span className="don-lbl">RECEIVED</span>
              </div>
            </div>

            {/* Donation Health Bar */}
            <div className="donation-progress-wrapper">
              <div className="donation-progress-bar">
                <div className="donation-fill" style={{ width: `${donationPercent}%` }}></div>
              </div>
              <div className="donation-bar-labels">
                <span>{donationPercent}% Donated</span>
                <span>{100 - donationPercent}% Received</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heroes & Troops Arsenal Grid */}
      <section className="arsenal-section coc-card">
        <div className="card-title-bar">
          <Crown size={20} className="text-gold-main" />
          <h3 className="font-game">HEROES & TROOPS ARSENAL</h3>
        </div>

        {/* Heroes */}
        {player.heroes && player.heroes.length > 0 && (
          <div className="arsenal-group">
            <h4 className="arsenal-group-title">HEROES</h4>
            <div className="arsenal-grid">
              {player.heroes.map((hero, idx) => (
                <div key={idx} className={`arsenal-card ${hero.level >= hero.maxLevel ? 'max-level' : ''}`}>
                  <span className="arsenal-item-name">{hero.name}</span>
                  <div className="arsenal-level-badge">
                    <span className="lvl-val font-game">LVL {hero.level}</span>
                    <span className="lvl-max">/ {hero.maxLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Troops */}
        {player.troops && player.troops.length > 0 && (
          <div className="arsenal-group">
            <h4 className="arsenal-group-title">TROOPS & PETS</h4>
            <div className="arsenal-grid">
              {player.troops.map((troop, idx) => (
                <div key={idx} className={`arsenal-card ${troop.level >= troop.maxLevel ? 'max-level' : ''}`}>
                  <span className="arsenal-item-name">{troop.name}</span>
                  <div className="arsenal-level-badge">
                    <span className="lvl-val font-game">LVL {troop.level}</span>
                    <span className="lvl-max">/ {troop.maxLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spells */}
        {player.spells && player.spells.length > 0 && (
          <div className="arsenal-group">
            <h4 className="arsenal-group-title">SPELLS</h4>
            <div className="arsenal-grid">
              {player.spells.map((spell, idx) => (
                <div key={idx} className={`arsenal-card ${spell.level >= spell.maxLevel ? 'max-level' : ''}`}>
                  <span className="arsenal-item-name">{spell.name}</span>
                  <div className="arsenal-level-badge">
                    <span className="lvl-val font-game">LVL {spell.level}</span>
                    <span className="lvl-max">/ {spell.maxLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Achievements Summary Cards */}
      <section className="achievements-section coc-card">
        <div className="card-title-bar">
          <Award size={20} className="text-gold-main" />
          <h3 className="font-game">ACHIEVEMENTS PROGRESS ({completedAchievements.length} / {achievements.length} COMPLETED)</h3>
        </div>

        <div className="achievements-grid">
          {achievements.slice(0, 12).map((ach, idx) => {
            const isDone = ach.value >= ach.target;
            const pct = Math.min(100, Math.round((ach.value / ach.target) * 100));

            return (
              <div key={idx} className={`achievement-card ${isDone ? 'ach-completed' : ''}`}>
                <div className="ach-top-row">
                  <span className="ach-name font-game">{ach.name}</span>
                  <div className="ach-stars">
                    {[1, 2, 3].map(starNum => (
                      <Star
                        key={starNum}
                        size={14}
                        className={starNum <= ach.stars ? 'star-gold' : 'star-empty'}
                      />
                    ))}
                  </div>
                </div>

                <p className="ach-desc">{ach.info}</p>

                <div className="ach-progress-row">
                  <div className="ach-progress-bar">
                    <div className="ach-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="ach-pct font-game">{ach.value.toLocaleString()} / {ach.target.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <style>{`
        .player-page-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .player-hero-card {
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #162436 0%, #1e314a 50%, #101a28 100%);
          gap: 24px;
          flex-wrap: wrap;
        }
        .player-hero-main {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .th-shield-badge {
          width: 90px;
          height: 90px;
          background: var(--gold-gradient);
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #121a24;
          box-shadow: var(--gold-shadow);
          border: 2px solid #fff;
        }
        .th-label { font-size: 0.65rem; font-weight: 800; opacity: 0.8; letter-spacing: 0.5px; }
        .th-level { font-size: 2.2rem; line-height: 1; }
        .th-weapon { font-size: 0.75rem; color: #a31c1c; margin-top: 2px; }

        .player-identity { display: flex; flex-direction: column; gap: 4px; }
        .player-title-row { display: flex; align-items: center; gap: 10px; }
        .xp-badge { background: var(--coc-blue-main); color: #fff; font-weight: 800; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; border: 1px solid var(--coc-blue-light); }
        .player-tag-text { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; }
        .player-name { font-size: 2.5rem; line-height: 1.1; }

        .player-clan-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-gold);
          padding: 6px 14px;
          border-radius: 20px;
          cursor: pointer;
          margin-top: 6px;
          transition: background 0.2s;
        }
        .player-clan-pill:hover { background: rgba(255, 199, 44, 0.15); }
        .clan-mini-badge { width: 20px; height: 20px; }
        .clan-pill-name { font-weight: 700; font-size: 0.95rem; color: #fff; }
        .clan-pill-role { font-size: 0.75rem; color: var(--gold-main); font-weight: 800; }
        .no-clan-pill { font-size: 0.85rem; color: var(--text-muted); font-weight: 700; }

        .league-hero-badge {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--border-dark);
          padding: 16px 24px;
          border-radius: 16px;
        }
        .league-icon-img { width: 64px; height: 64px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5)); }
        .league-name { font-size: 1.3rem; color: #fff; display: block; }
        .trophy-count-row { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
        .trophy-number { font-size: 1.5rem; color: var(--gold-main); }

        .player-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 24px;
        }
        .player-card-box { padding: 24px; }
        .card-title-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid var(--border-dark);
          padding-bottom: 12px;
          margin-bottom: 18px;
          color: var(--gold-light);
        }
        .card-title-bar h3 { font-size: 1.1rem; flex: 1; }
        .donor-status-badge { margin-left: auto; }

        .stat-rows-container { display: flex; flex-direction: column; gap: 12px; }
        .stat-row { display: flex; align-items: center; justify-content: space-between; font-size: 0.95rem; }
        .stat-row-label { color: var(--text-muted); font-weight: 600; }
        .stat-row-value { font-size: 1.1rem; color: #fff; }
        .text-green { color: var(--green-win); }

        .donation-telemetry-body { display: flex; flex-direction: column; gap: 20px; }
        .donation-numbers-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: center; }
        .donated-box { background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border: 1px solid var(--border-dark); }
        .don-num { font-size: 1.6rem; display: block; margin-bottom: 2px; }
        .don-lbl { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); }

        .donation-progress-wrapper { display: flex; flex-direction: column; gap: 6px; }
        .donation-progress-bar { width: 100%; height: 12px; background: #000; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-dark); }
        .donation-fill { height: 100%; background: var(--green-win); transition: width 0.4s ease; }
        .donation-bar-labels { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); }

        .arsenal-section { padding: 28px; }
        .arsenal-group { margin-top: 20px; }
        .arsenal-group-title { font-size: 0.85rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 12px; }
        .arsenal-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
        .arsenal-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-dark);
          padding: 10px 14px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .arsenal-card.max-level {
          border-color: var(--gold-border);
          background: rgba(255, 199, 44, 0.08);
        }
        .arsenal-item-name { font-size: 0.85rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px; }
        .arsenal-level-badge { display: flex; align-items: baseline; gap: 2px; }
        .lvl-val { font-size: 0.95rem; color: var(--gold-main); }
        .lvl-max { font-size: 0.7rem; color: var(--text-muted); font-weight: 700; }

        .achievements-section { padding: 28px; }
        .achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; margin-top: 16px; }
        .achievement-card {
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--border-dark);
          padding: 16px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .achievement-card.ach-completed {
          border-color: rgba(76, 217, 100, 0.4);
          background: rgba(76, 217, 100, 0.04);
        }
        .ach-top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
        .ach-name { font-size: 1rem; color: #fff; }
        .ach-stars { display: flex; gap: 2px; }
        .star-gold { color: var(--gold-main); fill: var(--gold-main); }
        .star-empty { color: #333; }
        .ach-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 12px; }
        .ach-progress-row { display: flex; flex-direction: column; gap: 4px; }
        .ach-progress-bar { height: 8px; background: #000; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-dark); }
        .ach-fill { height: 100%; background: var(--gold-gradient); }
        .ach-pct { font-size: 0.75rem; color: var(--gold-light); text-align: right; }
      `}</style>
    </div>
  );
}
