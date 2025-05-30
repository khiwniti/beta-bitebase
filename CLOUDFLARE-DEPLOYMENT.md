# 🌐 BiteBase Cloudflare Deployment Guide

## 🎯 **Complete Cloudflare Deployment Strategy**

Deploy your entire BiteBase AI-powered restaurant intelligence platform on Cloudflare's edge network for maximum performance, scalability, and global reach.

## 📋 **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Cloudflare Pages│    │Cloudflare Workers│   │Cloudflare Workers│
│   Frontend      │◄──►│   Backend API   │◄──►│   AI Agents     │
│beta.bitebase.app│    │ api.bitebase.app│    │ ai.bitebase.app │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Custom Domain │    │   Cloudflare    │    │   External APIs │
│beta.bitebase.app│    │   D1 Database   │    │   OpenAI, etc   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Quick Deployment**

### **One-Command Deployment**
```bash
chmod +x scripts/deploy-cloudflare.sh
./scripts/deploy-cloudflare.sh
```

## 📝 **Step-by-Step Deployment**

### **Prerequisites**
1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Domain**: Add your domain to Cloudflare (bitebase.app)
3. **Wrangler CLI**: Install globally
   ```bash
   npm install -g wrangler
   wrangler login
   ```

### **Step 1: Database Setup (Cloudflare D1)**

```bash
# Create D1 database
wrangler d1 create bitebase-production

# Run migrations
cd apps/backend
wrangler d1 execute bitebase-production --file=../../database/schema.sql
```

### **Step 2: Backend API Deployment (Cloudflare Workers)**

```bash
cd apps/backend

# Install dependencies
cp package-cloudflare.json package.json
npm install

# Deploy backend worker
wrangler deploy --env production
```

**Expected Output:**
```
✅ Backend API deployed to: https://bitebase-backend-api.your-subdomain.workers.dev
```

### **Step 3: AI Agents Deployment (Cloudflare Workers)**

```bash
cd agent

# Install dependencies
npm install hono

# Deploy AI agents worker
wrangler deploy --env production
```

**Expected Output:**
```
✅ AI Agents deployed to: https://bitebase-ai-agents.your-subdomain.workers.dev
```

### **Step 4: Frontend Deployment (Cloudflare Pages)**

#### **Option A: Automatic Deployment (Recommended)**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > Pages
2. Click "Create a project"
3. Connect to GitHub repository
4. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `cd apps/frontend && npm run build`
   - **Build output directory**: `apps/frontend/out`
   - **Root directory**: `/`

#### **Option B: Manual Deployment**
```bash
cd apps/frontend

# Build the frontend
npm run build

# Deploy to Pages (if wrangler pages is available)
wrangler pages deploy out --project-name=bitebase-frontend
```

### **Step 5: Custom Domain Configuration**

#### **Frontend Domain (beta.bitebase.app)**
1. Go to Cloudflare Dashboard > Pages > Your Project
2. Click "Custom domains"
3. Add domain: `beta.bitebase.app`
4. Cloudflare will automatically configure DNS

#### **API Domains**
1. Go to Cloudflare Dashboard > Workers & Pages
2. Select your worker
3. Go to "Triggers" tab
4. Add custom domain:
   - Backend API: `api.bitebase.app`
   - AI Agents: `ai.bitebase.app`

## ⚙️ **Environment Variables Configuration**

### **Backend API Worker**
Set in Cloudflare Dashboard > Workers > bitebase-backend-api > Settings > Variables:

```bash
# Database
DATABASE_URL=your_database_url

# Security
JWT_SECRET=your_jwt_secret_here
ADMIN_JWT_SECRET=your_admin_jwt_secret_here

# CORS
CORS_ORIGIN=https://beta.bitebase.app

# Environment
NODE_ENV=production
```

### **AI Agents Worker**
Set in Cloudflare Dashboard > Workers > bitebase-ai-agents > Settings > Variables:

```bash
# API Keys
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
TAVILY_API_KEY=your_tavily_api_key

# Environment
NODE_ENV=production
```

### **Frontend (Pages)**
Set in Cloudflare Dashboard > Pages > Your Project > Settings > Environment Variables:

