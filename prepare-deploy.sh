#!/bin/bash

# University Portal - Deployment Preparation Script
# This script helps prepare your project for deployment

echo "🚀 Preparing University Portal for Deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if Git is initialized
echo "${YELLOW}Step 1: Checking Git repository...${NC}"
if [ -d ".git" ]; then
    echo "${GREEN}✓ Git repository found${NC}"
else
    echo "⚠️  Git not initialized. Run: git init"
fi

# Step 2: Check if code is committed
echo ""
echo "${YELLOW}Step 2: Checking for uncommitted changes...${NC}"
if git diff-index --quiet HEAD --; then
    echo "${GREEN}✓ All changes committed${NC}"
else
    echo "⚠️  You have uncommitted changes. Run:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
fi

# Step 3: Generate JWT Secret
echo ""
echo "${YELLOW}Step 3: Generate JWT Secret...${NC}"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "${GREEN}Your JWT Secret:${NC}"
echo "$JWT_SECRET"
echo ""
echo "⚠️  Save this! You'll need it for Render deployment."

# Step 4: Check environment files
echo ""
echo "${YELLOW}Step 4: Checking environment files...${NC}"
if [ -f "backend/.env" ]; then
    echo "${GREEN}✓ Backend .env exists${NC}"
else
    echo "⚠️  Backend .env not found"
fi

if [ -f "frontend/.env" ]; then
    echo "${GREEN}✓ Frontend .env exists${NC}"
else
    echo "⚠️  Frontend .env not found"
fi

# Step 5: Check if pushed to GitHub
echo ""
echo "${YELLOW}Step 5: Checking GitHub remote...${NC}"
if git remote -v | grep -q "github.com"; then
    echo "${GREEN}✓ GitHub remote configured${NC}"
    echo "Remote URL: $(git remote get-url origin)"
else
    echo "⚠️  No GitHub remote found"
fi

# Step 6: Summary
echo ""
echo "═══════════════════════════════════════════"
echo "📋 DEPLOYMENT CHECKLIST"
echo "═══════════════════════════════════════════"
echo ""
echo "✅ Step 1: MongoDB Atlas"
echo "   → Sign up at: https://www.mongodb.com/cloud/atlas/register"
echo "   → Create FREE cluster"
echo "   → Get connection string"
echo ""
echo "✅ Step 2: Deploy Backend (Render)"
echo "   → Sign up at: https://render.com/"
echo "   → Create Web Service from GitHub"
echo "   → Root Directory: backend"
echo "   → Add environment variables:"
echo "     NODE_ENV=production"
echo "     PORT=5000"
echo "     MONGODB_URI=<your-connection-string>"
echo "     JWT_SECRET=$JWT_SECRET"
echo "     CORS_ORIGIN=*"
echo ""
echo "✅ Step 3: Deploy Frontend (Vercel)"
echo "   → Sign up at: https://vercel.com/"
echo "   → Import from GitHub"
echo "   → Root Directory: frontend"
echo "   → Add environment variable:"
echo "     VITE_API_URL=<your-render-backend-url>/api"
echo ""
echo "═══════════════════════════════════════════"
echo ""
echo "${GREEN}🎉 Ready to deploy!${NC}"
echo ""
echo "📚 Read QUICK_DEPLOY.md for detailed instructions"
echo "📖 Read DEPLOYMENT_GUIDE.md for comprehensive guide"
echo ""
