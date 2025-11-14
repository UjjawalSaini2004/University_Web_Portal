# 🚀 Deployment Guide - University Portal

This guide will help you deploy your University Portal application online for **FREE**.

## 📋 Prerequisites

- [x] GitHub account (You already have this!)
- [x] Code pushed to GitHub (Done! ✅)
- [ ] MongoDB Atlas account
- [ ] Vercel account
- [ ] Render account

---

## 🎯 Recommended Setup: Vercel + Render + MongoDB Atlas

### **Step 1: Setup MongoDB Atlas (Database)**

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a **FREE** cluster (M0 Sandbox - 512MB)
4. Click **"Create"** and wait 3-5 minutes

#### Configure Database Access:
1. Go to **"Database Access"** → **"Add New Database User"**
2. Create username and password (save these!)
3. Set **"Built-in Role"** to **"Read and write to any database"**

#### Configure Network Access:
1. Go to **"Network Access"** → **"Add IP Address"**
2. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
3. Click **"Confirm"**

#### Get Connection String:
1. Go to **"Database"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/university_portal?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your actual credentials

---

### **Step 2: Deploy Backend (Render)**

1. Go to https://render.com/
2. Sign up with **GitHub**
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub account and select **"University_Web_Portal"** repository

#### Configure Web Service:
```
Name: university-portal-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

#### Add Environment Variables:
Click **"Advanced"** → **"Add Environment Variable"**

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=<paste-your-mongodb-atlas-connection-string>
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
CORS_ORIGIN=*
```

5. Click **"Create Web Service"**
6. Wait 5-10 minutes for deployment
7. Copy your backend URL (e.g., `https://university-portal-backend.onrender.com`)

---

### **Step 3: Deploy Frontend (Vercel)**

1. Go to https://vercel.com/
2. Sign up with **GitHub**
3. Click **"Add New..."** → **"Project"**
4. Import **"University_Web_Portal"** repository

#### Configure Project:
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### Add Environment Variables:
```bash
VITE_API_URL=https://university-portal-backend.onrender.com/api
```
*(Replace with your actual Render backend URL)*

5. Click **"Deploy"**
6. Wait 2-3 minutes
7. Your site will be live at `https://your-project-name.vercel.app`

---

## 🔧 Post-Deployment Configuration

### Update Backend CORS:
After frontend is deployed, update Render backend environment variable:
```bash
CORS_ORIGIN=https://your-project-name.vercel.app
```

### Update Frontend API URL:
Already done in Step 3! ✅

### Test Your Deployment:
1. Visit your Vercel URL
2. Try registering a new user
3. Login with super admin credentials
4. Test all features

---

## 🎉 Alternative Free Options

### **Option 2: Railway** (All-in-One)
- Frontend + Backend + Database in one place
- Free tier: $5 credit/month
- https://railway.app/

### **Option 3: Netlify + Render**
- Similar to Vercel + Render
- https://www.netlify.com/

### **Option 4: Heroku** (No longer free)
- Was popular but now requires payment

---

## 📊 Free Tier Limits

| Service | Free Tier Limits |
|---------|-----------------|
| **MongoDB Atlas** | 512MB storage, Unlimited connections |
| **Render** | 750 hours/month, Sleeps after 15 min inactivity |
| **Vercel** | 100GB bandwidth/month, Unlimited projects |
| **Railway** | $5 credit/month (~500 hours) |

---

## ⚠️ Important Notes

### Render Free Tier:
- **Spins down after 15 minutes of inactivity**
- First request after sleep takes 30-50 seconds
- Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your backend every 14 minutes to keep it awake

### MongoDB Atlas:
- Free cluster pauses after 60 days of inactivity
- Maximum 512MB storage
- Good enough for development/testing

### Vercel:
- Excellent for frontend
- Fast CDN and automatic SSL
- Free custom domains

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update CORS_ORIGIN to your frontend URL
- [ ] Never commit .env files to GitHub
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB Atlas IP whitelist (if needed)
- [ ] Set up proper user authentication
- [ ] Configure file upload limits

---

## 🆘 Troubleshooting

### Backend not responding:
1. Check Render logs
2. Verify MongoDB connection string
3. Check environment variables
4. Wait 30 seconds after first request (cold start)

### Frontend can't connect to backend:
1. Verify VITE_API_URL is correct
2. Check CORS settings on backend
3. Ensure backend is deployed and running
4. Check browser console for errors

### Database connection failed:
1. Verify MongoDB Atlas credentials
2. Check IP whitelist (should be 0.0.0.0/0)
3. Ensure connection string is correct
4. Check if cluster is active

---

## 📝 Quick Commands

### Generate Strong JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Backend API:
```bash
curl https://your-backend-url.onrender.com/api/health
```

### Check Logs:
- **Render**: Dashboard → Your Service → Logs
- **Vercel**: Dashboard → Your Project → Deployments → View Function Logs

---

## 🎓 Next Steps

1. **Custom Domain**: Add your own domain to Vercel (free)
2. **Monitoring**: Set up UptimeRobot to monitor your backend
3. **Analytics**: Add Vercel Analytics (free)
4. **Performance**: Optimize images and bundle size
5. **SEO**: Add meta tags and sitemap

---

## 💡 Cost-Effective Upgrades (When Needed)

If you outgrow free tiers:
- **Backend**: Railway ($5-10/month) or DigitalOcean ($5/month)
- **Database**: MongoDB Atlas Shared Cluster ($9/month)
- **Frontend**: Vercel Pro ($20/month) - but free is usually enough!

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.atlas.mongodb.com/

---

**🎉 Congratulations! Your University Portal is now live online!**

Visit: `https://your-project-name.vercel.app`
