# 🔧 Team Omega Execution Guide - Infrastructure Validation

**Team:** Omega (Infrastructure Engineers)  
**Managing Engineer:** Amp  
**Status:** ACTIVE - Ready to Execute  
**Duration:** 1-2 days (parallel tasks recommended)  

---

## Quick Start

**Your Mission:** Validate all external service integrations are correctly configured and working.

**Deliverable:** Sign-off on `docs/INFRASTRUCTURE_VALIDATION.md` with all checkboxes completed.

**Timeline:** Complete by EOD Nov 13 or morning Nov 14.

**Blockers for:** Teams Sigma, Pi, Alpha, Beta (4 teams waiting on you!)

---

## Task Allocation (Recommended)

Assign one person per task for parallel execution:

| Task | Owner | Duration | Priority |
|------|-------|----------|----------|
| **O-1** MongoDB Configuration | Person A | 2-4 hours | 🔴 Critical |
| **O-2** Google OAuth Setup | Person B | 2-4 hours | 🔴 Critical |
| **O-3** Email Service (Resend) | Person C | 1-2 hours | 🟡 High |
| **O-4** VAPID Keys & Notifications | Person D | 1 hour | 🟡 High |
| **O-5** NextAuth Configuration | Person A/B | 1-2 hours | 🟡 High |
| **O-6** AI Configuration | Person B | 1 hour | 🟠 Medium |

**Team Lead:** Coordinates checkpoints every 2 hours, escalates blockers immediately.

---

## Task O-1: MongoDB Configuration (Person A)

### What to Do
Validate MongoDB Atlas cluster is created, configured, and connected.

### Step-by-Step

1. **Cluster Creation**
   ```bash
   # Go to MongoDB Atlas: https://cloud.mongodb.com
   # If not already created:
   # 1. Create new project "Serene Mind"
   # 2. Build cluster (M0 Free tier minimum)
   # 3. Choose AWS/GCP and a region near your users
   # 4. Wait 3-5 minutes for cluster to initialize
   ```
   - [ ] Cluster created
   - [ ] Cluster name: ___________
   - [ ] Tier: M0 Free (or higher)
   - [ ] Status: Active ✓

2. **Database User Setup**
   ```bash
   # MongoDB Atlas → Database Access → Add New Database User
   # 1. Username: serene-admin
   # 2. Password: Generate strong password (save to secure location)
   # 3. Built-in roles: Select "Atlas Admin" or "Read and write to any database"
   # 4. Click "Add User"
   ```
   - [ ] User created: serene-admin
   - [ ] Password saved securely
   - [ ] Permissions: Atlas Admin ✓

3. **Network Access**
   ```bash
   # MongoDB Atlas → Network Access → Add IP Address
   # For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   # For production: Add Vercel IP ranges or keep "Anywhere"
   ```
   - [ ] IP whitelist configured
   - [ ] Development access: 0.0.0.0/0 ✓
   - [ ] Vercel access: Allowed ✓

4. **Connection String**
   ```bash
   # MongoDB Atlas → Database → Connect → Connect your application
   # Driver: Node.js | Version: 5.5 or later
   # Copy connection string and replace credentials
   
   # Should look like:
   # mongodb+srv://serene-admin:PASSWORD@cluster0.xxxxx.mongodb.net/serene-mind?retryWrites=true&w=majority
   ```
   - [ ] Connection string obtained
   - [ ] Username replaced: serene-admin ✓
   - [ ] Password replaced: [secure] ✓
   - [ ] Database name: serene-mind ✓

5. **Test Connection** (using MongoDB Compass)
   ```bash
   # Download MongoDB Compass if not already: https://www.mongodb.com/products/compass
   # 1. Open MongoDB Compass
   # 2. Paste connection string
   # 3. Click Connect
   # 4. Should see: "Atlas admin" or database connected successfully
   ```
   - [ ] MongoDB Compass installed or CLI available
   - [ ] Connection test: **PASS** ✓
   - [ ] Can see database: serene-mind

