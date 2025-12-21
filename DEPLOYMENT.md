# Deployment Guide - Render.com

This guide will help you deploy the Srigandha Kannada Koota CMS to Render.com.

## Prerequisites

✅ GitHub repository: https://github.com/Nitinkaroshi/srigandha.git
✅ Render.com account (free tier works)
✅ MongoDB Atlas account (free tier works)

---

## Part 1: Deploy Backend API (Server)

### Step 1: Create Web Service on Render

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect Account"** to connect GitHub (if not already connected)
4. Find and select your repository: `Nitinkaroshi/srigandha`
5. Click **"Connect"**

### Step 2: Configure Backend Service

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `srigandha-api` |
| **Region** | Choose closest to your users (e.g., Oregon USA) |
| **Branch** | `main` or `master` |
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long_here
CLIENT_URL=https://srigandha-web.onrender.com
```

**For MONGODB_URI:**
1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Add it as environment variable:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/srigandha?retryWrites=true&w=majority
```

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment to complete (3-5 minutes)
3. You'll see: ✅ **Deploy successful**
4. **Copy your backend URL** (e.g., `https://srigandha-api.onrender.com`)
   - You'll need this for frontend deployment!

---

## Part 2: Deploy Frontend (Client)

### Step 1: Create Static Site on Render

1. Go back to https://dashboard.render.com/
2. Click **"New +"** → **"Static Site"**
3. Select your repository: `Nitinkaroshi/srigandha`
4. Click **"Connect"**

### Step 2: Configure Frontend Service

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `srigandha-web` |
| **Branch** | `main` or `master` |
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

**IMPORTANT:** Replace `YOUR_BACKEND_URL` with your actual backend URL from Part 1!

```
VITE_API_URL=https://srigandha-api.onrender.com/api
VITE_BASE_URL=https://srigandha-api.onrender.com
```

Example:
- If your backend URL is `https://srigandha-api-xyz.onrender.com`
- Then set `VITE_API_URL` to `https://srigandha-api-xyz.onrender.com/api`
- And set `VITE_BASE_URL` to `https://srigandha-api-xyz.onrender.com`

### Step 4: Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment to complete (3-5 minutes)
3. You'll see: ✅ **Deploy successful**
4. Your site is now live! (e.g., `https://srigandha-web.onrender.com`)

---

## Part 3: Update Backend CORS

After frontend deployment, update the backend's `CLIENT_URL`:

1. Go to your **Backend Service** on Render
2. Click **"Environment"** tab
3. Find `CLIENT_URL` variable
4. Update it with your **actual frontend URL**: `https://srigandha-web.onrender.com`
5. Click **"Save Changes"**
6. Service will automatically redeploy

---

## Part 4: Initialize Database

### Step 1: Access Backend Shell

1. Go to your **Backend Service** on Render
2. Click **"Shell"** tab (top right)
3. Wait for shell to connect

### Step 2: Run Initialization Script

In the shell, run:
```bash
node initializeData.js
```

Wait for completion. You should see:
```
✅ DATABASE INITIALIZATION COMPLETE!
📊 Summary:
   - Site Settings: Initialized
   - Pages: 2 (Home page created)
   - Carousel: 0 slides (Upload images via admin)
   - Committee Members: 39
```

---

## Part 5: Create Admin Account

### Option 1: Register via Frontend (Recommended)

1. Visit your deployed site: `https://srigandha-web.onrender.com`
2. Click **"Login"** → **"Register"**
3. Fill in registration form:
   - Name: Your Name
   - Email: admin@srigandhafl.org
   - Password: (choose a strong password)
4. Click **"Register"**

### Option 2: Manually Set Admin Role in MongoDB

After registering:

1. Go to MongoDB Atlas
2. Click **"Browse Collections"**
3. Find `srigandha` database → `users` collection
4. Find your user document
5. Click **"Edit Document"**
6. Change `"role": "user"` to `"role": "admin"`
7. Click **"Update"**

### Step 3: Login as Admin

1. Go to `https://srigandha-web.onrender.com/login`
2. Enter your credentials
3. After login, you'll be redirected to admin dashboard
4. Access admin panel at: `https://srigandha-web.onrender.com/admin`

