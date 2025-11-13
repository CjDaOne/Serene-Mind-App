# 🧪 QA Testing Plan & Validation - Team Sigma

**Assigned To:** Team Sigma (QA Engineers)  
**Status:** In Progress  
**Last Updated:** November 13, 2025  

---

## 📋 Comprehensive E2E & Functional Testing

This document provides complete testing procedures for Serene Mind App production deployment validation.

---

## 🔐 Section 1: Authentication Testing

### **1.1 Guest Mode Access**

- [ ] **Guest Entry Point Available**
  - Visit home page: `https://app.vercel.app/`
  - "Try Demo" button visible: ✓
  - Clickable and functional: ✓
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Guest Session Created**
  - After clicking "Try Demo"
  - Browser shows guest JWT token: ✓
  - localStorage contains guest session: ✓
  - Dashboard accessible: ✓
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Guest Data Isolation**
  - Create 2 guest sessions (different browsers/incognito)
  - Session 1 creates task "Task A"
  - Session 2 should NOT see "Task A"
  - Each guest has isolated demo data
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Guest Session Expiration**
  - Create guest session
  - Wait 30+ minutes
  - Refresh page
  - Should show "Session Expired" message
  - Option to create new guest session
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Guest Feature Limitations**
  - Can create max 5 tasks ✓
  - Can create max 3 journal entries ✓
  - Cannot generate AI insights ✓
  - Cannot set push notifications ✓
  - **Test Date:** _____ **Status:** ✓ / ☐

### **1.2 Google OAuth Login**

- [ ] **Google OAuth Button Present**
  - Home page shows "Sign in with Google" button
  - Button is clickable and functional
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **OAuth Flow - Sign In**
  ```
  1. Click "Sign in with Google"
  2. Redirected to Google consent screen
  3. Approve permissions
  4. Redirected back to app
  5. User session created
  6. Redirected to dashboard
  ```
  - All steps complete successfully: ✓
  - Session persists on page refresh: ✓
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **OAuth Flow - Sign Out**
  - Click user menu → "Sign Out"
  - Verified redirected to home page
  - Session cleared from localStorage: ✓
  - MongoDB session removed: ✓
  - Cannot access protected routes: ✓
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **OAuth Error Handling**
  - Deny Google permissions
  - Should show error message
  - Redirected back to home
  - No session created
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **OAuth State Parameter Validation**
  - Manually alter state parameter in URL
  - Request should fail
  - CSRF protection working
  - **Test Date:** _____ **Status:** ✓ / ☐

### **1.3 Email Magic Link Authentication**

- [ ] **Email Sign-In Option Available**
  - Home page shows email input option
  - "Sign in with Email" button visible and clickable
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Magic Link Generation**
  ```
  1. Enter email address
  2. Click "Send Magic Link"
  3. Check email inbox
  4. Should receive email within 2 minutes
  ```
  - Email received: ✓
  - Contains magic link: ✓
  - Link contains token: ✓
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Magic Link Authentication**
  - Click magic link in email
  - Should redirect to app
  - User session created
  - Logged in to dashboard: ✓
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Magic Link Expiration**
  - Generate magic link
  - Wait 24+ hours
  - Attempt to use expired link
  - Should show "Link expired" message
  - Option to request new link
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Magic Link One-Time Use**
  - Generate magic link
  - Click link once (successful login)
  - Copy link URL
  - Try to use same link again
  - Should fail with "Link already used"
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Invalid Email Handling**
  - Enter invalid email format
  - Submit
  - Should show validation error
  - No email sent
  - **Test Date:** _____ **Status:** ✓ / ☐

### **1.4 Protected Routes & Redirects**

- [ ] **Unauthenticated Access**
  - Visit `/dashboard` without login
  - Should redirect to `/` (home)
  - Show login prompt
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Protected Routes List**
  - [ ] `/dashboard` - redirects to home if not auth
  - [ ] `/tasks` - redirects to home if not auth
  - [ ] `/journal` - redirects to home if not auth
  - [ ] `/calendar` - redirects to home if not auth
  - [ ] All protected routes verified: ✓
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Post-Login Redirect**
  - Visit protected route while logged out
  - Get redirected to login
  - After successful login
  - Should redirect to originally requested page (not just dashboard)
  - **Test Date:** _____ **Status:** ✓ / ☐

---

## ✅ Section 2: Core Features Testing

### **2.1 Task Management**

