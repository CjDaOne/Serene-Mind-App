# 🔧 Infrastructure Validation Checklist - Team Omega

**Assigned To:** Team Omega (Infrastructure Engineers)  
**Status:** In Progress  
**Last Updated:** November 13, 2025  

---

## 📋 Pre-Deployment Infrastructure Validation

This document provides comprehensive validation procedures for all external service integrations required for Serene Mind App production deployment.

---

## ✅ 1. MongoDB Configuration Validation

### **1.1 Cluster Verification**

- [ ] **Cluster Created** 
  - Cluster name: `_________________`
  - Cloud provider: `_________________`
  - Region: `_________________`
  - Tier: M0 Free / M2 Shared / _________ (M0+ recommended)
  - **Verification Command:**
    ```bash
    # Test connection with MongoDB Compass
    # URI: mongodb+srv://username:password@cluster.mongodb.net/serene-mind
    # Should connect successfully
    ```

- [ ] **Database User Created**
  - Username: `serene-admin`
  - Permissions: Atlas Admin / Read & Write ✓
  - **Verified:** _____ (date/time)

### **1.2 Network Access**

- [ ] **IP Whitelist Configured**
  - Vercel IP ranges added: ☐ Yes ☐ No
  - Development IP (0.0.0.0/0 for testing): ☐ Yes ☐ No
  - **Notes:** _____________________

### **1.3 Connection String**

- [ ] **Connection String Generated**
  - Format: `mongodb+srv://serene-admin:PASSWORD@cluster.mongodb.net/serene-mind`
  - Username replaced: ✓
  - Password replaced: ✓
  - Database name: `serene-mind` ✓
  - **Connection String Validated:** _____ (date/time)

- [ ] **Connection Test Successful**
  ```bash
  # Test with MongoDB Compass or shell
  mongo "mongodb+srv://serene-admin:password@cluster.mongodb.net/serene-mind"
  # Should connect and show: "Atlas admin"
  ```

### **1.4 Database Indexes**

- [ ] **Indexes Created**
  ```javascript
  // Run in MongoDB shell or Atlas UI
  db.tasks.createIndex({ userId: 1, createdAt: -1 });
  db.tasks.createIndex({ userId: 1, completed: 1 });
  db.journal.createIndex({ userId: 1, createdAt: -1 });
  db.journal.createIndex({ userId: 1, mood: 1 });
  ```
  - Tasks indexes created: ✓
  - Journal indexes created: ✓
  - **Verified:** _____ (date/time)

### **1.5 MongoDB Environment Variables**

```env
MONGODB_URI=mongodb+srv://serene-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/serene-mind?retryWrites=true&w=majority
MONGODB_DB=serene-mind
```

- [ ] Environment variables set in `.env.local`
- [ ] Variables set in Vercel (Production + Preview + Development)
- [ ] No plain passwords in git commits
- [ ] **Verified:** _____ (date/time)

---

## ✅ 2. Google OAuth Configuration Validation

### **2.1 Google Cloud Project**

- [ ] **Project Created**
  - Project name: `Serene Mind App`
  - Project ID: `_________________`
  - Billing account linked: ☐ Yes ☐ No
  - **Verified:** _____ (date/time)

### **2.2 OAuth Consent Screen**

- [ ] **Consent Screen Configured**
  - User type: External ✓
  - App name: Serene Mind ✓
  - Support email: `_________________`
  - Developer contact: `_________________`
  - **Verified:** _____ (date/time)

### **2.3 OAuth 2.0 Credentials**

- [ ] **Client ID Created**
  - Application type: Web application ✓
  - Client ID: `_______________________`
  - Client Secret: `_______________________` (secured)
  - **Verified:** _____ (date/time)

### **2.4 Redirect URIs**

- [ ] **Development URI Configured**
  - `http://localhost:3000/api/auth/callback/google` ✓
  - **Verified in Google Console:** _____ (date/time)

- [ ] **Production URI Configured**
  - `https://your-project.vercel.app/api/auth/callback/google`
  - **Vercel URL:** `_________________`
  - **Verified in Google Console:** _____ (date/time)

- [ ] **Custom Domain URI (Optional)**
  - `https://yourdomain.com/api/auth/callback/google` (if applicable)
  - **Verified:** _____ (date/time)

### **2.5 OAuth Flow Testing**

- [ ] **Local OAuth Test**
  ```bash
  # Run dev server
  npm run dev
  # Navigate to http://localhost:3000
  # Test "Sign in with Google"
  # Should complete OAuth flow successfully
  ```
  - Test result: ✓ Pass / ☐ Fail
  - **Verified:** _____ (date/time)