6. **Create Indexes** (recommended for performance)
   ```bash
   # In MongoDB Compass or Atlas CLI, run:
   db.tasks.createIndex({ userId: 1, createdAt: -1 });
   db.tasks.createIndex({ userId: 1, completed: 1 });
   db.journal.createIndex({ userId: 1, createdAt: -1 });
   db.journal.createIndex({ userId: 1, mood: 1 });
   ```
   - [ ] Tasks indexes created: ✓
   - [ ] Journal indexes created: ✓

7. **Document Configuration**
   ```bash
   # Add to INFRASTRUCTURE_VALIDATION.md Section 1:
   # Fill in checklist with dates/times
   # Record connection string securely (don't commit to git!)
   ```
   - [ ] INFRASTRUCTURE_VALIDATION.md updated
   - [ ] Person A signature added
   - [ ] Connection string stored in secure location (1Password, LastPass, etc.)

### Checklist
- [ ] Cluster created and active
- [ ] Database user created with correct permissions
- [ ] Network access configured
- [ ] Connection string generated
- [ ] Test connection successful
- [ ] Indexes created
- [ ] Documentation updated

**Handoff to:** Person E (NextAuth) for session storage validation

---

## Task O-2: Google OAuth Setup (Person B)

### What to Do
Create Google OAuth credentials and validate the OAuth flow works locally.

### Step-by-Step

1. **Create Google Cloud Project**
   ```bash
   # Go to: https://console.cloud.google.com
   # 1. Create new project: "Serene Mind App"
   # 2. Wait for project to be created
   ```
   - [ ] Project created
   - [ ] Project name: Serene Mind App
   - [ ] Project ID: ___________

2. **Configure OAuth Consent Screen**
   ```bash
   # Google Cloud Console → APIs & Services → OAuth consent screen
   # 1. User Type: External
   # 2. Create
   # 3. Fill form:
   #    - App name: Serene Mind
   #    - Support email: your-email@gmail.com
   #    - Developer contact: your-email@gmail.com
   # 4. Save and Continue (skip scopes)
   ```
   - [ ] Consent screen created
   - [ ] App name: Serene Mind ✓
   - [ ] Email addresses configured

3. **Create OAuth Credentials**
   ```bash
   # APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
   # 1. Application type: Web application
   # 2. Name: "Serene Mind Web App"
   # 3. Authorized redirect URIs - Add BOTH:
   #    - http://localhost:3000/api/auth/callback/google
   #    - http://localhost:3001/api/auth/callback/google  (if dev on 3001)
   # 4. Create
   # 5. Copy Client ID and Client Secret
   ```
   - [ ] OAuth credentials created
   - [ ] Client ID: ___________
   - [ ] Client Secret: ___________ (secured)
   - [ ] Redirect URIs added: localhost:3000, localhost:3001

4. **Test OAuth Flow Locally**
   ```bash
   # In project directory:
   # 1. Add to .env.local:
   export GOOGLE_CLIENT_ID="your-client-id"
   export GOOGLE_CLIENT_SECRET="your-client-secret"
   export NEXTAUTH_URL="http://localhost:3000"
   export NEXTAUTH_SECRET="$(openssl rand -base64 32)"  # generate if needed
   
   # 2. Run dev server:
   npm run dev
   
   # 3. Open http://localhost:3001 (or 3000 if configured)
   # 4. Click "Sign in with Google"
   # 5. Complete OAuth flow
   # 6. Should be redirected back to app as logged-in user
   ```
   - [ ] .env.local updated with credentials
   - [ ] Dev server started successfully
   - [ ] OAuth flow test: **PASS** ✓
   - [ ] Session created in browser
   - [ ] Redirected back to app as logged-in user

5. **Verify Session in Database**
   ```bash
   # Connect to MongoDB with credentials from O-1
   # Check sessions collection:
   db.sessions.find().pretty()
   
   # Should see session document with:
   # - sessionToken (httpOnly cookie)
   # - userId
   # - expires date
   ```
   - [ ] Session stored in MongoDB: ✓
   - [ ] Session document structure correct

6. **Document Configuration**
   ```bash
   # Update INFRASTRUCTURE_VALIDATION.md Section 2
   # Fill in all checkboxes with completion dates
   # Record Client ID/Secret securely
   ```
   - [ ] INFRASTRUCTURE_VALIDATION.md updated
   - [ ] Person B signature added
   - [ ] Credentials stored securely

