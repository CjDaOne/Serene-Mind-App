# 📚 Serene Mind App - Documentation Navigator

Welcome to the Serene Mind App documentation! This guide will help you find the information you need quickly.

---

## 🚀 Quick Start

**New to the project?** Start here:

1. **[README.md](../README.md)** - Project overview, features, and tech stack
2. **[GETTING_STARTED.md](../GETTING_STARTED.md)** - Setup instructions and first steps
3. **[AGENTS.md](../AGENTS.md)** - Development commands and conventions
4. **[DEPLOYMENT.md](../DEPLOYMENT.md)** - Production deployment guide

---

## 📖 Documentation Index

### 🏗️ Architecture & Technical Design
Located in [`docs/architecture/`](../docs/architecture/)

- **[DATABASE_SETUP.md](../docs/architecture/DATABASE_SETUP.md)** - MongoDB configuration, schemas, and indexes
- **[blueprint.md](../docs/blueprint.md)** - Original project blueprint and design decisions

### ✨ Feature Documentation
Located in [`docs/features/`](../docs/features/)

- **[GUEST_MODE.md](../docs/features/GUEST_MODE.md)** - Technical guide to guest authentication and demo data
- **[GUEST_MODE_FAQ.md](../docs/features/GUEST_MODE_FAQ.md)** - User-facing FAQ for guest mode

### 🔒 Security & Monitoring
Located in [`docs/security/`](../docs/security/)

- **[SENTRY_SETUP.md](../docs/security/SENTRY_SETUP.md)** - Error tracking and monitoring configuration

---

## 📂 Project Structure

```
/
├── README.md                 # Project overview
├── GETTING_STARTED.md        # Quick start guide
├── DEPLOYMENT.md             # Production deployment
├── AGENTS.md                 # Development commands
├── docs/
│   ├── architecture/         # System architecture docs
│   ├── features/             # Feature documentation
│   └── security/             # Security and monitoring
└── archive/                  # Historical documentation
    ├── agent-reports/        # AI agent completion reports
    ├── task-boards/          # Implementation task boards
    └── execution-logs/       # Development logs
```

---

## 🔍 How to Find Information

### "How do I set up the project locally?"
→ [GETTING_STARTED.md](../GETTING_STARTED.md)

### "How do I deploy to production?"
→ [DEPLOYMENT.md](../DEPLOYMENT.md)

### "What commands do I run?"
→ [AGENTS.md](../AGENTS.md) (Commands section)

### "How does guest mode work?"
→ [docs/features/GUEST_MODE.md](../docs/features/GUEST_MODE.md)

### "How is the database structured?"
→ [docs/architecture/DATABASE_SETUP.md](../docs/architecture/DATABASE_SETUP.md)

### "How do I set up error monitoring?"
→ [docs/security/SENTRY_SETUP.md](../docs/security/SENTRY_SETUP.md)

---

## 🤝 Contributing to Documentation

### When to Update Documentation

- **New feature added?** → Create or update relevant guide in `docs/features/`
- **Architecture changed?** → Update `docs/architecture/` documentation
- **New deployment step?** → Update [DEPLOYMENT.md](../DEPLOYMENT.md)
- **New dev command?** → Add to [AGENTS.md](../AGENTS.md)

### Documentation Style Guide

1. **Use clear headings** - Make it scannable
2. **Include code examples** - Show, don't just tell
3. **Link to related docs** - Help users navigate
4. **Keep it concise** - Respect the reader's time
5. **Update dates** - Add "Last updated: YYYY-MM-DD" to major docs

### Where to Put New Documentation

| Type | Location | Example |
|------|----------|---------|
| Essential guide | Root directory | `README.md`, `DEPLOYMENT.md` |
| Architecture | `docs/architecture/` | Database schema, state management |
| Feature docs | `docs/features/` | Guest mode, PWA setup |
| Security | `docs/security/` | Sentry, authentication |
| Historical | `archive/` | Agent reports, task boards |

---

## 🎯 Documentation Goals

Our documentation should be:

- ✅ **Discoverable** - Easy to find what you need
- ✅ **Comprehensive** - Covers all major features
- ✅ **Up-to-date** - Reflects current implementation
- ✅ **Beginner-friendly** - Accessible to new contributors
- ✅ **Well-organized** - Logical structure and navigation

---

## 📋 Quick Reference

### Essential Links

- **Repository:** https://github.com/CjDaOne/Serene-Mind-App
- **Live App:** (Add deployment URL here)
- **Issue Tracker:** https://github.com/CjDaOne/Serene-Mind-App/issues

### Key Technologies

- **Framework:** Next.js 15 (App Router)
- **Database:** MongoDB
- **Auth:** NextAuth.js
- **AI:** Google Genkit + Gemini
- **UI:** ShadCN + TailwindCSS
- **Deployment:** Vercel

### Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run typecheck    # Type checking
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests
```

See [AGENTS.md](../AGENTS.md) for complete command list.

---

## 📞 Getting Help

1. **Check documentation** - Use this guide to navigate
2. **Search issues** - Someone may have asked before
3. **Create an issue** - Describe your problem with context
4. **Update docs** - If you found the answer, help others!

---

**Last updated:** 2025-10-30  
**Maintained by:** Serene Mind Development Team