### **2.6 Google OAuth Environment Variables**

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

- [ ] Environment variables set in `.env.local`
- [ ] Variables set in Vercel (Production + Preview + Development)
- [ ] Credentials not in git history
- [ ] **Verified:** _____ (date/time)

---

## ✅ 3. Email Service Configuration (Resend)

### **3.1 Resend Account**

- [ ] **Account Created**
  - Account email: `_________________`
  - Billing account linked: ☐ Yes ☐ No
  - **Verified:** _____ (date/time)

### **3.2 API Key**

- [ ] **API Key Generated**
  - API Key: `re_________________________________` (secured)
  - Permission: Sending access ✓
  - **Stored securely:** ☐ 1Password ☐ LastPass ☐ Other: _____

### **3.3 Domain Configuration (Optional but Recommended)**

- [ ] **Domain Added to Resend**
  - Domain: `yourdomain.com` (if applicable)
  - DNS records configured: ☐ Yes ☐ No
  - Verification status: Verified / Pending
  - **Verified:** _____ (date/time)

### **3.4 Email Test**

- [ ] **Send Test Email**
  ```bash
  # Using Resend API or dashboard
  # Send to your-email@gmail.com
  # Should arrive within 1-2 minutes
  ```
  - Test result: ✓ Pass / ☐ Fail
  - **Verified:** _____ (date/time)

### **3.5 Email Environment Variables**

```env
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=re_your-api-key
EMAIL_FROM=noreply@yourdomain.com
```

- [ ] Environment variables set in `.env.local`
- [ ] Variables set in Vercel (Production + Preview + Development)
- [ ] EMAIL_FROM uses verified domain (or default)
- [ ] **Verified:** _____ (date/time)

---

## ✅ 4. Web Push Notifications (VAPID Keys)

### **4.1 VAPID Key Generation**

- [ ] **Keys Generated**
  ```bash
  npx web-push generate-vapid-keys
  ```
  - Public Key: `BEL_________________________________`
  - Private Key: `________________________________` (secured)
  - **Generation Date:** _____ (date/time)

### **4.2 VAPID Key Validation**

- [ ] **Public Key Format**
  - Starts with "BEL" or similar: ✓
  - Length: ~88 characters: ✓
  
- [ ] **Private Key Format**
  - Base64 encoded: ✓
  - Length: ~88 characters: ✓

### **4.3 VAPID Environment Variables**

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BEL_your-public-key
VAPID_PRIVATE_KEY=your-private-key
VAPID_SUBJECT=mailto:noreply@yourdomain.com
```

- [ ] Environment variables set in `.env.local`
- [ ] Variables set in Vercel (Production + Preview + Development)
- [ ] Public key is PUBLIC (OK to share)
- [ ] Private key is PRIVATE (never commit)
- [ ] **Verified:** _____ (date/time)

### **4.4 Push Notification Test**

- [ ] **Push Subscription Test**
  - Deploy to Vercel or run locally with HTTPS
  - Navigate to dashboard
  - Click "Enable Notifications"
  - Grant browser permission
  - Send test notification
  - **Result:** ✓ Received / ☐ Failed
  - **Verified:** _____ (date/time)

---

## ✅ 5. NextAuth Configuration

### **5.1 NextAuth Secret**

- [ ] **Secret Generated**
  ```bash
  openssl rand -base64 32
  ```
  - Secret: `_________________________________` (secured)
  - **Generation Date:** _____ (date/time)

### **5.2 NextAuth Environment Variables**

```env
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000  # Development
NEXTAUTH_URL=https://your-project.vercel.app  # Production
```

- [ ] `NEXTAUTH_SECRET` set in `.env.local`
- [ ] `NEXTAUTH_SECRET` set in Vercel (Production + Preview + Development)
- [ ] `NEXTAUTH_URL` set for development environment
- [ ] `NEXTAUTH_URL` set for production environment
- [ ] Secret never committed to git
- [ ] **Verified:** _____ (date/time)

### **5.3 NextAuth Session Testing**

- [ ] **Local Session Test**
  ```bash
  npm run dev
  # Sign in with Google OAuth
  # Check browser cookies for next-auth.session-token
  # Verify session in MongoDB
  ```
  - Test result: ✓ Pass / ☐ Fail
  - Session stored in MongoDB: ✓
  - **Verified:** _____ (date/time)

---

## ✅ 6. Google Gemini AI Configuration

### **6.1 Google AI API Key**

- [ ] **API Key Generated**
  - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
  - Create new API key
  - API Key: `AIza_________________________________` (secured)
  - **Verified:** _____ (date/time)

### **6.2 AI Environment Variables**

```env
GOOGLE_GENAI_API_KEY=AIza_your-api-key
GENKIT_MODEL=gemini-2.0-flash
```

- [ ] Environment variables set in `.env.local`
- [ ] Variables set in Vercel (Production + Preview + Development)
- [ ] API key never committed to git
- [ ] **Verified:** _____ (date/time)

### **6.3 AI Functionality Test**

- [ ] **Create Journal Entry with AI Insights**
  - Deploy app or run locally
  - Create a journal entry
  - Click "Generate AI Insights"
  - Should receive AI-generated insights within 10 seconds
  - **Result:** ✓ Works / ☐ Failed
  - **Verified:** _____ (date/time)

---

## ✅ 7. Node Environment Configuration

- [ ] **NODE_ENV Set**
  - Development: `NODE_ENV=development`
  - Production: `NODE_ENV=production`
  - **Set in Vercel:** ☐ Yes ☐ No
  - **Verified:** _____ (date/time)

---

## ✅ 8. Vercel Deployment Configuration

### **8.1 Project Setup**

- [ ] **Repository Connected**
  - Repository URL: `https://github.com/______/serene-mind-app`
  - Branch: `main` / ________
  - **Verified:** _____ (date/time)