### Checklist
- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URIs configured (localhost)
- [ ] OAuth flow tested locally: PASS
- [ ] Session created in MongoDB
- [ ] Documentation updated

**Handoff to:** Managing Engineer (for production URI config later)

---

## Task O-3: Email Service Setup (Person C)

### What to Do
Configure Resend (or alternative email service) for magic link authentication.

### Step-by-Step

1. **Create Resend Account**
   ```bash
   # Go to: https://resend.com
   # 1. Sign up with GitHub or email
   # 2. Verify email address
   # 3. Accept terms
   ```
   - [ ] Account created
   - [ ] Email verified
   - [ ] Account dashboard accessible

2. **Generate API Key**
   ```bash
   # Resend Dashboard → API Keys → Create API Key
   # 1. Name: "Serene Mind Production"
   # 2. Permission: Sending access
   # 3. Copy API key (starts with re_)
   # 4. **Save immediately** (shown only once)
   ```
   - [ ] API Key generated
   - [ ] API Key: re________________ (secured)
   - [ ] Stored in secure location (1Password, LastPass, etc.)

3. **Test Email Sending**
   ```bash
   # Using Resend API or CLI:
   # 1. Send test email to yourself
   # 2. Should arrive within 1-2 minutes
   # 3. Check spam folder if needed
   
   # Using curl:
   curl -X POST "https://api.resend.com/emails" \
     -H "Authorization: Bearer re_your_api_key" \
     -H "Content-Type: application/json" \
     -d '{
       "from": "noreply@yourdomain.com",
       "to": "your-email@gmail.com",
       "subject": "Serene Mind Test",
       "html": "<p>Test email from Serene Mind</p>"
     }'
   ```
   - [ ] Test email sent
   - [ ] Email received: ✓
   - [ ] Email delivered within 2 minutes
   - [ ] No spam folder issues

4. **Configure Email Environment Variables**
   ```bash
   # Add to .env.local:
   export EMAIL_SERVER_HOST="smtp.resend.com"
   export EMAIL_SERVER_PORT="465"
   export EMAIL_SERVER_USER="resend"
   export EMAIL_SERVER_PASSWORD="re_your_api_key"
   export EMAIL_FROM="noreply@yourdomain.com"
   ```
   - [ ] Environment variables added to .env.local
   - [ ] No credentials in git

5. **Optional: Verify Custom Domain** (for production)
   ```bash
   # Resend Dashboard → Domains → Add Domain
   # 1. Enter domain: yourdomain.com
   # 2. Add DNS records
   # 3. Wait for verification (up to 48 hours)
   # 4. For development: Skip this step
   ```
   - [ ] Domain verification (optional - can skip for MVP)
   - [ ] Using: yourdomain.com / default Resend domain

6. **Document Configuration**
   ```bash
   # Update INFRASTRUCTURE_VALIDATION.md Section 3
   # Fill in checklist items
   ```
   - [ ] INFRASTRUCTURE_VALIDATION.md updated
   - [ ] Person C signature added

### Checklist
- [ ] Resend account created and verified
- [ ] API key generated and secured
- [ ] Test email sent successfully
- [ ] Email environment variables configured
- [ ] .env.local updated (not committed to git)
- [ ] Documentation updated

**No handoff needed** - Task is independent

---

## Task O-4: VAPID Keys & Notifications (Person D)

### What to Do
Generate VAPID keys for web push notifications.

### Step-by-Step

1. **Generate VAPID Keys**
   ```bash
   # In project directory, run:
   npx web-push generate-vapid-keys
   
   # Output will be:
   # Public Key: BEL...very_long_string...xyz
   # Private Key: abc...very_long_string...123
   ```
   - [ ] Command executed successfully
   - [ ] Public Key: BEL__________________ (OK to share)
   - [ ] Private Key: __________________ (KEEP SECURE)

