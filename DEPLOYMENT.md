# 🚀 Deployment Guide - Serene Mind App

Complete step-by-step guide to deploy Serene Mind App to production with all features enabled.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ MongoDB Atlas account (free tier available)
- ✅ Google Cloud Console account (for OAuth)
- ✅ Email service account (Resend recommended - free tier)
- ✅ Vercel account (free tier available)
- ✅ Domain name (optional, Vercel provides free subdomain)

---

## 🗄️ Step 1: MongoDB Setup

### 1.1 Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new project: "Serene Mind"
3. Build a cluster (M0 Free tier is sufficient for development)
4. Choose your cloud provider and region
5. Create cluster (takes 3-5 minutes)

### 1.2 Configure Database Access

1. Go to **Database Access** → **Add New Database User**
2. Authentication Method: **Password**
3. Username: `serene-admin` (or your choice)
4. Generate a secure password and **save it**
5. Database User Privileges: **Atlas Admin** or **Read and write to any database**
6. Click **Add User**

### 1.3 Configure Network Access

1. Go to **Network Access** → **Add IP Address**
2. For development: Click **Allow Access from Anywhere** (0.0.0.0/0)
3. For production: Add Vercel's IP ranges or use "Allow from Anywhere"
4. Add description: "Vercel Deployment"

### 1.4 Get Connection String

1. Go to **Database** → **Connect** → **Connect your application**
2. Driver: **Node.js**, Version: **5.5 or later**
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your credentials
5. Add database name: `serene-mind`
   ```
   mongodb+srv://serene-admin:yourpassword@cluster0.xxxxx.mongodb.net/serene-mind?retryWrites=true&w=majority
   ```

### 1.5 Create Indexes (Optional but Recommended)

Connect to your database using MongoDB Compass or the shell, then run:

```javascript
// Tasks collection indexes
db.tasks.createIndex({ userId: 1, createdAt: -1 });
db.tasks.createIndex({ userId: 1, completed: 1 });

// Journal collection indexes
db.journal.createIndex({ userId: 1, createdAt: -1 });
db.journal.createIndex({ userId: 1, mood: 1 });
```

---

## 🔐 Step 2: Google OAuth Setup

### 2.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: "Serene Mind App"
3. Wait for project creation to complete

### 2.2 Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. User Type: **External** (unless you have Google Workspace)
3. Click **Create**
4. Fill in App Information:
   - **App name:** Serene Mind
   - **User support email:** your-email@gmail.com
   - **Developer contact:** your-email@gmail.com
5. Skip **Scopes** (default scopes are fine)
6. Add test users (your email) if in testing mode
7. Click **Save and Continue**

### 2.3 Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name: "Serene Mind Web App"
5. **Authorized redirect URIs** - Add both:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.vercel.app/api/auth/callback/google`
   - (Add your custom domain if you have one)
6. Click **Create**
7. Copy the **Client ID** and **Client Secret** → Save them securely

---

## 📧 Step 3: Email Service Setup (Resend)

### 3.1 Create Resend Account

1. Go to [Resend](https://resend.com)
2. Sign up with GitHub or email
3. Verify your email address

### 3.2 Get API Key

1. Go to **API Keys** in dashboard
2. Click **Create API Key**
3. Name: "Serene Mind Production"
4. Permission: **Sending access**
5. Copy the API key (starts with `re_`) → **Save it** (shown only once)

### 3.3 Verify Domain (Optional but Recommended)

For production, verify your domain to avoid spam filters:

1. Go to **Domains** → **Add Domain**
2. Enter your domain: `yourdomain.com`
3. Add the DNS records to your domain provider (TXT, MX, CNAME)
4. Wait for verification (can take up to 48 hours)

**For development/testing:** Use Resend's test mode with any email address.

### 3.4 Email Configuration Details

```env
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com  # Use your verified domain
```

**Alternative Email Services:**

- **SendGrid:** `smtp.sendgrid.net:587`
- **AWS SES:** `email-smtp.us-east-1.amazonaws.com:587`
- **Mailgun:** `smtp.mailgun.org:587`

---

## 🔔 Step 4: Web Push Notifications (VAPID Keys)

### 4.1 Generate VAPID Keys

Run this command locally:

```bash
npx web-push generate-vapid-keys
```

Output:
```
Public Key: BEL...your-public-key...xyz
Private Key: abc...your-private-key...123
```

### 4.2 Save Keys

Copy both keys to your environment variables:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BEL...your-public-key...xyz
VAPID_PRIVATE_KEY=abc...your-private-key...123
VAPID_SUBJECT=mailto:noreply@yourdomain.com
```

