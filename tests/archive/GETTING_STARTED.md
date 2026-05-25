# 🚀 Getting Started - Serene Mind App

Quick start guide to get Serene Mind App running locally.

---

## ⚡ Quick Start (5 minutes)

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or Atlas)
- **Git**

### Basic Setup

```bash
# 1. Clone the repository
git clone https://github.com/CjDaOne/Serene-Mind-App.git
cd Serene-Mind-App

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI

# 4. Start development server
npm run dev
```

Visit **http://localhost:3001** 🎉

---

## 🔧 Detailed Setup

### 1. Environment Configuration

Copy `.env.local.example` to `.env.local` and configure:

**Required (Minimum):**
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=serene-mind
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3001
```

**Optional (Full Features):**
- Google OAuth (see [DEPLOYMENT.md](DEPLOYMENT.md))
- Email magic link (requires email server)
- Google AI API key (for AI insights)
- Sentry DSN (for error monitoring)

### 2. Database Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Ubuntu/Debian:
sudo apt-get install mongodb

# macOS:
brew install mongodb-community

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Recommended)**

1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Add to `.env.local` as `MONGODB_URI`

See [docs/architecture/DATABASE_SETUP.md](docs/architecture/DATABASE_SETUP.md) for indexes and schemas.

### 3. Development Commands

```bash
# Start dev server (with Turbopack)
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Run tests
npm test                  # Unit tests
npm run test:e2e          # E2E tests
npm run test:e2e:ui       # E2E with UI

# Build for production
npm run build
npm start
```

See [AGENTS.md](AGENTS.md) for all available commands.

---

## 🌐 Try Without Setup

**Guest Mode:** Visit the deployed app and click "Try as Guest" - no setup required!

---

## 🐛 Troubleshooting

### MongoDB connection fails
- Check MongoDB is running: `mongod --version`
- Verify `MONGODB_URI` in `.env.local`
- Check network/firewall settings for Atlas

### Port 3001 already in use
```bash
# Change port in package.json dev script
"dev": "next dev -p 3002"
```

### TypeScript errors
```bash
# Regenerate types
npm run typecheck
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📚 Next Steps

1. **[AGENTS.md](AGENTS.md)** - Learn development workflow
2. **[docs/architecture/](docs/architecture/)** - Understand system architecture
3. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to production
4. **[.github/DOCUMENTATION.md](.github/DOCUMENTATION.md)** - Browse all docs

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test: `npm test && npm run typecheck`
3. Commit with clear message
4. Push and create pull request

---

**Need help?** Check [.github/DOCUMENTATION.md](.github/DOCUMENTATION.md) or create an issue.

**Last updated:** 2025-10-30
