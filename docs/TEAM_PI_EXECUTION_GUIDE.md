# 🔐 Team Pi Execution Guide - Security & Compliance Audit

**Team:** Pi (Security Engineers)  
**Managing Engineer:** Amp  
**Status:** READY TO EXECUTE (after Omega sign-off)  
**Duration:** 6-8 hours  
**Start Date:** 2025-11-14 9:00 AM

---

## Quick Start

**Your Mission:** Conduct comprehensive security audit and validate zero critical vulnerabilities.

**Deliverable:** Create & sign `SECURITY_SIGN_OFF.md` with full audit details and zero critical vulns.

**Blocker:** Team Omega must complete infrastructure validation first (Gate 1).

**Timeline:** Start 2025-11-14 AM → Complete by 2025-11-14 5:00 PM

---

## Audit Allocation

Assign members to security domains (parallel execution):

| Domain | Owner | Duration | Items | Priority |
|--------|-------|----------|-------|----------|
| Dependency Scan | Person A | 1 hour | 3 checks | 🔴 Critical |
| Security Headers | Person B | 2 hours | 10 checks | 🔴 Critical |
| Auth Security | Person A | 2 hours | 8 checks | 🔴 Critical |
| Data Isolation | Person B | 2 hours | 5 checks | 🔴 Critical |
| API Security | Person C | 2 hours | 6 checks | 🟡 High |
| Database Security | Person C | 1 hour | 5 checks | 🟡 High |
| Compliance | Person D | 1 hour | 5 checks | 🟠 Medium |

**Total:** 7 domains, 42 checks, target 0 critical vulns

---

## Pre-Audit Setup (Before 9:00 AM)

### 1. Access & Tools Setup
```bash
# Required tools
npm install -g npm-audit
npm install -g snyk

# Access needed
- Source code repository access
- Production deployment access
- MongoDB read-only access
- AWS/Cloud console access (if applicable)
- npm account (for publishing checks)

# Tools for testing
- BURP Community Suite (or similar)
- npm audit
- Snyk CLI
- curl / Postman for API testing
```

### 2. Baseline Gathering
- [ ] Get Omega infrastructure validation results
- [ ] Review deployed app configuration
- [ ] Gather Sigma performance baseline
- [ ] Check current npm dependencies

---

## Domain 1: Dependency Security Scan (Person A)

**Duration:** 1 hour  
**Checks:** 3  
**Target:** 0 critical vulns found

### Check 1: npm audit

```bash
cd /home/cjnf/Serene-Mind-App
npm audit

# Record results:
# Total vulnerabilities: ___
# Critical: ___
# High: ___
# Medium: ___
# Low: ___
```

**Acceptance Criteria:**
- [ ] 0 critical vulnerabilities
- [ ] 0-2 high vulnerabilities (must be justified)
- [ ] All medium/low issues documented

**Issues Found:**
```
[List any vulnerabilities]
[For each: Name, Severity, Affected Package, Remediation]
```

### Check 2: Snyk Scan

```bash
snyk test

# Compare with npm audit results
# Should be consistent
```

**Acceptance Criteria:**
- [ ] Results match npm audit
- [ ] No additional critical vulns found

### Check 3: License Compliance

```bash
npm ls --depth=0

# Verify all licenses acceptable for production use
# Check for GPL, AGPL, or other restrictive licenses
```

**Acceptance Criteria:**
- [ ] All licenses acceptable
- [ ] No GPL/AGPL for SaaS use
- [ ] Document any unusual licensing

**Sign-Off for Domain 1:** Person A _____ (Date/Time)

---

## Domain 2: Security Headers (Person B)

**Duration:** 2 hours  
**Checks:** 10  
**Target:** All headers present and correct

### Check 1: Content-Security-Policy

**Test:**
```bash
# Visit https://your-deployment.vercel.app
# Check response headers via DevTools or:
curl -I https://your-deployment.vercel.app | grep -i content-security-policy
```

**Expected:** CSP header present  
**What to look for:**
- [ ] `script-src` restricted (not 'unsafe-inline')
- [ ] `style-src` restricted
- [ ] `default-src` set
- [ ] Report-uri configured (optional)

**Result:** ☐ Pass ☐ Fail  
**Notes:** _________________

### Check 2: X-Content-Type-Options

```bash
curl -I https://your-deployment.vercel.app | grep -i x-content-type-options
```

**Expected:** `X-Content-Type-Options: nosniff`

