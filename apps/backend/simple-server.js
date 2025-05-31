#!/usr/bin/env node

/**
 * BiteBase Simple Backend Server
 * SQLite-based backend for development
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const BiteBaseAIAssistant = require('./ai-assistant');

const app = express();
const PORT = process.env.PORT || 8080;

// Database setup
const dbPath = path.join(__dirname, 'bitebase.db');
const db = new sqlite3.Database(dbPath);

// Initialize AI Assistant
const aiAssistant = new BiteBaseAIAssistant(dbPath);

// Middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize database tables
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create restaurants table
      db.run(`
        CREATE TABLE IF NOT EXISTS restaurants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          cuisine TEXT NOT NULL,
          address TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          rating REAL DEFAULT 0,
          price_range TEXT DEFAULT 'moderate',
          phone_number TEXT,
          website TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create market_analyses table
      db.run(`
        CREATE TABLE IF NOT EXISTS market_analyses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          location TEXT NOT NULL,
          analysis_type TEXT NOT NULL,
          results TEXT,
          opportunity_score REAL DEFAULT 0,
          status TEXT DEFAULT 'completed',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uid TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          display_name TEXT,
          account_type TEXT DEFAULT 'restaurant',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ Database tables initialized');
          resolve();
        }
      });
    });
  });
}

// Insert sample data
function insertSampleData() {
  return new Promise((resolve) => {
    // Sample restaurants in Bangkok area
    const sampleRestaurants = [
      {
        name: "Nonna's Kitchen",
        cuisine: "Italian",
        address: "123 Sukhumvit Soi 11, Bangkok",
        latitude: 13.7563,
        longitude: 100.5418,
        rating: 4.3,
        price_range: "moderate",
        phone_number: "+66-2-123-4567"
      },
      {
        name: "Ciao Bella",
        cuisine: "Italian", 
        address: "456 Sukhumvit Soi 15, Bangkok",
        latitude: 13.7573,
        longitude: 100.5428,
        rating: 4.5,
        price_range: "upscale",
        phone_number: "+66-2-234-5678"
      },
      {
        name: "Mediterranean Delights",
        cuisine: "Mediterranean",
        address: "789 Sukhumvit Soi 8, Bangkok", 
        latitude: 13.7553,
        longitude: 100.5408,
        rating: 4.1,
        price_range: "moderate",
        phone_number: "+66-2-345-6789"
      },
      {
        name: "Pasta Paradise",
        cuisine: "Italian",
        address: "321 Sukhumvit Soi 13, Bangkok",
        latitude: 13.7568,
        longitude: 100.5423,
        rating: 4.4,
        price_range: "moderate", 
        phone_number: "+66-2-456-7890"
      },
      {
        name: "Bella Vista Bistro",
        cuisine: "Mediterranean",
        address: "555 Sukhumvit Soi 12, Bangkok",
        latitude: 13.7560,
        longitude: 100.5415,
        rating: 4.6,
        price_range: "upscale",
        phone_number: "+66-2-567-8901"
      }
    ];

    // Check if data already exists
    db.get("SELECT COUNT(*) as count FROM restaurants", (err, row) => {
      if (err || row.count > 0) {
        console.log('✅ Sample data already exists or error occurred');
        resolve();
        return;
      }

      // Insert sample restaurants
      const stmt = db.prepare(`
        INSERT INTO restaurants (name, cuisine, address, latitude, longitude, rating, price_range, phone_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      sampleRestaurants.forEach(restaurant => {
        stmt.run([
          restaurant.name,
          restaurant.cuisine,
          restaurant.address,
          restaurant.latitude,
          restaurant.longitude,
          restaurant.rating,
          restaurant.price_range,
          restaurant.phone_number
        ]);
      });

      stmt.finalize(() => {
        console.log('✅ Sample restaurant data inserted');
        resolve();
      });
    });
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'bitebase-simple-backend',
    version: '1.0.0'
  });
});

// Get restaurants endpoint
app.get('/api/restaurants', (req, res) => {
  const { latitude, longitude, radius } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required parameters: latitude, longitude' });
  }

  // Simple query - in production you'd use proper geospatial calculations
  const query = `
    SELECT * FROM restaurants 
    WHERE latitude BETWEEN ? AND ? 
    AND longitude BETWEEN ? AND ?
    ORDER BY created_at DESC
    LIMIT 50
  `;

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const rad = parseFloat(radius || 5) * 0.01; // Simple radius calculation

  db.all(query, [lat - rad, lat + rad, lng - rad, lng + rad], (err, rows) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    res.json({
      restaurants: rows,
      count: rows.length,
      query: { latitude: lat, longitude: lng, radius: parseFloat(radius || 5) }
    });
  });
});

// Create restaurant endpoint
app.post('/api/restaurants', (req, res) => {
  const { name, cuisine, address, latitude, longitude, rating, priceRange, phoneNumber } = req.body;

  if (!name || !cuisine || !address || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO restaurants (name, cuisine, address, latitude, longitude, rating, price_range, phone_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, cuisine, address, latitude, longitude, rating || 0, priceRange || 'moderate', phoneNumber], function(err) {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ error: 'Database insert failed' });
    }

    res.status(201).json({
      id: this.lastID,
      message: 'Restaurant created successfully'
    });
  });
});

// Get market analyses endpoint
app.get('/api/market-analyses', (req, res) => {
  const query = 'SELECT * FROM market_analyses ORDER BY created_at DESC LIMIT 20';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    res.json({
      analyses: rows,
      count: rows.length
    });
  });
});

// Create market analysis endpoint
app.post('/api/market-analyses', (req, res) => {
  const { location, analysisType, results, opportunityScore } = req.body;

  if (!location || !analysisType) {
    return res.status(400).json({ error: 'Missing required fields: location, analysisType' });
  }

  const query = `
    INSERT INTO market_analyses (location, analysis_type, results, opportunity_score, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [location, analysisType, JSON.stringify(results || {}), opportunityScore || 0, 'completed'], function(err) {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ error: 'Database insert failed' });
    }

    res.status(201).json({
      id: this.lastID,
      message: 'Market analysis created successfully'
    });
  });
});

// User management endpoints
app.post('/api/users', (req, res) => {
  const { uid, email, displayName, accountType } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ error: 'Missing required fields: uid, email' });
  }

  const query = `
    INSERT OR REPLACE INTO users (uid, email, display_name, account_type)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [uid, email, displayName || '', accountType || 'restaurant'], function(err) {
    if (err) {
      console.error('Database operation error:', err);
      return res.status(500).json({ error: 'Database operation failed' });
    }

    res.json({ message: 'User created/updated successfully' });
  });
});

app.get('/api/users/:uid', (req, res) => {
  const { uid } = req.params;
  const query = 'SELECT * FROM users WHERE uid = ?';

  db.get(query, [uid], (err, row) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(row);
  });
});

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId = 'default-user', userContext = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`AI Chat Request - User: ${userId}, Message: ${message}`);
    
    // Process message with AI Assistant
    const response = await aiAssistant.processMessage(userId, message, userContext);
    
    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ 
      error: 'Failed to process AI request',
      details: error.message 
    });
  }
});

// Get user chat history
app.get('/api/chat/history/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;
    
    const history = aiAssistant.getUserHistory(userId, parseInt(limit));
    
    res.json({
      success: true,
      history: history,
      count: history.length
    });
    
  } catch (error) {
    console.error('Chat History Error:', error);
    res.status(500).json({ 
      error: 'Failed to get chat history',
      details: error.message 
    });
  }
});

// Clear user chat session
app.delete('/api/chat/session/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    aiAssistant.clearUserSession(userId);
    
    res.json({
      success: true,
      message: 'Chat session cleared'
    });
    
  } catch (error) {
    console.error('Clear Session Error:', error);
    res.status(500).json({ 
      error: 'Failed to clear chat session',
      details: error.message 
    });
  }
});

// Legacy research endpoint for backward compatibility
app.post('/research', (req, res) => {
  // Mock AI research response
  res.json({
    status: 'completed',
    data: {
      demographics: {
        population: 125000,
        averageIncome: 45000,
        ageGroups: {
          '18-25': 22,
          '26-35': 28,
          '36-45': 25,
          '46-55': 15,
          '55+': 10
        }
      },
      marketInsights: [
        'High density of young professionals in the area',
        'Growing food delivery market',
        'Strong preference for international cuisine'
      ]
    }
  });
});

app.get('/api/restaurants', (req, res) => {
  // This will be handled by our main restaurants endpoint above
  res.redirect(307, '/api/restaurants');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
  try {
    console.log('🚀 Starting BiteBase Simple Backend...');
    
    await initializeDatabase();
    await insertSampleData();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 BiteBase Simple Backend running on http://0.0.0.0:${PORT}`);
      console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
      console.log(`🍽️  Restaurants API: http://0.0.0.0:${PORT}/api/restaurants`);
      console.log(`📈 Market Analysis API: http://0.0.0.0:${PORT}/api/market-analyses`);
      console.log('✅ Backend ready to serve requests!');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  db.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  db.close();
  process.exit(0);
});

startServer().catch(console.error);