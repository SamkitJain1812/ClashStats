# ARCHITECTURE.md — ClashStat Backend Architecture & API Design

## 1. Executive Summary & Security Architecture
The ClashStat backend is a Node.js + Express application that serves as a secure API Proxy and Caching layer between the React frontend and the official Clash of Clans REST API (`https://api.clashofclans.com/v1`).

### Security Requirements
- **Server-Side Token Storage:** The Clash of Clans API Key (`COC_API_TOKEN`) is stored strictly in the backend `.env` file and is **never** sent to the client browser.
- **Tag Normalization:** All Clash of Clans tags (e.g. `#2PP0LP0C`) are automatically URL-encoded (`%232PP0LP0C`) by the Express server before sending upstream HTTP requests.
- **CORS Protection:** Cross-Origin Resource Sharing is configured to only allow requests from the authorized frontend origin.

---

## 2. IP Whitelisting & Deployment Tradeoff Matrix
The Clash of Clans Developer Portal requires all API keys to be bound to specific whitelisted outbound IP addresses.

### Local Development Strategy (Current Phase)
During development, your machine's current public IP address (obtainable via `curl ifconfig.me`) is registered in your [Clash of Clans Developer Portal](https://developer.clashofclans.com/) key settings.

### Production Hosting Options & Tradeoffs

| Host Type | Examples | IP Whitelist Handling | Tradeoffs & Recommendation |
| :--- | :--- | :--- | :--- |
| **Static Egress EKS / VPS / PaaS** *(Recommended)* | Render, Railway, DigitalOcean, Fly.io | Provides static/known IP addresses that can be directly whitelisted in the CoC portal once. | **Best Option:** Simple setup, zero proxy overhead, cheap or free tiers available, native Express support. |
| **Serverless Functions** | Vercel Functions, Netlify, AWS Lambda | Dynamic IPs change on every invocation, causing direct CoC API calls to fail with 403 Forbidden. | **Requires Proxy:** Needs an HTTP proxy extension (e.g., Fixie/QuotaGuard Static) or a $5/mo micro-proxy (Nginx/Express on static VPS) to route CoC API calls through a fixed IP. |

---

## 3. Caching & Rate Limit Mitigation
The Clash of Clans API enforces strict rate limits per API key and updates specific endpoints at varying frequencies.

### Caching Strategy (`node-cache` / In-Memory TTL)
To prevent hitting CoC API rate limits and to reduce latency for client requests:
- **In-Memory Cache Key:** Hashed endpoint path + normalized tag (e.g. `player_%232PP0LP0C`).
- **Endpoint Specific TTLs:**
  - `Player Profile` & `Clan Info`: **60 seconds**
  - `Clan Members & Leaderboard`: **60 seconds**
  - `Current War Status`: **30 seconds** (Real-time updates during war battles)
  - `War Log`: **180 seconds** (Historical data changes slowly)
  - `CWL Group & Round Data`: **300 seconds (5 minutes)**
- **Error Fallback:** If upstream CoC API returns 503 (Maintenance) or 429 (Rate Limit Exceeded), the proxy returns stale cached data with a `X-Cache-Stale: true` header if available.

---

## 4. Backend Express Routes Specification

Base URL: `/api/v1`

### 4.1 System & Health
- **`GET /api/v1/health`**
  - **Description:** Server status check and CoC API token validation indicator.
  - **Response:** `{ status: "ok", cachedItems: 12, cocApiStatus: "connected" }`

### 4.2 Player Endpoints
- **`GET /api/v1/player/:tag`**
  - **Description:** Fetches comprehensive player profile, trophies, town hall level, attack/defense stats, war stars, and full hero/troop arsenal levels.
  - **Upstream CoC Call:** `GET /v1/players/{encodedTag}`
  - **TTL:** 60s

### 4.3 Clan Endpoints
- **`GET /api/v1/clan/:tag`**
  - **Description:** Fetches clan summary, badge URLs, clan level, total points, war win streak, and location.
  - **Upstream CoC Call:** `GET /v1/clans/{encodedTag}`
  - **TTL:** 60s

- **`GET /api/v1/clan/:tag/members`**
  - **Description:** Fetches clan member roster sortable by trophies, role, Town Hall level, donations given, and donations received.
  - **Upstream CoC Call:** `GET /v1/clans/{encodedTag}/members`
  - **TTL:** 60s

### 4.4 War Stats & War Log Endpoints
- **`GET /api/v1/clan/:tag/currentwar`**
  - **Description:** Fetches current clan war status (state: `inWar`, `preparation`, `warEnded`, opponent clan, stars, destruction %, attacks remaining).
  - **Upstream CoC Call:** `GET /v1/clans/{encodedTag}/currentwar`
  - **TTL:** 30s

- **`GET /api/v1/clan/:tag/warlog`**
  - **Description:** Fetches clan historical war log entries (result: `win`/`lose`/`tie`, stars scored, destruction %, opponent details).
  - **Upstream CoC Call:** `GET /v1/clans/{encodedTag}/warlog`
  - **TTL:** 180s

### 4.5 CWL (Clan War League) Endpoints
- **`GET /api/v1/clan/:tag/cwl/group`**
  - **Description:** Fetches current Clan War League group standings, league season tier, participating clans, and round war tags.
  - **Upstream CoC Call:** `GET /v1/clans/{encodedTag}/currentwar/leaguegroup`
  - **TTL:** 300s

- **`GET /api/v1/cwl/war/:warTag`**
  - **Description:** Fetches detailed war battle data for a specific CWL round war tag.
  - **Upstream CoC Call:** `GET /v1/clanwarleagues/wars/{encodedWarTag}`
  - **TTL:** 120s

---

## 5. Directory & File Structure

```text
ClashStats/
├── PROJECT.md
├── ARCHITECTURE.md
├── .env.example
├── .gitignore
├── package.json (root orchestration)
├── server/
│   ├── package.json
│   ├── .env
│   ├── index.js                  # Express app entrypoint & middleware listener
│   ├── config/
│   │   └── constants.js          # Default tags, TTL durations, CoC base URL
│   ├── middleware/
│   │   ├── cacheMiddleware.js    # In-memory node-cache middleware
│   │   └── errorHandler.js       # Centralized HTTP error & CoC API status handler
│   ├── services/
│   │   └── cocClient.js          # Axios instance configured with Bearer token & tag encoder
│   └── routes/
│       ├── healthRoutes.js       # Health check route
│       ├── playerRoutes.js       # /api/v1/player endpoints
│       ├── clanRoutes.js         # /api/v1/clan endpoints
│       └── cwlRoutes.js          # /api/v1/cwl endpoints
└── client/                       # React (Vite) frontend (Phase 3)
```

---

## 6. Next Actions & Execution Plan
1. Obtain approval on `ARCHITECTURE.md`.
2. Initialize `server/` directory and install Express, Axios, `node-cache`, `cors`, and `dotenv`.
3. Create `.env.example` and sample server setup to verify CoC API token connectivity.
