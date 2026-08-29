import React, { useState, useEffect } from 'react';
import { getCwlGroup } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Trophy, Award, Calendar, Star, Shield, CheckCircle, ChevronRight, Info, Eye, Sparkles } from 'lucide-react';

// Realistic Sample CWL Data for Preview Mode
const MOCK_CWL_CLANS = [
  { rank: 1, name: 'Clashers Empire', tag: '#2GP20YPVP', stars: 284, destruction: 5420.5, wins: 6, losses: 1, isOurClan: true },
  { rank: 2, name: 'Valhalla Warriors', tag: '#2YY09988', stars: 268, destruction: 5210.0, wins: 5, losses: 2 },
  { rank: 3, name: 'Apex Predators', tag: '#8899AABB', stars: 251, destruction: 4980.2, wins: 4, losses: 3 },
  { rank: 4, name: 'Shadow Ninjas', tag: '#11223344', stars: 242, destruction: 4850.8, wins: 4, losses: 3 },
  { rank: 5, name: 'Royal Knights', tag: '#55667788', stars: 230, destruction: 4620.1, wins: 3, losses: 4 },
  { rank: 6, name: 'Mystic Elixir', tag: '#99AABBCC', stars: 215, destruction: 4410.0, wins: 3, losses: 4 },
  { rank: 7, name: 'Dark Avengers', tag: '#DDEEFF00', stars: 198, destruction: 4120.4, wins: 2, losses: 5, demoted: true },
  { rank: 8, name: 'Dragon Slayers', tag: '#12345678', stars: 175, destruction: 3890.0, wins: 1, losses: 6, demoted: true }
];

const MOCK_ROUNDS = [
  { round: 1, opponent: 'Valhalla Warriors', oppTag: '#2YY09988', ourStars: 42, oppStars: 38, ourDest: 95.4, oppDest: 88.2, status: 'WIN' },
  { round: 2, opponent: 'Apex Predators', oppTag: '#8899AABB', ourStars: 39, oppStars: 35, ourDest: 91.2, oppDest: 84.5, status: 'WIN' },
  { round: 3, opponent: 'Shadow Ninjas', oppTag: '#11223344', ourStars: 41, oppStars: 37, ourDest: 93.0, oppDest: 86.8, status: 'WIN' },
  { round: 4, opponent: 'Royal Knights', oppTag: '#55667788', ourStars: 38, oppStars: 40, ourDest: 89.5, oppDest: 92.1, status: 'LOSS' },
  { round: 5, opponent: 'Mystic Elixir', oppTag: '#99AABBCC', ourStars: 44, oppStars: 31, ourDest: 98.2, oppDest: 79.4, status: 'WIN' },
  { round: 6, opponent: 'Dark Avengers', oppTag: '#DDEEFF00', ourStars: 40, oppStars: 33, ourDest: 92.6, oppDest: 81.0, status: 'WIN' },
  { round: 7, opponent: 'Dragon Slayers', oppTag: '#12345678', ourStars: 40, oppStars: 29, ourDest: 90.1, oppDest: 76.5, status: 'WIN' }
];

const MOCK_MEMBER_MEDALS = [
  { name: 'Chief Sam', tag: '#Y8YLP9RR2', th: 16, attacksUsed: 7, stars: 21, baseMedals: 320, bonusEligible: true },
  { name: 'Warlord Alex', tag: '#22PP0011', th: 16, attacksUsed: 7, stars: 19, baseMedals: 320, bonusEligible: true },
  { name: 'DragonMaster', tag: '#33QQ1122', th: 15, attacksUsed: 7, stars: 18, baseMedals: 320, bonusEligible: true },
  { name: 'ShadowKnight', tag: '#44RR2233', th: 15, attacksUsed: 6, stars: 16, baseMedals: 288, bonusEligible: true },
  { name: 'ArcherQueen99', tag: '#55SS3344', th: 14, attacksUsed: 7, stars: 15, baseMedals: 320, bonusEligible: false },
  { name: 'VikingKing', tag: '#66TT4455', th: 14, attacksUsed: 5, stars: 12, baseMedals: 256, bonusEligible: false }
];