```bash
# API URLs
NEXT_PUBLIC_API_URL=https://api.bitebase.app
NEXT_PUBLIC_AGENT_API_URL=https://ai.bitebase.app
NEXT_PUBLIC_SITE_URL=https://beta.bitebase.app

# Firebase (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bitebase-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bitebase-prod
```

## 🔧 **Advanced Configuration**

### **KV Namespaces (Caching)**
```bash
# Create KV namespaces
wrangler kv:namespace create "CACHE" --env production
wrangler kv:namespace create "AI_CACHE" --env production

# Update wrangler.toml with the namespace IDs
```

### **Durable Objects (Real-time Features)**
```bash
# For real-time chat or live updates
wrangler deploy --compatibility-date 2024-05-25
```

### **Analytics and Monitoring**
1. Enable Cloudflare Analytics in Dashboard
2. Set up Workers Analytics
3. Configure Real User Monitoring (RUM)

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
```

## 📊 **Performance Benefits**

### **Cloudflare Edge Network**
- **Global CDN**: 300+ locations worldwide
- **Edge Computing**: Workers run at the edge
- **Zero Cold Starts**: Instant response times
- **Auto-scaling**: Handles traffic spikes automatically

### **Cost Optimization**
- **Workers**: $5/month for 10M requests
- **Pages**: Free for unlimited static sites
- **D1**: $5/month for 25M reads
- **KV**: $0.50/month for 10M reads

## 🛡️ **Security Features**

### **Built-in Security**
- **DDoS Protection**: Automatic DDoS mitigation
- **SSL/TLS**: Automatic HTTPS certificates
- **WAF**: Web Application Firewall
- **Bot Management**: Advanced bot protection

### **Custom Security Rules**
```javascript
// Example security rule in Worker
if (request.headers.get('User-Agent')?.includes('bot')) {
  return new Response('Blocked', { status: 403 })
}
```

## 🔄 **CI/CD Integration**

### **GitHub Actions**
```yaml
name: Deploy to Cloudflare
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy --env production
```

## 📈 **Monitoring and Analytics**

### **Cloudflare Analytics**
- Real-time traffic analytics
- Performance metrics
- Security insights
- Error tracking

### **Custom Metrics**
```javascript
// Track custom metrics in Workers
addEventListener('fetch', event => {
  event.passThroughOnException()
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Track API calls
  await fetch('https://analytics.bitebase.app/track', {
    method: 'POST',
    body: JSON.stringify({
      endpoint: request.url,
      timestamp: Date.now()
    })
  })
}
```

## 🎯 **Production Checklist**

### **Pre-Launch**
- [ ] All environment variables configured
- [ ] Custom domains pointing correctly
- [ ] SSL certificates active
- [ ] Database migrations completed
- [ ] API endpoints responding
- [ ] Frontend loading correctly

### **Post-Launch**
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify all features working
- [ ] Set up alerting
- [ ] Configure backups

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Worker Not Responding**
```bash
# Check worker logs
wrangler tail bitebase-backend-api

# Check deployment status
wrangler deployments list
```

#### **Database Connection Issues**
```bash
# Test D1 connection
wrangler d1 execute bitebase-production --command "SELECT 1"

# Check database schema
wrangler d1 execute bitebase-production --command "SELECT name FROM sqlite_master WHERE type='table'"
```

#### **Frontend Build Errors**
```bash
# Check build logs in Pages dashboard
# Verify environment variables are set
# Check Next.js configuration
```

## 🎉 **Success!**

Your BiteBase platform is now deployed on Cloudflare's global edge network!

### **Live URLs**
- **Frontend**: https://beta.bitebase.app
- **Backend API**: https://api.bitebase.app
- **AI Agents**: https://ai.bitebase.app

### **Benefits Achieved**
✅ **Global Performance**: Sub-100ms response times worldwide  
✅ **Infinite Scale**: Auto-scaling to handle any traffic  
✅ **Zero Downtime**: 100% uptime with edge redundancy  
✅ **Cost Effective**: Pay only for what you use  
✅ **Enterprise Security**: Built-in DDoS and WAF protection  

**🍽️ Your AI-powered restaurant intelligence platform is now live on the edge! 🌐✨**
