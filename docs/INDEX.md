# 📚 Documentation Index

Welcome to the Serene Mind App documentation. This is your central hub for all technical documentation, guides, and resources.

---

## 🚀 Getting Started

New to the project? Start here:

- **[Getting Started Guide](../GETTING_STARTED.md)** - Quick setup in 5 minutes
  - Prerequisites and installation
  - Environment configuration
  - Common commands
  - Troubleshooting

- **[README](../README.md)** - Project overview
  - Feature highlights
  - Tech stack
  - Quick start
  - PWA features

- **[Development Guidelines](../AGENTS.md)** - Developer reference
  - NPM commands
  - Code conventions
  - Build configuration
  - Testing approach

---

## 🏗️ Architecture & Design

Understand how the system works:

- **[Architecture Overview](architecture/OVERVIEW.md)** ⭐ **Start here!**
  - System architecture diagram
  - Tech stack deep dive
  - Key design decisions
  - Performance optimizations
  - Data flow diagrams

- **[Database Setup](architecture/DATABASE_SETUP.md)**
  - MongoDB configuration
  - Connection pooling
  - Indexes and optimization
  - Best practices

- **[Types Guide](architecture/TYPES_GUIDE.md)**
  - TypeScript types reference
  - Type definitions
  - Type safety patterns

---

## ✨ Features

Deep dives into specific features:

- **[Guest Mode](features/GUEST_MODE.md)** ⭐
  - Technical architecture
  - JWT session management
  - Demo data handling
  - Limitations and constraints
  - Upgrade flow

- **[Guest Mode FAQ](features/GUEST_MODE_FAQ.md)**
  - Common questions
  - User-facing guide
  - Privacy & security
  - Troubleshooting

---

## 🔐 Security

Security, monitoring, and error tracking:

- **[Sentry Setup](security/SENTRY_SETUP.md)**
  - Error monitoring integration
  - Performance tracking
  - User session replay
  - Alert configuration

---

## 🧪 Testing

Testing strategies and guides:

- **[Testing Guide](testing/TESTING_GUIDE.md)** ⭐
  - Unit testing with Jest
  - E2E testing with Playwright
  - Manual testing checklist
  - Coverage reports
  - Debugging tips

---

## 🚢 Deployment

Production deployment and operations:

- **[Deployment Guide](../DEPLOYMENT.md)** ⭐ **Essential for production**
  - Step-by-step deployment to Vercel
  - MongoDB Atlas setup
  - Google OAuth configuration
  - Email service setup
  - VAPID keys for push notifications
  - Environment variables
  - Post-deployment checklist
  - Monitoring and analytics
  - Troubleshooting

---

## 📖 Additional Resources

### Quick Reference

| Resource | Purpose | When to Use |
|----------|---------|-------------|
| [GETTING_STARTED.md](../GETTING_STARTED.md) | Quick setup guide | First-time setup |
| [README.md](../README.md) | Project overview | Understanding features |
| [AGENTS.md](../AGENTS.md) | Developer reference | Daily development |
| [DEPLOYMENT.md](../DEPLOYMENT.md) | Deployment guide | Going to production |
| [architecture/OVERVIEW.md](architecture/OVERVIEW.md) | System architecture | Understanding codebase |
| [testing/TESTING_GUIDE.md](testing/TESTING_GUIDE.md) | Testing guide | Writing tests |

### By Use Case

**I want to...**

- **Set up the project locally** → [GETTING_STARTED.md](../GETTING_STARTED.md)
- **Understand how authentication works** → [architecture/OVERVIEW.md](architecture/OVERVIEW.md) (Security section)
- **Configure the database** → [architecture/DATABASE_SETUP.md](architecture/DATABASE_SETUP.md)
- **Learn about Guest Mode** → [features/GUEST_MODE.md](features/GUEST_MODE.md)
- **Write tests** → [testing/TESTING_GUIDE.md](testing/TESTING_GUIDE.md)
- **Deploy to production** → [DEPLOYMENT.md](../DEPLOYMENT.md)
- **Set up error monitoring** → [security/SENTRY_SETUP.md](security/SENTRY_SETUP.md)
- **Understand the tech stack** → [architecture/OVERVIEW.md](architecture/OVERVIEW.md)