**Result:** ☐ Pass ☐ Fail

### Check 3: X-Frame-Options

```bash
curl -I https://your-deployment.vercel.app | grep -i x-frame-options
```

**Expected:** `X-Frame-Options: DENY` or `SAMEORIGIN`

**Result:** ☐ Pass ☐ Fail

### Check 4: X-XSS-Protection

```bash
curl -I https://your-deployment.vercel.app | grep -i x-xss-protection
```

**Expected:** `X-XSS-Protection: 1; mode=block`

**Result:** ☐ Pass ☐ Fail

### Check 5: Strict-Transport-Security

```bash
curl -I https://your-deployment.vercel.app | grep -i strict-transport-security
```

**Expected:** `Strict-Transport-Security: max-age=31536000; includeSubDomains`

**Result:** ☐ Pass ☐ Fail

### Check 6: Referrer-Policy

```bash
curl -I https://your-deployment.vercel.app | grep -i referrer-policy
```

**Expected:** `Referrer-Policy: strict-origin-when-cross-origin`

**Result:** ☐ Pass ☐ Fail

### Check 7: Permissions-Policy

```bash
curl -I https://your-deployment.vercel.app | grep -i permissions-policy
```

**Expected:** Restrictions on: camera, microphone, geolocation (if not used)

**Result:** ☐ Pass ☐ Fail

### Check 8: HTTPS Enforcement

```bash
# Verify redirect from HTTP to HTTPS
curl -i http://your-deployment.vercel.app 2>&1 | grep -i location
```

**Expected:** 301/302 redirect to HTTPS

**Result:** ☐ Pass ☐ Fail

### Check 9: CORS Configuration

```bash
# Test CORS headers
curl -H "Origin: https://evil.com" -i https://your-deployment.vercel.app
```

**Expected:** No `Access-Control-Allow-Origin: *` (too permissive)

**Result:** ☐ Pass ☐ Fail  
**Current CORS Policy:** _________________

### Check 10: API Security Headers

```bash
# Test API endpoint for security headers
curl -I https://your-deployment.vercel.app/api/tasks
```

**Expected:** Same security headers as main app

**Result:** ☐ Pass ☐ Fail

**Summary for Domain 2:**
- [ ] 10/10 headers properly configured
- [ ] Missing headers: ________________
- [ ] Misconfigured headers: ________________

**Sign-Off for Domain 2:** Person B _____ (Date/Time)

---

## Domain 3: Authentication Security (Person A)

**Duration:** 2 hours  
**Checks:** 8  
**Target:** All checks pass

### Check 1: JWT Token Validation

```bash
# Sign in via OAuth
# Check JWT in DevTools
# Expected structure: header.payload.signature
```

**Verify:**
- [ ] Token has 3 parts (header.payload.signature)
- [ ] Header has: `alg: HS256` or similar
- [ ] Payload has: `sub` (subject/user ID), `exp` (expiration), `iat` (issued at)
- [ ] Signature verifies correctly
- [ ] Token uses httpOnly cookie (not localStorage)

**Result:** ☐ Pass ☐ Fail

### Check 2: Token Expiration

```bash
# Decode token (use jwt.io for inspection)
# Check exp claim
```

**Verify:**
- [ ] Expiration is reasonable (24 hours typical)
- [ ] Token expires after inactivity
- [ ] Refresh token mechanism exists (if applicable)

**Token TTL:** _____ hours  
**Result:** ☐ Pass ☐ Fail

### Check 3: Password Hashing (Email Auth)

**Review code:** `src/lib/auth` or similar

**Verify:**
- [ ] Passwords hashed with bcrypt (not plaintext or weak hash)
- [ ] Salt rounds >= 10
- [ ] No passwords stored in plaintext anywhere
- [ ] No password reset tokens stored in plaintext

**Result:** ☐ Pass ☐ Fail

### Check 4: OAuth Provider Validation

**Review code:** `src/lib/oauth` or NextAuth config

**Verify:**
- [ ] Client secret never exposed in frontend code
- [ ] Redirect URIs whitelist enforced
- [ ] State parameter validation active (CSRF protection)
- [ ] PKCE flow used if supported

**Result:** ☐ Pass ☐ Fail

### Check 5: Session Management

**Review code:** Session configuration

**Verify:**
- [ ] Sessions stored server-side (MongoDB, not JWT only)
- [ ] Session tokens are random and unpredictable
- [ ] Session invalidation on logout works
- [ ] No session fixation vulnerability
- [ ] Cookie flags correct (HttpOnly, Secure, SameSite)