- [ ] **Task Creation**
  - Click "+ New Task"
  - Fill in: Title, Description, Due Date, Priority
  - Click "Create"
  - Task appears in list immediately
  - Task saved to database
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Task Read/View**
  - Tasks display in task list
  - Click task to view details
  - All fields display correctly
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Task Update**
  - Click task in list
  - Edit title, description, or due date
  - Click "Save"
  - Changes reflect immediately in list
  - Changes saved to database
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Task Completion**
  - Create task
  - Mark as "Completed"
  - Task appears in completed list
  - Can mark as incomplete again
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Task Deletion**
  - Create task
  - Click delete button
  - Confirm deletion
  - Task removed from list
  - Removed from database
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Task Priority**
  - Create tasks with different priorities
  - List sorts by priority correctly
  - Priority updates work
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Task Due Dates**
  - Set due dates for tasks
  - Calendar view shows tasks on correct dates
  - Due date indicators work
  - Overdue tasks highlighted
  - **Test Date:** _____ **Status:** ✓ / ☐

### **2.2 Journal Entries**

- [ ] **Journal Entry Creation**
  - Navigate to Journal page
  - Click "+ New Entry"
  - Write content
  - Add mood (if available)
  - Click "Save"
  - Entry appears in list
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Journal Entry Read**
  - Click entry in list
  - Content displays correctly
  - Mood indicator visible
  - Timestamp correct
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Journal Entry Update**
  - Click edit on existing entry
  - Modify content/mood
  - Click "Save"
  - Changes reflect immediately
  - Database updated
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Journal Entry Deletion**
  - Click delete on entry
  - Confirm deletion
  - Entry removed from list
  - Removed from database
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Journal Search/Filter**
  - Search by text in entries
  - Filter by mood
  - Filter by date range
  - Results display correctly
  - **Test Date:** _____ **Status:** ✓ / ☐

### **2.3 AI Insights**

- [ ] **AI Insights Generation**
  - Create journal entry with substantial content (2+ paragraphs)
  - Click "Generate Insights" button
  - AI should generate insights within 10-15 seconds
  - Insights display in readable format
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **AI Insights Content Quality**
  - Insights are relevant to journal content
  - Insights are supportive and helpful
  - No errors or truncated text
  - Appropriate length (not too short or long)
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **AI Error Handling**
  - Request insights for very short entry
  - Should handle gracefully (error or empty state)
  - No app crash or error 500
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Rate Limiting (AI)**
  - Request insights 5+ times in quick succession
  - After limit, should show "Try again in X seconds"
  - No actual requests after rate limit
  - **Test Date:** _____ **Status:** ✓ / ☐

### **2.4 Calendar View**

- [ ] **Calendar Displays**
  - Navigate to Calendar page
  - Current month displays
  - All tasks with due dates shown
  - Dates are correct
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Calendar Navigation**
  - Navigate to previous month
  - Navigate to next month
  - Navigate to current month
  - All work correctly
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Task on Calendar**
  - Click task date in calendar
  - Shows task details
  - Can edit or mark complete from calendar view
  - **Test Date:** _____ **Status:** ✓ / ☐

### **2.5 Affirmations**

- [ ] **Daily Affirmations Display**
  - Navigate to Affirmations page
  - Affirmation displays
  - Text is readable
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Affirmation Rotation**
  - View affirmation
  - Refresh page
  - New affirmation displays (or cycling logic works)
  - **Test Date:** _____ **Status:** ✓ / ☐

### **2.6 Rewards System**

- [ ] **Rewards Display**
  - Navigate to Rewards page
  - Achievements list displays
  - Current points/level shown
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Reward Unlock on Task Completion**
  - Complete task
  - Check rewards page
  - Points increased
  - Badges unlock when earned
  - **Test Date:** _____ **Status:** ✓ / ☐

---

## 📱 Section 3: PWA Features Testing

### **3.1 Service Worker & Offline**

- [ ] **Service Worker Registration**
  - Open app in Chrome DevTools
  - Go to Application → Service Workers
  - Service worker should be registered and active
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Offline Page Display**
  - Disable internet (DevTools → Network → Offline)
  - Try to create new task
  - Should show "Offline" message or offline page
  - Existing cached data still visible
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Cache Strategy**
  - Load app while online
  - Note which assets are cached
  - Disable internet
  - Refresh page
  - Should load from cache (fast load)
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Online Sync**
  - While offline, add/update task (if supported)
  - Go back online
  - Data should sync automatically
  - No manual refresh needed
  - **Test Date:** _____ **Status:** ✓ / ☐

### **3.2 Install Prompt & PWA Install**

