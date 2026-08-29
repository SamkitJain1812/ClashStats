import React, { useState, useEffect } from 'react';
import { getClanDetails, getClanMembers } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Shield, Trophy, Users, Swords, ArrowUpDown, Search, Crown, Heart, User, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ClanPage({ activeTag, setActiveTag }) {
  const [clan, setClan] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Table controls
  const [sortBy, setSortBy] = useState('trophies'); // 'trophies', 'donations', 'donationsReceived', 'townHallLevel', 'role'
  const [sortOrder, setSortOrder] = useState('desc');
  const [memberSearch, setMemberSearch] = useState('');

  const navigate = useNavigate();

  const fetchClanData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clanRes, membersRes] = await Promise.all([
        getClanDetails(activeTag || 'default'),
        getClanMembers(activeTag || 'default')
      ]);

      if (clanRes && clanRes.success) {
        setClan(clanRes.data);
      } else {
        throw clanRes || { message: 'Failed to fetch clan details.' };
      }

      if (membersRes && membersRes.success) {
        setMembers(membersRes.data || []);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClanData();
  }, [activeTag]);

  if (loading) return <LoadingSpinner message="LOADING CLAN PROFILE & MEMBER LEADERBOARD..." />;
  if (error) return <ErrorMessage error={error} onRetry={fetchClanData} />;
  if (!clan) return null;

  // Handle member click navigation
  const handleMemberClick = (memberTag) => {
    if (setActiveTag) setActiveTag(memberTag);
    navigate(`/player`);
  };

  // Sorting Logic
  const roleWeights = { leader: 4, coLeader: 3, admin: 2, member: 1 };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.tag.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'role') {
      valA = roleWeights[a.role] || 0;
      valB = roleWeights[b.role] || 0;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="clan-page-container">
      {/* Clan Hero Banner */}
      <div className="clan-hero-card coc-card coc-card-gold">
        <div className="clan-hero-main">
          {/* Large Badge */}
          {clan.badgeUrls?.medium ? (
            <img src={clan.badgeUrls.medium} alt={clan.name} className="clan-emblem-img" />
          ) : (
            <div className="clan-emblem-fallback font-game">CLAN</div>
          )}

          <div className="clan-identity">
            <div className="clan-level-row">
              <span className="clan-lvl-badge font-game">LEVEL {clan.clanLevel}</span>
              <span className="clan-tag-text">{clan.tag}</span>
            </div>
            <h1 className="font-game text-gold-gradient text-shadow-game clan-name">{clan.name}</h1>
            <p className="clan-description">{clan.description || 'No clan description set.'}</p>
          </div>
        </div>

        {/* Clan Overview Metrics */}
        <div className="clan-header-stats-grid">
          <div className="clan-stat-chip">
            <Trophy size={18} className="text-gold-main" />
            <div>
              <span className="chip-label">CLAN POINTS</span>
              <span className="chip-value font-game">{clan.clanPoints?.toLocaleString()}</span>
            </div>
          </div>

          <div className="clan-stat-chip">
            <Swords size={18} className="text-red-loss" />
            <div>
              <span className="chip-label">WAR WIN STREAK</span>
              <span className="chip-value font-game">{clan.warWinStreak || 0} WINS</span>
            </div>
          </div>

          <div className="clan-stat-chip">
            <Users size={18} className="text-coc-blue-light" />
            <div>
              <span className="chip-label">MEMBERS</span>
              <span className="chip-value font-game">{clan.members} / 50</span>
            </div>
          </div>
        </div>
      </div>

      {/* Roster Leaderboard Table Section */}
      <section className="coc-card roster-card">
        <div className="roster-header-bar">
          <div className="header-title-group">
            <Users size={22} className="text-gold-main" />
            <h2 className="font-game roster-title">CLAN MEMBER LEADERBOARD</h2>
            <span className="coc-badge coc-badge-gold">{sortedMembers.length} MEMBERS</span>
          </div>

          {/* Roster Search Input */}
          <div className="roster-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Filter member by name..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="roster-search-input"
            />
          </div>
        </div>

        {/* Member Table */}
        <div className="table-responsive">
          <table className="coc-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>RANK</th>
                <th>MEMBER & ROLE</th>
                <th onClick={() => toggleSort('townHallLevel')} className="sortable-th">
                  <div className="th-cell">
                    <span>TH LEVEL</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => toggleSort('trophies')} className="sortable-th">
                  <div className="th-cell">
                    <span>TROPHIES</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => toggleSort('donations')} className="sortable-th">
                  <div className="th-cell">
                    <span>DONATED</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => toggleSort('donationsReceived')} className="sortable-th">
                  <div className="th-cell">
                    <span>RECEIVED</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {sortedMembers.map((member, index) => {
                const don = member.donations || 0;
                const rec = member.donationsReceived || 0;
                let roleLabel = 'Member';
                let roleClass = 'role-member';

                if (member.role === 'leader') { roleLabel = 'LEADER'; roleClass = 'role-leader'; }
                else if (member.role === 'coLeader') { roleLabel = 'CO-LEADER'; roleClass = 'role-coleader'; }
                else if (member.role === 'admin') { roleLabel = 'ELDER'; roleClass = 'role-elder'; }

                return (
                  <tr key={member.tag} onClick={() => handleMemberClick(member.tag)} className="member-row">
                    <td className="rank-td font-game">#{index + 1}</td>
                    <td className="member-info-td">
                      <div className="member-name-block">
                        <div className="name-row">
                          <span className="member-name font-heading">{member.name}</span>
                          <span className={`role-pill ${roleClass}`}>{roleLabel}</span>
                        </div>
                        <span className="member-tag">{member.tag}</span>
                      </div>
                    </td>
                    <td className="th-td">
                      <span className="th-table-badge font-game">TH {member.townHallLevel}</span>
                    </td>
                    <td className="trophy-td">
                      <div className="trophy-table-cell">
                        {member.league?.iconUrls?.tiny && (
                          <img src={member.league.iconUrls.tiny} alt={member.league.name} className="league-tiny-img" />
                        )}
                        <span className="trophy-val font-game">{member.trophies?.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="donated-td font-game text-green">{don.toLocaleString()}</td>
                    <td className="received-td font-game text-gold-main">{rec.toLocaleString()}</td>
                    <td className="action-td">
                      <ChevronRight size={18} className="chevron-icon" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <style>{`
        .clan-page-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .clan-hero-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: linear-gradient(135deg, #141f2d 0%, #1d2c3e 50%, #0d1521 100%);
        }
        .clan-hero-main {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .clan-emblem-img {
          width: 96px;
          height: 96px;
          filter: drop-shadow(0 6px 12px rgba(0,0,0,0.6));
        }
        .clan-emblem-fallback {
          width: 90px; height: 90px; background: var(--coc-blue-main); border: 2px solid var(--coc-blue-light); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.2rem;
        }

        .clan-identity { flex: 1; min-width: 280px; }
        .clan-level-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
        .clan-lvl-badge { background: var(--gold-gradient); color: #121a24; font-size: 0.75rem; font-weight: 800; padding: 2px 10px; border-radius: 12px; }
        .clan-tag-text { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; }
        .clan-name { font-size: 2.4rem; line-height: 1.1; margin-bottom: 8px; }
        .clan-description { color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; max-width: 720px; }

        .clan-header-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          border-top: 1px solid var(--border-dark);
          padding-top: 20px;
        }
        .clan-stat-chip {
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--border-dark);
          padding: 12px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .chip-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.5px; display: block; }
        .chip-value { font-size: 1.2rem; color: #fff; }

        /* Roster Card */
        .roster-card { padding: 28px; }
        .roster-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid var(--border-dark);
          padding-bottom: 18px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .header-title-group { display: flex; align-items: center; gap: 12px; }
        .roster-title { font-size: 1.3rem; color: var(--gold-light); }

        .roster-search-box { position: relative; min-width: 240px; }
        .roster-search-box .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .roster-search-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-dark);
          border-radius: 8px;
          padding: 8px 12px 8px 36px;
          color: #fff;
          font-family: var(--font-body);
          font-size: 0.85rem;
          outline: none;
        }
        .roster-search-input:focus { border-color: var(--gold-border); }

        /* Table Styling */
        .table-responsive { overflow-x: auto; }
        .coc-table { width: 100%; border-collapse: collapse; text-align: left; }
        .coc-table th {
          padding: 12px 16px;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-dark);
          letter-spacing: 0.5px;
        }
        .sortable-th { cursor: pointer; user-select: none; }
        .sortable-th:hover { color: var(--gold-main); }
        .th-cell { display: flex; align-items: center; gap: 6px; }

        .member-row {
          cursor: pointer;
          transition: background 0.15s ease;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .member-row:hover {
          background: rgba(255, 199, 44, 0.05);
        }
        .member-row td { padding: 14px 16px; vertical-align: middle; }

        .rank-td { font-size: 1.1rem; color: var(--gold-main); }
        .member-name-block { display: flex; flex-direction: column; gap: 2px; }
        .name-row { display: flex; align-items: center; gap: 8px; }
        .member-name { font-size: 1rem; color: #fff; font-weight: 700; }
        .member-tag { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

        .role-pill { font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
        .role-leader { background: rgba(255, 199, 44, 0.2); color: var(--gold-main); border: 1px solid var(--gold-border); }
        .role-coleader { background: rgba(38, 114, 207, 0.2); color: var(--coc-blue-light); border: 1px solid var(--coc-blue-light); }
        .role-elder { background: rgba(76, 217, 100, 0.2); color: var(--green-win); border: 1px solid var(--green-win); }
        .role-member { background: rgba(255, 255, 255, 0.06); color: var(--text-muted); }

        .th-table-badge { background: rgba(0, 0, 0, 0.4); border: 1px solid var(--border-dark); padding: 4px 8px; border-radius: 6px; font-size: 0.85rem; color: var(--gold-light); }
        .trophy-table-cell { display: flex; align-items: center; gap: 6px; }
        .league-tiny-img { width: 24px; height: 24px; }
        .trophy-val { font-size: 1.05rem; color: #fff; }
        .chevron-icon { color: var(--text-muted); opacity: 0.5; transition: opacity 0.2s, transform 0.2s; }
        .member-row:hover .chevron-icon { opacity: 1; transform: translateX(3px); color: var(--gold-main); }
      `}</style>
    </div>
  );
}
