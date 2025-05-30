#!/usr/bin/env node

/**
 * BiteBase Express.js API Server
 * Alternative to Strapi for production deployment
 */

const express = require('express');
const { Client } = require('pg');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 1337;

// AI Agent service URLs
const AGENT_FASTAPI_URL = process.env.AGENT_FASTAPI_URL || 'http://localhost:8001';
const AGENT_GATEWAY_URL = process.env.AGENT_GATEWAY_URL || 'http://localhost:5000';

// Database configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Simple CORS middleware
app.use((req, res, next) => {
  const origin = process.env.CORS_ORIGIN || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
let db;

async function connectDatabase() {
  try {
    console.log('🔌 Connecting to database...');
    db = new Client(dbConfig);
    await db.connect();
    console.log('✅ Connected to PostgreSQL database');

    // Create tables if they don't exist
    await initializeTables();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

async function initializeTables() {
  try {
    // Create restaurants table
    await db.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cuisine VARCHAR(100) NOT NULL,
        address VARCHAR(500) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 5),
        price_range VARCHAR(20) CHECK (price_range IN ('budget', 'moderate', 'upscale', 'luxury')),
        phone_number VARCHAR(50),
        website VARCHAR(255),
        opening_hours JSONB,
        capacity INTEGER,
        year_established INTEGER,
        features JSONB,
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create market_analyses table
    await db.query(`
      CREATE TABLE IF NOT EXISTS market_analyses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        target_location VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        radius DECIMAL(5, 2) DEFAULT 5,
        analysis_type VARCHAR(50) CHECK (analysis_type IN ('market-opportunity', 'competition', 'demographics', 'comprehensive')) NOT NULL,
        target_cuisine VARCHAR(100),
        results JSONB,
        opportunity_score DECIMAL(3, 1) CHECK (opportunity_score >= 0 AND opportunity_score <= 10),
        competition_level VARCHAR(20) CHECK (competition_level IN ('low', 'medium', 'high')),
        estimated_revenue BIGINT,
        recommendations JSONB,
        status VARCHAR(20) CHECK (status IN ('pending', 'in-progress', 'completed', 'failed')) DEFAULT 'pending',
        completed_at TIMESTAMP,
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create users table for basic user management
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        display_name VARCHAR(255),
        account_type VARCHAR(50) DEFAULT 'restaurant',
        company_name VARCHAR(255),
        subscription_plan VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Error initializing tables:', error);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: db ? 'connected' : 'disconnected'
  });
});

// API Routes

// Get all restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const { latitude, longitude, radius = 5, cuisine } = req.query;

    let query = 'SELECT * FROM restaurants WHERE 1=1';
    const params = [];

    if (latitude && longitude && radius) {
      // Simple distance calculation (for more accuracy, use PostGIS functions)
      query += ` AND (
        6371 * acos(
          cos(radians($${params.length + 1})) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians($${params.length + 2})) +
          sin(radians($${params.length + 1})) *
          sin(radians(latitude))
        )
      ) <= $${params.length + 3}`;
      params.push(parseFloat(latitude), parseFloat(longitude), parseFloat(radius));
    }

    if (cuisine) {
      query += ` AND LOWER(cuisine) = LOWER($${params.length + 1})`;
      params.push(cuisine);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create restaurant
app.post('/api/restaurants', async (req, res) => {
  try {
    const {
      name, description, cuisine, address, latitude, longitude,
      rating, priceRange, phoneNumber, website, openingHours,
      capacity, yearEstablished, features
    } = req.body;

    const result = await db.query(`
      INSERT INTO restaurants (
        name, description, cuisine, address, latitude, longitude,
        rating, price_range, phone_number, website, opening_hours,
        capacity, year_established, features
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      name, description, cuisine, address, latitude, longitude,
      rating, priceRange, phoneNumber, website, openingHours,
      capacity, yearEstablished, features
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all market analyses
app.get('/api/market-analyses', async (req, res) => {
  try {
    const { status, analysisType, createdBy } = req.query;

    let query = 'SELECT * FROM market_analyses WHERE 1=1';
    const params = [];

    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    if (analysisType) {
      query += ` AND analysis_type = $${params.length + 1}`;
      params.push(analysisType);
    }

    if (createdBy) {
      query += ` AND created_by = $${params.length + 1}`;
      params.push(createdBy);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching market analyses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create market analysis
app.post('/api/market-analyses', async (req, res) => {
  try {
    const {
      title, description, targetLocation, latitude, longitude, radius,
      analysisType, targetCuisine, results, opportunityScore,
      competitionLevel, estimatedRevenue, recommendations, createdBy
    } = req.body;

    const result = await db.query(`
      INSERT INTO market_analyses (
        title, description, target_location, latitude, longitude, radius,
        analysis_type, target_cuisine, results, opportunity_score,
        competition_level, estimated_revenue, recommendations, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      title, description, targetLocation, latitude, longitude, radius,
      analysisType, targetCuisine, results, opportunityScore,
      competitionLevel, estimatedRevenue, recommendations, createdBy
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating market analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User management endpoints
app.post('/api/users', async (req, res) => {
  try {
    const { uid, email, displayName, accountType, companyName, subscriptionPlan } = req.body;

    const result = await db.query(`
      INSERT INTO users (uid, email, display_name, account_type, company_name, subscription_plan)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (uid) DO UPDATE SET
        email = EXCLUDED.email,
        display_name = EXCLUDED.display_name,
        account_type = EXCLUDED.account_type,
        company_name = EXCLUDED.company_name,
        subscription_plan = EXCLUDED.subscription_plan,
        updated_at = NOW()
      RETURNING *
    `, [uid, email, displayName, accountType, companyName, subscriptionPlan]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error managing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await db.query('SELECT * FROM users WHERE uid = $1', [uid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Agent Integration Endpoints

// Restaurant research endpoint (FastAPI)
app.post('/api/ai/research', async (req, res) => {
  try {
    console.log(`${new Date().toISOString()} - AI Research request:`, req.body);

    const response = await axios.post(`${AGENT_FASTAPI_URL}/research`, req.body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000 // 30 second timeout
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
app.get('/api/ai/restaurants', async (req, res) => {
  try {
    const { latitude, longitude, radius, platforms } = req.query;

    if (!latitude || !longitude || !radius) {
      return res.status(400).json({ error: 'Missing required parameters: latitude, longitude, radius' });
    }

    console.log(`${new Date().toISOString()} - AI Restaurant data request:`, req.query);

    const response = await axios.get(`${AGENT_GATEWAY_URL}/api/restaurants`, {
      params: { latitude, longitude, radius, platforms },
      timeout: 30000
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
app.get('/api/ai/analyze', async (req, res) => {
  try {
    const { latitude, longitude, radius, platforms, analysis_type } = req.query;

    if (!latitude || !longitude || !radius) {
      return res.status(400).json({ error: 'Missing required parameters: latitude, longitude, radius' });
    }

    console.log(`${new Date().toISOString()} - AI Analysis request:`, req.query);

    const response = await axios.get(`${AGENT_GATEWAY_URL}/api/analyze`, {
      params: { latitude, longitude, radius, platforms, analysis_type },
      timeout: 45000 // Longer timeout for analysis
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
app.get('/api/ai/geocode', async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Missing required parameter: address' });
    }

    console.log(`${new Date().toISOString()} - AI Geocoding request:`, req.query);

    const response = await axios.get(`${AGENT_GATEWAY_URL}/api/geocode`, {
      params: { address },
      timeout: 15000
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

// AI service health check
app.get('/api/ai/health', async (req, res) => {
  try {
    const [fastApiHealth, gatewayHealth] = await Promise.allSettled([
      axios.get(`${AGENT_FASTAPI_URL}/health`, { timeout: 5000 }),
      axios.get(`${AGENT_GATEWAY_URL}/api/geocode?address=test`, { timeout: 5000 })
    ]);

    res.json({
      fastapi: {
        status: fastApiHealth.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        url: AGENT_FASTAPI_URL,
        error: fastApiHealth.status === 'rejected' ? fastApiHealth.reason.message : null
      },
      gateway: {
        status: gatewayHealth.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        url: AGENT_GATEWAY_URL,
        error: gatewayHealth.status === 'rejected' ? gatewayHealth.reason.message : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed', details: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
async function startServer() {
  console.log('🚀 Starting BiteBase API Server...');
  await connectDatabase();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BiteBase API Server running on http://0.0.0.0:${PORT}`);
    console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`🍽️  Restaurants API: http://0.0.0.0:${PORT}/api/restaurants`);
    console.log(`📈 Market Analysis API: http://0.0.0.0:${PORT}/api/market-analyses`);
  });
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully');
  if (db) {
    await db.end();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully');
  if (db) {
    await db.end();
  }
  process.exit(0);
});

startServer().catch(console.error);
