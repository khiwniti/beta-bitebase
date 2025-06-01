# BiteBase Deployment Instructions

## 🎯 Frontend Deployment to Vercel

### Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`

### Step 1: Deploy Frontend
```bash
# Navigate to project root
cd /workspace/beta-bitebase

# Deploy to Vercel (this will use the existing vercel.json configuration)
vercel --prod

# Or if you want to deploy from the frontend directory specifically:
cd apps/frontend
vercel --prod
```

### Step 2: Configure Environment Variables in Vercel
In your Vercel dashboard, add these environment variables:
- `NEXT_PUBLIC_API_URL`: Your Render backend URL (will be available after backend deployment)
- `NEXT_PUBLIC_STRAPI_URL`: Your Strapi CMS URL
- `NEXT_PUBLIC_AGENT_API_URL`: Your AI Gateway URL
- `NEXT_PUBLIC_SITE_URL`: Your Vercel domain
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Your Mapbox token
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key
- Other Firebase configuration variables

## 🎯 Backend Deployment to Render

### Prerequisites
1. Create a Render account at https://render.com
2. Connect your GitHub repository to Render

### Step 1: Deploy Backend Services
Your project includes a `render.yaml` file that defines multiple services:

1. **bitebase-backend-api** (Express.js API)
2. **bitebase-strapi-cms** (Strapi CMS)
3. **bitebase-ai-agents** (Python FastAPI)
4. **bitebase-ai-gateway** (Node.js)

### Step 2: Deploy via Render Dashboard
1. Go to Render Dashboard
2. Click "New" → "Blueprint"
3. Connect your GitHub repository: `https://github.com/khiwniti/beta-bitebase.git`
4. Render will automatically detect the `render.yaml` file
5. Review and deploy all services

### Step 3: Update Environment Variables
After deployment, update these URLs in your Vercel environment variables:
- `NEXT_PUBLIC_API_URL`: `https://bitebase-backend-api.onrender.com`
- `NEXT_PUBLIC_STRAPI_URL`: `https://bitebase-strapi-cms.onrender.com`
- `NEXT_PUBLIC_AGENT_API_URL`: `https://bitebase-ai-gateway.onrender.com`

## 🔧 Manual Deployment Steps

### Frontend (Vercel)
```bash
# 1. Build the frontend locally to test
cd apps/frontend
npm install
npm run build

# 2. Deploy to Vercel
vercel --prod
```

### Backend (Render)
```bash
# 1. Test backend locally
cd apps/backend
npm install
npm start

# 2. Push to GitHub (Render will auto-deploy)
git add .
git commit -m "Deploy to production"
git push origin main
```

## 🌐 Expected URLs After Deployment

### Frontend (Vercel)
- Production URL: `https://beta.bitebase.app` (or your custom domain)
- Vercel URL: `https://your-project.vercel.app`

### Backend (Render)
- API: `https://bitebase-backend-api.onrender.com`
- Strapi CMS: `https://bitebase-strapi-cms.onrender.com`
- AI Agents: `https://bitebase-ai-agents.onrender.com`
- AI Gateway: `https://bitebase-ai-gateway.onrender.com`

## 🔍 Verification Steps

### 1. Test API Endpoints
```bash
# Health check
curl https://bitebase-backend-api.onrender.com/health

# Test restaurants endpoint
curl https://bitebase-backend-api.onrender.com/api/restaurants

# Test market analysis endpoint
curl https://bitebase-backend-api.onrender.com/api/market-analyses
```

### 2. Test Frontend
- Visit your Vercel URL
- Check that the frontend loads correctly
- Verify API connectivity in browser console
- Test user authentication and data loading

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Update `CORS_ORIGIN` in Render environment variables
   - Include your Vercel domain in the CORS settings

2. **API Connection Issues**
   - Verify `NEXT_PUBLIC_API_URL` in Vercel environment variables
   - Check that backend services are running on Render

3. **Build Failures**
   - Check build logs in Vercel/Render dashboards
   - Ensure all dependencies are properly listed in package.json

4. **Environment Variables**
   - Double-check all required environment variables are set
   - Ensure sensitive keys are properly configured

## 📞 Support

If you encounter issues:
1. Check deployment logs in Vercel/Render dashboards
2. Verify environment variables are correctly set
3. Test API endpoints individually
4. Check network connectivity between services