### By Role

**For Frontend Developers:**
1. [GETTING_STARTED.md](../GETTING_STARTED.md) - Setup
2. [architecture/OVERVIEW.md](architecture/OVERVIEW.md) - Architecture
3. [architecture/TYPES_GUIDE.md](architecture/TYPES_GUIDE.md) - Types
4. [testing/TESTING_GUIDE.md](testing/TESTING_GUIDE.md) - Testing

**For Backend Developers:**
1. [GETTING_STARTED.md](../GETTING_STARTED.md) - Setup
2. [architecture/DATABASE_SETUP.md](architecture/DATABASE_SETUP.md) - Database
3. [architecture/OVERVIEW.md](architecture/OVERVIEW.md) - API design
4. [security/SENTRY_SETUP.md](security/SENTRY_SETUP.md) - Monitoring

**For DevOps Engineers:**
1. [DEPLOYMENT.md](../DEPLOYMENT.md) - Production deployment
2. [architecture/DATABASE_SETUP.md](architecture/DATABASE_SETUP.md) - Database config
3. [security/SENTRY_SETUP.md](security/SENTRY_SETUP.md) - Monitoring setup

**For Product Managers:**
1. [README.md](../README.md) - Feature overview
2. [features/GUEST_MODE.md](features/GUEST_MODE.md) - Guest mode capabilities
3. [features/GUEST_MODE_FAQ.md](features/GUEST_MODE_FAQ.md) - User experience

**For QA Engineers:**
1. [testing/TESTING_GUIDE.md](testing/TESTING_GUIDE.md) - Testing strategy
2. [GETTING_STARTED.md](../GETTING_STARTED.md) - Local setup
3. [README.md](../README.md) - Feature list

---

## 🗂️ Documentation Structure

```
docs/
├── INDEX.md                    # This file - Master index
├── architecture/               # System architecture
│   ├── OVERVIEW.md            # Architecture overview ⭐
│   ├── DATABASE_SETUP.md      # MongoDB configuration
│   └── TYPES_GUIDE.md         # TypeScript types
├── features/                   # Feature documentation
│   ├── GUEST_MODE.md          # Guest mode technical guide ⭐
│   └── GUEST_MODE_FAQ.md      # Guest mode FAQ
├── security/                   # Security & monitoring
│   └── SENTRY_SETUP.md        # Sentry error tracking
└── testing/                    # Testing guides
    └── TESTING_GUIDE.md       # Testing guide ⭐

Root-level documentation:
├── README.md                   # Project overview ⭐
├── GETTING_STARTED.md          # Quick setup guide ⭐
├── DEPLOYMENT.md               # Production deployment ⭐
└── AGENTS.md                   # Development reference
```

⭐ = Essential reading

---

## 🔍 Finding What You Need

### Search by Topic

**Authentication & Authorization**
- [architecture/OVERVIEW.md](architecture/OVERVIEW.md) → "Security Architecture" section
- [features/GUEST_MODE.md](features/GUEST_MODE.md) → Guest authentication
- [DEPLOYMENT.md](../DEPLOYMENT.md) → Google OAuth setup

**Database**
- [architecture/DATABASE_SETUP.md](architecture/DATABASE_SETUP.md) → Complete database guide
- [architecture/OVERVIEW.md](architecture/OVERVIEW.md) → Database schema

**AI Features**
- [architecture/OVERVIEW.md](architecture/OVERVIEW.md) → "AI Integration" section
- [README.md](../README.md) → AI features overview

