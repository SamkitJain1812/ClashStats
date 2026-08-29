import React, { useState, useEffect } from 'react';
import { User, Users, Swords, Trophy, Shield, ArrowRight, Star, Heart, Flame, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPlayerProfile, getClanDetails } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function DashboardPage({ activePlayerTag, activeClanTag, setActiveClanTag }) {
  const [player, setPlayer] = useState(null);
  const [clan, setClan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboardSummary() {
      setLoading(true);
      setError(null);
      try {
        const playerRes = await getPlayerProfile(activePlayerTag || 'default');
        if (playerRes && playerRes.success) {
          setPlayer(playerRes.data);

          const targetClanTag = playerRes.data.clan?.tag || activeClanTag || 'default';
          if (playerRes.data.clan?.tag && setActiveClanTag) {
            setActiveClanTag(playerRes.data.clan.tag);
          }

          try {
            const clanRes = await getClanDetails(targetClanTag);
            if (clanRes && clanRes.success) {
              setClan(clanRes.data);
            }
          } catch (clanErr) {
            console.warn('Clan data fetch failed for dashboard summary:', clanErr);
          }
        } else {
          setError(playerRes || { message: 'Failed to fetch player profile.' });
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardSummary();
  }, [activePlayerTag, activeClanTag]);

  if (loading) return <LoadingSpinner message="LOADING SUPERCELL TELEMETRY HUB..." />;
  if (error) return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="dashboard-page-container">
      {/* Featured Banner Hero (Matching Deep Purple Cloud Background - Image 4) */}
      <section className="cloud-purple-section">
        <div className="hero-inner-content">
          <div className="hero-badge">
            <Shield size={16} className="text-gold-main" />
            <span>SUPERCELL STORE COMMAND CENTER</span>
          </div>

          {/* White 3D Game Title Font (Image 3) */}
          <h1 className="font-game-3d store-hero-title">
            CLASH OF CLANS STATS HUB
          </h1>

          <p className="hero-desc">
            Browse live player telemetry, clan member rankings, war attack trackers, and CWL performance telemetry connected to official Supercell servers. Enjoy!
          </p>

          <div className="hero-tag-box">
            <span className="tag-label">ACTIVE PLAYER TARGET:</span>
            <span className="tag-val font-game text-gold-game">{player?.tag || activePlayerTag || '#Y8YLP9RR2'}</span>
          </div>
        </div>
      </section>

      {/* Wooden Section Header Banner (Matching Wood Backdrop - Image 2) */}
      <div className="wood-section-banner">
        <h2 className="font-game-3d" style={{ fontSize: '2rem' }}>
          LIVE OVERVIEW
        </h2>
        <p style={{ color: 'var(--text-muted-beige)', fontSize: '0.9rem' }}>Real-time telemetry breakdown</p>
      </div>

      {/* Quick Summary Telemetry Cards (Matching Image 1) */}
      {player && (
        <section className="highlights-grid">
          {/* Active Player Card */}
          <div className="coc-card highlight-card" onClick={() => navigate('/player')}>
            <div className="card-badge-header">
              <span className="xp-chip font-heading">EXP {player.expLevel}</span>
              <span className="th-chip font-game text-gold-game">TH {player.townHallLevel}</span>
            </div>
            <h3 className="font-game-3d player-title">{player.name}</h3>
            <div className="stat-pills-row">
              <div className="stat-pill">
                <Trophy size={16} className="text-gold-main" />
                <span className="font-heading" style={{ color: '#fff' }}>{player.trophies?.toLocaleString()} Trophies</span>
              </div>
              <div className="stat-pill">
                <Star size={16} className="text-gold-main" />
                <span className="font-heading" style={{ color: '#fff' }}>{player.warStars?.toLocaleString()} Stars</span>
              </div>
            </div>
            <div className="card-footer-action">
              <span>INSPECT PLAYER PROFILE & ARSENAL</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Active Clan Card */}
          {clan ? (
            <div className="coc-card highlight-card" onClick={() => navigate('/clan')}>
              <div className="card-badge-header">
                {clan.badgeUrls?.small && <img src={clan.badgeUrls.small} alt="Badge" className="clan-mini-badge" />}
                <span className="clan-lvl-chip font-game text-gold-game">LEVEL {clan.clanLevel}</span>
              </div>
              <h3 className="font-game-3d clan-title">{clan.name}</h3>
              <div className="stat-pills-row">
                <div className="stat-pill">
                  <Users size={16} className="text-coc-blue-light" />
                  <span className="font-heading" style={{ color: '#fff' }}>{clan.members} / 50 Members</span>
                </div>
                <div className="stat-pill">
                  <Flame size={16} className="text-red-loss" />
                  <span className="font-heading" style={{ color: '#fff' }}>{clan.warWinStreak || 0} Win Streak</span>
                </div>
              </div>
              <div className="card-footer-action">
                <span>INSPECT CLAN ROSTER & LEADERBOARD</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ) : (
            <div className="coc-card highlight-card" onClick={() => navigate('/player')}>
              <div className="card-badge-header">
                <span className="clan-lvl-chip font-game text-gold-game">NO CLAN</span>
              </div>
              <h3 className="font-game-3d clan-title">{player.name}</h3>
              <p style={{ color: 'var(--text-muted-beige)', fontSize: '0.9rem' }}>Player is not currently a member of any clan.</p>
              <div className="card-footer-action">
                <span>VIEW PLAYER DETAILS</span>
                <ArrowRight size={16} />
              </div>
            </div>
          )}
        </section>
      )}

      {/* Wooden Title for Hub Sections */}
      <div className="wood-section-banner" style={{ marginTop: '20px' }}>
        <h2 className="font-game-3d" style={{ fontSize: '2rem' }}>
          STORE SPECIALS & TELEMETRY HUBS
        </h2>
        <p style={{ color: 'var(--text-muted-beige)', fontSize: '0.9rem' }}>Browse featured statistics in the Clash of Clans Store. Enjoy!</p>
      </div>

      {/* Navigation Hub Grid */}
      <section className="hub-grid">
        <div className="coc-card hub-card" onClick={() => navigate('/player')}>
          <div className="card-icon-box blue-box">
            <User size={28} />
          </div>
          <div className="hub-card-content">
            <h3 className="font-game-3d hub-card-title">PLAYER PROFILE</h3>
            <p className="hub-card-desc">Town Hall level badge, trophies, attack/defense wins, donation ratio, hero & troop levels.</p>
          </div>
          <div className="card-action">
            <span>OPEN PROFILE</span>
            <ArrowRight size={18} />
          </div>
        </div>

        <div className="coc-card hub-card" onClick={() => navigate('/clan')}>
          <div className="card-icon-box gold-box">
            <Users size={28} />
          </div>
          <div className="hub-card-content">
            <h3 className="font-game-3d hub-card-title">CLAN ROSTER</h3>
            <p className="hub-card-desc">Sortable member rankings by Trophies, Role, Town Hall level, and Donations given/received.</p>
          </div>
          <div className="card-action">
            <span>OPEN ROSTER</span>
            <ArrowRight size={18} />
          </div>
        </div>

        <div className="coc-card hub-card" onClick={() => navigate('/war')}>
          <div className="card-icon-box red-box">
            <Swords size={28} />
          </div>
          <div className="hub-card-content">
            <h3 className="font-game-3d hub-card-title">CLAN WARS</h3>
            <p className="hub-card-desc">Live war status, opponent details, star tallies, destruction %, and historical war log.</p>
          </div>
          <div className="card-action">
            <span>OPEN WARS</span>
            <ArrowRight size={18} />
          </div>
        </div>

        <div className="coc-card hub-card" onClick={() => navigate('/cwl')}>
          <div className="card-icon-box purple-box">
            <Trophy size={28} />
          </div>
          <div className="hub-card-content">
            <h3 className="font-game-3d hub-card-title">CWL LEAGUE</h3>
            <p className="hub-card-desc">CWL season group standings, 7-round battle logs, and player medal contributions.</p>
          </div>
          <div className="card-action">
            <span>OPEN CWL</span>
            <ArrowRight size={18} />
          </div>
        </div>
      </section>

      <style>{`
        .dashboard-page-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .hero-inner-content { max-width: 760px; }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(255, 199, 44, 0.15);
          border: 1px solid var(--border-gold);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--gold-light);
          margin-bottom: 14px;
        }
        .store-hero-title {
          font-size: 2.8rem;
          line-height: 1.1;
          margin-bottom: 12px;
        }
        .hero-desc {
          color: var(--text-muted-beige);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .hero-tag-box {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(0,0,0,0.4);
          padding: 10px 18px;
          border-radius: 12px;
          border: 1px solid var(--border-gold);
        }
        .tag-label { font-size: 0.75rem; font-weight: 800; color: var(--text-muted-beige); }
        .tag-val { font-size: 1.1rem; }

        .highlights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
        .highlight-card { padding: 24px; cursor: pointer; display: flex; flex-direction: column; gap: 12px; }
        .card-badge-header { display: flex; align-items: center; gap: 8px; }
        .xp-chip { background: #1d4ed8; color: #fff; font-weight: 800; font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; }
        .th-chip, .clan-lvl-chip { background: var(--gold-gradient); color: #121a24; font-weight: 800; font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; }
        .clan-mini-badge { width: 24px; height: 24px; }
        .player-title, .clan-title { font-size: 1.8rem; line-height: 1.1; }
        .stat-pills-row { display: flex; gap: 12px; margin-top: 4px; }
        .stat-pill { display: flex; align-items: center; gap: 6px; background: rgba(0, 0, 0, 0.4); border: 1px solid var(--border-gold); padding: 6px 14px; border-radius: 10px; font-size: 0.95rem; }
        .card-footer-action { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; font-weight: 800; color: var(--gold-light); }

        .hub-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .hub-card { padding: 24px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 220px; }
        .card-icon-box { width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .blue-box { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid #3b82f6; }
        .gold-box { background: rgba(255, 199, 44, 0.2); color: var(--gold-main); border: 1px solid var(--gold-border); }
        .red-box { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #dc2626; }
        .purple-box { background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid #a855f7; }

        .hub-card-title { font-size: 1.3rem; margin-bottom: 8px; }
        .hub-card-desc { font-size: 0.9rem; color: var(--text-muted-beige); line-height: 1.5; margin-bottom: 20px; }
        .card-action { display: flex; align-items: center; justify-content: space-between; font-weight: 700; font-size: 0.85rem; color: var(--gold-light); padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}
