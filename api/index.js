// Vercel Serverless Function Entry Point
// Wraps the existing Express server as a single serverless function
const path = require('path');

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

// Central Error Handler Middleware
app.use(errorHandler);

// Export the Express app — Vercel wraps it as a serverless function
module.exports = app;
