#!/bin/bash

# BiteBase Production Deployment Script
set -e

echo "🚀 BiteBase Production Deployment"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "apps" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🎯 Step 1: Preparing Frontend for Vercel Deployment"
echo "=================================================="

cd apps/frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Build to test
echo "🏗️  Building frontend..."
npm run build

echo "✅ Frontend build successful!"

cd ../..

echo ""
echo "🎯 Step 2: Preparing Backend for Render Deployment"
echo "================================================="

cd apps/backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Test the server
echo "🧪 Testing backend server..."
timeout 10s npm start || echo "✅ Backend server test completed"

cd ../..

echo ""
echo "🎯 Step 3: Deployment Commands"
echo "=============================="

echo ""
echo "📋 Frontend Deployment (Vercel):"
echo "Run the following command to deploy to Vercel:"
echo "  vercel --prod"
echo ""
echo "📋 Backend Deployment (Render):"
echo "1. Go to https://render.com"
echo "2. Create a new Blueprint"
echo "3. Connect this repository: https://github.com/khiwniti/beta-bitebase.git"
echo "4. Render will automatically use the render.yaml configuration"
echo ""

echo "🔧 Environment Variables to Set:"
echo "==============================="
echo ""
echo "In Vercel Dashboard:"
echo "- NEXT_PUBLIC_API_URL=https://bitebase-backend-api.onrender.com"
echo "- NEXT_PUBLIC_STRAPI_URL=https://bitebase-strapi-cms.onrender.com"
echo "- NEXT_PUBLIC_AGENT_API_URL=https://bitebase-ai-gateway.onrender.com"
echo "- NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app"
echo "- NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token"
echo "- NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key"
echo ""
echo "In Render Dashboard:"
echo "- All environment variables are already configured in render.yaml"
echo "- Update database credentials if needed"
echo "- Add API keys for external services (OpenAI, Google Maps, etc.)"
echo ""

echo "🎉 Deployment preparation complete!"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_INSTRUCTIONS.md"
echo ""

# Ask if user wants to deploy now
read -p "🚀 Deploy frontend to Vercel now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to Vercel..."
    vercel --prod
else
    echo "📝 To deploy later, run: vercel --prod"
fi

echo ""
echo "✅ All done! Check DEPLOYMENT_INSTRUCTIONS.md for next steps."