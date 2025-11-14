# ⚡ Quick Deploy Guide - Get Online in 15 Minutes!

## 🎯 Fastest Way to Deploy (Recommended)

### **Step 1: MongoDB Atlas (3 minutes)**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up → Create FREE cluster
3. Database Access → Add user (save username/password!)
4. Network Access → Allow 0.0.0.0/0
5. Copy connection string from "Connect" button

### **Step 2: Deploy Backend on Render (5 minutes)**
1. Go to: https://render.com/
2. Sign in with GitHub
3. New + → Web Service
4. Connect `University_Web_Portal` repo
5. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-with-command-below>
   CORS_ORIGIN=*
   ```
7. Click "Create Web Service"
8. **COPY YOUR BACKEND URL** (e.g., https://xxx.onrender.com)

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Step 3: Deploy Frontend on Vercel (5 minutes)**
1. Go to: https://vercel.com/
2. Sign in with GitHub
3. New Project → Import `University_Web_Portal`
4. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=<your-render-backend-url>/api
   ```
6. Click "Deploy"
7. **DONE!** Your site is live! 🎉

---

## 🔗 Your Live URLs

After deployment, you'll have:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Database**: MongoDB Atlas cluster

---

## ⚠️ Important: Update CORS After Frontend Deploys

1. Go to Render Dashboard
2. Find your backend service
3. Environment → Edit `CORS_ORIGIN`
4. Change from `*` to: `https://your-project.vercel.app`
5. Save Changes

---

## 🧪 Test Your Deployment

1. Visit your Vercel URL
2. Register a new account
3. Login
4. Try all features

---

## 💰 100% FREE - No Credit Card Needed!

- ✅ MongoDB Atlas: 512MB free forever
- ✅ Render: 750 hours/month free
- ✅ Vercel: Unlimited projects free

---

## 🚨 Common Issues & Fixes

### "Backend not responding"
- Wait 30 seconds (Render cold start)
- Check backend logs in Render dashboard

### "Can't connect to database"
- Verify MongoDB connection string
- Check if IP whitelist is 0.0.0.0/0

### "CORS error"
- Update CORS_ORIGIN in Render to your Vercel URL
- Redeploy backend after change

---

## 🎓 You're Live! Share Your Project!

Your University Portal is now online and accessible worldwide! 🌍

**Share your links:**
- Frontend: `https://your-project.vercel.app`
- Backend API: `https://your-backend.onrender.com/api`

---

Need detailed instructions? Check **DEPLOYMENT_GUIDE.md**