---

## 🔑 Step 5: Generate NextAuth Secret

Run this command locally:

```bash
openssl rand -base64 32
```

Copy the output to:

```env
NEXTAUTH_SECRET=your-generated-secret-here
```

---

## ☁️ Step 6: Vercel Deployment

### 6.1 Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for production deployment"

# Push to GitHub
git branch -M main
git remote add origin https://github.com/yourusername/serene-mind-app.git
git push -u origin main
```

### 6.2 Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

### 6.3 Add Environment Variables

In Vercel project settings → **Environment Variables**, add ALL variables from `.env.local.example`:

#### Database
```
MONGODB_URI = mongodb+srv://serene-admin:password@cluster.mongodb.net/serene-mind
MONGODB_DB = serene-mind
```

#### NextAuth
```
NEXTAUTH_SECRET = your-generated-secret-from-openssl
NEXTAUTH_URL = https://your-project.vercel.app
```

#### Google OAuth
```
GOOGLE_CLIENT_ID = your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = your-client-secret
```

#### Email Service
```
EMAIL_SERVER_HOST = smtp.resend.com
EMAIL_SERVER_PORT = 465
EMAIL_SERVER_USER = resend
EMAIL_SERVER_PASSWORD = re_your_resend_api_key
EMAIL_FROM = noreply@yourdomain.com
```

#### Push Notifications
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY = your-public-key
VAPID_PRIVATE_KEY = your-private-key
VAPID_SUBJECT = mailto:noreply@yourdomain.com
```

#### AI Service
```
GOOGLE_GENAI_API_KEY = your-google-ai-api-key
GENKIT_MODEL = gemini-2.0-flash
```

#### Node Environment
```
NODE_ENV = production
```

**Important:** Set all variables for **Production**, **Preview**, and **Development** environments.

### 6.4 Deploy

1. Click **Deploy**
2. Wait for build to complete (2-5 minutes)
3. You'll get a deployment URL: `https://your-project.vercel.app`

---

## 🔄 Step 7: Update OAuth Callback URLs

### 7.1 Update Google OAuth Console

