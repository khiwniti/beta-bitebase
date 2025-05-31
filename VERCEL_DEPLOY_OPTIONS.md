# 🚀 Vercel Deployment Options

You're getting the error: "If `rewrites`, `redirects`, `headers`, `cleanUrls` or `trailingSlash` are used, then `routes` cannot be present."

Here are **3 different approaches** to fix this:

## ✅ **Option 1: No vercel.json (Recommended)**

**Delete vercel.json completely** and let Vercel auto-detect:

1. **Go to**: https://vercel.com
2. **Sign in** with GitHub  
3. **Click**: "New Project"
4. **Import**: `https://github.com/khiwniti/beta-bitebase`
5. **Configure manually**:
   - **Framework**: Next.js
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

6. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://bitebase-backend-api.onrender.com
   NEXT_PUBLIC_STRAPI_URL=https://bitebase-strapi-cms.onrender.com
   NEXT_PUBLIC_AGENT_API_URL=https://bitebase-ai-gateway.onrender.com
   NEXT_PUBLIC_SITE_URL=https://beta.bitebase.app
   ```

7. **Click**: "Deploy"

## ✅ **Option 2: Minimal vercel.json**

Use the minimal configuration (already created):

```json
{
  "buildCommand": "cd apps/frontend && npm run build",
  "outputDirectory": "apps/frontend/.next", 
  "installCommand": "cd apps/frontend && npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://bitebase-backend-api.onrender.com",
    "NEXT_PUBLIC_STRAPI_URL": "https://bitebase-strapi-cms.onrender.com", 
    "NEXT_PUBLIC_AGENT_API_URL": "https://bitebase-ai-gateway.onrender.com",
    "NEXT_PUBLIC_SITE_URL": "https://beta.bitebase.app"
  }
}
```

## ✅ **Option 3: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /workspace/beta-bitebase
vercel --prod

# When prompted:
# - Framework: Next.js
# - Root Directory: apps/frontend
# - Build Command: npm run build
# - Output Directory: .next
```

## 🎯 **Recommended: Try Option 1 First**

The simplest approach is to **delete vercel.json** and configure manually in the Vercel dashboard. This avoids all configuration conflicts.

## 🔧 **If You Still Get Errors**

1. **Clear Vercel cache**: Delete the project and recreate it
2. **Check for hidden files**: Make sure no `.vercel` folder exists
3. **Use a different project name** in Vercel dashboard

**The error suggests there might be a cached configuration somewhere. Starting fresh with Option 1 should resolve this completely.**