# BiteBase Production Deployment Guide

## 🚀 **Deployment Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Render.com    │    │   Render.com    │
│   Frontend      │◄──►│   Backend API   │◄──►│   AI Agents     │
│ beta.bitebase.app│    │   Express.js    │    │   Python        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Custom Domain │    │   PostgreSQL    │    │   Strapi CMS    │
│ beta.bitebase.app│    │   Neon.tech     │    │   (Optional)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 **Pre-Deployment Checklist**

### **1. Repository Setup**
- [ ] Create GitHub repository for the project
- [ ] Push all code to main branch
- [ ] Ensure all environment files are configured
- [ ] Test locally with production environment variables

### **2. Domain Configuration**
- [ ] Configure DNS for beta.bitebase.app
- [ ] Set up SSL certificates (handled by Vercel)
- [ ] Configure CORS for production domains

### **3. API Keys and Secrets**
- [ ] OpenAI API key for AI agents
- [ ] Google Maps API key for location services
- [ ] Firebase configuration for authentication
- [ ] Generate new JWT secrets for production

## 🔧 **Backend Deployment (Render.com)**

### **Step 1: Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your repository

### **Step 2: Deploy Backend Services**

#### **A. Express.js API (Primary Backend)**
```bash
# Service Configuration
Name: bitebase-backend-api
Environment: Node
Build Command: cd apps/backend && npm ci && npm run build
Start Command: cd apps/backend && npm run express:start
Health Check Path: /health
```

#### **B. Strapi CMS (Admin Interface)**
```bash
# Service Configuration
Name: bitebase-strapi-cms
Environment: Node
Build Command: cd apps/backend && npm ci && npm run build
Start Command: cd apps/backend && npm run start
Health Check Path: /admin
```

#### **C. AI Agents (Python FastAPI)**
```bash
# Service Configuration
Name: bitebase-ai-agents
Environment: Python
Build Command: cd agent && pip install -r requirements.txt
Start Command: cd agent && python run_server.py
Health Check Path: /health
```

#### **D. AI Gateway (Node.js)**
```bash
# Service Configuration
Name: bitebase-ai-gateway
Environment: Node
Build Command: cd agent && npm ci
Start Command: cd agent && node server.js
```

### **Step 3: Environment Variables**

Set these environment variables in Render dashboard:

#### **Backend API Environment Variables:**
```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://bitebasedb_staging_owner:npg_vzp02ERAaXoQ@ep-damp-tooth-a4orgq86-pooler.us-east-1.aws.neon.tech/bitebasedb_staging?sslmode=require
CORS_ORIGIN=https://beta.bitebase.app,https://bitebase.app
AGENT_FASTAPI_URL=https://bitebase-ai-agents.onrender.com
AGENT_GATEWAY_URL=https://bitebase-ai-gateway.onrender.com
```

#### **Strapi CMS Environment Variables:**
```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://...
APP_KEYS=2ebuMok3H/O96/o1n/nOyg==,mLN9bGnz5IIzz0tR81ng8g==,vxFi1WuR/zifZJpZkZWVEw==,zr61pBkrMFUG80JQv6L1CA==
ADMIN_JWT_SECRET=pwnD8hb/0xTrUxY8KCHOTw==
JWT_SECRET=4RnZ3V+sClxdkd2xjgYj/Q==
API_TOKEN_SALT=0tzHD0jdayW/8WIYX0vIyA==
TRANSFER_TOKEN_SALT=CppdRmSl7U299fT06yUgNg==
CORS_ORIGIN=https://beta.bitebase.app,https://bitebase.app
```

#### **AI Agents Environment Variables:**
```
PORT=10000
RELOAD=false
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
TAVILY_API_KEY=your_tavily_key
DATABASE_URL=postgresql://...
```

## 🌐 **Frontend Deployment (Vercel)**

### **Step 1: Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Import your repository

### **Step 2: Configure Project**
```bash
# Project Settings
Framework Preset: Next.js
Root Directory: apps/frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm ci
```

