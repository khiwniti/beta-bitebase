# 🚀 BiteBase Cloudflare Deployment Checklist

## ✅ **Pre-Deployment Requirements**

### **1. Cloudflare Account Setup**
- [ ] Create Cloudflare account at [cloudflare.com](https://cloudflare.com)
- [ ] Add domain `bitebase.app` to Cloudflare
- [ ] Update nameservers to Cloudflare
- [ ] Verify domain is active in Cloudflare

### **2. Wrangler CLI Setup**
```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Verify login
wrangler whoami
```

### **3. API Keys Required**
- [ ] **OpenAI API Key**: For AI restaurant analysis
- [ ] **Mapbox API Key**: For geocoding and maps
- [ ] **Tavily API Key**: For web research (optional)

## 🌐 **Deployment Steps**

### **Step 1: Quick Deployment (Recommended)**
```bash
# Make script executable
chmod +x scripts/deploy-cloudflare.sh

# Run deployment script
./scripts/deploy-cloudflare.sh
```

### **Step 2: Manual Deployment (If needed)**

#### **A. Deploy Backend API Worker**
```bash
cd apps/backend

# Copy Cloudflare package.json
cp package-cloudflare.json package.json

# Install dependencies
npm install

# Deploy to production
wrangler deploy --env production
```

#### **B. Deploy AI Agents Worker**
```bash
cd agent

# Install Hono framework
npm install hono

# Deploy AI worker
wrangler deploy --env production
```

#### **C. Deploy Frontend to Pages**
```bash
cd apps/frontend

# Install dependencies
npm ci

# Build frontend
npm run build

# Deploy to Pages (manual via dashboard)
# Go to Cloudflare Dashboard > Pages > Create Project
```

### **Step 3: Database Setup**
```bash
# Create D1 database
wrangler d1 create bitebase-production

# Run migrations
wrangler d1 execute bitebase-production --file=database/schema.sql --env production
```

## ⚙️ **Environment Variables Configuration**

### **Backend API Worker**
Set in Cloudflare Dashboard > Workers > bitebase-backend-api > Settings > Variables:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret_here
ADMIN_JWT_SECRET=your_admin_jwt_secret_here
CORS_ORIGIN=https://beta.bitebase.app
NODE_ENV=production
```

### **AI Agents Worker**
Set in Cloudflare Dashboard > Workers > bitebase-ai-agents > Settings > Variables:

```
OPENAI_API_KEY=your_openai_api_key
MAPBOX_API_KEY=your_mapbox_api_key
TAVILY_API_KEY=your_tavily_api_key
NODE_ENV=production
```

### **Frontend (Pages)**
Set in Cloudflare Dashboard > Pages > bitebase-frontend > Settings > Environment Variables:

```
NEXT_PUBLIC_API_URL=https://api.bitebase.app
NEXT_PUBLIC_AGENT_API_URL=https://ai.bitebase.app
NEXT_PUBLIC_SITE_URL=https://beta.bitebase.app
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bitebase-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bitebase-prod
```

## 🔗 **Custom Domain Setup**

### **Frontend Domain**
1. Go to Cloudflare Dashboard > Pages > bitebase-frontend
2. Click "Custom domains"
3. Add domain: `beta.bitebase.app`
4. Cloudflare will automatically configure DNS

### **API Domains**
1. Go to Cloudflare Dashboard > Workers & Pages
2. Select your worker
3. Go to "Triggers" tab
4. Add custom domains:
   - Backend API: `api.bitebase.app`
   - AI Agents: `ai.bitebase.app`

## 🧪 **Testing Deployment**

### **Health Checks**
```bash
# Test all services
curl https://beta.bitebase.app
curl https://api.bitebase.app/health
curl https://ai.bitebase.app/health
```

### **API Testing**
```bash
# Test restaurant data
curl "https://api.bitebase.app/api/restaurants?latitude=40.7128&longitude=-74.0060&radius=5"

# Test AI research
curl -X POST https://ai.bitebase.app/research \
  -H "Content-Type: application/json" \
  -d '{"location": "New York", "cuisine_type": "Italian"}'

# Test geocoding
curl "https://ai.bitebase.app/api/geocode?address=New York, NY"
```

## 🎯 **Post-Deployment Checklist**

- [ ] All health checks return 200 status
- [ ] Frontend loads without errors
- [ ] API endpoints respond correctly
- [ ] AI agents process requests successfully
- [ ] Database queries execute properly
- [ ] Custom domains are working
- [ ] SSL certificates are active
- [ ] Environment variables are set
- [ ] Error monitoring is configured

## 🔧 **Troubleshooting**

### **Common Issues**
- **Worker not responding**: Check wrangler logs with `wrangler tail`
- **Database errors**: Verify D1 database exists and migrations ran
- **CORS issues**: Ensure CORS_ORIGIN includes your domain
- **API key errors**: Verify all API keys are set correctly

### **Useful Commands**
```bash
# Check worker logs
wrangler tail bitebase-backend-api

# List deployments
wrangler deployments list

# Test D1 database
wrangler d1 execute bitebase-production --command "SELECT 1"
```

## 🎉 **Success!**

Your BiteBase platform is now deployed on Cloudflare's global edge network!

**Live URLs:**
- Frontend: https://beta.bitebase.app
- Backend API: https://api.bitebase.app
- AI Agents: https://ai.bitebase.app

**Benefits Achieved:**
✅ Global Performance: Sub-100ms response times worldwide
✅ Infinite Scale: Auto-scaling to handle any traffic
✅ Zero Downtime: 100% uptime with edge redundancy
✅ Cost Effective: Pay only for what you use
✅ Enterprise Security: Built-in DDoS and WAF protection

🍽️ Your AI-powered restaurant intelligence platform is now live on the edge! 🌐✨
