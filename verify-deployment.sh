#!/bin/bash

# BiteBase Deployment Verification Script
echo "🔍 BiteBase Deployment Verification"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check URL
check_url() {
    local url=$1
    local name=$2
    echo -n "Checking $name... "
    
    if curl -s --head "$url" | head -n 1 | grep -q "200 OK\|301\|302"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Get URLs from user
echo "Please enter your deployment URLs:"
echo ""

read -p "Frontend URL (Vercel): " FRONTEND_URL
read -p "Backend API URL (Render): " BACKEND_URL
read -p "Strapi CMS URL (Render): " STRAPI_URL
read -p "AI Gateway URL (Render): " AI_GATEWAY_URL

echo ""
echo "🧪 Testing Deployments..."
echo ""

# Test URLs
FRONTEND_OK=0
BACKEND_OK=0
STRAPI_OK=0
AI_GATEWAY_OK=0

if [ ! -z "$FRONTEND_URL" ]; then
    check_url "$FRONTEND_URL" "Frontend (Vercel)"
    FRONTEND_OK=$?
fi

if [ ! -z "$BACKEND_URL" ]; then
    check_url "$BACKEND_URL/health" "Backend API Health"
    BACKEND_OK=$?
fi

if [ ! -z "$STRAPI_URL" ]; then
    check_url "$STRAPI_URL" "Strapi CMS"
    STRAPI_OK=$?
fi

if [ ! -z "$AI_GATEWAY_URL" ]; then
    check_url "$AI_GATEWAY_URL" "AI Gateway"
    AI_GATEWAY_OK=$?
fi

echo ""
echo "📊 Deployment Summary:"
echo "======================"

if [ $FRONTEND_OK -eq 0 ]; then
    echo -e "Frontend: ${GREEN}✅ DEPLOYED${NC}"
else
    echo -e "Frontend: ${RED}❌ FAILED${NC}"
fi

if [ $BACKEND_OK -eq 0 ]; then
    echo -e "Backend API: ${GREEN}✅ DEPLOYED${NC}"
else
    echo -e "Backend API: ${RED}❌ FAILED${NC}"
fi

if [ $STRAPI_OK -eq 0 ]; then
    echo -e "Strapi CMS: ${GREEN}✅ DEPLOYED${NC}"
else
    echo -e "Strapi CMS: ${RED}❌ FAILED${NC}"
fi

if [ $AI_GATEWAY_OK -eq 0 ]; then
    echo -e "AI Gateway: ${GREEN}✅ DEPLOYED${NC}"
else
    echo -e "AI Gateway: ${RED}❌ FAILED${NC}"
fi

echo ""

# Overall status
if [ $FRONTEND_OK -eq 0 ] && [ $BACKEND_OK -eq 0 ]; then
    echo -e "${GREEN}🎉 Core deployment successful!${NC}"
    echo ""
    echo "🔗 Your URLs:"
    echo "Frontend: $FRONTEND_URL"
    echo "Backend API: $BACKEND_URL"
    echo ""
    echo "✅ Next steps:"
    echo "1. Test the frontend application"
    echo "2. Verify API connections work"
    echo "3. Check for any console errors"
    echo "4. Add any missing API keys to Render"
else
    echo -e "${RED}❌ Deployment issues detected${NC}"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "1. Check deployment logs in Vercel/Render dashboards"
    echo "2. Verify all environment variables are set"
    echo "3. Ensure services have finished starting (may take 5-10 minutes)"
fi

echo ""
echo "📋 Manual verification checklist:"
echo "- [ ] Frontend loads without errors"
echo "- [ ] No empty pages"
echo "- [ ] API calls work from frontend"
echo "- [ ] No console errors in browser"
echo "- [ ] All required API keys added to Render"