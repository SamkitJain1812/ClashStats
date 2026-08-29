const path = require('path');
// Load environment variables from server/.env
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');

const { DEFAULT_PORT } = require('./config/constants');
const healthRoutes = require('./routes/healthRoutes');
const playerRoutes = require('./routes/playerRoutes');
const clanRoutes = require('./routes/clanRoutes');
const cwlRoutes = require('./routes/cwlRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || DEFAULT_PORT;

// Enable CORS for frontend clients
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// API Route Mounts
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/player', playerRoutes);
app.use('/api/v1/clan', clanRoutes);
app.use('/api/v1/cwl', cwlRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'ClashStat Backend Proxy API',
    version: '1.0.0',
    status: 'online',
    documentation: '/api/v1/health'
  });
});

// Central Error Handler Middleware
app.use(errorHandler);

// Start HTTP Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` ClashStat Backend Proxy running on port ${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(` CoC Token Configured: ${Boolean(process.env.COC_API_TOKEN && process.env.COC_API_TOKEN !== 'your_clash_of_clans_jwt_token_here')}`);
  console.log(`=================================================`);
});
