#!/bin/bash

# BiteBase Frontend Deployment Script
echo "🚀 BiteBase Frontend Deployment to Vercel"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "🔑 Please login to Vercel:"
    vercel login
fi

# Run a final build test
echo "🔨 Running final build test..."
cd apps/frontend
if npm run build; then
    echo "✅ Build successful!"
    cd ..
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo "📝 Next steps:"
echo "   1. Check your Vercel dashboard for the deployment URL"
echo "   2. Test the deployed application"
echo "   3. Deploy the backend to Render using the Blueprint method"
echo "   4. Update environment variables if needed"