---

## Part 6: Upload Content

### 1. Upload Carousel Images

1. Go to **Admin → Carousel**
2. Click **"Add New Slide"**
3. Upload images with titles and captions
4. Make sure "Active" is checked
5. Visit homepage to see carousel

### 2. Create Events

1. Go to **Admin → Events**
2. Click **"Add New Event"**
3. Fill in event details and upload image
4. Publish event

### 3. Create Gallery Albums

1. Go to **Admin → Gallery**
2. Click **"Add New Gallery"**
3. Enter event title (e.g., "Ugadi Celebration 2024")
4. Select event date
5. Upload multiple images
6. Optionally add YouTube video links
7. Click **"Create Gallery"**

---

## Important Notes

### ⚠️ Free Tier Limitations

**Render Free Tier:**
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- **Uploaded files are LOST** on service restart/redeploy

**Solutions:**
1. **For images:** Use external storage:
   - Cloudinary (free tier: 25GB)
   - AWS S3
   - Google Cloud Storage

2. **Keep service awake:** Use a ping service:
   - UptimeRobot (pings every 5 minutes)
   - cron-job.org

### 🔒 Security Checklist

✅ Change default JWT_SECRET to something unique
✅ Use strong password for admin account
✅ Enable MongoDB IP whitelist (add Render's IPs)
✅ Never commit `.env` files to GitHub
✅ Regularly backup MongoDB database

---

## Troubleshooting

### Backend won't start

**Check Logs:**
1. Go to backend service
2. Click **"Logs"** tab
3. Look for error messages

**Common Issues:**
- ❌ MongoDB connection error → Check MONGODB_URI
- ❌ JWT secret missing → Add JWT_SECRET env variable
- ❌ Port error → Ensure PORT=5000 is set

### Frontend can't connect to backend

**Check:**
1. Is VITE_API_URL correct? (should end with `/api`)
2. Is backend deployed and running?
3. Is CLIENT_URL set in backend?
4. Check browser console for CORS errors

### Images not loading

**Check:**
1. Are images uploaded via admin panel?
2. Check browser console for 404 errors
3. Verify VITE_BASE_URL is correct
4. Remember: Free tier loses files on restart!

### Carousel not showing

**Check:**
1. Are carousel slides uploaded and active?
2. Check browser console for errors
3. Visit `/admin/carousel` to verify slides exist
4. Ensure at least 1 slide has `isActive: true`

---

## Custom Domain (Optional)

To use your own domain (e.g., www.srigandhafl.org):

### Frontend (Static Site)
1. Go to frontend service → **"Settings"**
2. Click **"Custom Domain"**
3. Add your domain
4. Follow DNS configuration instructions

### Backend (Web Service)
1. Upgrade to paid plan (custom domains not available on free tier)
2. Or use subdomain like `api.srigandhafl.org`

---

## Monitoring & Maintenance

### Check Service Health
- Render Dashboard shows service status
- Set up email alerts in Render settings

### Database Backups
1. MongoDB Atlas auto-backs up daily (free tier)
2. Manual backup: Atlas → Cluster → "⋯" → "Download Backup"

### Update Code
1. Push changes to GitHub
2. Render auto-deploys on push (if enabled)
3. Or click **"Manual Deploy"** → **"Deploy latest commit"**

---

## Support

If you encounter issues:

1. Check logs in Render dashboard
2. Verify all environment variables are set
3. Test API endpoints using Postman
4. Check MongoDB connection in Atlas

---

## Quick Reference

### Your Deployment URLs

**Frontend:** `https://srigandha-web.onrender.com`
**Backend API:** `https://srigandha-api.onrender.com`
**Admin Panel:** `https://srigandha-web.onrender.com/admin`

### Important Environment Variables

**Backend (`server`):**
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
CLIENT_URL=https://your-frontend-url.onrender.com
```

**Frontend (`client`):**
```bash
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_BASE_URL=https://your-backend-url.onrender.com
```

---

**🎉 Congratulations! Your site is now live!**
