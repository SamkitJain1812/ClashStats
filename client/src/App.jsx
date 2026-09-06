import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import DashboardPage from './pages/DashboardPage';
import PlayerPage from './pages/PlayerPage';
import ClanPage from './pages/ClanPage';
import WarPage from './pages/WarPage';
import CwlPage from './pages/CwlPage';
import { pingHealth } from './services/api';

export default function App() {
  const [activePlayerTag, setActivePlayerTag] = useState(() => {
    return localStorage.getItem('clashstat_player_tag') || '';
  });
  const [activeClanTag, setActiveClanTag] = useState(() => {
    return localStorage.getItem('clashstat_clan_tag') || '';
  });

  // Silent keepalive ping on startup to ensure backend is warm
  useEffect(() => {
    pingHealth();
  }, []);

  // Handle Tag Search from Search Bar
  const handleTagSearch = (tag) => {
    const cleanTag = tag?.trim() ? (tag.trim().startsWith('#') ? tag.trim().toUpperCase() : '#' + tag.trim().toUpperCase()) : '';
    setActivePlayerTag(cleanTag);
    if (cleanTag) {
      localStorage.setItem('clashstat_player_tag', cleanTag);
    } else {
      localStorage.removeItem('clashstat_player_tag');
    }
    setActiveClanTag('');
    localStorage.removeItem('clashstat_clan_tag');
  };

  const handleClanTagChange = (clanTag) => {
    setActiveClanTag(clanTag);
    if (clanTag) {
      localStorage.setItem('clashstat_clan_tag', clanTag);
    }
  };

  return (
    <Router>
      <div className="app-shell">
        <Navbar
          activeTag={activePlayerTag}
          setActiveTag={handleTagSearch}
        />
        
        <main className="app-content">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  activePlayerTag={activePlayerTag}
                  setActivePlayerTag={handleTagSearch}
                  activeClanTag={activeClanTag}
                  setActiveClanTag={handleClanTagChange}
                />
              }
            />
            <Route
              path="/player"
              element={
                <PlayerPage
                  activeTag={activePlayerTag}
                  setActiveClanTag={setActiveClanTag}
                />
              }
            />
            <Route
              path="/clan"
              element={
                <ClanPage
                  activeTag={activeClanTag}
                  setActiveTag={handleTagSearch}
                />
              }
            />
            <Route
              path="/war"
              element={
                <WarPage activeTag={activeClanTag} />
              }
            />
            <Route
              path="/cwl"
              element={
                <CwlPage activeTag={activeClanTag} />
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>

      <style>{`
        .app-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .app-content {
          flex: 1;
        }
      `}</style>
    </Router>
  );
}
