import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import DashboardPage from './pages/DashboardPage';
import PlayerPage from './pages/PlayerPage';
import ClanPage from './pages/ClanPage';
import WarPage from './pages/WarPage';
import CwlPage from './pages/CwlPage';

export default function App() {
  const [activePlayerTag, setActivePlayerTag] = useState('');
  const [activeClanTag, setActiveClanTag] = useState('');

  // Handle Tag Search from Search Bar
  const handleTagSearch = (tag) => {
    setActivePlayerTag(tag);
    // Also reset clan tag so pages auto-resolve from player's clan
    setActiveClanTag('');
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
                  activeClanTag={activeClanTag}
                  setActiveClanTag={setActiveClanTag}
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
