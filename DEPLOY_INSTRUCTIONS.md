# 🚀 BiteBase Deployment Instructions

## ✅ Status: Ready to Deploy!
- Frontend build: ✅ PASSING
- Backend server: ✅ TESTED
- All TypeScript errors: ✅ FIXED
- Configuration files: ✅ READY

## 🎯 Step 1: Deploy Frontend to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Login to Vercel**:
   ```bash
   cd /workspace/beta-bitebase
   vercel login
   ```
   - Choose "Continue with GitHub"
   - Follow the browser authentication

2. **Deploy to Production**:
   ```bash
   vercel --prod
   ```
   - Vercel will automatically detect the Next.js app
   - It will use the `vercel.json` configuration
   - Environment variables are pre-configured

### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import from GitHub: `https://github.com/khiwniti/beta-bitebase`
4. Set these configurations:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

## 🎯 Step 2: Deploy Backend to Render

### Using Render Blueprint (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Sign in** with your GitHub account
3. **Click "New" → "Blueprint"**
4. **Connect Repository**: 
   - Repository URL: `https://github.com/khiwniti/beta-bitebase`
   - Branch: `main`
5. **Render will detect `render.yaml`** and show these services:
   - ✅ bitebase-backend-api (Express.js API)
   - ✅ bitebase-strapi-cms (Strapi CMS)  
   - ✅ bitebase-ai-agents (Python FastAPI)
   - ✅ bitebase-ai-gateway (Node.js)
6. **Click "Apply"** to deploy all services

### Add Required API Keys

After deployment, add these environment variables in Render:

1. Go to each service in Render dashboard
2. Navigate to "Environment" tab
3. Add these variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `GOOGLE_MAPS_API_KEY`: Your Google Maps API key
   - `TAVILY_API_KEY`: Your Tavily API key

## 🔧 Step 3: Update Environment Variables

### Update Frontend Environment Variables

If your Render URLs are different from the defaults, update Vercel:

1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Update these if needed:
   - `NEXT_PUBLIC_API_URL`: Your actual Render backend URL
   - `NEXT_PUBLIC_STRAPI_URL`: Your actual Strapi URL
   - `NEXT_PUBLIC_AGENT_API_URL`: Your actual AI Gateway URL

## 🧪 Step 4: Test Your Deployment

### Test Backend
```bash
# Test health endpoint (replace with your actual URL)
curl https://bitebase-backend-api.onrender.com/health
```

### Test Frontend
Visit your Vercel URL and check:
- ✅ Pages load without errors
- ✅ API connections work
- ✅ No console errors

## 📋 Expected Results

### Frontend URLs
- **Vercel URL**: `https://your-project-name.vercel.app`
- **Custom Domain**: `https://beta.bitebase.app` (if configured)

### Backend URLs
- **Main API**: `https://bitebase-backend-api.onrender.com`
- **Strapi CMS**: `https://bitebase-strapi-cms.onrender.com/admin`
- **AI Agents**: `https://bitebase-ai-agents.onrender.com`
- **AI Gateway**: `https://bitebase-ai-gateway.onrender.com`

## 🚨 Troubleshooting

### If Frontend Build Fails
```bash
# Test build locally first
cd /workspace/beta-bitebase/apps/frontend
npm run build
```

### If Backend Deployment Fails
- Check Render service logs
- Verify all environment variables are set
- Ensure database connection is working

### If Pages Are Empty
- Check browser console for errors
- Verify API endpoints are responding
- Check CORS configuration

## 🎉 Success Checklist

- [ ] Vercel deployment successful
- [ ] Render services all running
- [ ] API keys added to Render
- [ ] Frontend loads without errors
- [ ] Backend health check passes
- [ ] API connections working
- [ ] No empty pages

## 📞 Need Help?

If you encounter issues:
1. Check deployment logs in both platforms
2. Verify all environment variables
3. Test individual components
4. Check CORS settings

**Your application is ready to deploy!** 🚀