import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Swords, User, Users, Trophy, Search, Activity, RefreshCw, Clock, X, ChevronRight } from 'lucide-react';
import cocLogo from '../assets/Clash of Clans logo.svg';

export default function Navbar({ activeTag, setActiveTag, onRefresh }) {
  const [searchInput, setSearchInput] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timerCount, setTimerCount] = useState(60);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Auto-refresh 60s timer
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setTimerCount((prev) => {
        if (prev <= 1) {
          handleManualRefresh();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, onRefresh]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => {
      setIsRefreshing(false);
      setTimerCount(60);
    }, 600);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    let cleanTag = searchInput.trim();
    if (!cleanTag.startsWith('#')) {
      cleanTag = '#' + cleanTag;
    }

    if (setActiveTag) setActiveTag(cleanTag);
    setSearchInput('');
    setIsDrawerOpen(false);
    
    // If not already on home dashboard or player page, route to player
    if (location.pathname !== '/' && location.pathname !== '/player') {
      navigate('/player');
    }
  };

  return (
    <>
      {/* Supercell Store Wooden Header Top Bar */}
      <header className="supercell-wooden-header">
        <div className="wood-header-inner">
          {/* Official Clash of Clans Logo from Assets folder */}
          <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={cocLogo} alt="Clash of Clans Logo" className="coc-asset-logo-img" />
          </div>

          {/* Persistent Search Form in Header */}
          <form className="header-search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Search Player/Clan Tag (#Y8YLP9RR2)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button type="submit" className="coc-btn search-btn font-game">
              SEARCH
            </button>
          </form>

          {/* Sync & Menu Actions */}
          <div className="header-right-actions">
            <button
              onClick={handleManualRefresh}
              className={`coc-btn refresh-btn ${isRefreshing ? 'spinning' : ''}`}
              title="Manual Refresh Telemetry"
            >
              <RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} />
              <span>REFRESH</span>
            </button>

            <div
              className="supercell-id-profile-btn"
              onClick={() => setIsDrawerOpen(true)}
              title="Open Mobile Menu"
            >
              <div className="sc-avatar-circle">
                <User size={18} />
              </div>
              <div className="hamburger-bars">
                <div className="bar-line"></div>
                <div className="bar-line"></div>
                <div className="bar-line"></div>
              </div>
            </div>
          </div>
        </div>

        {/* PROMINENT TOP NAVIGATION TAB BAR */}
        <nav className="top-dashboard-nav-bar">
          <div className="top-nav-inner">
            <NavLink to="/" end className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}>
              <Activity size={18} />
              <span>DASHBOARD</span>
            </NavLink>

            <NavLink to="/player" className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}>
              <User size={18} />
              <span>PLAYER PROFILE</span>
            </NavLink>

            <NavLink to="/clan" className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>CLAN ROSTER</span>
            </NavLink>

            <NavLink to="/war" className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}>
              <Swords size={18} />
              <span>CLAN WARS</span>
            </NavLink>

            <NavLink to="/cwl" className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}>
              <Trophy size={18} />
              <span>CWL LEAGUE</span>
            </NavLink>
          </div>
        </nav>
      </header>

      {/* Sub Ribbon */}
      <div className="store-sub-ribbon">
        Discover Clash of Clans Telemetry & Leaderboards ⚡ Live API Connected
      </div>

      {/* Slide-Out Side Drawer Menu */}
      {isDrawerOpen && (
        <div className="side-drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="side-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <img src={cocLogo} alt="Clash of Clans" style={{ height: '36px' }} />
              <button className="drawer-close-btn" onClick={() => setIsDrawerOpen(false)}>
                <X size={26} />
              </button>
            </div>

            {/* Profile Info Block */}
            <div className="drawer-user-card">
              <div className="drawer-user-avatar">
                <User size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold-main)', fontWeight: 800 }}>ACTIVE TELEMETRY TAG</span>
                <h4 className="font-heading" style={{ color: '#fff', fontSize: '1.05rem' }}>
                  {activeTag || '#Y8YLP9RR2'}
                </h4>
              </div>
            </div>

            {/* Mobile Tag Search Form */}
            <form onSubmit={handleSearchSubmit} className="mobile-drawer-search">
              <div className="search-input-wrapper">
                <Search className="search-icon" size={16} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter Tag (e.g. #2GP20YPVP)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <button type="submit" className="coc-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                SEARCH TAG
              </button>
            </form>

            {/* Navigation Menu Items */}
            <div className="drawer-menu-list">
              <NavLink to="/" end onClick={() => setIsDrawerOpen(false)} className={({ isActive }) => `drawer-menu-item ${isActive ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Activity size={18} />
                  <span>DASHBOARD</span>
                </div>
                <ChevronRight size={16} />
              </NavLink>

              <NavLink to="/player" onClick={() => setIsDrawerOpen(false)} className={({ isActive }) => `drawer-menu-item ${isActive ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <User size={18} />
                  <span>PLAYER PROFILE</span>
                </div>
                <ChevronRight size={16} />
              </NavLink>

              <NavLink to="/clan" onClick={() => setIsDrawerOpen(false)} className={({ isActive }) => `drawer-menu-item ${isActive ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Users size={18} />
                  <span>CLAN ROSTER</span>
                </div>
                <ChevronRight size={16} />
              </NavLink>

              <NavLink to="/war" onClick={() => setIsDrawerOpen(false)} className={({ isActive }) => `drawer-menu-item ${isActive ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Swords size={18} />
                  <span>CLAN WARS</span>
                </div>
                <ChevronRight size={16} />
              </NavLink>

              <NavLink to="/cwl" onClick={() => setIsDrawerOpen(false)} className={({ isActive }) => `drawer-menu-item ${isActive ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Trophy size={18} />
                  <span>CWL LEAGUE</span>
                </div>
                <ChevronRight size={16} />
              </NavLink>
            </div>

            {/* Sync & Refresh Controls in Drawer */}
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={handleManualRefresh} className={`coc-btn ${isRefreshing ? 'spinning' : ''}`} style={{ justifyContent: 'center' }}>
                <RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} />
                <span>REFRESH LIVE TELEMETRY</span>
              </button>

              <button onClick={() => setAutoRefresh(!autoRefresh)} className={`auto-timer-pill ${autoRefresh ? 'timer-active' : 'timer-disabled'}`} style={{ justifyContent: 'center' }}>
                <Clock size={14} />
                <span>{autoRefresh ? `AUTO-SYNC ACTIVE (${timerCount}s)` : 'AUTO-SYNC OFF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Rewards Bar */}
      <div className="supercell-floating-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="floating-pts-badge">100 PTS</span>
          <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>To next Telemetry Level</span>
        </div>
        <button onClick={handleManualRefresh} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <RefreshCw size={16} className={isRefreshing ? 'spin-icon' : ''} />
        </button>
      </div>

      <style>{`
        .header-search-form {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          max-width: 380px;
        }
        .search-input-wrapper {
          position: relative;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted-dark);
        }
        .search-input {
          width: 100%;
          background: #1f140c;
          border: 1px solid #7d5733;
          border-radius: 8px;
          padding: 8px 12px 8px 38px;
          color: #fff;
          font-family: var(--font-body);
          font-size: 0.85rem;
          outline: none;
        }
        .search-input:focus {
          border-color: var(--gold-main);
        }
        .search-btn {
          padding: 8px 14px;
          font-size: 0.8rem;
          white-space: nowrap;
        }
        .header-right-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .top-dashboard-nav-bar {
          background: rgba(34, 20, 10, 0.95);
          border-top: 1px solid rgba(255, 199, 44, 0.2);
          border-bottom: 2px solid var(--border-gold);
          padding: 0 24px;
        }
        .top-nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          gap: 6px;
          overflow-x: auto;
        }
        .top-nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          color: #d4c5b5;
          text-decoration: none;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .top-nav-link:hover {
          color: #fff;
          background: rgba(255, 199, 44, 0.08);
        }
        .top-nav-link.active {
          color: var(--gold-main);
          border-bottom-color: var(--gold-main);
          background: rgba(255, 199, 44, 0.15);
          text-shadow: 0 0 10px rgba(255, 199, 44, 0.3);
        }

        @media (max-width: 768px) {
          .header-search-form { display: none; }
        }
      `}</style>
    </>
  );
}