### **Step 3: Environment Variables**
Set these in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://bitebase-backend-api.onrender.com
NEXT_PUBLIC_STRAPI_URL=https://bitebase-strapi-cms.onrender.com
NEXT_PUBLIC_AGENT_API_URL=https://bitebase-ai-gateway.onrender.com
NEXT_PUBLIC_SITE_URL=https://beta.bitebase.app
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bitebase-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bitebase-prod
```

### **Step 4: Custom Domain Setup**
1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add custom domain: `beta.bitebase.app`
4. Configure DNS records as instructed by Vercel

## 🔐 **Security Configuration**

### **1. Generate New Production Secrets**
```bash
# Generate new JWT secrets for production
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### **2. Database Security**
- Enable SSL connections
- Use connection pooling
- Set up database backups

### **3. API Security**
- Configure CORS for production domains only
- Enable rate limiting
- Set up API authentication

## 📊 **Monitoring and Logging**

### **1. Health Checks**
- Backend API: `https://bitebase-backend-api.onrender.com/health`
- Strapi CMS: `https://bitebase-strapi-cms.onrender.com/admin`
- AI Agents: `https://bitebase-ai-agents.onrender.com/health`
- Frontend: `https://beta.bitebase.app`

### **2. Logging**
- Render.com provides built-in logging
- Vercel provides function logs
- Set up external monitoring (optional)

## 🚀 **Deployment Commands**

### **Automated Deployment (Recommended)**
```bash
# Deploy using render.yaml
git push origin main
# Render will automatically deploy based on render.yaml

# Deploy frontend to Vercel
git push origin main
# Vercel will automatically deploy
```

### **Manual Deployment**
```bash
# Backend (if needed)
cd apps/backend
npm run deploy:production

# Frontend (if needed)
cd apps/frontend
npm run build
```

## 🔄 **Post-Deployment Steps**

### **1. Verify Deployments**
- [ ] Test frontend at https://beta.bitebase.app
- [ ] Test backend API endpoints
- [ ] Test AI agent functionality
- [ ] Verify database connections

### **2. Set Up Admin User**
1. Go to https://bitebase-strapi-cms.onrender.com/admin
2. Create first admin user
3. Configure content types and permissions

### **3. Test Full Integration**
- [ ] Test user registration/login
- [ ] Test restaurant data fetching
- [ ] Test AI market analysis
- [ ] Test location intelligence features

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Backend Not Starting**
- Check environment variables are set correctly
- Verify database connection string
- Check build logs in Render dashboard

#### **Frontend Build Errors**
- Verify all environment variables are set
- Check build logs in Vercel dashboard
- Ensure API URLs are accessible

#### **AI Agents Not Responding**
- Verify API keys are set correctly
- Check Python dependencies in requirements.txt
- Monitor agent service logs

#### **Database Connection Issues**
- Verify SSL settings
- Check connection string format
- Ensure database is accessible from Render

## 📈 **Scaling and Optimization**

### **Performance Optimization**
- Enable CDN for static assets
- Implement caching strategies
- Optimize database queries
- Use connection pooling

### **Scaling Strategy**
- Monitor resource usage
- Upgrade Render plans as needed
- Implement horizontal scaling for AI agents
- Use database read replicas if needed

## 🎯 **Success Metrics**

### **Deployment Success Indicators**
- [ ] All services return 200 status codes
- [ ] Frontend loads without errors
- [ ] API endpoints respond correctly
- [ ] AI agents process requests successfully
- [ ] Database queries execute properly

### **Performance Targets**
- Frontend load time: < 3 seconds
- API response time: < 500ms
- AI agent response: < 10 seconds
- Database query time: < 100ms

## 📞 **Support and Maintenance**

### **Monitoring**
- Set up uptime monitoring
- Configure error alerting
- Monitor performance metrics
- Track user analytics

### **Maintenance**
- Regular dependency updates
- Security patches
- Database maintenance
- Performance optimization

**🍽️ Your BiteBase platform is now ready for production deployment! Follow this guide step-by-step for a successful launch.**
