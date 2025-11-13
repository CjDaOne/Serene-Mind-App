# 🧪 Team Sigma Execution Guide - QA Testing & Validation

**Team:** Sigma (QA Engineers)  
**Managing Engineer:** Amp  
**Status:** READY TO EXECUTE (after Omega sign-off)  
**Duration:** 8-10 hours  
**Start Date:** 2025-11-14 9:00 AM

---

## Quick Start

**Your Mission:** Execute comprehensive QA testing across all features and validate production readiness.

**Deliverable:** Complete `docs/QA_TESTING_PLAN.md` with 95%+ pass rate and team sign-off.

**Blocker:** Team Omega must complete infrastructure validation first (Gate 1).

**Timeline:** Start 2025-11-14 AM → Complete by 2025-11-14 6:00 PM

---

## Test Allocation

Assign team members by test section (parallel execution recommended):

| Section | Owner | Duration | Tests | Priority |
|---------|-------|----------|-------|----------|
| Authentication | Person A | 2 hours | 14 tests | 🔴 Critical |
| Core Features | Person B | 3 hours | 10 tests | 🔴 Critical |
| PWA Features | Person C | 2 hours | 10 tests | 🟡 High |
| Performance | Person A | 2 hours | 10 tests | 🟡 High |
| Security | Person B | 2 hours | 6 tests | 🟡 High |
| Database | Person C | 1 hour | 4 tests | 🟡 High |
| Browsers | Person D | 2 hours | 10 tests | 🟠 Medium |
| Responsive | Person D | 1 hour | 8 tests | 🟠 Medium |

**Total:** 8 sections, 72 tests, target >95% pass rate

---

## Pre-Test Setup (Before 9:00 AM)

### 1. Environment Setup
```bash
# Verify infrastructure exists
# Omega must provide:
# - Vercel deployment URL
# - All environment variables configured
# - Staging database with test data
# - Email service working
# - VAPID keys configured

# Clone repo and install
git clone https://github.com/CjDaOne/Serene-Mind-App.git
cd Serene-Mind-App
npm install

# Verify dev server starts
npm run dev
# Should be running on http://localhost:3001 (or 3000)
```

### 2. Test Data Preparation
```bash
# Create test accounts
# Email 1: test-user-1@example.com (via magic link)
# Email 2: test-user-2@example.com (via magic link)
# Google account (if available for OAuth)

# Pre-populate test data:
# - 5 sample tasks
# - 3 sample journal entries
# - Various moods/priorities
```

### 3. Tools Setup
- [ ] Chrome DevTools open (F12)
- [ ] Lighthouse extension installed
- [ ] Network inspector ready
- [ ] MongoDB compass connected (read-only)
- [ ] Performance monitoring tools ready
- [ ] Browser compatibility browsers open (Firefox, Safari)

---

## Section 1: Authentication Testing (Person A)

**Duration:** 2 hours  
**Tests:** 14 total  
**Target:** 14/14 pass

### 1.1 Guest Mode Testing

**Tests:**
- [ ] Guest entry point available
  - Visit home page
  - "Try Demo" button visible
  - Button is clickable
  
- [ ] Guest session created
  - Click "Try Demo"
  - JWT token in localStorage
  - Dashboard accessible
  
- [ ] Guest data isolation
  - Create guest session 1: add "Task A"
  - Create guest session 2 (incognito): check data
  - Session 2 should NOT see "Task A"
  
- [ ] Guest expiration
  - Create guest session
  - Wait 30+ minutes (or check expiration logic)
  - Refresh page
  - Should show "Session Expired" or "Create new session"
  
- [ ] Guest limitations
  - Can create max 5 tasks
  - Can create max 3 journals
  - No AI insights button
  - No notifications button

**Pass Criteria:** All 5 guest tests ✓

### 1.2 Google OAuth Testing

**Tests:**
- [ ] OAuth button present on home page
- [ ] OAuth flow completes successfully
  - Redirected to Google
  - Approve permissions
  - Redirected back to app
  - Dashboard accessible
  