2. **Validate Key Format**
   ```bash
   # Check public key:
   # - Starts with "BE" or similar
   # - Length: ~88 characters
   # - Base64 encoded
   
   # Check private key:
   # - Base64 encoded
   # - Length: ~88 characters
   # - No special characters except = for padding
   ```
   - [ ] Public key format valid
   - [ ] Private key format valid
   - [ ] Both keys appear properly generated

3. **Configure Environment Variables**
   ```bash
   # Add to .env.local:
   export NEXT_PUBLIC_VAPID_PUBLIC_KEY="BEL_your_public_key"
   export VAPID_PRIVATE_KEY="your_private_key"
   export VAPID_SUBJECT="mailto:noreply@yourdomain.com"
   ```
   - [ ] Variables added to .env.local
   - [ ] Public key: NEXT_PUBLIC_* (OK to commit)
   - [ ] Private key: Secured (not committed to git)
   - [ ] Subject configured

4. **Test Push Subscription** (optional, requires HTTPS)
   ```bash
   # Local test requires HTTPS (push notifications need secure context)
   # Can be tested in production or with local HTTPS setup
   # For now: Document that this will be tested in Phase 2
   ```
   - [ ] Keys generated and stored
   - [ ] Will be tested in Phase 2 (E2E testing)

5. **Document Configuration**
   ```bash
   # Update INFRASTRUCTURE_VALIDATION.md Section 4
   # Fill in VAPID key information and checklist
   ```
   - [ ] INFRASTRUCTURE_VALIDATION.md updated
   - [ ] Person D signature added
   - [ ] Keys stored in secure location

### Checklist
- [ ] VAPID keys generated with `npx web-push`
- [ ] Key format validated
- [ ] Environment variables configured
- [ ] Keys stored securely (not in git)
- [ ] Documentation updated

**No handoff needed** - Task is independent

---

## Task O-5: NextAuth Configuration (Person A or B)

### What to Do
Generate NextAuth secret and validate session storage in MongoDB.

### Step-by-Step

1. **Generate NextAuth Secret**
   ```bash
   # Run this command:
   openssl rand -base64 32
   
   # Output example: (copy this full output)
   # abc123+XyZ/...moreRandomStuff...==
   ```
   - [ ] Command executed
   - [ ] Secret generated: ____________________
   - [ ] Stored securely (1Password, LastPass, etc.)

2. **Configure Environment Variables**
   ```bash
   # Add to .env.local:
   export NEXTAUTH_SECRET="your_generated_secret_from_above"
   export NEXTAUTH_URL="http://localhost:3000"  # for local dev
   ```
   - [ ] NEXTAUTH_SECRET added
   - [ ] NEXTAUTH_URL set to localhost
   - [ ] Not committed to git

3. **Verify Session Storage**
   ```bash
   # 1. Start dev server: npm run dev
   # 2. Sign in with Google OAuth (from Task O-2)
   # 3. Connect to MongoDB (from Task O-1)
   # 4. Check sessions collection:
   
   db.sessions.find({ "user.email": "your-email@gmail.com" }).pretty()
   
   # Should see:
   # {
   #   _id: ObjectId("..."),
   #   sessionToken: "...",
   #   userId: "...",
   #   expires: ISODate("..."),
   #   user: { email: "...", name: "..." }
   # }
   ```
   - [ ] Session created in MongoDB: ✓
   - [ ] Session has correct structure
   - [ ] User data matches login
   - [ ] Expiration date is in future

4. **Validate JWT Token**
   ```bash
   # In browser DevTools:
   # 1. Open Application tab
   # 2. Cookies → localhost
   # 3. Look for: next-auth.session-token
   # 4. Should have HttpOnly, Secure (in HTTPS), SameSite flags
   ```
   - [ ] Session cookie created
   - [ ] Cookie has HttpOnly flag
   - [ ] Cookie is SameSite: Strict or Lax

5. **Document Configuration**
   ```bash
   # Update INFRASTRUCTURE_VALIDATION.md Section 5
   # Fill in all checklist items
   ```
   - [ ] INFRASTRUCTURE_VALIDATION.md updated
   - [ ] Person A/B signature added

### Checklist
- [ ] NextAuth secret generated with openssl
- [ ] Environment variables configured
- [ ] Dev server running with NextAuth
- [ ] Session created and stored in MongoDB
- [ ] JWT token has correct flags
- [ ] Documentation updated