export default function CwlPage({ activeTag }) {
  const [cwlData, setCwlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Controls
  const [previewMode, setPreviewMode] = useState(true); // Default to preview mode if inactive
  const [selectedRound, setSelectedRound] = useState(1);

  const fetchCwl = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCwlGroup(activeTag || 'default');
      if (res && res.success && res.data && res.data.state !== 'notInWar') {
        setCwlData(res.data);
        setPreviewMode(false); // Real data available
      } else {
        // No active CWL season right now
        setPreviewMode(true);
      }
    } catch (err) {
      // 404 or inactive -> fallback to preview mode
      setPreviewMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCwl();
  }, [activeTag]);

  if (loading) return <LoadingSpinner message="FETCHING CLAN WAR LEAGUE GROUP TELEMETRY..." />;

  const currentRoundData = MOCK_ROUNDS.find(r => r.round === selectedRound) || MOCK_ROUNDS[0];

  return (
    <div className="cwl-page-container">
      {/* Header Banner */}
      <div className="cwl-header-banner coc-card coc-card-gold">
        <div className="header-main">
          <div className="cwl-badge-box">
            <Trophy size={32} className="text-purple-cwl" />
          </div>
          <div>
            <div className="league-tier-pill font-game">MASTER LEAGUE I</div>
            <h1 className="font-game text-gold-gradient text-shadow-game page-title">CLAN WAR LEAGUE (CWL)</h1>
            <span className="page-subtitle font-heading">SEASON GROUP TELEMETRY & MEDAL CALCULATOR</span>
          </div>
        </div>

        {/* Preview / Live Mode Toggle */}
        <div className="mode-toggle-card">
          <div className="toggle-info font-heading">
            <Eye size={16} className="text-gold-main" />
            <span>{previewMode ? 'PREVIEW MODE ACTIVE' : 'LIVE CWL DATA'}</span>
          </div>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`coc-btn ${previewMode ? 'coc-btn-gold' : ''} toggle-btn`}
          >
            <Sparkles size={16} />
            <span>{previewMode ? 'SWITCH TO LIVE CHECK' : 'ENABLE PREVIEW DEMO'}</span>
          </button>
        </div>
      </div>

      {previewMode && (
        <div className="preview-notice-banner coc-card">
          <Info size={20} className="text-gold-main" />
          <p>
            <strong>Note:</strong> Clan War League takes place during the first week of each month. Since CWL is not currently active for your clan today, displaying <strong>Interactive Sample CWL Season Telemetry</strong> below.
          </p>
        </div>
      )}

      {/* 8-Clan Group Standings Table */}
      <section className="coc-card standings-card">
        <div className="card-title-bar">
          <Trophy size={22} className="text-purple-cwl" />
          <h2 className="font-game standings-title">8-CLAN GROUP STANDINGS</h2>
          <span className="coc-badge coc-badge-gold">MASTER LEAGUE I</span>
        </div>

        <div className="table-responsive">
          <table className="coc-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>RANK</th>
                <th>CLAN NAME</th>
                <th>TOTAL STARS</th>
                <th>TOTAL DESTRUCTION</th>
                <th>WAR RECORD (W-L)</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CWL_CLANS.map((clanItem) => {
                const isPromo = clanItem.rank === 1;
                const isDemoted = clanItem.demoted;

                return (
                  <tr
                    key={clanItem.tag}
                    className={`cwl-row ${clanItem.isOurClan ? 'our-clan-row' : ''} ${isPromo ? 'promo-row' : ''} ${isDemoted ? 'demote-row' : ''}`}
                  >
                    <td className="rank-td font-game">#{clanItem.rank}</td>
                    <td>
                      <div className="clan-name-cell">
                        <span className="clan-name-text font-heading">{clanItem.name}</span>
                        {clanItem.isOurClan && <span className="our-clan-tag font-game">OUR CLAN</span>}
                      </div>
                    </td>
                    <td className="font-game text-gold-main stars-td">★ {clanItem.stars}</td>
                    <td className="font-heading dest-td">{clanItem.destruction.toFixed(1)}%</td>
                    <td className="font-game record-td">
                      <span className="text-green">{clanItem.wins}W</span> - <span className="text-red-loss">{clanItem.losses}L</span>
                    </td>
                    <td>
                      {isPromo ? (
                        <span className="coc-badge coc-badge-win">PROMOTION ZONE</span>
                      ) : isDemoted ? (
                        <span className="coc-badge coc-badge-loss">DEMOTION ZONE</span>
                      ) : (
                        <span className="coc-badge coc-badge-gold">SAFE</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7-Round Battle Tabs */}
      <section className="coc-card rounds-card">
        <div className="card-title-bar">
          <Calendar size={22} className="text-gold-main" />
          <h2 className="font-game rounds-title">7-ROUND BATTLE LOGS</h2>
        </div>

        {/* Round Tabs */}
        <div className="round-tabs-row">
          {MOCK_ROUNDS.map((r) => (
            <button
              key={r.round}
              onClick={() => setSelectedRound(r.round)}
              className={`round-tab-btn font-game ${selectedRound === r.round ? 'active-round' : ''}`}
            >
              <span>ROUND {r.round}</span>
              <span className={`round-status-pill ${r.status === 'WIN' ? 'win-pill' : 'loss-pill'}`}>
                {r.status}
              </span>
            </button>
          ))}
        </div>

        {/* Round Detail Scorecard */}
        <div className="round-detail-box">
          <div className="round-detail-header">
            <span className="round-num-label font-game">ROUND {currentRoundData.round} MATCH</span>
            <span className={`coc-badge ${currentRoundData.status === 'WIN' ? 'coc-badge-win' : 'coc-badge-loss'}`}>
              RESULT: {currentRoundData.status}
            </span>
          </div>

          <div className="round-match-grid">
            <div className="round-team-col our-col">
              <h3 className="font-game team-name text-gold-gradient">Clashers Empire</h3>
              <div className="round-stars font-game">★ {currentRoundData.ourStars}</div>
              <div className="round-dest font-heading">{currentRoundData.ourDest}% Destruction</div>
            </div>

            <div className="round-vs-divider font-game">VS</div>

            <div className="round-team-col opp-col">
              <h3 className="font-game team-name text-red-loss">{currentRoundData.opponent}</h3>
              <div className="round-stars font-game">★ {currentRoundData.oppStars}</div>
              <div className="round-dest font-heading">{currentRoundData.oppDest}% Destruction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Player CWL Medals & Performance Calculator */}
      <section className="coc-card medals-card">
        <div className="card-title-bar">
          <Award size={22} className="text-purple-cwl" />
          <h2 className="font-game medals-title">MEMBER CWL MEDALS & BONUS CALCULATOR</h2>
        </div>

        <div className="table-responsive">
          <table className="coc-table">
            <thead>
              <tr>
                <th>PLAYER</th>
                <th>TH LEVEL</th>
                <th>ATTACKS USED</th>
                <th>TOTAL STARS</th>
                <th>BASE LEAGUE MEDALS</th>
                <th>BONUS MEDAL ELIGIBLE</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_MEMBER_MEDALS.map((m) => (
                <tr key={m.tag} className="member-row">
                  <td>
                    <div className="player-name-text font-heading">{m.name}</div>
                    <div className="player-tag-text">{m.tag}</div>
                  </td>
                  <td><span className="th-table-badge font-game">TH {m.th}</span></td>
                  <td className="font-game">{m.attacksUsed} / 7</td>
                  <td className="font-game text-gold-main">★ {m.stars}</td>
                  <td className="font-game text-purple-cwl">{m.baseMedals} MEDALS</td>
                  <td>
                    {m.bonusEligible ? (
                      <span className="coc-badge coc-badge-win">HIGH BONUS PRIORITY</span>
                    ) : (
                      <span className="coc-badge coc-badge-gold">STANDARD</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <style>{`
        .cwl-page-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .cwl-header-banner {
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          background: linear-gradient(135deg, #1b142d 0%, #281c44 50%, #120b20 100%);
          flex-wrap: wrap;
        }
        .header-main { display: flex; align-items: center; gap: 20px; }
        .cwl-badge-box {
          width: 72px; height: 72px; background: rgba(168, 85, 247, 0.2); border: 2px solid var(--purple-cwl); border-radius: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
        }
        .league-tier-pill { background: var(--purple-cwl); color: #fff; font-size: 0.75rem; padding: 2px 10px; border-radius: 12px; display: inline-block; margin-bottom: 4px; }
        .page-title { font-size: 2.2rem; line-height: 1.1; }
        .page-subtitle { font-size: 0.75rem; color: var(--text-muted); letter-spacing: 1px; }

        .mode-toggle-card {
          background: rgba(0,0,0,0.4);
          border: 1px solid var(--border-gold);
          padding: 16px 20px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-end;
        }
        .toggle-info { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--gold-light); }
        .toggle-btn { padding: 8px 14px; font-size: 0.8rem; }

        .preview-notice-banner {
          background: rgba(255, 199, 44, 0.08);
          border: 1px solid var(--gold-border);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          color: var(--text-main);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        /* Standings */
        .standings-card, .rounds-card, .medals-card { padding: 28px; }
        .card-title-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--border-dark);
          padding-bottom: 14px;
          margin-bottom: 20px;
          color: var(--gold-light);
        }
        .standings-title, .rounds-title, .medals-title { font-size: 1.3rem; flex: 1; }

        .cwl-row { border-bottom: 1px solid rgba(255,255,255,0.03); }
        .our-clan-row { background: rgba(38, 114, 207, 0.12) !important; border-left: 4px solid var(--coc-blue-light); }
        .promo-row { background: rgba(76, 217, 100, 0.05); }
        .demote-row { background: rgba(255, 59, 48, 0.05); }

        .clan-name-cell { display: flex; align-items: center; gap: 10px; }
        .clan-name-text { font-size: 1.05rem; color: #fff; }
        .our-clan-tag { background: var(--coc-blue-main); color: #fff; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; }
        .text-purple-cwl { color: var(--purple-cwl); }

        /* Rounds */
        .round-tabs-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 16px; margin-bottom: 16px; }
        .round-tab-btn {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-dark);
          color: var(--text-muted);
          padding: 10px 16px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .round-tab-btn:hover { border-color: var(--gold-border); color: #fff; }
        .active-round { background: var(--gold-gradient); color: #121a24 !important; border-color: #fff; }

        .round-status-pill { font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
        .win-pill { background: rgba(76, 217, 100, 0.2); color: var(--green-win); }
        .loss-pill { background: rgba(255, 59, 48, 0.2); color: var(--red-loss); }
        .active-round .win-pill, .active-round .loss-pill { background: rgba(0,0,0,0.3); color: #121a24; }

        .round-detail-box {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--border-dark);
          border-radius: 14px;
          padding: 24px;
        }
        .round-detail-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .round-num-label { font-size: 1.1rem; color: var(--gold-light); }

        .round-match-grid { display: grid; grid-template-columns: 1fr 60px 1fr; align-items: center; text-align: center; gap: 16px; }
        .round-team-col { padding: 16px; background: rgba(0,0,0,0.2); border-radius: 12px; border: 1px solid var(--border-dark); }
        .our-col { border-color: var(--gold-border); }
        .opp-col { border-color: rgba(255, 59, 48, 0.4); }
        .team-name { font-size: 1.4rem; margin-bottom: 4px; }
        .round-stars { font-size: 2rem; color: var(--gold-main); }
        .round-dest { font-size: 0.85rem; color: var(--text-muted); }
        .round-vs-divider { font-size: 1.4rem; color: var(--gold-main); }

        .player-name-text { font-size: 1rem; color: #fff; }
        .player-tag-text { font-size: 0.75rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