1. Go back to [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Update **Authorized redirect URIs** with your Vercel URL:
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```
5. Save changes

### 7.2 Update NextAuth URL in Vercel

1. Go to Vercel project settings → **Environment Variables**
2. Update `NEXTAUTH_URL`:
   ```
   NEXTAUTH_URL = https://your-project.vercel.app
   ```
3. Redeploy the project

---

## ✅ Step 8: Post-Deployment Verification

### 8.1 Functionality Checklist

Test each feature in production:

- [ ] **Home Page Loads:** Visit your Vercel URL
- [ ] **Google OAuth Login:** Click "Sign in with Google"
- [ ] **Email Magic Link:** Try email authentication
- [ ] **Dashboard Access:** Verify protected routes work
- [ ] **Task Creation:** Create a new task
- [ ] **Journal Entry:** Create a journal entry
- [ ] **AI Insights:** Test AI-powered suggestions
- [ ] **PWA Install:** Test "Add to Home Screen"
- [ ] **Offline Mode:** Disable internet and verify offline page
- [ ] **Push Notifications:** Enable and test push notifications
- [ ] **Mobile Responsive:** Test on mobile device
- [ ] **iOS Safari:** Test PWA install on iPhone
- [ ] **Android Chrome:** Test PWA install on Android

### 8.2 Performance Checks

Run Lighthouse audit (Chrome DevTools):

```
Target Scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+
- PWA: 100 ✓
```

### 8.3 Monitor Logs

Check Vercel deployment logs:

1. Go to **Deployments** → Select latest deployment
2. Click **View Function Logs**
3. Look for errors or warnings
4. Monitor for 24 hours after deployment

### 8.4 Database Verification

Check MongoDB Atlas:

1. Go to **Database** → **Collections**
2. Verify collections are created:
   - `accounts`
   - `sessions`
   - `users`
   - `tasks`
   - `journal`
3. Check that data is being saved correctly

---

## 🌐 Step 9: Custom Domain (Optional)

### 9.1 Add Domain in Vercel

1. Go to project **Settings** → **Domains**
2. Add your custom domain: `sereneminds.app`
3. Follow DNS configuration instructions

### 9.2 Update OAuth Callbacks

Add custom domain to Google OAuth:

```
https://sereneminds.app/api/auth/callback/google
```

### 9.3 Update Environment Variables

```
NEXTAUTH_URL = https://sereneminds.app
EMAIL_FROM = noreply@sereneminds.app
VAPID_SUBJECT = mailto:noreply@sereneminds.app
```

---

## 🐛 Troubleshooting

### Google OAuth "redirect_uri_mismatch" Error

**Solution:** Ensure redirect URI in Google Console exactly matches:
```
https://your-domain.com/api/auth/callback/google
```
No trailing slash, exact protocol (https).

### Email Magic Link Not Sending

**Solution:**
1. Check Resend dashboard for failed sends
2. Verify `EMAIL_FROM` domain is verified
3. Check Vercel function logs for SMTP errors
4. Test with a different email provider

### Database Connection Timeout

**Solution:**
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Network Access allows Vercel IPs
3. Ensure database user has correct permissions
4. Test connection string with MongoDB Compass

### Push Notifications Not Working

**Solution:**
1. Verify VAPID keys are correct (public key starts with "B")
2. Check browser console for service worker errors
3. Ensure HTTPS is enabled (required for PWA)
4. Test on different browsers (Chrome, Safari)

### Build Fails on Vercel

**Solution:**
1. Check build logs for specific errors
2. Run `npm run build` locally first
3. Ensure all dependencies are in `package.json`
4. Check TypeScript errors: `npm run typecheck`

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Rotate secrets regularly** (every 90 days)
3. **Use different credentials** for development and production
4. **Enable 2FA** on all service accounts
5. **Monitor error logs** for suspicious activity
6. **Keep dependencies updated:** `npm audit` and `npm update`
7. **Use environment-specific secrets** in Vercel

### Rate Limiting (Built-in Protection)

The app includes built-in rate limiting to protect API routes from abuse:

**Current Limits:**
- **Tasks API:** 10 requests per 10 seconds per user/IP
- **Journal API:** 10 requests per 10 seconds per user/IP
- **Rewards API:** 5 requests per 10 seconds per user/IP

**How it works:**
- In-memory rate limiter (resets on deployment)
- Tracks by authenticated user ID or IP address
- Returns HTTP 429 when limit exceeded
- Includes `X-RateLimit-*` headers in responses

**Upgrade Path (Recommended for Production):**

For persistent rate limiting that survives deployments:

1. **Option A: Upstash Redis** (Recommended)
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```
   - Create free account at https://upstash.com
   - Get Redis URL and token
   - Add to environment variables
   - Update `src/lib/rate-limit.ts` to use Upstash

2. **Option B: Vercel KV**
   ```bash
   npm install @vercel/kv
   ```
   - Enable in Vercel project settings
   - Automatically configured
   - Update rate limiter to use KV

**Security Headers:**

The app automatically sets these security headers on all protected routes:
- `X-Request-ID`: Unique request identifier for tracking
- `X-Content-Type-Options: nosniff`: Prevents MIME sniffing
- `X-Frame-Options: DENY`: Prevents clickjacking
- `X-XSS-Protection: 1; mode=block`: Enables browser XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin`: Controls referrer information

---

## 📊 Monitoring & Analytics

### Built-in Monitoring (Enabled by Default)

The app includes production-ready monitoring out of the box:

#### 1. Vercel Analytics ✅

**Automatically enabled** - no configuration needed.

**Features:**
- Page view tracking
- Web Vitals (LCP, FID, CLS)
- User geography and devices
- Real-time traffic data

**How to view:**
1. Go to your Vercel project dashboard
2. Click **Analytics** tab
3. View metrics for:
   - Top pages
   - Audience insights
   - Performance scores
   - Real User Monitoring (RUM)

**Upgrade Options:**
- **Hobby:** Free (500 events/day)
- **Pro:** $10/month (unlimited events)

#### 2. Structured Logging ✅

**Location:** `src/lib/logger.ts`

**Features:**
- Production-safe logging (auto-sanitizes sensitive data)
- Different log levels: `error`, `warn`, `info`, `debug`
- JSON-formatted logs with timestamps
- User context and error tracking

**Usage in Code:**
```typescript
import { logger } from '@/lib/logger';

// Error logging
logger.error('Failed to create task', {
  userId: session.user.id,
  taskId: task.id,
  error: error.message,
});

// Warning logging
logger.warn('Rate limit approaching', {
  userId: session.user.id,
  endpoint: '/api/tasks',
});

// Info logging (development only)
logger.info('Task created successfully', {
  taskId: newTask.id,
});
```

**View Logs in Vercel:**
1. Go to **Deployments** → Select deployment
2. Click **Functions** tab
3. Select a function (e.g., `/api/tasks`)
4. View real-time logs

#### 3. Error Boundary Reporting ✅

**Location:** `src/app/error.tsx`

**What it tracks:**
- Error message and stack trace
- Page URL where error occurred
- Timestamp
- Error digest (Next.js internal ID)

**Automatic features:**
- Logs to console (visible in Vercel logs)
- User-friendly error UI
- "Try Again" button to recover

All errors are automatically logged with full context for debugging.

### Advanced Error Tracking (Optional)

For advanced error monitoring, see [`docs/SENTRY_SETUP.md`](docs/SENTRY_SETUP.md).

**Sentry provides:**
- Real-time error alerting
- Error grouping and trends
- Performance monitoring
- User session replay
- Team collaboration

**When to add Sentry:**
- 100+ active users
- Need systematic error tracking
- Want performance insights
- Require alerting (email/Slack)

**Cost:** Free tier (5,000 errors/month)

### Monitoring Dashboard

**What to monitor in Vercel:**

1. **Function Logs** (Real-time)
   - API errors and warnings
   - Database connection issues
   - Rate limiting events
   - AI generation failures

2. **Analytics** (Daily/Weekly)
   - Page views and user sessions
   - Web Vitals performance
   - Device and browser distribution
   - Geographic user data

3. **Deployment Health**
   - Build success/failure
   - Function invocation count
   - Bandwidth usage
   - Error rate

### Regular Maintenance Tasks

- **Daily:** Monitor Vercel function logs for critical errors
- **Weekly:** Review Analytics for usage trends
- **Monthly:** 
  - Review MongoDB usage and optimize queries
  - Check Web Vitals scores (target 90+)
  - Review error patterns and fix issues
- **Quarterly:** 
  - Update dependencies: `npm update`
  - Run security audit: `npm audit`
  - Review and rotate API keys
- **As needed:** Scale MongoDB cluster based on usage

---

## 🎯 Success Indicators

Your deployment is successful when:

✅ All environment variables are set correctly  
✅ Google OAuth login works  
✅ Email magic link authentication works  
✅ Database operations succeed (tasks, journal entries)  
✅ PWA installs on mobile devices  
✅ Offline mode displays correctly  
✅ Push notifications are delivered  
✅ Lighthouse PWA score is 100  
✅ No errors in Vercel function logs  
✅ AI insights generate correctly  

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **NextAuth Docs:** https://next-auth.js.org
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Resend Docs:** https://resend.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **PWA Guide:** https://web.dev/progressive-web-apps

---

## 🚀 What's Next?

After successful deployment:

1. **Share the app** with test users for feedback
2. **Monitor usage** and performance metrics
3. **Iterate on features** based on user feedback
4. **Set up CI/CD** for automated deployments
5. **Add more AI features** (mood trends, recommendations)
6. **Implement analytics** to track user engagement
7. **Optimize performance** based on real-world usage

---

**Deployed successfully?** 🎉 Star the repo and share your experience!
