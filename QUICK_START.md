# 🚀 BiteBase Intelligence - Quick Start Guide

## 🎯 Overview

Get your BiteBase Intelligence platform up and running in minutes! This guide will help you deploy the complete AI-powered restaurant business intelligence platform.

## ⚡ Quick Deployment

### 1. **Clone and Setup**
```bash
# Clone the repository
git clone <your-repository-url>
cd bitebase-geospatial-saas

# Install dependencies
yarn install

# Install Python dependencies for AI agents
cd agent
pip3 install fastapi uvicorn openai requests python-multipart python-dotenv aiofiles
cd ..
```

### 2. **Environment Configuration**

Create environment files with your API keys:

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_AGENT_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**AI Agents (agent/.env)**
```env
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
LLM_PROVIDER=openai
LLM_MODEL=gpt-4-turbo
PORT=8000
```

**Backend (apps/backend/.env)**
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-secure-app-keys
JWT_SECRET=your-jwt-secret
DATABASE_FILENAME=.tmp/data.db
```

### 3. **Start Services**
```bash
# Option 1: Automated deployment
./scripts/deploy.sh deploy

# Option 2: Manual startup
# Terminal 1 - Backend
cd apps/backend && yarn develop &

# Terminal 2 - AI Agents
cd agent && python3 -m uvicorn bitebase_ai.bitebase:app --host 0.0.0.0 --port 8000 &

# Terminal 3 - Frontend
cd apps/frontend && yarn dev &

# Terminal 4 - Documentation
cd apps/docs && yarn dev &
```

### 4. **Access Your Platform**
- **Frontend**: http://localhost:3000
- **AI Agents**: http://localhost:8000
- **Backend**: http://localhost:1337
- **Documentation**: http://localhost:3003

## 🎨 **Platform Features**

### **🏠 Landing Page**
- Modern BiteBase Intelligence design
- Feature showcase and social proof
- Clear call-to-action buttons
- Responsive mobile design

### **🏢 Restaurant Setup Wizard**
- 4-step guided setup process
- Interactive map for location selection
- AI-powered location analysis
- Business goal configuration

### **📊 AI Dashboard**
- Real-time business metrics
- AI insights and recommendations
- Quick action buttons
- Performance tracking

### **🗺️ Market Analysis**
- Interactive mapping interface
- Comprehensive location intelligence
- Competition and demographic analysis
- AI-generated recommendations

## 🤖 **AI Agent System**

### **Available Agents**
- **Location Intelligence**: Site selection and market analysis
- **Product Analysis**: Menu optimization and performance
- **Customer Insights**: Behavioral analysis and preferences
- **Restaurant Analysis**: Comprehensive business intelligence

### **API Endpoints**
```bash
# Health check
GET http://localhost:8000/health

# Location analysis
POST http://localhost:8000/api/v1/location/analyze

# Product analysis
POST http://localhost:8000/api/v1/product/analyze

# Restaurant analysis
POST http://localhost:8000/api/v1/restaurant/analyze
```

## 🎯 **User Journey**

### **1. Landing Experience**
1. User visits the landing page
2. Learns about AI-powered restaurant intelligence
3. Clicks "Start Free Trial" to begin setup

### **2. Restaurant Setup**
1. **Concept Definition**: Name, cuisine, target audience
2. **Goal Setting**: Business objectives and priorities
3. **Location Selection**: Interactive map with AI analysis
4. **Summary**: Review and complete setup

### **3. Dashboard Usage**
1. View real-time business metrics
2. Receive AI-powered insights and alerts
3. Access market analysis and reports
4. Get personalized recommendations

## 🔧 **Customization**

### **Colors & Branding**
The platform uses the BiteBase Intelligence color scheme:
- **Primary**: #3B82F6 (Blue)
- **Secondary**: #10B981 (Green)
- **Accent**: #1F2937 (Dark Gray)
- **Warning**: #F59E0B (Orange)

Update colors in:
- `apps/frontend/tailwind.config.js`
- `apps/frontend/app/globals.css`

### **Content & Copy**
Update text content in:
- `apps/frontend/app/page.tsx` (Landing page)
- `apps/frontend/app/restaurant-setup/page.tsx` (Setup wizard)
- `apps/frontend/app/dashboard/page.tsx` (Dashboard)

## 🚀 **Production Deployment**

### **Vercel (Frontend)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd apps/frontend
vercel --prod
```

### **Railway (Backend & AI)**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy backend
cd apps/backend
railway login
railway init
railway up

# Deploy AI agents
cd ../../agent
railway init
railway up
```

### **Environment Variables for Production**
Set these in your deployment platform:
- `OPENAI_API_KEY`
- `GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_AGENT_API_URL`

## 🔍 **Testing the Platform**

### **1. Test Landing Page**
- Visit http://localhost:3000
- Check responsive design
- Test navigation and CTAs

### **2. Test Restaurant Setup**
- Click "Start Free Trial"
- Complete all 4 setup steps
- Verify AI location analysis

### **3. Test Dashboard**
- Access dashboard after setup
- Check metrics and insights
- Test quick action buttons

### **4. Test Market Analysis**
- Navigate to market analysis
- Select location on map
- Verify AI analysis results

## 🆘 **Troubleshooting**

### **Common Issues**

**Frontend won't start:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
yarn install
yarn dev
```

**AI agents not responding:**
```bash
# Check Python dependencies
cd agent
pip3 install -r requirements.txt

# Verify API keys
python3 -c "import os; print('OpenAI:', bool(os.getenv('OPENAI_API_KEY')))"
```

**Backend connection issues:**
```bash
# Reset Strapi database
cd apps/backend
rm -rf .tmp/data.db
yarn develop
```

### **Logs and Debugging**
```bash
# View service logs
tail -f logs/frontend.log
tail -f logs/backend.log
tail -f logs/agent.log
```

## 📞 **Support**

- **Documentation**: Check the `/docs` directory
- **Issues**: Create GitHub issues for bugs
- **Features**: Submit feature requests
- **Community**: Join discussions

---

**🍽️ Your BiteBase Intelligence platform is now ready to revolutionize restaurant decision-making with AI-powered insights!**

*Need help? Check the comprehensive documentation or reach out to our support team.*
