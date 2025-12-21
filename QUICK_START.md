# 🚀 Quick Start Guide - Deploy in 15 Minutes

## 📋 Prerequisites Checklist

- [ ] GitHub account with code pushed
- [ ] Render.com account (free)
- [ ] MongoDB Atlas account (free)
- [ ] Gmail account for alerts

---

## Step 1: Deploy Backend (5 min)

1. Go to https://dashboard.render.com/
2. Click **New +** → **Web Service**
3. Connect repository: `Nitinkaroshi/srigandha`
4. Configure:
   - Name: `srigandha-api`
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `npm start`
   - Free plan

5. **Add Environment Variables:**

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=create_random_32_character_secret_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/srigandha?retryWrites=true&w=majority

# Get these from Gmail App Password settings
ALERT_EMAIL=your-email@gmail.com
ALERT_EMAIL_PASSWORD=your-16-char-app-password
ALERT_RECIPIENT=your-email@gmail.com
```

6. Click **Create Web Service**
7. 📝 **Copy your backend URL** (e.g., https://srigandha-api.onrender.com)

---

## Step 2: Setup Gmail Alerts (2 min)

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Scroll to **App passwords**
4. Create app password for "Mail" → "Srigandha CMS"
5. Copy the 16-character password
6. Add to Render environment variables above

---

## Step 3: Deploy Frontend (5 min)

1. Click **New +** → **Static Site**
2. Connect same repository
3. Configure:
   - Name: `srigandha-web`
   - Root Directory: `client`
   - Build: `npm install && npm run build`
   - Publish: `dist`

4. **Add Environment Variables:**
```env
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
VITE_BASE_URL=https://YOUR-BACKEND-URL.onrender.com
```

5. Click **Create Static Site**

---

## Step 4: Update Backend CORS (1 min)

1. Go to backend service → **Environment**
2. Update `CLIENT_URL` to your frontend URL
3. Save (auto-redeploys)

---

## Step 5: Initialize Database (2 min)

1. Backend service → **Shell** tab
2. Run: `node initializeData.js`
3. Wait for success message

---

## Step 6: Create Admin (1 min)

1. Visit your site
2. Register new account
3. Go to MongoDB Atlas → Find user → Change role to "admin"
4. Login again - now you're admin!

---

## ✅ Verification Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Database initialized
- [ ] Admin account created
- [ ] Can login to admin panel
- [ ] Received "Server Restarted" email
- [ ] Can upload carousel images
- [ ] Images display on homepage

---

## 🎯 Next Steps

1. Upload carousel images
2. Create events
3. Add gallery albums
4. Setup UptimeRobot (keep server awake)
5. Test email alerts

---

## 📚 Full Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) - Auto-restart & email alerts
- [README.md](README.md) - Project overview

---

## 🆘 Quick Troubleshooting

**Backend won't start:**
- Check MONGODB_URI is correct
- Verify JWT_SECRET is set
- Check Render logs

**Frontend can't connect:**
- Verify VITE_API_URL matches backend URL
- Check CLIENT_URL in backend
- Look for CORS errors in browser

**No email alerts:**
- Confirm NODE_ENV=production
- Verify Gmail app password is correct
- Check all 3 email variables are set

---

**Need help?** Check the full guides linked above or Render support.