- [ ] Session persists on refresh
  - Sign in via OAuth
  - Refresh page
  - Still logged in
  
- [ ] Logout works
  - Click user menu → Sign Out
  - Redirected to home
  - Session cleared
  
- [ ] OAuth error handling
  - Deny Google permissions
  - Should show error
  - Redirected to home
  - No session created

**Pass Criteria:** All 5 OAuth tests ✓

### 1.3 Email Magic Link Testing

**Tests:**
- [ ] Email sign-in option available
  - Home page has email input
  - "Send Magic Link" button visible
  
- [ ] Magic link email received
  - Enter test email
  - Check inbox within 2 minutes
  - Email contains magic link
  
- [ ] Magic link authentication works
  - Click link in email
  - Logged in to dashboard
  - Session created
  
- [ ] One-time use validation
  - Click magic link once
  - Try to reuse same link
  - Should fail with "Link already used"

**Pass Criteria:** All 4 email tests ✓

### 1.4 Protected Routes Testing

**Tests:**
- [ ] Unauthenticated access redirected
  - Visit `/dashboard` without login
  - Redirected to `/` (home)
  
- [ ] Protected routes verified (4 routes)
  - Dashboard, Tasks, Journal, Calendar
  - All redirect to home when not authenticated

**Pass Criteria:** All 1 protected route test (covers 5 routes) ✓

**Sign-Off for Section 1:** Person A _____ (Date/Time)

---

## Section 2: Core Features Testing (Person B)

**Duration:** 3 hours  
**Tests:** 10 total (multiple items per test)  
**Target:** 10/10 pass

### 2.1 Task Management (3 tests)

**Test 1: Task CRUD Operations**
- [ ] Create task
  - Click "+ New Task"
  - Fill: Title, Description, Due Date, Priority
  - Click "Create"
  - Task appears immediately
  - Task in database
  
- [ ] Read task
  - Click task in list
  - All fields display
  
- [ ] Update task
  - Edit title/description/date
  - Click "Save"
  - Changes reflect in list
  - Changes in database
  
- [ ] Delete task
  - Delete task
  - Confirm deletion
  - Task removed from list and database

**Test 2: Task Priority & Due Dates**
- [ ] Create 3 tasks with different priorities
  - List sorts correctly
  - Priority updates work
  
- [ ] Due dates appear in calendar
  - Calendar shows tasks on correct dates
  - Overdue highlighted

**Test 3: Task Completion**
- [ ] Mark task complete
  - Task moves to completed list
  - Can mark incomplete again

### 2.2 Journal Entries (3 tests)

**Test 4: Journal CRUD**
- [ ] Create entry
  - Write content
  - Add mood
  - Save
  - Entry in list
  
- [ ] Read entry
  - Click entry
  - Content displays
  - Mood shows
  
- [ ] Update entry
  - Edit content/mood
  - Save
  - Changes reflect
  
- [ ] Delete entry
  - Delete
  - Removed from list and database

**Test 5: Journal Search/Filter**
- [ ] Search by text
  - Type search term
  - Results filtered
  
- [ ] Filter by mood
  - Select mood
  - Only that mood shows

**Test 6: Mood Tracking**
- [ ] Create entries with 5 different moods
- [ ] All moods track correctly
- [ ] Mood trends visible

### 2.3 AI Insights (2 tests)

**Test 7: AI Insights Generation**
- [ ] Create journal with 2+ paragraphs
- [ ] Click "Generate Insights"
- [ ] AI generates insights within 15 seconds
- [ ] Insights display in readable format
- [ ] Content is relevant and helpful

**Test 8: AI Error Handling**
- [ ] Request insights for very short entry
- [ ] Handles gracefully (not 500 error)
- [ ] Rate limiting works (5+ quick requests fail gracefully)

### 2.4 Calendar & Features (2 tests)

**Test 9: Calendar View**
- [ ] Calendar displays current month
- [ ] Tasks with due dates appear
- [ ] Can navigate to previous/next month
- [ ] Click task shows details

