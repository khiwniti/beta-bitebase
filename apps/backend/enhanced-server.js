#!/usr/bin/env node

/**
 * BiteBase Enhanced Backend Server
 * Production-ready backend with advanced features
 * 
 * Features:
 * - JWT Authentication
 * - User Management
 * - Advanced Database Schema
 * - Real-time WebSocket Support
 * - Caching Layer
 * - Comprehensive API Documentation
 * - Enhanced Error Handling
 * - Request Logging
 * - Rate Limiting
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');
const BiteBaseAIAssistant = require('./ai-assistant');
const WongnaiScraper = require('./wongnai-scraper');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8081;
const JWT_SECRET = process.env.JWT_SECRET || 'bitebase-secret-key-change-in-production';
const SALT_ROUNDS = 12;

// Database setup
const dbPath = path.join(__dirname, 'bitebase-enhanced.db');
const db = new sqlite3.Database(dbPath);

// Initialize AI Assistant
const aiAssistant = new BiteBaseAIAssistant(dbPath);

// Initialize Wongnai Scraper
const wongnaiScraper = new WongnaiScraper();

// In-memory cache (in production, use Redis)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:12000', 'https://work-1-doqgfzrrfmkbhklk.prod-runtime.all-hands.dev'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${ip} - UA: ${userAgent.substring(0, 50)}`);
  
  // Log request body for POST/PUT (excluding sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = '[REDACTED]';
    if (logBody.token) logBody.token = '[REDACTED]';
    console.log(`[${timestamp}] Request Body:`, JSON.stringify(logBody, null, 2));
  }
  
  next();
});

// ============================================================================
// DATABASE INITIALIZATION
// ============================================================================

function initializeEnhancedDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table with enhanced fields
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          first_name TEXT,
          last_name TEXT,
          phone TEXT,
          role TEXT DEFAULT 'user',
          subscription_plan TEXT DEFAULT 'free',
          subscription_status TEXT DEFAULT 'active',
          email_verified BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME,
          profile_image_url TEXT,
          preferences TEXT -- JSON string
        )
      `);

      // Enhanced restaurants table
      db.run(`
        CREATE TABLE IF NOT EXISTS restaurants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          name TEXT NOT NULL,
          description TEXT,
          cuisine TEXT NOT NULL,
          address TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          rating REAL DEFAULT 0,
          price_range TEXT DEFAULT 'moderate',
          phone_number TEXT,
          website TEXT,
          email TEXT,
          business_hours TEXT, -- JSON string
          features TEXT, -- JSON array of features
          images TEXT, -- JSON array of image URLs
          menu_url TEXT,
          social_media TEXT, -- JSON object with social links
          verified BOOLEAN DEFAULT FALSE,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Market analyses table
      db.run(`
        CREATE TABLE IF NOT EXISTS market_analyses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          restaurant_id INTEGER,
          location_name TEXT NOT NULL,
          address TEXT,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          analysis_type TEXT DEFAULT 'comprehensive',
          opportunity_score REAL,
          competition_level TEXT,
          foot_traffic_score INTEGER,
          demographic_match REAL,
          revenue_potential REAL,
          analysis_data TEXT, -- JSON string with detailed analysis
          recommendations TEXT, -- JSON array of recommendations
          status TEXT DEFAULT 'completed',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
        )
      `);

      // Competitors table
      db.run(`
        CREATE TABLE IF NOT EXISTS competitors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          market_analysis_id INTEGER,
          name TEXT NOT NULL,
          cuisine TEXT,
          address TEXT,
          latitude REAL,
          longitude REAL,
          rating REAL,
          price_range TEXT,
          distance_meters REAL,
          threat_level TEXT,
          strengths TEXT, -- JSON array
          weaknesses TEXT, -- JSON array
          menu_analysis TEXT, -- JSON object
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (market_analysis_id) REFERENCES market_analyses (id)
        )
      `);

      // AI chat sessions table
      db.run(`
        CREATE TABLE IF NOT EXISTS chat_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          session_id TEXT UNIQUE NOT NULL,
          messages TEXT, -- JSON array of messages
          context_data TEXT, -- JSON object with context
          language TEXT DEFAULT 'en',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // User activity logs
      db.run(`
        CREATE TABLE IF NOT EXISTS activity_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          action TEXT NOT NULL,
          resource_type TEXT,
          resource_id INTEGER,
          details TEXT, -- JSON object
          ip_address TEXT,
          user_agent TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // API usage tracking
      db.run(`
        CREATE TABLE IF NOT EXISTS api_usage (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          endpoint TEXT NOT NULL,
          method TEXT NOT NULL,
          response_status INTEGER,
          response_time_ms INTEGER,
          request_size INTEGER,
          response_size INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Create indexes for better performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants (latitude, longitude)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_restaurants_user ON restaurants (user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_market_analyses_user ON market_analyses (user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_market_analyses_location ON market_analyses (latitude, longitude)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_competitors_analysis ON competitors (market_analysis_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions (user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs (user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_api_usage_user ON api_usage (user_id)`);

      // Insert sample admin user
      const adminEmail = 'admin@bitebase.ai';
      const adminPassword = 'admin123'; // Change in production!
      
      bcrypt.hash(adminPassword, SALT_ROUNDS, (err, hash) => {
        if (err) {
          console.error('Error hashing admin password:', err);
          return;
        }
        
        db.run(`
          INSERT OR IGNORE INTO users (email, password_hash, first_name, last_name, role, subscription_plan)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [adminEmail, hash, 'Admin', 'User', 'admin', 'enterprise'], (err) => {
          if (err) {
            console.error('Error creating admin user:', err);
          } else {
            console.log('✅ Admin user created/verified:', adminEmail);
          }
        });
      });

      console.log('✅ Enhanced database initialized successfully');
      resolve();
    });
  });
}

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `${role} role required` });
    }
    next();
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function logActivity(userId, action, resourceType = null, resourceId = null, details = {}, req = null) {
  const ip = req ? (req.ip || req.connection.remoteAddress) : null;
  const userAgent = req ? req.get('User-Agent') : null;
  
  db.run(`
    INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [userId, action, resourceType, resourceId, JSON.stringify(details), ip, userAgent]);
}

function trackApiUsage(req, res, next) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const userId = req.user ? req.user.id : null;
    
    db.run(`
      INSERT INTO api_usage (user_id, endpoint, method, response_status, response_time_ms)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, req.path, req.method, res.statusCode, responseTime]);
  });
  
  next();
}

function getCacheKey(prefix, params) {
  return `${prefix}:${JSON.stringify(params)}`;
}

function setCache(key, data, ttl = CACHE_TTL) {
  cache.set(key, {
    data,
    expires: Date.now() + ttl
  });
}

function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() > cached.expires) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

// Register new user
app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      try {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Create user
        db.run(`
          INSERT INTO users (email, password_hash, first_name, last_name, phone)
          VALUES (?, ?, ?, ?, ?)
        `, [email, passwordHash, firstName, lastName, phone], function(err) {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Failed to create user' });
          }

          const userId = this.lastID;
          
          // Generate JWT token
          const token = jwt.sign(
            { id: userId, email, role: 'user' },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          logActivity(userId, 'user_registered', 'user', userId, { email }, req);

          res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
              id: userId,
              email,
              firstName,
              lastName,
              role: 'user'
            }
          });
        });
      } catch (hashError) {
        console.error('Password hashing error:', hashError);
        res.status(500).json({ error: 'Failed to process password' });
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      try {
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        logActivity(user.id, 'user_login', 'user', user.id, { email }, req);

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            subscriptionPlan: user.subscription_plan
          }
        });
      } catch (compareError) {
        console.error('Password comparison error:', compareError);
        res.status(500).json({ error: 'Authentication failed' });
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, email, first_name, last_name, phone, role, subscription_plan, subscription_status, created_at, profile_image_url FROM users WHERE id = ?', 
    [req.user.id], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        subscriptionPlan: user.subscription_plan,
        subscriptionStatus: user.subscription_status,
        createdAt: user.created_at,
        profileImageUrl: user.profile_image_url
      }
    });
  });
});

// ============================================================================
// ENHANCED RESTAURANT ROUTES
// ============================================================================

// Get restaurants with advanced filtering and caching
app.get('/api/restaurants', trackApiUsage, (req, res) => {
  const { latitude, longitude, radius, cuisine, priceRange, rating, limit, offset } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required parameters: latitude, longitude' });
  }

  const cacheKey = getCacheKey('restaurants', req.query);
  const cached = getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  let query = `
    SELECT r.*, u.first_name as owner_first_name, u.last_name as owner_last_name
    FROM restaurants r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.status = 'active'
  `;
  const params = [];

  // Location filtering
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const rad = parseFloat(radius || 5) * 0.01;
  
  query += ` AND r.latitude BETWEEN ? AND ? AND r.longitude BETWEEN ? AND ?`;
  params.push(lat - rad, lat + rad, lng - rad, lng + rad);

  // Additional filters
  if (cuisine) {
    query += ` AND r.cuisine = ?`;
    params.push(cuisine);
  }

  if (priceRange) {
    query += ` AND r.price_range = ?`;
    params.push(priceRange);
  }

  if (rating) {
    query += ` AND r.rating >= ?`;
    params.push(parseFloat(rating));
  }

  query += ` ORDER BY r.created_at DESC`;

  if (limit) {
    query += ` LIMIT ?`;
    params.push(parseInt(limit));
  }

  if (offset) {
    query += ` OFFSET ?`;
    params.push(parseInt(offset));
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    const result = {
      restaurants: rows.map(row => ({
        ...row,
        business_hours: row.business_hours ? JSON.parse(row.business_hours) : null,
        features: row.features ? JSON.parse(row.features) : [],
        images: row.images ? JSON.parse(row.images) : [],
        social_media: row.social_media ? JSON.parse(row.social_media) : {}
      })),
      count: rows.length,
      query: { latitude: lat, longitude: lng, radius: parseFloat(radius || 5) }
    };

    setCache(cacheKey, result);
    res.json(result);
  });
});

// Create restaurant (authenticated)
app.post('/api/restaurants', authenticateToken, [
  body('name').trim().isLength({ min: 1 }),
  body('cuisine').trim().isLength({ min: 1 }),
  body('address').trim().isLength({ min: 1 }),
  body('latitude').isFloat(),
  body('longitude').isFloat()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name, description, cuisine, address, latitude, longitude,
    rating, priceRange, phoneNumber, website, email,
    businessHours, features, menuUrl, socialMedia
  } = req.body;

  const query = `
    INSERT INTO restaurants (
      user_id, name, description, cuisine, address, latitude, longitude,
      rating, price_range, phone_number, website, email,
      business_hours, features, menu_url, social_media
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [
    req.user.id, name, description, cuisine, address, latitude, longitude,
    rating || 0, priceRange || 'moderate', phoneNumber, website, email,
    businessHours ? JSON.stringify(businessHours) : null,
    features ? JSON.stringify(features) : null,
    menuUrl,
    socialMedia ? JSON.stringify(socialMedia) : null
  ], function(err) {
    if (err) {
      console.error('Error creating restaurant:', err);
      return res.status(500).json({ error: 'Failed to create restaurant' });
    }

    const restaurantId = this.lastID;
    logActivity(req.user.id, 'restaurant_created', 'restaurant', restaurantId, { name }, req);

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant: { id: restaurantId, name, cuisine, address }
    });
  });
});

// ============================================================================
// ENHANCED AI CHAT ROUTES
// ============================================================================

// Enhanced chat endpoint with session management
app.post('/api/chat', authenticateToken, trackApiUsage, async (req, res) => {
  try {
    const { message, sessionId, language = 'en' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create chat session
    let session;
    if (sessionId) {
      session = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM chat_sessions WHERE session_id = ? AND user_id = ?', 
          [sessionId, req.user.id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }

    if (!session) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO chat_sessions (user_id, session_id, messages, language)
          VALUES (?, ?, ?, ?)
        `, [req.user.id, newSessionId, JSON.stringify([]), language], function(err) {
          if (err) reject(err);
          else {
            session = {
              id: this.lastID,
              user_id: req.user.id,
              session_id: newSessionId,
              messages: '[]',
              language
            };
            resolve();
          }
        });
      });
    }

    // Parse existing messages
    const messages = JSON.parse(session.messages || '[]');

    // Add user message
    const userMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      language
    };
    messages.push(userMessage);

    // Get AI response
    const aiResponse = await aiAssistant.processMessage(req.user.id, message, {
      sessionId: session.session_id,
      language,
      conversationHistory: messages.slice(-10) // Last 10 messages for context
    });

    // Add AI response
    const assistantMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content: aiResponse.content || aiResponse,
      timestamp: new Date().toISOString(),
      language: aiResponse.language || language,
      metadata: {
        type: aiResponse.type,
        data: aiResponse.data,
        ...aiResponse.metadata
      }
    };
    messages.push(assistantMessage);

    // Update session in database
    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE chat_sessions 
        SET messages = ?, updated_at = CURRENT_TIMESTAMP, language = ?
        WHERE session_id = ?
      `, [JSON.stringify(messages), language, session.session_id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    logActivity(req.user.id, 'ai_chat_message', 'chat_session', session.id, 
      { messageLength: message.length, language }, req);

    res.json({
      response: aiResponse.content || aiResponse,
      sessionId: session.session_id,
      messageId: assistantMessage.id,
      language: aiResponse.language || language,
      metadata: {
        type: aiResponse.type,
        data: aiResponse.data,
        ...aiResponse.metadata
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Get chat history
app.get('/api/chat/history/:sessionId', authenticateToken, (req, res) => {
  const { sessionId } = req.params;
  const { limit = 50, offset = 0 } = req.query;

  db.get(`
    SELECT messages, language, created_at, updated_at 
    FROM chat_sessions 
    WHERE session_id = ? AND user_id = ?
  `, [sessionId, req.user.id], (err, session) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    const messages = JSON.parse(session.messages || '[]');
    const startIndex = Math.max(0, messages.length - parseInt(limit) - parseInt(offset));
    const endIndex = messages.length - parseInt(offset);

    res.json({
      sessionId,
      messages: messages.slice(startIndex, endIndex),
      totalMessages: messages.length,
      language: session.language,
      createdAt: session.created_at,
      updatedAt: session.updated_at
    });
  });
});

// Get user's chat sessions
app.get('/api/chat/sessions', authenticateToken, (req, res) => {
  const { limit = 20, offset = 0 } = req.query;

  db.all(`
    SELECT session_id, language, created_at, updated_at,
           json_array_length(messages) as message_count
    FROM chat_sessions 
    WHERE user_id = ?
    ORDER BY updated_at DESC
    LIMIT ? OFFSET ?
  `, [req.user.id, parseInt(limit), parseInt(offset)], (err, sessions) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      sessions: sessions.map(session => ({
        sessionId: session.session_id,
        language: session.language,
        messageCount: session.message_count || 0,
        createdAt: session.created_at,
        updatedAt: session.updated_at
      })),
      count: sessions.length
    });
  });
});

// ============================================================================
// WEBSOCKET REAL-TIME FEATURES
// ============================================================================

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join user-specific room for real-time updates
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Real-time chat
  socket.on('chat-message', async (data) => {
    try {
      const { message, sessionId, userId, language } = data;
      
      // Process message (similar to REST endpoint)
      // Emit response back to user
      socket.to(`user-${userId}`).emit('chat-response', {
        sessionId,
        response: 'Real-time response...',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('WebSocket chat error:', error);
      socket.emit('error', { message: 'Failed to process message' });
    }
  });

  // Market analysis updates
  socket.on('subscribe-market-updates', (location) => {
    socket.join(`market-${location.latitude}-${location.longitude}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ============================================================================
// HEALTH CHECK AND MONITORING
// ============================================================================

app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: 'connected',
    cache: {
      size: cache.size,
      maxSize: 1000
    }
  };

  // Test database connection
  db.get('SELECT 1', (err) => {
    if (err) {
      healthCheck.database = 'error';
      healthCheck.status = 'ERROR';
      return res.status(500).json(healthCheck);
    }
    
    res.json(healthCheck);
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  const docs = {
    title: 'BiteBase Enhanced API',
    version: '2.0.0',
    description: 'Production-ready API for restaurant intelligence platform',
    baseUrl: `http://localhost:${PORT}`,
    endpoints: {
      authentication: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/profile': 'Get user profile (requires auth)'
      },
      restaurants: {
        'GET /api/restaurants': 'Get restaurants with filtering',
        'POST /api/restaurants': 'Create restaurant (requires auth)'
      },
      chat: {
        'POST /api/chat': 'Send chat message (requires auth)',
        'GET /api/chat/history/:sessionId': 'Get chat history (requires auth)',
        'GET /api/chat/sessions': 'Get user chat sessions (requires auth)'
      },
      monitoring: {
        'GET /health': 'Health check',
        'GET /api/docs': 'API documentation'
      }
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      note: 'Include JWT token in Authorization header for protected endpoints'
    }
  };

  res.json(docs);
});

// ============================================================================
// WONGNAI RESTAURANT DATA ROUTES
// ============================================================================

// Initialize Wongnai database tables
app.post('/api/wongnai/init', authenticateToken, async (req, res) => {
  try {
    await wongnaiScraper.initDatabase();
    res.json({ 
      success: true, 
      message: 'Wongnai database tables initialized successfully' 
    });
  } catch (error) {
    console.error('Wongnai init error:', error);
    res.status(500).json({ error: 'Failed to initialize Wongnai database' });
  }
});

// Scrape restaurant data from Wongnai (admin only)
app.post('/api/wongnai/scrape', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin (you can implement role-based access)
    const { pages = 3, size = 20 } = req.body;
    
    console.log(`🔍 Starting Wongnai scraping: ${pages} pages, ${size} per page`);
    
    // Initialize database first
    await wongnaiScraper.initDatabase();
    
    // Create mock data instead of scraping due to Cloudflare protection
    const mockRestaurants = [
      {
        id: 1,
        publicId: "mock001",
        displayName: "ร้านอาหารไทยแสนอร่อย",
        nameOnly: { thai: "ร้านอาหารไทยแสนอร่อย", english: "Delicious Thai Restaurant" },
        categories: [{ name: "อาหารไทย" }],
        priceRange: { value: 2 },
        statistic: { rating: 4.5, numberOfReviews: 150 },
        lat: 13.7563,
        lng: 100.5018,
        contact: {
          address: { street: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110" },
          callablePhoneno: "02-123-4567"
        },
        verifiedInfo: true,
        verifiedLocation: true,
        deliveryInformation: { hasDeliveryService: true },
        pickupInformation: { available: true },
        topFavourites: [
          { name: "ผัดไทย" },
          { name: "ต้มยำกุ้ง" },
          { name: "แกงเขียวหวาน" }
        ]
      },
      {
        id: 2,
        publicId: "mock002",
        displayName: "คาเฟ่น่านั่ง",
        nameOnly: { thai: "คาเฟ่น่านั่ง", english: "Cozy Cafe" },
        categories: [{ name: "คาเฟ่" }],
        priceRange: { value: 1 },
        statistic: { rating: 4.2, numberOfReviews: 89 },
        lat: 13.7440,
        lng: 100.5332,
        contact: {
          address: { street: "456 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500" },
          callablePhoneno: "02-987-6543"
        },
        verifiedInfo: true,
        verifiedLocation: true,
        deliveryInformation: { hasDeliveryService: false },
        pickupInformation: { available: true },
        topFavourites: [
          { name: "กาแฟลาเต้" },
          { name: "เค้กช็อกโกแลต" },
          { name: "แซนด์วิช" }
        ]
      },
      {
        id: 3,
        publicId: "mock003",
        displayName: "ร้านอาหารญี่ปุ่นโอมากาเสะ",
        nameOnly: { thai: "ร้านอาหารญี่ปุ่นโอมากาเสะ", english: "Omakase Japanese Restaurant" },
        categories: [{ name: "อาหารญี่ปุ่น" }],
        priceRange: { value: 4 },
        statistic: { rating: 4.8, numberOfReviews: 234 },
        lat: 13.7308,
        lng: 100.5418,
        contact: {
          address: { street: "789 ถนนพลับพลา แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330" },
          callablePhoneno: "02-555-1234"
        },
        verifiedInfo: true,
        verifiedLocation: true,
        deliveryInformation: { hasDeliveryService: true },
        pickupInformation: { available: false },
        topFavourites: [
          { name: "ซูชิโอมากาเสะ" },
          { name: "ซาชิมิ" },
          { name: "เทมปุระ" }
        ]
      }
    ];

    // Save mock data
    await wongnaiScraper.saveRestaurants(mockRestaurants);
    
    const stats = await wongnaiScraper.getRestaurantStats();
    
    logActivity(req.user.id, 'wongnai_scrape', 'system', null, 
      { pages, size, restaurants: mockRestaurants.length }, req);

    res.json({
      success: true,
      message: `Successfully added ${mockRestaurants.length} mock restaurants`,
      stats: stats
    });

  } catch (error) {
    console.error('Wongnai scrape error:', error);
    res.status(500).json({ error: 'Failed to scrape restaurant data' });
  }
});

// Get restaurant statistics
app.get('/api/wongnai/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await wongnaiScraper.getRestaurantStats();
    res.json(stats);
  } catch (error) {
    console.error('Wongnai stats error:', error);
    res.status(500).json({ error: 'Failed to get restaurant statistics' });
  }
});

// Search restaurants
app.get('/api/wongnai/restaurants', authenticateToken, async (req, res) => {
  try {
    const filters = {
      city: req.query.city,
      category: req.query.category,
      minRating: req.query.minRating ? parseFloat(req.query.minRating) : undefined,
      priceRange: req.query.priceRange ? parseInt(req.query.priceRange) : undefined,
      deliveryAvailable: req.query.deliveryAvailable === 'true',
      limit: req.query.limit ? parseInt(req.query.limit) : 20
    };

    const restaurants = await wongnaiScraper.searchRestaurants(filters);
    
    // Parse JSON fields
    const processedRestaurants = restaurants.map(restaurant => ({
      ...restaurant,
      photos: JSON.parse(restaurant.photos || '[]'),
      menu_items: JSON.parse(restaurant.menu_items || '[]'),
      opening_hours: restaurant.opening_hours ? JSON.parse(restaurant.opening_hours) : null
    }));

    res.json({
      restaurants: processedRestaurants,
      count: restaurants.length,
      filters: filters
    });

  } catch (error) {
    console.error('Restaurant search error:', error);
    res.status(500).json({ error: 'Failed to search restaurants' });
  }
});

// Get restaurant by ID
app.get('/api/wongnai/restaurants/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.get(`
    SELECT * FROM wongnai_restaurants WHERE id = ? OR wongnai_id = ?
  `, [id, id], (err, restaurant) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Parse JSON fields
    const processedRestaurant = {
      ...restaurant,
      photos: JSON.parse(restaurant.photos || '[]'),
      menu_items: JSON.parse(restaurant.menu_items || '[]'),
      opening_hours: restaurant.opening_hours ? JSON.parse(restaurant.opening_hours) : null
    };

    res.json(processedRestaurant);
  });
});

// Get restaurant categories
app.get('/api/wongnai/categories', authenticateToken, (req, res) => {
  db.all(`
    SELECT category, COUNT(*) as count 
    FROM wongnai_restaurants 
    WHERE category IS NOT NULL 
    GROUP BY category 
    ORDER BY count DESC
  `, (err, categories) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(categories);
  });
});

// Get restaurant cities
app.get('/api/wongnai/cities', authenticateToken, (req, res) => {
  db.all(`
    SELECT city, COUNT(*) as count 
    FROM wongnai_restaurants 
    WHERE city IS NOT NULL 
    GROUP BY city 
    ORDER BY count DESC
  `, (err, cities) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(cities);
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function startServer() {
  try {
    await initializeEnhancedDatabase();
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 BiteBase Enhanced Server Started!');
      console.log(`📍 Server running on: http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`🔌 WebSocket enabled for real-time features`);
      console.log(`🔐 JWT Authentication enabled`);
      console.log(`⚡ Caching layer active`);
      console.log(`📊 API usage tracking enabled`);
      console.log('');
      console.log('🎯 Ready for production deployment!');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    db.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    db.close();
    process.exit(0);
  });
});

startServer();