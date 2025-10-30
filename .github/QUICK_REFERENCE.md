# ⚡ Quick Reference - Serene Mind App

One-page cheat sheet for common tasks.

---

## 🚀 Setup (First Time)

```bash
git clone https://github.com/CjDaOne/Serene-Mind-App.git
cd Serene-Mind-App
npm install
cp .env.local.example .env.local
# Edit .env.local with MongoDB URI
npm run dev  # → http://localhost:3001
```

---

## 💻 Development Commands

```bash
npm run dev              # Dev server (port 3001)
npm run build            # Production build
npm run typecheck        # TypeScript check
npm run lint             # ESLint check
npm test                 # Unit tests (Jest)
npm run test:e2e         # E2E tests (Playwright)
npm run test:e2e:ui      # E2E with UI
```

---

## 📂 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # ShadCN components
│   └── {feature}/   # Feature-specific
├── lib/             # Utilities & types
├── ai/              # Google Genkit flows
└── middleware.ts    # Auth & routing
```

---

## 🔧 Environment Variables

**Minimum (Guest Mode):**
```env
MONGODB_URI=your-mongo-uri
MONGODB_DB=serene-mind
NEXTAUTH_SECRET=random-secret
NEXTAUTH_URL=http://localhost:3001
```

**Full Features:** See `.env.local.example`

---

## 🗄️ Database Collections

- `users` - User accounts
- `tasks` - User tasks
- `journals` - Journal entries
- `affirmations` - Affirmations library
- `sessions` - NextAuth sessions
- `pushSubscriptions` - PWA push notifications

---

## 🔐 Auth Providers

- Guest Mode (JWT, 30 min sessions)
- Google OAuth
- Email Magic Link

---

## 📚 Key Documentation

| Need | Link |
|------|------|
| Setup | [GETTING_STARTED.md](../GETTING_STARTED.md) |
| Deploy | [DEPLOYMENT.md](../DEPLOYMENT.md) |
| Commands | [AGENTS.md](../AGENTS.md) |
| Database | [docs/architecture/DATABASE_SETUP.md](../docs/architecture/DATABASE_SETUP.md) |
| Guest Mode | [docs/features/GUEST_MODE.md](../docs/features/GUEST_MODE.md) |
| All Docs | [DOCUMENTATION.md](DOCUMENTATION.md) |

---

## 🐛 Common Issues

**MongoDB connection fails:**
```bash
# Check URI in .env.local
# Verify MongoDB is running
```

**Port 3001 in use:**
```bash
# Change port: npm run dev -- -p 3002
```

**TypeScript errors:**
```bash
rm -rf .next
npm run typecheck
```

**Build fails:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 🎨 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** ShadCN + TailwindCSS
- **Database:** MongoDB
- **Auth:** NextAuth.js
- **AI:** Google Genkit + Gemini
- **Testing:** Jest + Playwright
- **Deployment:** Vercel

---

## 🔗 Quick Links

- **Repo:** https://github.com/CjDaOne/Serene-Mind-App
- **Docs:** [.github/DOCUMENTATION.md](DOCUMENTATION.md)
- **Issues:** https://github.com/CjDaOne/Serene-Mind-App/issues

---

**Updated:** 2025-10-30
