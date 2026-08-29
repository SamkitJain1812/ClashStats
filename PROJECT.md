# PROJECT.md — ClashStat

## 1. Project Overview & Scope
**ClashStat** is a full-stack, Clash of Clans dashboard application modeling the visual identity and polish of Supercell's official store ([store.supercell.com](https://store.supercell.com)). It provides comprehensive real-time statistics for Clash of Clans players and clans, including player profiles, clan member leaderboards, clan war stats, and Clan War League (CWL) performance.

- **Access Model:** Public dashboard featuring an interactive Player/Clan Tag search bar alongside pre-configured default tags.
- **Visual Vibe:** Supercell Store UI — deep slate background, gold/bronze beveled trims, CoC blue UI chrome, Town Hall badges, and bold gaming typography.

---

## 2. Tech Stack
- **Frontend:** React (Vite), Vanilla CSS with CSS custom properties for the Supercell theme system, Lucide icons, and Recharts/Chart.js for stat visualization.
- **Backend:** Node.js + Express API Proxy.
- **Caching & API Integration:** Express backend acts as a secure proxy to the official Clash of Clans REST API (`https://api.clashofclans.com/v1`). It handles Bearer token auth and includes an in-memory TTL cache (30s–60s) to optimize response times and prevent API rate-limiting.
- **Environment Configuration:** Configured via `.env` (`COC_API_TOKEN`, `DEFAULT_PLAYER_TAG`, `DEFAULT_CLAN_TAG`, `PORT`).

---

## 3. Visual & UI Direction (Supercell Store Branding)
- **Color Palette:**
  - Dark Slate/Navy Backgrounds: `#0b1017`, `#141c27`, `#1c2836`
  - CoC Blue UI Chrome: `#1d5da9`, `#2672cf`, hover glow `#3a8bfd`
  - Metallic Gold/Bronze Trim: `#ffc72c`, `#d49b29`, `#e5a823`
  - Accent Badges: Green `#4cd964` (Wins/Online), Red `#ff3b30` (Losses/War), Purple `#a855f7` (Elixir/CWL)
- **Typography:** Google Fonts (`Luckiest Guy` for heavy CoC headings/titles, `Outfit` / `Kanit` for clean UI numbers and stats). Text strokes, drop shadows, and metallic gradient text fills.
- **UI Elements:** Beveled action buttons, ribbon banners, Town Hall level shield badges, gold frame borders, and troop level indicator pills.

---

## 4. Screens & Key Features

### Top Navigation & Global Bar
- Brand logo with clash swords motif and gold trim.
- Interactive Tag Search Bar (accepts `#PLAYER_TAG` or `#CLAN_TAG`).
- Quick-switch preset chips for default tags.
- Live API connectivity & server status indicator.

### Screen 1: Player Profile (`/player`)
- **Header Card:** Player Name, Tag, Town Hall badge level, Builder Hall level, Clan affiliation, XP level shield.
- **Trophy & League Overview:** Main Trophies, Highest Trophies, Legend League stats (if applicable), Builder Base Trophies.
- **Stats Grid:** Attacks Won, Defenses Won, Clan Cards Donated vs. Received (with ratio rating indicator), War Stars won, Clan Capital Contribution.
- **Hero & Troop Arsenal:** Visual grid showcasing unlocked Troops, Spells, and Heroes with level badges (`Level X / Max Y`).

### Screen 2: Clan Overview & Member Leaderboard (`/clan`)
- **Clan Header:** Clan Badge emblem, Name, Tag, Clan Level badge, Total Clan Points, War Win Streak, Required Trophies, War Frequency, Clan Capital Level.
- **Member Leaderboard Table:** Interactive sortable table by Rank, Name, Role (Leader, Co-Leader, Elder, Member), Town Hall Level, Trophies, Donations Given, Donations Received.
- **Donation Activity Status:** Visual donor health tags (Top Donor, Generous, Balanced, Low Donor).

### Screen 3: War Stats & Log (`/war`)
- **Current War Live Card:** Current War state (Preparation, In War, Ended), Opponent Clan details, Star count progress bar, Destruction percentage, Attacks used count, battle timer countdown.
- **War Log & Performance Stats:** Win/Loss/Tie ratio cards, recent War Log results, average destruction rate chart, star efficiency breakdown.

### Screen 4: CWL (Clan War League) Dashboard (`/cwl`)
- **CWL Group Standings:** CWL Season tier badge, standings leaderboard of all 8 clans in group, total stars scored, total destruction percentage.
- **Round Breakdown:** Navigation tab across Rounds 1–7 displaying match scores and star tallies per round.
- **Player CWL Performance Table:** Stars contributed per member, total attacks used, and estimated CWL bonus medal output.

---

## 5. Next Steps
- Confirm `PROJECT.md` scope with the user.
- Upon approval, initialize the backend server (`server/`) and frontend React app (`client/`).