**Result:** ☐ Pass ☐ Fail

### Check 6: Rate Limiting on Auth Endpoints

**Test:**
```bash
# Attempt rapid login requests
for i in {1..10}; do
  curl -X POST https://your-deployment.vercel.app/api/auth/signin \
    -d '{"email":"test@test.com"}'
done

# Should get 429 Too Many Requests after threshold
```

**Verify:**
- [ ] Rate limiting enforced on /api/auth/signin
- [ ] Rate limiting enforced on /api/auth/callback
- [ ] Rate limiting enforced on password reset
- [ ] Limits reasonable (not too strict)

**Result:** ☐ Pass ☐ Fail

### Check 7: CSRF Protection

**Test:** Review form submissions

**Verify:**
- [ ] All state-changing requests (POST/PUT/DELETE) have CSRF tokens
- [ ] CSRF tokens are session-specific
- [ ] CSRF tokens validated server-side
- [ ] Tokens change per request (one-time use)

**Result:** ☐ Pass ☐ Fail

### Check 8: Account Enumeration Protection

**Test:**
```bash
# Try to sign up with existing email
# Try to sign in with non-existent email
# Check error messages
```

**Verify:**
- [ ] Error messages don't reveal if email exists
- [ ] "User not found" and "Wrong password" same generic message
- [ ] No information leakage about valid accounts

**Result:** ☐ Pass ☐ Fail

**Summary for Domain 3:**
- [ ] 8/8 auth security checks pass
- [ ] Failed checks: ________________

**Sign-Off for Domain 3:** Person A _____ (Date/Time)

---

## Domain 4: Data Isolation & Privacy (Person B)

**Duration:** 2 hours  
**Checks:** 5  
**Target:** All checks pass

### Check 1: User Data Isolation

**Test:**
```bash
# Create Account A with tasks
# Create Account B
# Try to access Account A's tasks via API
curl -H "Authorization: Bearer B_token" \
  https://your-deployment.vercel.app/api/tasks/A_task_id
```

**Expected:** 403 Forbidden

**Verify:**
- [ ] Account B cannot access Account A's data
- [ ] API enforces userId check
- [ ] Database queries filtered by userId
- [ ] No permission bypass possible

**Result:** ☐ Pass ☐ Fail

### Check 2: Guest Data Isolation

**Test:**
- [ ] Create guest session 1
- [ ] Create guest session 2 (separate browser)
- [ ] Session 1 task NOT visible in Session 2
- [ ] Sessions completely isolated

**Verify:**
- [ ] Guest sessions use separate namespaces
- [ ] No data leakage between guests
- [ ] Session tokens properly scoped

**Result:** ☐ Pass ☐ Fail

### Check 3: Sensitive Data in Logs

**Review:**
```bash
# Check application logs
# Review error messages
# Check console output
```

**Verify:**
- [ ] No passwords in logs
- [ ] No API keys in logs
- [ ] No PII in logs (emails at minimum OK)
- [ ] No JWT tokens in logs
- [ ] Errors don't expose stack traces to users

**Result:** ☐ Pass ☐ Fail

### Check 4: GDPR/Privacy Compliance

**Review:**
- [ ] Privacy policy exists and links from app
- [ ] User data deletion endpoint works
- [ ] GDPR rights honored (data export, deletion)
- [ ] Consent tracking if needed

**Verify:**
- [ ] Can export own data: ☐ Yes ☐ No
- [ ] Can delete own data: ☐ Yes ☐ No
- [ ] Can control what's shared: ☐ Yes ☐ No
- [ ] Privacy policy links: ☐ Yes ☐ No

**Result:** ☐ Pass ☐ Fail

### Check 5: Database Encryption

**Test:**
```bash
# Connect to MongoDB
# Check connection string for TLS/SSL
# Verify encryption at rest (MongoDB Atlas feature)
```

**Verify:**
- [ ] MongoDB connection uses TLS/SSL (mongodb+srv, not plain)
- [ ] Encryption at rest enabled
- [ ] Backup encryption enabled
- [ ] No data stored in plaintext fields (passwords hashed, keys encrypted)

**Result:** ☐ Pass ☐ Fail

**Summary for Domain 4:**
- [ ] 5/5 data isolation checks pass
- [ ] Failed checks: ________________

**Sign-Off for Domain 4:** Person B _____ (Date/Time)

