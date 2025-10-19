# 🚀 Render Deployment Guide - Murder Mystery App

## ✅ Pre-Deployment Checklist

Your app is now ready for Render deployment! Here's what we've accomplished:

- ✅ **Removed Docker complexity** - No more Dockerfile or docker-compose.yml
- ✅ **Updated package.json** - Added Prisma generation to build process
- ✅ **Optimized render.yaml** - Native Node.js deployment configuration
- ✅ **Tested local build** - Confirmed everything works without Docker

## 🎯 Render Deployment Steps

### 1. **Connect GitHub Repository**
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Blueprint"
3. Connect your GitHub account
4. Select your `murder_mystery` repository

### 2. **Deploy with Blueprint**
1. Render will automatically detect your `render.yaml`
2. Click "Apply" to create all services
3. This will create:
   - **Web Service**: Next.js app
   - **Worker Service**: Email processing
   - **Cron Service**: Daily tasks
   - **PostgreSQL Database**: Guest data
   - **Redis Database**: Caching

### 3. **Set Environment Variables**
In the Render dashboard, add these environment variables:

#### Required Variables:
```
RESEND_API_KEY=your_resend_api_key_here
```

#### Optional Variables (already set in render.yaml):
```
RSVP_DEADLINE=2025-10-31
EMAIL_FROM=Dark Lotus <noreply@saveoj.us>
MAX_GUESTS=50
RATE_LIMIT_PER_MINUTE=5
RATE_LIMIT_PER_DAY=100
```

### 4. **Database Setup**
1. Render will automatically create the PostgreSQL database
2. The database will be populated when the app first runs
3. Prisma will handle schema migrations automatically

## 🔧 Services Overview

### **Web Service** (`black-lotus-web`)
- **Runtime**: Node.js
- **Build**: `npm install && npm run build`
- **Start**: `npm start`
- **Health Check**: `/api/health`
- **URL**: `https://black-lotus-web.onrender.com`

### **Worker Service** (`black-lotus-worker`)
- **Runtime**: Node.js
- **Build**: `npm install`
- **Start**: `npm run worker:start`
- **Purpose**: Email queue processing

### **Cron Service** (`black-lotus-cron`)
- **Schedule**: Daily at 9 AM PT
- **Command**: `npm run cron:daily`
- **Purpose**: Daily maintenance tasks

### **Database** (`black-lotus-db`)
- **Type**: PostgreSQL
- **Plan**: Starter (1GB storage)
- **Auto-backups**: Yes

### **Redis** (`black-lotus-kv`)
- **Type**: Redis
- **Plan**: Starter
- **Purpose**: Caching and session storage

## 📊 Cost Breakdown

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Web Service | Starter | $7 |
| Worker Service | Starter | $7 |
| Cron Service | Starter | $7 |
| PostgreSQL | Starter | $7 |
| Redis | Starter | $7 |
| **Total** | | **$35/month** |

## 🚀 Post-Deployment

### 1. **Test Your App**
- Visit your web service URL
- Test the RSVP form
- Check admin panel functionality
- Verify email sending

### 2. **Custom Domain** (Optional)
- Add your custom domain in Render dashboard
- Update DNS records
- SSL certificates are automatic

### 3. **Monitoring**
- View logs in Render dashboard
- Monitor performance metrics
- Set up alerts for errors

## 🔍 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json

2. **Database Connection Issues**
   - Verify DATABASE_URL is set correctly
   - Check database service status

3. **Email Not Sending**
   - Verify RESEND_API_KEY is set
   - Check worker service logs

4. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly

## 📞 Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Render Support**: Available in dashboard
- **Your App Logs**: Available in each service dashboard

---

## 🎉 You're Ready to Deploy!

Your murder mystery app is now optimized for Render deployment. The native Node.js setup will be faster, simpler, and more reliable than the Docker approach.

**Next Step**: Go to [render.com](https://render.com) and deploy your app! 🚀
