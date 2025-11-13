# University Management Portal - Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or self-hosted MongoDB)
- Git
- Domain name (optional, for production)

---

## Part 1: Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free tier account
3. Create a new project (e.g., "University Portal")

### 2. Create Database Cluster
1. Click "Build a Database"
2. Choose FREE tier (M0 Sandbox)
3. Select cloud provider and region (nearest to your location)
4. Cluster name: `university-portal`
5. Click "Create"

### 3. Configure Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `university_admin`
5. Password: Generate secure password (save this!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 4. Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's IP address
5. Click "Confirm"

### 5. Get Connection String
1. Go to "Database" → Click "Connect"
2. Choose "Connect your application"
3. Driver: Node.js, Version: 4.1 or later
4. Copy connection string:
   ```
   mongodb+srv://university_admin:<password>@university-portal.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with actual password
6. Save this connection string for later

---

## Part 2: Backend Deployment

### Option A: Deploy to Render (Recommended - Free Tier Available)

#### 1. Prepare Backend for Deployment

Create `.gitignore` in backend folder:
```
node_modules/
.env
uploads/
logs/
*.log
```

#### 2. Push Code to GitHub
```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git branch -M main
git remote add origin https://github.com/yourusername/university-portal-backend.git
git push -u origin main
```

#### 3. Deploy on Render
1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `university-portal-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### 4. Add Environment Variables
In Render dashboard → Environment → Add:
```
NODE_ENV=production
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<generate_random_32_char_string>
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=<generate_another_random_32_char_string>
JWT_REFRESH_EXPIRE=30d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your_gmail@gmail.com>
EMAIL_PASSWORD=<gmail_app_password>
EMAIL_FROM=University Portal <noreply@university.edu>

CLIENT_URL=<your_frontend_url_after_deployment>
```

**To generate JWT secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**To get Gmail app password:**
1. Enable 2-factor authentication on Gmail
2. Go to Google Account → Security → App passwords
3. Generate password for "Mail"

#### 5. Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://university-portal-backend.onrender.com`

#### 6. Seed Database
```bash
# After deployment, trigger seeding via Render shell or locally:
MONGO_URI=<connection_string> node scripts/seedData.js
```

---

### Option B: Deploy to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select repository
5. Add environment variables (same as above)
6. Railway auto-detects Node.js and deploys
7. Get deployment URL from Railway dashboard

---

### Option C: Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create university-portal-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=<connection_string>
heroku config:set JWT_SECRET=<secret>
# ... set all other variables

# Deploy
git push heroku main

# Seed database
heroku run node scripts/seedData.js
```

---

## Part 3: Frontend Deployment

### Option A: Deploy to Vercel (Recommended - Free Tier)

#### 1. Update Frontend Configuration

Edit `frontend/src/utils/constants.js`:
```javascript
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 'https://university-portal-backend.onrender.com/api';
```

Create `frontend/.env.production`:
```
VITE_API_URL=https://university-portal-backend.onrender.com/api
```

#### 2. Push to GitHub
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
git branch -M main
git remote add origin https://github.com/yourusername/university-portal-frontend.git
git push -u origin main
```

#### 3. Deploy on Vercel
1. Go to https://vercel.com and sign up
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### 4. Add Environment Variables
In Vercel → Settings → Environment Variables:
```
VITE_API_URL=https://university-portal-backend.onrender.com/api
```

#### 5. Deploy
1. Click "Deploy"
2. Wait for build (2-5 minutes)
3. Get URL: `https://university-portal.vercel.app`

---

### Option B: Deploy to Netlify

#### 1. Build Frontend Locally
```bash
cd frontend
npm install
npm run build
```

#### 2. Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### 3. Configure Environment
In Netlify → Site settings → Environment variables:
```
VITE_API_URL=https://university-portal-backend.onrender.com/api
```

---

## Part 4: Post-Deployment Configuration

### 1. Update Backend CORS

Edit `backend/server.js` CORS configuration:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://university-portal.vercel.app', // Add your production URL
  ],
  credentials: true,
};
```

Redeploy backend after this change.

### 2. Test API Connection

Visit: `https://university-portal-backend.onrender.com/api/health`

Should return:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Test Frontend

Visit your frontend URL and try logging in with demo credentials:

**Admin:**
- Email: `admin@university.edu`
- Password: `Admin@123`

**Faculty:**
- Email: `john.doe@university.edu`
- Password: `Faculty@123`

**Student:**
- Email: `alice.kumar@student.edu`
- Password: `Student@123`

---

## Part 5: Custom Domain Setup (Optional)

### For Frontend (Vercel)

1. Buy domain from Namecheap/GoDaddy
2. In Vercel → Settings → Domains
3. Add your custom domain (e.g., `portal.university.edu`)
4. Add DNS records in domain provider:
   ```
   Type: CNAME
   Name: portal
   Value: cname.vercel-dns.com
   ```
5. Wait for DNS propagation (up to 48 hours)

### For Backend (Render)

1. In Render → Settings → Custom Domain
2. Add custom domain (e.g., `api.university.edu`)
3. Add DNS records:
   ```
   Type: CNAME
   Name: api
   Value: <your-app>.onrender.com
   ```

---

## Part 6: SSL/HTTPS Configuration

Both Vercel and Render automatically provide free SSL certificates via Let's Encrypt. No manual configuration needed.

---

## Part 7: Monitoring and Maintenance

### 1. Setup Logging

Both backend services log to console by default. For production:

**Render:**
- View logs in Render dashboard → Logs tab
- Set up log drains to external services (optional)

**Vercel:**
- View function logs in Vercel dashboard
- Integrate with Sentry for error tracking

### 2. Database Backups

**MongoDB Atlas:**
- Free tier: Automatic snapshots every 24 hours
- Retention: 2 days
- Manual backups: Cluster → Backup tab