**Handoff to:** Person E (if exists) or Managing Engineer

---

## Task O-6: AI Configuration (Person B)

### What to Do
Get Google Gemini API key and validate it works.

### Step-by-Step

1. **Generate API Key**
   ```bash
   # Go to: https://aistudio.google.com/app/apikey
   # 1. Click "Create API Key"
   # 2. Select or create project
   # 3. Copy the API key (starts with AIza_)
   # 4. Save securely immediately
   ```
   - [ ] API key generated
   - [ ] Key format: AIza_________________
   - [ ] Stored securely

2. **Configure Environment Variables**
   ```bash
   # Add to .env.local:
   export GOOGLE_GENAI_API_KEY="AIza_your_key"
   export GENKIT_MODEL="gemini-2.0-flash"
   ```
   - [ ] API key added to .env.local
   - [ ] Model specified: gemini-2.0-flash
   - [ ] Not committed to git

3. **Test AI Integration (Optional)**
   ```bash
   # If Genkit setup exists:
   # 1. Create a journal entry with content
   # 2. Click "Generate Insights"
   # 3. Should see AI-generated response within 10-15 seconds
   
   # If Genkit not set up yet:
   # - Document that this will be tested in Phase 2
   ```
   - [ ] API key validated (can skip functional test for now)
   - [ ] Will test in Phase 2 E2E testing

4. **Document Configuration**
   ```bash
   # Update INFRASTRUCTURE_VALIDATION.md Section 6
   # Fill in checklist items
   ```
   - [ ] INFRASTRUCTURE_VALIDATION.md updated
   - [ ] Person B signature added

### Checklist
- [ ] Google AI API key generated
- [ ] Environment variables configured
- [ ] Key stored securely
- [ ] Documentation updated

**No handoff needed** - Task is independent

---

## Final Checklist: Team Omega Sign-Off

Before marking this phase complete:

- [ ] **O-1 (MongoDB):** Person A completed and signed
- [ ] **O-2 (OAuth):** Person B completed and signed
- [ ] **O-3 (Email):** Person C completed and signed
- [ ] **O-4 (VAPID):** Person D completed and signed
- [ ] **O-5 (NextAuth):** Person A/B completed and signed
- [ ] **O-6 (AI):** Person B completed and signed
- [ ] **Master Document:** `docs/INFRASTRUCTURE_VALIDATION.md` fully completed
- [ ] **All env variables:** Documented and tested in .env.local
- [ ] **No credentials in git:** Verified via `git log --all --grep="secret\|password\|key"`
- [ ] **README updated:** With current infrastructure status (optional but helpful)

---

## Team Lead Responsibilities

### Before Tasks Start
- [ ] Assign each task to team member
- [ ] Provide this execution guide to team
- [ ] Confirm access to required services (MongoDB, Google Cloud, Resend)
- [ ] Set up 2-hour checkpoint meetings
- [ ] Create shared notes document for blockers

### During Execution
- [ ] Monitor progress in 2-hour increments
- [ ] Unblock any service access issues immediately
- [ ] Escalate any critical blockers to Managing Engineer within 30 minutes
- [ ] Collect signed-off checkboxes from each person
- [ ] Document any issues or deviations

### Before Sign-Off
- [ ] Verify all tasks completed
- [ ] Review INFRASTRUCTURE_VALIDATION.md for completeness
- [ ] Ensure no credentials in git
- [ ] Schedule handoff meeting with Sigma, Pi team leads
- [ ] Provide sign-off document to Managing Engineer

---

## Escalation Contacts

**If task is blocked:**
1. **First:** Try to resolve within team (2 hours)
2. **Then:** Escalate to Team Lead
3. **Finally:** Escalate to Managing Engineer (Amp) immediately

**Managing Engineer Contact:** [TBD - Will be assigned]  
**Escalation Email:** [TBD]  
**Escalation Slack:** [TBD]

---

**Team Omega - Let's make this happen! 🚀**

**Document Owner:** Amp (Managing Engineer)  
**Created:** 2025-11-13  
**Status:** READY FOR EXECUTION