**Test 10: Other Features**
- [ ] Affirmations page loads
- [ ] Affirmations display readable text
- [ ] Rewards page loads
- [ ] Rewards/points display

**Sign-Off for Section 2:** Person B _____ (Date/Time)

---

## Section 3: PWA Features Testing (Person C)

**Duration:** 2 hours  
**Tests:** 10 total  
**Target:** 10/10 pass

### 3.1 Service Worker & Offline

**Test 1: Service Worker Registration**
- [ ] Open DevTools → Application → Service Workers
- [ ] Service worker registered and active
- [ ] No errors in console

**Test 2: Offline Functionality**
- [ ] DevTools → Network → Offline
- [ ] Try to create task
- [ ] Shows offline message
- [ ] Cached data still visible
- [ ] Go online → syncs if supported

**Test 3: Cache Performance**
- [ ] Load app online
- [ ] Disable internet
- [ ] Refresh page
- [ ] Loads from cache (fast)

### 3.2 Installation Testing

**Test 4: Desktop Install (Chrome/Edge)**
- [ ] Install prompt appears
- [ ] Click install
- [ ] App installs as desktop app
- [ ] Opens in standalone window
- [ ] Icon appears on desktop/taskbar

**Test 5: Android Install (Chrome)**
- [ ] Open app on Android Chrome
- [ ] Menu → "Install app"
- [ ] App installs with home screen icon
- [ ] Opens in standalone mode

**Test 6: iOS Install (Safari)**
- [ ] Open app on iPhone Safari
- [ ] Share → "Add to Home Screen"
- [ ] App installs with icon
- [ ] Opens in fullscreen

### 3.3 Notifications Testing

**Test 7: Permission Request**
- [ ] Dashboard shows notification prompt
- [ ] "Enable Notifications" button clickable
- [ ] Browser permission request works

**Test 8: Test Notification**
- [ ] Grant notification permission
- [ ] Send test notification
- [ ] Notification appears
- [ ] Can click to focus app

**Test 9: Background Notifications**
- [ ] Enable notifications
- [ ] Close app completely
- [ ] Trigger notification from browser tools
- [ ] Notification appears while app closed

### 3.4 Manifest Validation

**Test 10: Web App Manifest**
- [ ] DevTools → Application → Manifest
- [ ] Manifest loads without errors
- [ ] name, short_name, start_url correct
- [ ] display: "standalone"
- [ ] theme_color, background_color set
- [ ] Icons with multiple sizes present

**Sign-Off for Section 3:** Person C _____ (Date/Time)

---

## Section 4: Performance Testing (Person A)

**Duration:** 2 hours  
**Tests:** 10 total  
**Target:** 10/10 pass (target scores met)

### 4.1 Lighthouse Audit

**Test 1: Run Lighthouse**
- [ ] DevTools → Lighthouse
- [ ] Run audit for all categories
- [ ] Record baseline scores

**Test 2: Target Scores**
- [ ] Performance: 90+ (record: ___)
- [ ] Accessibility: 95+ (record: ___)
- [ ] Best Practices: 95+ (record: ___)
- [ ] SEO: 90+ (record: ___)
- [ ] PWA: 100 (record: ___)

**Status:** ✓ Pass if all targets met, ☐ Fail if any below target

### 4.2 Page Load Performance

**Test 3: First Load Time**
- [ ] Fresh load (clear cache)
- [ ] FCP (First Contentful Paint): ___ s (target: <1.5s)
- [ ] LCP (Largest Contentful Paint): ___ s (target: <2.5s)
- [ ] TTI (Time to Interactive): ___ s (target: <3s)

**Test 4: Cached Load Time**
- [ ] Second load (with cache)
- [ ] Time: ___ s (target: <1s)
- [ ] Significantly faster than first load: ✓

**Test 5: Navigation Performance**
- [ ] Navigate Tasks → Journal → Calendar
- [ ] Each transition: ___ ms (target: <500ms)
- [ ] No noticeable lag

