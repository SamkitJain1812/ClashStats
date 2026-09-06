// Vercel Serverless Function Entry Point
// Wraps the existing Express server as a single serverless function
const path = require('path');

// Ensure server/node_modules is resolved seamlessly when running on Vercel
module.paths.push(path.join(__dirname, '..', 'server', 'node_modules'));

// Load environment variables (Vercel injects them automatically,
// but dotenv is a fallback for local `vercel dev` usage)
try {
  require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });
} catch (e) {
  // dotenv may not be installed in production — that's fine,
  // Vercel injects env vars from the dashboard
}

const express = require('express');
const cors = require('cors');

const healthRoutes = require('../server/routes/healthRoutes');
const playerRoutes = require('../server/routes/playerRoutes');
const clanRoutes = require('../server/routes/clanRoutes');
const cwlRoutes = require('../server/routes/cwlRoutes');
const errorHandler = require('../server/middleware/errorHandler');

const app = express();

// Enable CORS for frontend clients
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// API Route Mounts (same paths as server/index.js)
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/player', playerRoutes);
app.use('/api/v1/clan', clanRoutes);
app.use('/api/v1/cwl', cwlRoutes);

// Root API route
app.get('/api', (req, res) => {
  res.json({
    name: 'ClashStat Backend Proxy API',
    version: '1.0.0',
    status: 'online',
    runtime: 'Vercel Serverless',
    documentation: '/api/v1/health'
  });
});

// Vercel Cron & Keepalive Ping route
app.get('/api/ping', async (req, res) => {
  const renderBackendUrl = process.env.RENDER_BACKEND_URL;
  let renderWakeResult = null;

  if (renderBackendUrl && !req.query.skip_forward) {
    try {
      const target = renderBackendUrl.replace(/\/$/, '') + '/api/v1/health/ping?skip_forward=true';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(target, { signal: controller.signal });
      clearTimeout(timeoutId);
      renderWakeResult = `Render pinged: status ${response.status}`;
    } catch (err) {
      renderWakeResult = `Render ping attempted: ${err.message}`;
    }
  }

  res.json({
    status: 'ok',
    message: 'Monthly keepalive ping successful',
    timestamp: new Date().toISOString(),
    runtime: 'Vercel Serverless Cron',
    renderWakeResult
  });
});

// Central Error Handler Middleware
app.use(errorHandler);

// Export the Express app — Vercel wraps it as a serverless function
module.exports = app;