### 3. Performance Monitoring

1. **Backend:** Use Render metrics dashboard
2. **Frontend:** Use Vercel Analytics (free tier)
3. **Database:** MongoDB Atlas metrics and alerts

### 4. Setup Alerts

**MongoDB Atlas:**
- Go to Alerts
- Create alert for:
  - High CPU usage (>80%)
  - Low storage space (<20%)
  - Connection spike

**Render:**
- Setup email notifications for deployment failures

---

## Part 8: Scaling Considerations

### When to Upgrade

**Free Tier Limitations:**
- Render: Spins down after 15 min inactivity (cold starts)
- Vercel: 100 GB bandwidth/month
- MongoDB Atlas: 512 MB storage

**Upgrade Triggers:**
- >500 active users
- >50 GB data storage
- Need for 24/7 uptime
- Custom domain requirements

### Upgrade Path

1. **Render:** $7/month (always-on)
2. **Vercel:** $20/month (Pro plan)
3. **MongoDB Atlas:** $9/month (M2 tier - 2GB storage)

**Estimated cost for 1000 users:** ~$36/month

---

## Part 9: CI/CD Pipeline (Optional)

### GitHub Actions for Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

Add secrets in GitHub → Settings → Secrets.

---

## Part 10: Troubleshooting

### Common Issues

#### 1. Backend doesn't connect to MongoDB
- Check MongoDB Atlas network access (IP whitelist)
- Verify connection string format
- Check username/password

#### 2. Frontend can't reach backend
- Check CORS configuration
- Verify API_BASE_URL in frontend
- Check backend deployment logs

#### 3. 502 Bad Gateway
- Backend crashed - check logs
- Database connection failed
- Out of memory (upgrade plan)

#### 4. Files not uploading
- Check multer configuration
- Verify file size limits
- Check disk space on server

#### 5. Email not sending
- Verify Gmail app password
- Check SMTP settings
- Enable "Less secure app access" (if needed)

### Debug Commands

```bash
# Test MongoDB connection
mongo "mongodb+srv://..." --username university_admin

# Test backend locally with production DB
MONGO_URI=<prod_connection> npm run dev

# Check backend health
curl https://university-portal-backend.onrender.com/api/health

# View Render logs
render logs <service-id> --tail

# View Vercel logs
vercel logs <deployment-url>
```

---

## Part 11: Security Checklist

- [ ] Environment variables set correctly (no hardcoded secrets)
- [ ] HTTPS enabled (auto with Vercel/Render)
- [ ] CORS configured with specific origins
- [ ] Rate limiting enabled (already in code)
- [ ] MongoDB authentication enabled
- [ ] Strong JWT secrets (32+ characters)
- [ ] File upload validation (type, size)
- [ ] Input sanitization (express-validator)
- [ ] Password hashing (bcrypt)
- [ ] Email verification required
- [ ] XSS protection (Helmet middleware)
- [ ] CSRF protection for state-changing operations

---

## Part 12: Backup and Recovery

### 1. Database Backup

```bash
# Manual backup from MongoDB Atlas
mongodump --uri="mongodb+srv://..." --out=./backup

# Restore
mongorestore --uri="mongodb+srv://..." ./backup
```

### 2. Code Backup

All code in GitHub - already backed up.

### 3. User Files Backup

For production, use cloud storage:
- AWS S3
- Cloudinary (for images)
- Google Cloud Storage

Update multer config to upload directly to cloud.

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with proper permissions
- [ ] Connection string obtained and tested
- [ ] Backend code pushed to GitHub
- [ ] Backend deployed to Render/Railway/Heroku
- [ ] Environment variables set on backend
- [ ] Database seeded with initial data
- [ ] Backend health endpoint tested
- [ ] Frontend code pushed to GitHub
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Environment variables set on frontend
- [ ] CORS updated with production URLs
- [ ] Frontend-backend connection tested
- [ ] Login tested with demo accounts
- [ ] All role dashboards tested
- [ ] File upload tested (if applicable)
- [ ] Email notifications tested
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate verified
- [ ] Error monitoring setup (optional)
- [ ] Analytics setup (optional)
- [ ] Documentation updated with live URLs

---

## Production URLs (Update after deployment)

- **Frontend:** `https://your-app.vercel.app`
- **Backend API:** `https://your-app.onrender.com/api`
- **API Documentation:** `https://your-app.onrender.com/api/docs`

---

## Support and Maintenance

### Regular Tasks

- **Weekly:** Check error logs, monitor performance
- **Monthly:** Review database size, check backup integrity
- **Quarterly:** Update dependencies, security audit
- **Yearly:** Review hosting costs, consider upgrades

### Emergency Contacts

- **MongoDB Support:** https://support.mongodb.com
- **Render Support:** https://render.com/docs
- **Vercel Support:** https://vercel.com/support

---

## Cost Summary (Production)

| Service | Free Tier | Paid Plan | Recommended |
|---------|-----------|-----------|-------------|
| MongoDB Atlas | 512 MB | $9/mo (2GB) | Paid after 100 students |
| Render (Backend) | Sleep after 15 min | $7/mo (always-on) | Paid for production |
| Vercel (Frontend) | 100 GB bandwidth | $20/mo (Pro) | Free for <10k users |
| Domain | - | $12/year | Optional |
| **Total** | $0/mo | $36/mo + $12/year | Scales with usage |

---

## Next Steps After Deployment

1. Share demo credentials with stakeholders
2. Collect feedback from test users
3. Monitor performance for first week
4. Implement additional features based on feedback
5. Setup automated testing (Jest, Cypress)
6. Create user documentation/manual
7. Plan for mobile app version
8. Consider advanced features (real-time chat, video calls)
