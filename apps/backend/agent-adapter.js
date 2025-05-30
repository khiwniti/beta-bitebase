/**
 * BiteBase Agent Adapter
 * 
 * A simple Express-based adapter for the Bitebase agent system.
 */

// Import required modules
const express = require('express');
const axios = require('axios');
const { SERVER, SERVICES, TIMEOUTS, CORS, LOGGING } = require('./agent-adapter/config');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', CORS.ORIGIN);
  res.header('Access-Control-Allow-Headers', CORS.ALLOWED_HEADERS);
  res.header('Access-Control-Allow-Methods', CORS.METHODS);
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Request logging
if (LOGGING.ENABLED) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} - Error:`, err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const [fastApiHealth, gatewayHealth] = await Promise.allSettled([
      axios.get(`${SERVICES.FASTAPI_URL}/health`, { timeout: TIMEOUTS.HEALTH }),
      axios.get(`${SERVICES.GATEWAY_URL}/api/health`, { timeout: TIMEOUTS.HEALTH })
    ]);

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      fastapi: {
        status: fastApiHealth.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        url: SERVICES.FASTAPI_URL,
        error: fastApiHealth.status === 'rejected' ? fastApiHealth.reason.message : null
      },
      gateway: {
        status: gatewayHealth.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        url: SERVICES.GATEWAY_URL,
        error: gatewayHealth.status === 'rejected' ? gatewayHealth.reason.message : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed', details: error.message });
  }
});

// Agent API Routes

// Research endpoint (FastAPI)
app.post('/api/research', async (req, res) => {
  try {
    if (LOGGING.ENABLED) {
      console.log(`${new Date().toISOString()} - AI Research request:`, req.body);
    }

    const response = await axios.post(`${SERVICES.FASTAPI_URL}/research`, req.body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: TIMEOUTS.RESEARCH
    });

    res.json(response.data);
  } catch (error) {
    console.error('AI Research error:', error.message);
    if (error.response) {
      res.status(error.response.status).json({
        error: 'AI research failed',
        details: error.response.data
      });
    } else {
      res.status(500).json({
        error: 'AI service unavailable',
        details: error.message
      });
    }
  }
});

// Restaurant data from agents (Gateway)
app.get('/api/restaurants', async (req, res) => {
  try {
    const { latitude, longitude, radius, platforms } = req.query;

    if (!latitude || !longitude || !radius) {
      return res.status(400).json({ error: 'Missing required parameters: latitude, longitude, radius' });
    }

    if (LOGGING.ENABLED) {
      console.log(`${new Date().toISOString()} - AI Restaurant data request:`, req.query);
    }

    const response = await axios.get(`${SERVICES.GATEWAY_URL}/api/restaurants`, {
      params: { latitude, longitude, radius, platforms },
      timeout: TIMEOUTS.RESTAURANTS
    });

    res.json(response.data);
  } catch (error) {
    console.error('AI Restaurant data error:', error.message);
    if (error.response) {
      res.status(error.response.status).json({
        error: 'AI restaurant data failed',
        details: error.response.data
      });
    } else {
      res.status(500).json({
        error: 'AI service unavailable',
        details: error.message
      });
    }
  }
});

// Market analysis from agents (Gateway)
app.get('/api/analyze', async (req, res) => {
  try {
    const { latitude, longitude, radius, platforms, analysis_type } = req.query;

    if (!latitude || !longitude || !radius) {
      return res.status(400).json({ error: 'Missing required parameters: latitude, longitude, radius' });
    }

    if (LOGGING.ENABLED) {
      console.log(`${new Date().toISOString()} - AI Analysis request:`, req.query);
    }

    const response = await axios.get(`${SERVICES.GATEWAY_URL}/api/analyze`, {
      params: { latitude, longitude, radius, platforms, analysis_type },
      timeout: TIMEOUTS.ANALYZE
    });

    res.json(response.data);
  } catch (error) {
    console.error('AI Analysis error:', error.message);
    if (error.response) {
      res.status(error.response.status).json({
        error: 'AI analysis failed',
        details: error.response.data
      });
    } else {
      res.status(500).json({
        error: 'AI service unavailable',
        details: error.message
      });
    }
  }
});

// Geocoding from agents (Gateway)
app.get('/api/geocode', async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Missing required parameter: address' });
    }

    if (LOGGING.ENABLED) {
      console.log(`${new Date().toISOString()} - AI Geocoding request:`, req.query);
    }

    const response = await axios.get(`${SERVICES.GATEWAY_URL}/api/geocode`, {
      params: { address },
      timeout: TIMEOUTS.GEOCODE
    });

    res.json(response.data);
  } catch (error) {
    console.error('AI Geocoding error:', error.message);
    if (error.response) {
      res.status(error.response.status).json({
        error: 'AI geocoding failed',
        details: error.response.data
      });
    } else {
      res.status(500).json({
        error: 'AI service unavailable',
        details: error.message
      });
    }
  }
});

// Start server
app.listen(SERVER.PORT, SERVER.HOST, () => {
  console.log(`🚀 BiteBase Agent Adapter running on http://${SERVER.HOST}:${SERVER.PORT}`);
  console.log(`📊 Health check: http://${SERVER.HOST}:${SERVER.PORT}/health`);
  console.log(`🤖 Research API: http://${SERVER.HOST}:${SERVER.PORT}/api/research`);
  console.log(`🍽️ Restaurants API: http://${SERVER.HOST}:${SERVER.PORT}/api/restaurants`);
  console.log(`📈 Market Analysis API: http://${SERVER.HOST}:${SERVER.PORT}/api/analyze`);
  console.log(`🗺️ Geocoding API: http://${SERVER.HOST}:${SERVER.PORT}/api/geocode`);
}); 