---

## Domain 5: API Security (Person C)

**Duration:** 2 hours  
**Checks:** 6  
**Target:** All checks pass

### Check 1: Input Validation

**Test:** Try to inject malicious inputs

```bash
# XSS attempt in task title
curl -X POST https://your-deployment.vercel.app/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"<script>alert(1)</script>"}'

# Expected: Script escaped, not executed
```

**Verify:**
- [ ] HTML/JS tags escaped in all inputs
- [ ] No eval() or dangerous functions used
- [ ] Input validation on backend (not just frontend)
- [ ] Type validation (string, number, date formats)

**Result:** ☐ Pass ☐ Fail

### Check 2: Output Encoding

**Test:**
```bash
# Check how user input is rendered
# In browser inspector, verify HTML entities, not raw HTML
```

**Verify:**
- [ ] User input rendered as text, not HTML
- [ ] JSON responses properly formatted
- [ ] No HTML injection in API responses

**Result:** ☐ Pass ☐ Fail

### Check 3: NoSQL Injection Prevention

**Test:**
```bash
# MongoDB injection attempt
curl -X POST https://your-deployment.vercel.app/api/tasks \
  -d '{"title":{"$ne":null}}'

# Should be treated as text, not JSON operator
```

**Verify:**
- [ ] Input not parsed as MongoDB operators
- [ ] Parameterized queries used
- [ ] No string concatenation in queries

**Result:** ☐ Pass ☐ Fail

### Check 4: Rate Limiting on APIs

**Test:**
```bash
# Rapid API requests
for i in {1..50}; do
  curl https://your-deployment.vercel.app/api/tasks
done

# Should get 429 Too Many Requests
```

**Verify:**
- [ ] Rate limiting enforced
- [ ] Limits reasonable (not blocking legitimate use)
- [ ] Different limits for different endpoints (stricter on auth)
- [ ] Rate limit headers included in response

**Result:** ☐ Pass ☐ Fail

### Check 5: API Authentication

**Test:**
```bash
# Try to access API without token
curl https://your-deployment.vercel.app/api/tasks

# Should get 401 Unauthorized
```

**Verify:**
- [ ] All protected endpoints require authentication
- [ ] Token validated on every request
- [ ] Invalid tokens rejected
- [ ] Expired tokens cause re-auth

**Result:** ☐ Pass ☐ Fail

### Check 6: API Versioning & Deprecation

**Review:**
- [ ] API versioning strategy defined
- [ ] Deprecated endpoints handled gracefully
- [ ] Breaking changes documented

**Verify:**
- [ ] Current API version documented: v___
- [ ] Backwards compatibility maintained: ☐ Yes ☐ No
- [ ] Deprecation warnings sent: ☐ Yes ☐ No

**Result:** ☐ Pass ☐ Fail

**Summary for Domain 5:**
- [ ] 6/6 API security checks pass
- [ ] Failed checks: ________________

**Sign-Off for Domain 5:** Person C _____ (Date/Time)

---

## Domain 6: Database Security (Person C)

**Duration:** 1 hour  
**Checks:** 5  
**Target:** All checks pass

### Check 1: Connection Security

```bash
# Verify MongoDB connection string uses TLS
# Should be: mongodb+srv://user:pass@...
# Not: mongodb://user:pass@...
```

**Verify:**
- [ ] TLS/SSL required
- [ ] Not accepting plain connections
- [ ] Certificate validation enabled

**Result:** ☐ Pass ☐ Fail

### Check 2: Authentication

```bash
# Verify MongoDB has auth enabled
# Should require username/password
```

**Verify:**
- [ ] Authentication required (not anonymous)
- [ ] User has minimal permissions (not admin)
- [ ] Password is strong and unique

**Result:** ☐ Pass ☐ Fail

### Check 3: Access Control

**Review:**
```bash
# Check MongoDB Atlas IP whitelist
# Should NOT be 0.0.0.0/0 in production
```

**Verify:**
- [ ] IP whitelist configured
- [ ] Only Vercel IPs whitelisted (or narrow range)
- [ ] Dev IP 0.0.0.0/0 only for development
- [ ] Removed before production

**Result:** ☐ Pass ☐ Fail

### Check 4: Backup & Recovery

**Review:**
```bash
# Check MongoDB Atlas backup settings
```

**Verify:**
- [ ] Automated backups enabled
- [ ] Retention policy defined
- [ ] Backup encryption enabled
- [ ] Recovery tested (restore from backup)