- [ ] **Build Configuration**
  - Framework: Next.js ✓
  - Root Directory: `./` ✓
  - Build Command: `npm run build` ✓
  - Output Directory: `.next` ✓
  - **Verified:** _____ (date/time)

### **8.2 Environment Variables in Vercel**

- [ ] **Production Environment**
  - [ ] MONGODB_URI
  - [ ] MONGODB_DB
  - [ ] NEXTAUTH_SECRET
  - [ ] NEXTAUTH_URL
  - [ ] GOOGLE_CLIENT_ID
  - [ ] GOOGLE_CLIENT_SECRET
  - [ ] EMAIL_SERVER_HOST
  - [ ] EMAIL_SERVER_PORT
  - [ ] EMAIL_SERVER_USER
  - [ ] EMAIL_SERVER_PASSWORD
  - [ ] EMAIL_FROM
  - [ ] NEXT_PUBLIC_VAPID_PUBLIC_KEY
  - [ ] VAPID_PRIVATE_KEY
  - [ ] VAPID_SUBJECT
  - [ ] GOOGLE_GENAI_API_KEY
  - [ ] GENKIT_MODEL
  - [ ] NODE_ENV=production

- [ ] **Preview Environment** (same as Production)

- [ ] **Development Environment** (same as Production)

- [ ] **All variables verified:** _____ (date/time)

### **8.3 Vercel URL**

- [ ] **Deployment URL**
  - URL: `https://________________________________.vercel.app`
  - Domain accessible and loading: ✓
  - HTTPS enabled: ✓
  - **Verified:** _____ (date/time)

---

## ✅ 9. Infrastructure Validation Summary

### **Final Checklist**

- [ ] MongoDB connected and tested
- [ ] Google OAuth configured and tested
- [ ] Email service configured and tested
- [ ] VAPID keys generated and stored
- [ ] NextAuth configured and tested
- [ ] Google Gemini API configured
- [ ] All 18+ environment variables set
- [ ] Vercel deployment ready
- [ ] All variables set in Vercel (Prod/Preview/Dev)
- [ ] No credentials in git history

### **Infrastructure Sign-Off**

**Team Omega Lead Signature:** _________________ **Date:** _______

**Infrastructure Status:** 
- ☐ ✅ Ready for Sigma Testing
- ☐ ⚠️ Issues Found (see notes below)
- ☐ 🚫 Deployment Blocked

**Critical Issues Found:**
```
[List any blockers or critical issues]
```

**Notes:**
```
[Add any observations or concerns]
```

---

## 🔄 Verification Timeline

| Task | Target Date | Actual Date | Status |
|------|-------------|-------------|--------|
| MongoDB Config | 2025-11-13 | _________ | ⏳ |
| OAuth Setup | 2025-11-13 | _________ | ⏳ |
| Email Config | 2025-11-13 | _________ | ⏳ |
| VAPID Keys | 2025-11-13 | _________ | ⏳ |
| NextAuth Config | 2025-11-13 | _________ | ⏳ |
| Gemini API | 2025-11-13 | _________ | ⏳ |
| Vercel Setup | 2025-11-13 | _________ | ⏳ |
| All Tests Passing | 2025-11-14 | _________ | ⏳ |

---

**Next Steps:** Once all items checked, pass to Team Sigma for E2E testing.