**Progressive Web App (PWA)**
- [README.md](../README.md) → PWA features section
- [testing/TESTING_GUIDE.md](testing/TESTING_GUIDE.md) → PWA testing
- [DEPLOYMENT.md](../DEPLOYMENT.md) → VAPID keys for notifications

**Testing**
- [testing/TESTING_GUIDE.md](testing/TESTING_GUIDE.md) → Complete testing guide
- [AGENTS.md](../AGENTS.md) → Test commands

**Deployment**
- [DEPLOYMENT.md](../DEPLOYMENT.md) → Complete deployment guide
- [architecture/DATABASE_SETUP.md](architecture/DATABASE_SETUP.md) → Database deployment

---

## 🆕 Contributing to Documentation

### Documentation Standards

1. **Use clear headings** with emoji for visual scanning
2. **Include code examples** for technical content
3. **Link to related docs** for context
4. **Keep it concise** - avoid unnecessary detail
5. **Update INDEX.md** when adding new docs

### File Naming Conventions

- Use `SCREAMING_SNAKE_CASE.md` for documentation files
- Place in appropriate subdirectory (architecture, features, security, testing)
- Update this INDEX.md with links and descriptions

### Adding New Documentation

1. Create markdown file in appropriate `docs/` subdirectory
2. Add entry to this INDEX.md with description
3. Link from related documentation
4. Test all links work correctly

---

## 📝 Documentation Changelog

### 2025-10-30
- ✅ Created GETTING_STARTED.md (quick setup guide)
- ✅ Created docs/INDEX.md (master documentation index)
- ✅ Created architecture/OVERVIEW.md (system architecture)
- ✅ Created testing/TESTING_GUIDE.md (comprehensive testing guide)
- ✅ Organized docs into subdirectories (architecture, features, security, testing)
- ✅ Improved README.md structure and clarity

### 2025-10-29
- ✅ Guest Mode documentation (GUEST_MODE.md, GUEST_MODE_FAQ.md)
- ✅ Updated DEPLOYMENT.md with comprehensive guide
- ✅ Updated AGENTS.md with development commands

---

## 🆘 Need Help?

Can't find what you're looking for?

1. **Check this INDEX** - Use Cmd/Ctrl+F to search
2. **Read GETTING_STARTED.md** - Covers most common questions
3. **Browse architecture/OVERVIEW.md** - System-level understanding
4. **Search the codebase** - Code is well-commented
5. **Open an issue** - [GitHub Issues](https://github.com/CjDaOne/Serene-Mind-App/issues)

---

## 🎯 Common Workflows

### Setting Up Development Environment
1. [GETTING_STARTED.md](../GETTING_STARTED.md) → Follow quick setup
2. [architecture/DATABASE_SETUP.md](architecture/DATABASE_SETUP.md) → Configure MongoDB
3. [AGENTS.md](../AGENTS.md) → Learn development commands

### Understanding the Codebase
1. [README.md](../README.md) → Project overview
2. [architecture/OVERVIEW.md](architecture/OVERVIEW.md) → Architecture deep dive
3. [architecture/TYPES_GUIDE.md](architecture/TYPES_GUIDE.md) → TypeScript types

### Deploying to Production
1. [DEPLOYMENT.md](../DEPLOYMENT.md) → Complete deployment guide
2. [architecture/DATABASE_SETUP.md](architecture/DATABASE_SETUP.md) → Production database setup
3. [security/SENTRY_SETUP.md](security/SENTRY_SETUP.md) → Error monitoring (optional)

### Writing Tests
1. [testing/TESTING_GUIDE.md](testing/TESTING_GUIDE.md) → Testing strategies
2. [AGENTS.md](../AGENTS.md) → Test commands
3. [architecture/OVERVIEW.md](architecture/OVERVIEW.md) → System understanding

---

**Last Updated:** 2025-10-30  
**Maintained By:** Development Team  
**Questions?** Open an issue on [GitHub](https://github.com/CjDaOne/Serene-Mind-App/issues)