- [ ] **Install Prompt Appears**
  - Load app on Chrome/Edge desktop
  - Should see install prompt in address bar or bottom banner
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Desktop Installation**
  - Click install prompt
  - App installs as desktop application
  - Icon appears on desktop / start menu
  - App opens in standalone window
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Android Installation**
  - Open app in Chrome on Android
  - Tap menu → "Install app"
  - App installs with icon on home screen
  - Opens in standalone mode
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **iOS Installation**
  - Open app in Safari on iPhone
  - Tap share button → "Add to Home Screen"
  - App installs with icon on home screen
  - Opens in Safari (full-screen mode)
  - **Test Date:** _____ **Status:** ✓ / ☐

### **3.3 Push Notifications**

- [ ] **Notification Permission Request**
  - Navigate to dashboard
  - Should see notification opt-in prompt
  - Allow browser notifications
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Notification Subscription**
  - Grant notification permission
  - Click "Enable Notifications"
  - Browser should not show additional prompts
  - Subscription successful
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Send Test Notification**
  - Click "Send Test Notification"
  - Notification should appear
  - Content is readable
  - Can click to focus app
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Task Reminder Notification**
  - Create task with due date today
  - Set reminder (if feature available)
  - At due time, should receive notification
  - Notification includes task title
  - Can dismiss or click to navigate
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Background Notifications**
  - Enable notifications
  - Close app completely
  - Trigger notification from backend
  - Notification should appear even when app closed
  - **Test Date:** _____ **Status:** ✓ / ☐

### **3.4 Web App Manifest**

- [ ] **Manifest File Present**
  - DevTools → Application → Manifest
  - Manifest file loads successfully
  - No errors in console
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Manifest Properties**
  - [ ] name: "Serene Mind"
  - [ ] short_name: "Serene"
  - [ ] start_url: "/"
  - [ ] display: "standalone"
  - [ ] background_color set
  - [ ] theme_color set
  - [ ] icons with multiple sizes
  - **Test Date:** _____ **Status:** ✓ / ☐

---

## ⚡ Section 4: Performance Testing

### **4.1 Lighthouse Audit**

- [ ] **Run Lighthouse Audit**
  - Open app in Chrome
  - DevTools → Lighthouse
  - Audit for: Performance, Accessibility, Best Practices, SEO, PWA
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Target Scores Achieved**
  - [ ] Performance: 90+ (target: _____)
  - [ ] Accessibility: 95+ (target: _____)
  - [ ] Best Practices: 95+ (target: _____)
  - [ ] SEO: 90+ (target: _____)
  - [ ] PWA: 100 (target: 100)
  - **All targets met:** ✓ / ☐
  - **Test Date:** _____ 

- [ ] **Lighthouse Recommendations**
  - Note any failing audits
  - Address critical issues before deployment
  - Document known limitations
  - **Issues Found:** None / _______________

### **4.2 Page Load Performance**

- [ ] **Initial Page Load**
  - Fresh load (no cache)
  - Measure time to interactive: ______ seconds (target: <3s)
  - First Contentful Paint: ______ seconds (target: <1.5s)
  - Largest Contentful Paint: ______ seconds (target: <2.5s)
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Repeat Page Load**
  - Load page second time (with cache)
  - Measure time: ______ seconds (target: <1s)
  - Significantly faster than first load: ✓
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Navigation Performance**
  - Click between pages (Tasks, Journal, Calendar)
  - Measure time for each page transition
  - Should be <500ms each
  - No noticeable delay or lag
  - **Test Date:** _____ **Status:** ✓ / ☐

### **4.3 API Response Times**

- [ ] **Task API Responses**
  - Create task: ______ ms (target: <500ms)
  - Update task: ______ ms (target: <500ms)
  - Fetch tasks: ______ ms (target: <300ms)
  - Delete task: ______ ms (target: <500ms)
  - **All under target:** ✓ / ☐
  - **Test Date:** _____ 

- [ ] **Journal API Responses**
  - Create entry: ______ ms
  - Fetch entries: ______ ms
  - Update entry: ______ ms
  - **All under target:** ✓ / ☐
  - **Test Date:** _____ 

- [ ] **AI API Responses**
  - Request insights: ______ seconds (target: <15s)
  - Response quality acceptable: ✓
  - No timeout errors: ✓
  - **Test Date:** _____ **Status:** ✓ / ☐

---

## 🔒 Section 5: Security Testing

### **5.1 Authentication Security**