**Result:** ☐ Pass ☐ Fail

### Check 5: Audit Logging

**Review:**
```bash
# Check if database operations are logged
```

**Verify:**
- [ ] Audit logging enabled (if available)
- [ ] Admin actions logged
- [ ] Logs retained for compliance period
- [ ] Log access restricted

**Result:** ☐ Pass ☐ Fail

**Summary for Domain 6:**
- [ ] 5/5 database security checks pass
- [ ] Failed checks: ________________

**Sign-Off for Domain 6:** Person C _____ (Date/Time)

---

## Domain 7: Compliance & Final Review (Person D)

**Duration:** 1 hour  
**Checks:** 5  
**Target:** All items documented

### Check 1: Terms of Service

- [ ] Terms of Service exists
- [ ] Links from app: ☐ Yes ☐ No
- [ ] Covers user content rights
- [ ] Covers limitation of liability

**Status:** ☐ Present ☐ Missing (flag as issue)

### Check 2: Privacy Policy

- [ ] Privacy Policy exists
- [ ] Links from app: ☐ Yes ☐ No
- [ ] Explains data collection
- [ ] Explains data usage
- [ ] Provides contact for privacy concerns

**Status:** ☐ Present ☐ Missing (flag as issue)

### Check 3: Third-Party Services Disclosure

**Document:**
- Google OAuth: ☐ Yes ☐ No
- Resend (Email): ☐ Yes ☐ No
- Google Gemini AI: ☐ Yes ☐ No
- Vercel Hosting: ☐ Yes ☐ No

**Note:** All third parties disclosed to users: ☐ Yes ☐ No

**Status:** ☐ Complete ☐ Incomplete

### Check 4: COPPA Compliance (if applicable)

- [ ] Age gate if targeting under-13: ☐ Yes ☐ N/A
- [ ] Parental consent if needed: ☐ Yes ☐ N/A
- [ ] No tracking of minors: ☐ Yes ☐ N/A

**Status:** ☐ Compliant ☐ N/A ☐ Action needed

### Check 5: Security Policy

- [ ] Responsible disclosure policy exists
- [ ] security.txt file at /.well-known/security.txt
- [ ] Contact for security issues documented

**Status:** ☐ Present ☐ Missing (flag as issue)

**Summary for Domain 7:**
- [ ] All compliance items addressed
- [ ] Missing items: ________________

**Sign-Off for Domain 7:** Person D _____ (Date/Time)

---

## Security Audit Sign-Off

### Summary of Findings

| Domain | Checks | Pass | Fail | Status |
|--------|--------|------|------|--------|
| Dependencies | 3 | ___ | ___ | ☐ ✓ ☐ ✗ |
| Headers | 10 | ___ | ___ | ☐ ✓ ☐ ✗ |
| Auth | 8 | ___ | ___ | ☐ ✓ ☐ ✗ |
| Data/Privacy | 5 | ___ | ___ | ☐ ✓ ☐ ✗ |
| API Security | 6 | ___ | ___ | ☐ ✓ ☐ ✗ |
| Database | 5 | ___ | ___ | ☐ ✓ ☐ ✗ |
| Compliance | 5 | ___ | ___ | ☐ ✓ ☐ ✗ |
| **TOTAL** | **42** | **___** | **___** | |

### Critical Issues Found

**Count:** ___ (must be 0 for deployment)

```
[List all critical vulnerabilities]
[For each: Issue, Risk, Remediation, Status]
```

### High-Priority Issues

**Count:** ___

```
[List all high-priority issues]
```

### Medium-Priority Issues

**Count:** ___

```
[List all medium-priority issues]
```

### Compliance Status

- [ ] ✅ **Compliant** - Ready for production
- [ ] ⚠️ **Partial** - Some issues found (see above)
- [ ] 🚫 **Not Compliant** - Deployment blocked

### Security Sign-Off

**Security Lead Signature:** _________________ **Date:** _______

**Vulnerability Status:**
- [ ] ✅ **0 Critical Vulnerabilities** - Ready for Pi sign-off
- [ ] ⚠️ Critical issues found (see above - deployment blocked)

**Final Assessment:**
```
[Summary of security posture]
[Any residual risks]
[Recommendations for future]
```

---

**Next Steps:** Pass to Managing Engineer for final gate approval

**Document Owner:** Amp (Managing Engineer)  
**Created:** 2025-11-13  
**Status:** READY FOR EXECUTION
