# ClashStat — Clash of Clans Telemetry Dashboard

[![Supercell Store Theme](https://img.shields.io/badge/Theme-Supercell%20Store-0b1017?style=for-the-badge&logo=supercell&logoColor=ffc72c)](https://store.supercell.com)
[![Node.js Express Proxy](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-417e38?style=for-the-badge&logo=express)](https://expressjs.com)
[![React Vite](https://img.shields.io/badge/Frontend-React%2019%20%2F%20Vite-61dafb?style=for-the-badge&logo=react)](https://vite.dev)

**ClashStat** is a full-stack, Clash of Clans telemetry dashboard application modeled after Supercell's official store branding ([store.supercell.com](https://store.supercell.com)). It connects directly to the official Clash of Clans REST API through a secure, rate-limited Node.js proxy.

---

## 🌟 Key Features

1. **Supercell Store Visual Identity:** Dark slate backgrounds (`#0b1017`), CoC blue UI chrome (`#1d5da9`), beveled metallic gold trim (`#ffc72c`), Town Hall level badges, and heavy gaming typography.
2. **Tag Lookup & Presets:** Search bar accepting any Player Tag (`#Y8YLP9RR2`) or Clan Tag (`#2GP20YPVP`) with live tag normalization (`#` encoded as `%23`).
3. **Player Profile Telemetry:** Town Hall badge (with weapon level), trophies, attack/defense wins, war stars, donation ratio indicator & health progress bar, hero/troop arsenal level pills, and achievements progress summary.
4. **Clan Roster & Leaderboard:** Sortable member roster table by Trophies, Donations Given, Donations Received, Town Hall Level, or Role. Click any member to view their player profile.
5. **Live Clan Wars & War Log:** Real-time war scorecard (Stars, Destruction %, Attacks Remaining), member attack tracker table, and historical war log analytics.
6. **Clan War League (CWL):** 8-Clan Group standings table, 7-round battle log tabs, and member medal calculator. Includes an **Interactive Preview Mode** for periods when CWL is inactive.
7. **Auto-Sync & Manual Refresh:** Live 60s auto-refresh timer with a manual refresh button.
8. **Actionable 403 IP Whitelist Helper:** Error screen detecting IP whitelist issues and guiding users on how to whitelist their machine's IP in the Supercell Developer Portal.

---

## 🛠️ Environment Variables

### Backend (`server/.env`)
| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `PORT` | No | Express server listener port (default: 5000) | `5000` |
| `COC_API_TOKEN` | **Yes** | Bearer JWT token from [CoC Developer Portal](https://developer.clashofclans.com) | `eyJhbGci...` |
| `DEFAULT_PLAYER_TAG` | No | Initial player tag loaded on startup | `#Y8YLP9RR2` |
| `DEFAULT_CLAN_TAG` | No | Initial clan tag loaded on startup | `#2GP20YPVP` |

### Frontend (`client/.env` or Vercel Environment Variables)
| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | Production | Full base URL of deployed backend proxy (leave empty for local Vite dev) | `https://clashstat-api.onrender.com/api/v1` |

---

## 🚀 Local Setup Instructions

### 1. Register API Key in Supercell Developer Portal
1. Obtain your public IP by visiting [ifconfig.me](https://ifconfig.me) or running `curl ifconfig.me`.
2. Log in to [developer.clashofclans.com](https://developer.clashofclans.com/).
3. Create a new API Key and add your public IP address to the **Allowed IP Addresses** whitelist.
4. Copy your key token.

### 2. Configure Local Environment
Create `server/.env`:
```env
PORT=5000
COC_API_TOKEN=your_jwt_key_here
DEFAULT_PLAYER_TAG=#Y8YLP9RR2
DEFAULT_CLAN_TAG=#2GP20YPVP
```

### 3. Run Backend Proxy Server
From root directory:
```powershell
npm run dev:server
```
*(Server listens on `http://localhost:5000`)*

### 4. Run React Frontend Client
In a second terminal:
```powershell
npm run dev:client
```
*(Open `http://localhost:3000` in your browser)*

---

## 🌐 Production Deployment Guide

### Phase 1: Deploy Backend to Render (Node Web Service)
1. Push your repository to GitHub / GitLab.
2. Log in to [Render.com](https://render.com) and click **New +** -> **Web Service**.
3. Connect your repository and configure:
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. In **Environment Variables**, add:
   - `COC_API_TOKEN` = *(Your CoC Developer API Token)*
   - `DEFAULT_PLAYER_TAG` = `#Y8YLP9RR2`
   - `DEFAULT_CLAN_TAG` = `#2GP20YPVP`
5. Click **Deploy Web Service** and note your backend URL (e.g. `https://clashstat-api.onrender.com`).

---

### Phase 2: Register Render's Outbound Static IP with Supercell
To prevent `403 Forbidden` errors in production, register Render's outbound IP addresses in your Supercell key whitelist:

1. In your Render Dashboard, select your `clashstat-backend` web service.
2. Look at the **Connect** or **Settings** panel for your web service's **Outbound IPv4 Addresses** (e.g. `216.24.57.1`, `52.203.24.120`, etc.).
3. Return to the [Supercell Developer Portal](https://developer.clashofclans.com/).
4. Edit your API Key and add each of Render's outbound IP addresses to the **Allowed IP Addresses** list.
5. Save the key.

---

### Phase 3: Deploy Frontend to Vercel
1. Log in to [Vercel.com](https://vercel.com) and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. Set **Root Directory** to `client`.
4. In **Environment Variables**, add:
   - `VITE_API_URL` = `https://clashstat-api.onrender.com/api/v1`
5. Click **Deploy**. Vercel will build your Vite React app and publish your live dashboard at `https://clashstat.vercel.app`!