### 4.3 API Response Times

**Test 6: Task APIs**
- [ ] Create task: ___ ms (target: <500ms)
- [ ] Update task: ___ ms (target: <500ms)
- [ ] Fetch tasks: ___ ms (target: <300ms)
- [ ] Delete task: ___ ms (target: <500ms)

**Test 7: Journal APIs**
- [ ] Create entry: ___ ms (target: <500ms)
- [ ] Fetch entries: ___ ms (target: <300ms)
- [ ] Update entry: ___ ms (target: <500ms)

**Test 8: AI APIs**
- [ ] Request insights: ___ s (target: <15s)
- [ ] No timeout errors: ✓
- [ ] Response quality acceptable: ✓

### 4.4 Additional Performance

**Test 9: Bundle Size**
- [ ] Check build size in `.next/` folder
- [ ] Record main bundle size
- [ ] Identify any unexpectedly large imports

**Test 10: Memory Leaks**
- [ ] Open Performance tab
- [ ] Record heap snapshots
- [ ] Navigate around for 5 minutes
- [ ] Heap shouldn't grow excessively
- [ ] No memory leaks detected: ✓

**Sign-Off for Section 4:** Person A _____ (Date/Time)

---

## Section 5: Security Testing (Person B)

**Duration:** 2 hours  
**Tests:** 6 total  
**Target:** 6/6 pass

### 5.1 Authentication Security

**Test 1: Session Token Validation**
- [ ] Browser DevTools → Application → Cookies
- [ ] Session token present
- [ ] Token has `HttpOnly` flag: ✓
- [ ] Token has `Secure` flag (HTTPS): ✓
- [ ] Token has `SameSite=Strict or Lax`: ✓

**Test 2: Token Expiration**
- [ ] Create session
- [ ] Check token expiration date
- [ ] Wait for expiration (or force expire)
- [ ] Token invalid: ✓
- [ ] Redirected to login: ✓

### 5.2 Data Isolation

**Test 3: User Data Isolation**
- [ ] Create Account A with tasks
- [ ] Create Account B (different user)
- [ ] Account B cannot see Account A's tasks: ✓
- [ ] Try to access Account A's data via API
- [ ] Returns 403 Forbidden: ✓

### 5.3 Input Validation

**Test 4: XSS Prevention**
- [ ] Create task with: `<script>alert('xss')</script>`
- [ ] Script does NOT execute: ✓
- [ ] Content displays as text: ✓
- [ ] Try in journal entry too
- [ ] XSS prevented: ✓

**Test 5: SQL Injection (NoSQL)**
- [ ] Try injection attempt in task title
- [ ] No database error exposed: ✓
- [ ] Injection treated as text: ✓

### 5.4 CSRF Protection

**Test 6: CSRF Tokens**
- [ ] Check form submissions for CSRF tokens
- [ ] Tokens are unique per request: ✓
- [ ] Tokens change per form submission: ✓
- [ ] Invalid token rejected: ✓

**Sign-Off for Section 5:** Person B _____ (Date/Time)

---

## Section 6: Database Testing (Person C)

**Duration:** 1 hour  
**Tests:** 4 total  
**Target:** 4/4 pass

### 6.1 Data Persistence

**Test 1: Task Persistence**
- [ ] Create task
- [ ] Refresh page
- [ ] Task still exists: ✓
- [ ] Verify in MongoDB: ✓

**Test 2: Journal Persistence**
- [ ] Create journal entry
- [ ] Sign out → Sign back in
- [ ] Journal entry still exists: ✓
- [ ] Data in MongoDB verified: ✓

### 6.2 Database Collections

**Test 3: Collections Exist**
- [ ] Connect to MongoDB
- [ ] Verify collections exist:
  - [ ] users
  - [ ] accounts
  - [ ] sessions
  - [ ] tasks
  - [ ] journal
  
**Status:** All collections present ✓

