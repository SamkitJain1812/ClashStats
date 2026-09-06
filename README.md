# ClashStat — Clash of Clans Telemetry Dashboard

[![Live Frontend](https://img.shields.io/badge/Live%20Frontend-clash--stats--navy.vercel.app-00dfa2?style=for-the-badge&logo=vercel&logoColor=white)](https://clash-stats-navy.vercel.app/)
[![Live Backend](https://img.shields.io/badge/Live%20Backend-clashstats--a97q.onrender.com-417e38?style=for-the-badge&logo=render&logoColor=white)](https://clashstats-a97q.onrender.com)
[![React 19 Vite](https://img.shields.io/badge/Frontend-React%2019%20%2F%20Vite-61dafb?style=for-the-badge&logo=react)](https://vite.dev)
[![Node.js Express](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-000000?style=for-the-badge&logo=express)](https://expressjs.com)

**ClashStat** is a modern, high-performance Clash of Clans telemetry and clan management dashboard inspired by the Supercell Store design system. It connects directly to the official Supercell REST API through a secure, caching Express proxy.

---

## 🔗 Live Deployments

* **Frontend Web App:** [https://clash-stats-navy.vercel.app/](https://clash-stats-navy.vercel.app/)
* **Backend API Base:** [https://clashstats-a97q.onrender.com](https://clashstats-a97q.onrender.com)
* **API Health & Keepalive:** [https://clashstats-a97q.onrender.com/api/v1/health/ping](https://clashstats-a97q.onrender.com/api/v1/health/ping)

---

## 🌟 Key Features

1. **Supercell Store Aesthetic:** Dark slate backgrounds (`#0b1017`), CoC electric blue chrome (`#1d5da9`), beveled metallic gold accents (`#ffc72c`), and custom Town Hall badges.
2. **Player Profile Telemetry:** Real-time stats including Town Hall level and weapon level, trophies, attack/defense win rates, war stars, donation ratio meters, hero/troop levels, and achievements.
3. **Clan Roster & Leaderboard:** Sortable roster by Trophies, Donations Given, Donations Received, Town Hall Level, and Clan Role with one-click player drilldown.
4. **Live Clan Wars & War Log:** Live war scorecards (Stars, Destruction %, Attacks Remaining), round-by-round attack timeline, and historical war logs.
5. **Clan War League (CWL):** 8-Clan Group standings table, 7-round battle logs, and member medal calculator with an interactive preview fallback for off-season periods.
6. **Smart Caching & Rate Limiting:** Built-in in-memory caching (`node-cache`) to preserve API quotas and deliver sub-millisecond responses.
7. **Silent Once-a-Month Keepalive:** Built-in Vercel Cron and GitHub Actions workflow running on the 1st of every month to keep the frontend and backend warm and prevent platform dormancy without sending notification or alert emails.

---

## 📁 Repository Structure

```text
ClashStats/
├── .github/workflows/
│   └── monthly-ping.yml       # Silent monthly keepalive workflow (0 0 1 * *)
├── api/
│   └── index.js               # Vercel serverless function entry point
├── client/                    # React 19 + Vite frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components (Navbar, Footer, Badges, etc.)
│   │   ├── pages/             # Dashboard, Player, Clan, War, and CWL views
│   │   └── services/api.js    # Axios API client with automatic health ping
│   └── package.json
├── server/                    # Node.js Express backend proxy
│   ├── routes/                # Health, Player, Clan, and CWL route handlers
│   ├── middleware/            # Caching and error handling
│   ├── index.js               # Standalone Express server entry point
│   ├── .env.example           # Environment template
│   └── package.json
├── render.yaml                # Render Infrastructure-as-Code blueprint
├── vercel.json                # Vercel routing and native cron configuration
└── package.json               # Monorepo root scripts
```

---

## 💻 How to Download and Run Locally

### 1. Prerequisites
* **Node.js** (v18.0.0 or higher) & **npm**
* **Git** installed on your machine
* An official API Key from the [Clash of Clans Developer Portal](https://developer.clashofclans.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/SamkitJain1812/ClashStats.git
cd ClashStats
```

### 3. Install All Dependencies
Install the root and subproject dependencies in one step:
```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 4. Create and Configure `server/.env`
Create a `.env` file inside the `server/` folder:
```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your API token and preferred defaults:
```env
PORT=5000
COC_API_TOKEN=your_clash_of_clans_jwt_token_here
DEFAULT_PLAYER_TAG=#Your_player_tag
DEFAULT_CLAN_TAG=#Your_Clan_tag
```

> [!NOTE]
> **Whitelisting Your Local IP:** When creating a key on [developer.clashofclans.com](https://developer.clashofclans.com/), Supercell requires your public IPv4 address. Find your public IP by visiting [ifconfig.me](https://ifconfig.me) or running `curl ifconfig.me`, and add it to your key's **Allowed IP Addresses**.

### 5. Start the Development Servers

#### Option A: Run Both Concurrently (Recommended)
From the root directory, run:
```bash
npm run dev
```
* **Frontend:** `http://localhost:3000` (or the port indicated by Vite)
* **Backend:** `http://localhost:5000`

#### Option B: Run in Separate Terminals
* **Terminal 1 (Backend):**
  ```bash
  npm run dev:server
  ```
* **Terminal 2 (Frontend):**
  ```bash
  npm run dev:client
  ```

---

## 🚀 How to Deploy

### Step 1: Deploy Backend to Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Select your GitHub repository (`ClashStats`).
4. Set the following build settings:
   * **Name:** `clashstats-backend`
   * **Root Directory:** `server`
   * **Environment:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
5. In **Environment Variables**, add:
   * `PORT`: `10000`
   * `COC_API_TOKEN`: *(Your CoC Developer API Token)*
   * `DEFAULT_PLAYER_TAG`: `#Your_player_tag`
   * `DEFAULT_CLAN_TAG`: `#Your_Clan_tag`
6. Click **Deploy Web Service**.
7. Note your live backend URL (e.g. `https://clashstats-a97q.onrender.com`).

#### Whitelisting Render's IP on Supercell Developer Portal
Render web services make outbound requests from specific IP ranges:
1. In your Render service, go to **Settings** or **Connect** and find your **Outbound IPv4 Addresses**.
2. Open the [Supercell Developer Portal](https://developer.clashofclans.com/), edit your API key, and add each of Render's outbound IP addresses.

---

### Step 2: Deploy Frontend to Vercel

1. Log in to [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
2. Import your `ClashStats` repository.
3. Configure the project:
   * **Framework Preset:** `Vite`
   * **Root Directory:** `./` (Leave as root so Vercel uses `vercel.json`)
4. In **Environment Variables**, add:
   * `VITE_API_URL`: `https://clashstats-a97q.onrender.com/api/v1`
   * `RENDER_BACKEND_URL`: `https://clashstats-a97q.onrender.com`
5. Click **Deploy**. Your app will be live at `https://clash-stats-navy.vercel.app/`!

---

## 🔒 Security & Token Privacy FAQ

### *Are my tokens or API keys visible to the public on GitHub?*
**No, they are completely private.**
* **Local `.env` files:** The `.gitignore` file strictly excludes all `.env`, `.env.*`, and `server/.env` files. They will never be tracked or pushed to GitHub.
* **GitHub Secrets / Tokens:** Any token added under your GitHub repository (`Settings -> Secrets and variables -> Actions`) is encrypted by GitHub. It is never displayed to visitors, repository viewers, or printed in logs.
* **Production Platforms:** Tokens placed in the Render and Vercel Environment Variables dashboards are encrypted at rest and never exposed to client browsers.

---

## ⏰ Automated Monthly Keepalive (No Emails)

Free-tier web services on platforms like Render and Vercel can sleep or be suspended if dormant for long periods. ClashStat includes two built-in, silent keepalive mechanisms that run once a month without sending any emails:

1. **Vercel Native Cron (`vercel.json`):**
   * Configured on schedule `0 0 1 * *` (midnight UTC on the 1st of every month).
   * Automatically invokes `/api/ping`, which keeps Vercel alive and sends a wake-up ping to the Render backend URL.
   * Vercel Crons send **zero emails**.
2. **GitHub Actions Workflow (`.github/workflows/monthly-ping.yml`):**
   * Runs on the 1st of every month at 00:00 UTC using GitHub Actions.
   * Uses `curl` to ping both the frontend and backend health endpoints.
   * Built with safe execution fallbacks (`|| true`), guaranteeing exit code 0 so GitHub **never triggers any failure or notification emails**.
3. **Frontend Startup Ping:**
   * Every time a user opens the frontend, `pingHealth()` executes quietly in the background to warm up the backend server immediately.