- [ ] **Session Token Validation**
  - Check browser cookies for session token
  - Token is httpOnly: ✓
  - Token is Secure (HTTPS only): ✓
  - Token is SameSite: Strict or Lax: ✓
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Token Expiration**
  - Create session
  - Check token expiration time
  - Wait for expiration
  - Token should be invalid
  - User redirected to login
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **CSRF Protection**
  - Check for CSRF tokens in forms
  - Tokens are unique per request: ✓
  - Tokens change per form submission: ✓
  - **Test Date:** _____ **Status:** ✓ / ☐

### **5.2 Data Isolation**

- [ ] **User Data Isolation**
  - Create Account A with tasks
  - Create Account B
  - Account B cannot see Account A's tasks
  - API requests from B blocked from A's data
  - MongoDB queries filtered by userId
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **API Authorization**
  - Modify task ID in API request to different user's task
  - Request should fail with 403 Forbidden
  - Cannot access another user's data via API
  - **Test Date:** _____ **Status:** ✓ / ☐

### **5.3 Input Validation**

- [ ] **XSS Prevention**
  - Try to create task with HTML: `<script>alert('xss')</script>`
  - Script should be escaped, not executed
  - Content displays as text, not HTML
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **SQL Injection (MongoDB)**
  - Try injection in task title
  - No database error exposed
  - Injection attempt treated as text
  - **Test Date:** _____ **Status:** ✓ / ☐

---

## 📊 Section 6: Database Testing

### **6.1 Data Persistence**

- [ ] **Task Persistence**
  - Create task
  - Refresh page
  - Task still exists
  - Check MongoDB to verify data saved
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Journal Persistence**
  - Create journal entry
  - Sign out and sign back in
  - Journal entry still exists
  - Data in MongoDB verified
  - **Test Date:** _____ **Status:** ✓ / ☐

### **6.2 Database Collections**

- [ ] **Expected Collections Created**
  - [ ] users
  - [ ] accounts
  - [ ] sessions
  - [ ] tasks
  - [ ] journal
  - All collections verified in MongoDB: ✓
  - **Test Date:** _____ 

- [ ] **Collection Indexes**
  - Tasks indexes present: ✓
  - Journal indexes present: ✓
  - Indexes improve query performance: ✓
  - **Test Date:** _____ **Status:** ✓ / ☐

---

## ✅ Section 7: Browser Compatibility

- [ ] **Chrome/Chromium**
  - All features work
  - No console errors
  - PWA installable
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Firefox**
  - All features work
  - No console errors
  - Notifications may not work (Firefox limitation)
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Safari (Desktop)**
  - All features work
  - No console errors
  - PWA partial support (iOS better)
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Safari (iOS)**
  - All features work
  - PWA installable via "Add to Home Screen"
  - Fullscreen mode works
  - Notifications not supported (iOS limitation)
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Chrome (Android)**
  - All features work
  - PWA installable
  - Notifications work
  - Mobile responsive
  - **Test Date:** _____ **Status:** ✓ / ☐

---

## 📱 Section 8: Responsive Design

- [ ] **Desktop (1920x1080)**
  - Layout looks good
  - All elements accessible
  - No horizontal scrolling
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Tablet (iPad 768x1024)**
  - Layout adapts well
  - Touch targets appropriate size
  - Readable text size
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Mobile (iPhone 375x667)**
  - Layout fully responsive
  - Text readable without zooming
  - Touch targets large enough
  - No horizontal scrolling
  - **Test Date:** _____ **Status:** ✓ / ☐

- [ ] **Small Mobile (375x667 and below)**
  - Layout functional
  - Essential features accessible
  - Scrolling works smoothly
  - **Test Date:** _____ **Status:** ✓ / ☐

---

## 📋 Test Execution Summary

### **All Test Categories Status**

| Category | Pass | Fail | Blockers |
|----------|------|------|----------|
| Authentication | __/10 | __/10 | _____ |
| Core Features | __/10 | __/10 | _____ |
| PWA Features | __/10 | __/10 | _____ |
| Performance | __/10 | __/10 | _____ |
| Security | __/10 | __/10 | _____ |
| Database | __/10 | __/10 | _____ |
| Browsers | __/10 | __/10 | _____ |
| Responsive | __/10 | __/10 | _____ |

**Total Pass Rate:** ______ % (Target: 95%+)

### **QA Sign-Off**

**QA Lead Signature:** _________________ **Date:** _______

**QA Status:** 
- ☐ ✅ Ready for Security Review
- ☐ ⚠️ Issues Found (see below)
- ☐ 🚫 Deployment Blocked

**Critical Issues Found:**
```
[List any blockers]
```

**Known Issues / Workarounds:**
```
[List non-critical issues and workarounds]
```

---

**Next Steps:** Once all tests pass, escalate to Team Pi for security review.