**Test 4: Indexes**
- [ ] Tasks indexes present: ✓
- [ ] Journal indexes present: ✓
- [ ] Indexes improve performance: ✓

**Sign-Off for Section 6:** Person C _____ (Date/Time)

---

## Section 7: Browser Compatibility (Person D)

**Duration:** 2 hours  
**Tests:** 10 total (1 test per browser)  
**Target:** 10/10 pass

### 7.1 Chrome/Chromium
- [ ] All features work
- [ ] No console errors
- [ ] PWA installable
- [ ] Notifications work
- **Result:** ✓ Pass

### 7.2 Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Notifications may not work (expected)
- **Result:** ✓ Pass

### 7.3 Safari (Desktop)
- [ ] All features work
- [ ] No console errors
- [ ] PWA partial support (expected)
- **Result:** ✓ Pass

### 7.4 Safari (iOS)
- [ ] All features work
- [ ] PWA installable via "Add to Home Screen"
- [ ] Fullscreen mode works
- [ ] Notifications not supported (expected)
- **Result:** ✓ Pass

### 7.5 Chrome (Android)
- [ ] All features work
- [ ] PWA installable
- [ ] Notifications work
- [ ] Mobile responsive
- **Result:** ✓ Pass

**Plus:** Edge, Opera, or other browsers as available

**Sign-Off for Section 7:** Person D _____ (Date/Time)

---

## Section 8: Responsive Design (Person D)

**Duration:** 1 hour  
**Tests:** 8 items (4 breakpoints)  
**Target:** 8/8 pass

### 8.1 Desktop (1920x1080)
- [ ] Layout looks good
- [ ] All elements accessible
- [ ] No horizontal scrolling
- **Result:** ✓ Pass

### 8.2 Tablet (768x1024)
- [ ] Layout adapts well
- [ ] Touch targets appropriate size
- [ ] Text readable
- **Result:** ✓ Pass

### 8.3 Mobile (375x667)
- [ ] Fully responsive
- [ ] Text readable without zooming
- [ ] Touch targets large
- [ ] No horizontal scrolling
- **Result:** ✓ Pass

### 8.4 Small Mobile (< 375px)
- [ ] Layout functional
- [ ] Essential features accessible
- [ ] Scrolling smooth
- **Result:** ✓ Pass

**Sign-Off for Section 8:** Person D _____ (Date/Time)

---

## Final QA Sign-Off

### Summary of Results

| Section | Tests | Pass | Fail | % |
|---------|-------|------|------|---|
| Authentication | 14 | ___ | ___ | __% |
| Core Features | 10 | ___ | ___ | __% |
| PWA | 10 | ___ | ___ | __% |
| Performance | 10 | ___ | ___ | __% |
| Security | 6 | ___ | ___ | __% |
| Database | 4 | ___ | ___ | __% |
| Browsers | 10 | ___ | ___ | __% |
| Responsive | 8 | ___ | ___ | __% |
| **TOTAL** | **72** | **___** | **___** | **___%** |

**Target:** 95%+ pass rate (68+ tests passing)

### Issues Found

**Critical Issues (Blocks Deployment):**
```
[List any critical failures]
```

**High Priority Issues (Must Fix):**
```
[List high-priority non-critical issues]
```

**Medium Priority Issues (Should Fix):**
```
[List medium-priority issues]
```

**Low Priority Issues (Nice to Have):**
```
[List low-priority issues]
```

### QA Team Sign-Off

**QA Lead Signature:** _________________ **Date:** _______

**QA Status:**
- [ ] ✅ **Ready for Security Review** (95%+ pass rate, no critical issues)
- [ ] ⚠️ Issues Found (see details above)
- [ ] 🚫 **Deployment Blocked** (critical failures)

**Notes:**
```
[Add any final observations or concerns]
```

---

**Next Steps:** Pass to Team Pi for security review

**Document Owner:** Amp (Managing Engineer)  
**Created:** 2025-11-13  
**Status:** READY FOR EXECUTION
