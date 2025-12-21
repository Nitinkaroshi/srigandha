# Production Setup Guide - 24/7 Uptime & Email Alerts

This guide covers production-ready configurations for automatic server restarts and email notifications.

---

## 📧 Email Alert Setup

### Step 1: Create Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** (if not already enabled)
4. Scroll down to **2-Step Verification** section
5. Click **App passwords** at the bottom
6. Select **Mail** and **Other (Custom name)**
7. Enter name: "Srigandha CMS Alerts"
8. Click **Generate**
9. **Copy the 16-character password** (save it securely)

### Step 2: Add Email Environment Variables

Add these to your **Backend Service** on Render:

```env
# Email Alert Configuration
ALERT_EMAIL=your-email@gmail.com
ALERT_EMAIL_PASSWORD=your-16-char-app-password
ALERT_RECIPIENT=your-email@gmail.com
```

**Example:**
```env
ALERT_EMAIL=admin@srigandhafl.org
ALERT_EMAIL_PASSWORD=abcd efgh ijkl mnop
ALERT_RECIPIENT=admin@srigandhafl.org
```

---

## 🔄 Auto-Restart Configuration

### Option 1: Render Built-in (Recommended for Free Tier)

Render automatically restarts your service if it crashes. No extra configuration needed!

**Features:**
- ✅ Automatic restart on crash
- ✅ Zero configuration
- ✅ Works on free tier
- ⚠️ Service still sleeps after 15 min inactivity (free tier)

### Option 2: PM2 Process Manager (For Paid Tier)

If you upgrade to a paid Render plan, you can use PM2 for advanced features.

**Update Render Start Command:**
```bash
npm run start:pm2
```

**PM2 Features:**
- ✅ Cluster mode (multiple instances)
- ✅ Automatic restart on crash
- ✅ Memory limit restart
- ✅ Log management
- ✅ Process monitoring

**PM2 Commands (via Render Shell):**
```bash
# View logs
npm run logs:pm2

# Restart manually
npm run restart:pm2

# Stop server
npm run stop:pm2
```

---

## 🚨 Email Alert Types

Your server will automatically send emails for:

### 1. Server Errors
- **When:** API errors occur
- **Contains:** Error message, stack trace, endpoint, user ID
- **Subject:** "🚨 Srigandha API Error Alert"

### 2. Server Restarts
- **When:** Server restarts (auto or manual)
- **Contains:** Timestamp, status
- **Subject:** "🔄 Server Restarted - Srigandha API"

### 3. Critical Alerts
- **When:** Unhandled errors, crashes
- **Contains:** Error details, requires immediate action
- **Subject:** "⚠️ CRITICAL: [Error Type]"

---

## 🔧 Testing Email Alerts

### Test in Development (Local)

1. Update `server/.env`:
```env
NODE_ENV=production
ALERT_EMAIL=your-email@gmail.com
ALERT_EMAIL_PASSWORD=your-app-password
ALERT_RECIPIENT=your-email@gmail.com
```

2. Start server:
```bash
cd server
npm start
```

3. Check email - you should receive "Server Restarted" notification

4. Test error alert - create an error in code temporarily:
```javascript
// In any route file
router.get('/test-error', (req, res) => {
  throw new Error('Test error for email alert');
});
```

5. Visit: `http://localhost:5000/api/test-error`
6. Check email for error alert

### Test in Production (Render)

1. Add email env variables to Render
2. Deploy your service
3. Check email for restart notification
4. Force an error to test error alerts

---

## 📊 Monitoring & Logs

### View Logs in Render

1. Go to your Backend Service
2. Click **"Logs"** tab
3. See real-time logs including:
   - Server starts/restarts
   - API requests
   - Errors
   - Email alert confirmations

### Log Retention

**Render Free Tier:**
- Logs: Last 7 days
- **Solution:** Email alerts ensure you're notified immediately

**Render Paid Tier:**
- Logs: Longer retention (check plan details)
- Can export logs

---

## 🔐 Security Best Practices

### 1. Use App Password (Not Your Gmail Password!)
- ✅ DO: Use 16-character app password
- ❌ DON'T: Use your actual Gmail password

### 2. Separate Alert Email (Optional but Recommended)
Create a dedicated Gmail account for alerts:
- alerts@srigandhafl.org
- This keeps your main inbox clean

