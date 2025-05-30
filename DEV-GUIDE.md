# BiteBase Development Guide

## 🏗️ Architecture Overview

BiteBase is a comprehensive AI-powered restaurant intelligence platform with the following components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   AI Agents     │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (Python)      │
│   Port: 3000    │    │   Port: 1337    │    │   Port: 8001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Firebase      │    │   PostgreSQL    │    │   Agent Gateway │
│   (Auth)        │    │   + PostGIS     │    │   (Node.js)     │
│                 │    │   (Database)    │    │   Port: 5000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. One-Command Setup
```bash
./setup-dev-environment.sh
```

### 2. Manual Setup
```bash
# Install dependencies
npm install

# Setup each component
cd apps/frontend && npm install && cd ../..
cd apps/backend && npm install && cd ../..
cd agent && poetry install && cd ..

# Setup environment files
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/backend/.env.production apps/backend/.env
cp agent/.env.example agent/.env
```

## 🔧 Development Workflow

### Frontend Development
```bash
cd apps/frontend
npm run dev
# → http://localhost:3000
```

### Backend API Development
```bash
cd apps/backend
npm run express:dev
# → http://localhost:1337
```

### AI Agents Development
```bash
cd apps/backend
npm run agent:dev
# → FastAPI: http://localhost:8001
# → Gateway: http://localhost:5000
```

### Full Stack Development
```bash
cd apps/backend
npm run dev:full
# → Runs Backend API + AI Agents together
```

## 🤖 AI Agent System

### Available Agents

1. **Restaurant Data Agent** (`/api/restaurants`)
   - Scrapes restaurant data from multiple platforms
   - Handles geospatial queries
   - Provides data validation and matching

2. **Restaurant Analysis Agent** (`/api/analyze`)
   - Market analysis and insights
   - Competition analysis
   - Revenue projections

3. **Location Intelligence Agent**
   - Demographic analysis
   - Foot traffic analysis
   - Market opportunity scoring

4. **Restaurant Research Agent** (`/research`)
   - Comprehensive market research
   - Customer insights
   - Financial analysis

### Agent API Endpoints

#### FastAPI Server (Port 8001)
```bash
# Health check
GET http://localhost:8001/health

# Restaurant research
POST http://localhost:8001/research
{
  "location": "New York, NY",
  "cuisine_type": "Italian",
  "additional_context": {}
}
```

#### Node.js Gateway (Port 5000)
```bash
# Get restaurants
GET http://localhost:5000/api/restaurants?latitude=40.7128&longitude=-74.0060&radius=5

# Match restaurants across platforms
GET http://localhost:5000/api/restaurants/match?latitude=40.7128&longitude=-74.0060&radius=5

# Analyze market data
GET http://localhost:5000/api/analyze?latitude=40.7128&longitude=-74.0060&radius=5&analysis_type=comprehensive

# Geocoding
GET http://localhost:5000/api/geocode?address=Times Square, New York
```

## 🗄️ Database

### Connection
- **Production**: Neon PostgreSQL with PostGIS
- **Connection String**: Available in `.env` files
- **Tables**: Auto-created on first run

### Management Commands
```bash
cd apps/backend

# Initialize/test database
npm run db:init

# Production database setup
npm run db:init:production
```

## 🔑 Environment Configuration

### Frontend (apps/frontend/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_AGENT_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
# ... other Firebase config
```

### Backend (apps/backend/.env)
```env
DATABASE_URL=postgresql://...
PORT=1337
CORS_ORIGIN=http://localhost:3000
```

### AI Agents (agent/.env)
```env
OPENAI_API_KEY=your_openai_key
GOOGLE_MAPS_API_KEY=your_maps_key
TAVILY_API_KEY=your_tavily_key
FASTAPI_PORT=8001
EXPRESS_PORT=5000
```

## 📊 API Integration

### Frontend → Backend API
```typescript
// Restaurant data
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`);

// AI agent calls
const analysis = await fetch(`${process.env.NEXT_PUBLIC_AGENT_API_URL}/api/analyze?...`);
```

### Backend → AI Agents
```javascript
// Direct FastAPI call
const response = await fetch('http://localhost:8001/research', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ location, cuisine_type })
});
```

## 🧪 Testing

### Unit Tests
```bash
# Frontend tests
cd apps/frontend && npm test

# Backend tests
cd apps/backend && npm test

# Agent tests
cd agent && poetry run pytest
```

### Integration Tests
```bash
# Test full stack
cd agent && python test_integration.py
```

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)
```bash
cd apps/frontend
npm run build
# Deploy build/ directory
```

### Backend (Railway/Render)
```bash
cd apps/backend
# Deploy express-server.js
# Set DATABASE_URL environment variable
```

### AI Agents (Python hosting)
```bash
cd agent
# Deploy FastAPI app from restaurant_research_server.py
# Set required environment variables
```

## 🔍 Debugging

### Check Service Status
```bash
# Backend API
curl http://localhost:1337/health

# AI Agents FastAPI
curl http://localhost:8001/health

# AI Agents Gateway
curl http://localhost:5000/api/geocode?address=test
```

### Common Issues

1. **Port conflicts**: Check if ports 3000, 1337, 5000, 8001 are available
2. **Python dependencies**: Ensure Poetry is installed and Python 3.12+
3. **Database connection**: Verify DATABASE_URL in environment files
4. **API keys**: Ensure all required API keys are set in agent/.env

## 📝 Development Tips

1. **Hot Reload**: All servers support hot reload in development mode
2. **Logging**: Check terminal output for detailed logs
3. **CORS**: Configured for cross-origin requests between services
4. **Error Handling**: Comprehensive error handling across all components

## 🎯 Next Steps

1. Set up your API keys in `agent/.env`
2. Run the full development environment: `npm run dev:full`
3. Access the frontend at http://localhost:3000
4. Test AI agents through the dashboard interface
5. Monitor logs for any issues

Happy coding! 🍽️✨