### 3. Multiple Recipients
To send alerts to multiple people:
```env
ALERT_RECIPIENT=admin@example.com,tech@example.com,manager@example.com
```

---

## ⚙️ Environment Variables Reference

### Backend Environment Variables

```env
# Required
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
CLIENT_URL=https://your-frontend.onrender.com

# Email Alerts (Optional but Recommended)
ALERT_EMAIL=your-email@gmail.com
ALERT_EMAIL_PASSWORD=your-app-password
ALERT_RECIPIENT=your-email@gmail.com
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] MongoDB password changed (after security leak)
- [ ] All environment variables set in Render
- [ ] Email alerts configured (ALERT_EMAIL, ALERT_EMAIL_PASSWORD, ALERT_RECIPIENT)
- [ ] NODE_ENV set to "production"
- [ ] CLIENT_URL pointing to actual frontend URL
- [ ] Test email alerts locally
- [ ] Deploy backend service
- [ ] Deploy frontend service
- [ ] Verify services are running
- [ ] Check email for restart notification
- [ ] Test API endpoints
- [ ] Upload content via admin panel

---

## 🔄 Keeping Server Awake (Free Tier)

Render free tier sleeps after 15 minutes of inactivity. Solutions:

### Option 1: UptimeRobot (Recommended - Free)

1. Sign up at https://uptimerobot.com (free)
2. Add new monitor:
   - Monitor Type: HTTP(s)
   - URL: `https://your-backend.onrender.com/api`
   - Monitoring Interval: 5 minutes
3. Done! Server stays awake

### Option 2: Cron-Job.org (Free)

1. Sign up at https://cron-job.org
2. Create new cron job:
   - URL: `https://your-backend.onrender.com/api`
   - Schedule: Every 5 minutes
3. Enable job

### Option 3: Upgrade to Paid Plan ($7/month)
- No sleep
- Persistent storage
- More resources
- Custom domains

---

## 📱 Advanced Monitoring (Optional)

### Slack Integration

1. Create Slack webhook
2. Add to environment variables:
```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

3. Update `errorMonitor.js` to send Slack alerts

### Third-Party Monitoring

Consider these services:
- **Better Uptime** - Free tier available
- **StatusCake** - Free monitoring
- **Pingdom** - Professional monitoring
- **Datadog** - Advanced monitoring (paid)

---

## 🐛 Troubleshooting

### Email Alerts Not Working

**Check:**
1. Is NODE_ENV set to "production"?
2. Are all three email env variables set?
3. Is the app password correct (16 characters)?
4. Check Render logs for email errors
5. Is Gmail account secure and active?

**Common Issues:**
- ❌ "Invalid credentials" → Check app password
- ❌ "No email sent" → NODE_ENV not "production"
- ❌ "Connection refused" → Gmail blocking, enable less secure apps

### Server Not Restarting

**Render Free Tier:**
- Server auto-restarts on crash (built-in)
- Check "Events" tab in Render for restart history

**PM2 (Paid Tier):**
```bash
# Check PM2 status
pm2 status

# View PM2 logs
pm2 logs

# Restart manually
pm2 restart srigandha-api
```

### High Memory Usage

If server crashes due to memory:

1. Check Render logs for memory errors
2. Optimize database queries
3. Add memory limit restart to PM2 config (already configured)
4. Consider upgrading Render plan

---

## 📈 Performance Tips

### 1. Database Indexing
Ensure MongoDB collections have proper indexes:
```javascript
// In your models
schema.index({ createdAt: -1 });
schema.index({ isPublished: 1 });
```

### 2. Response Caching
Add caching for frequently accessed data:
```javascript
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 }); // 10 min cache
```

### 3. Compression
Already enabled via Express compression middleware

### 4. Rate Limiting
Protect against abuse with rate limiting (already implemented)

---

## 📞 Support

If you need help:

1. Check Render logs first
2. Review email alerts
3. Check this documentation
4. Contact Render support
5. MongoDB Atlas support

---

## ✅ Success Criteria

Your production setup is successful when:

- [x] Server automatically restarts on crashes
- [x] Email alerts received for errors
- [x] Email alerts received on server restarts
- [x] Server stays awake (if using UptimeRobot)
- [x] Frontend can connect to backend
- [x] Admin panel accessible
- [x] File uploads working
- [x] Database connected
- [x] No errors in Render logs

---

**🎉 Your application is now production-ready with 24/7 monitoring!**
