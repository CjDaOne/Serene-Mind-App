# 🌿 Serene Mind App

**Empowering wellness through self-awareness, reflection, and productivity.**

Serene Mind is a **Progressive Web App (PWA)** designed to support users managing depression, anxiety, and PTSD. It combines **task management**, **journaling**, **mood tracking**, and **AI-powered insights** into a unified, installable experience that works offline.

---

## 🌟 Current Version: Production-Ready PWA

- **Framework:** Next.js 15 with App Router, TypeScript, and TailwindCSS
- **UI:** ShadCN UI components with custom design system
- **AI:** Google Genkit + Gemini API for intelligent insights
- **Auth:** NextAuth.js with Google OAuth + Email Magic Link
- **Database:** MongoDB with user data isolation
- **PWA:** Full offline support with service worker caching
- **Notifications:** Web Push API for task and wellness reminders
- **Deployment:** Vercel-ready with comprehensive configuration

---

## ✨ Core Features

### 📱 Progressive Web App (PWA)
- **Installable on all devices:** Add to home screen on iOS, Android, desktop
- **Offline-first architecture:** Access your tasks and journal entries without internet
- **Push notifications:** Receive reminders and wellness prompts
- **Fast & responsive:** Optimized caching for instant load times
- **App-like experience:** Fullscreen mode, app icons, splash screens

### 🔐 Flexible Authentication
- **Google OAuth:** One-click sign-in with your Google account
- **Email Magic Link:** Passwordless authentication via email (no password to remember)
- **Secure sessions:** JWT-based authentication with MongoDB session storage
- **Protected routes:** Automatic redirect to login for authenticated pages

### 📊 Wellness Dashboard
- **Mood tracking:** Visual mood trends and patterns over time
- **Task overview:** See your daily tasks and progress at a glance
- **Journal insights:** AI-powered analysis of your emotional patterns
- **Quick actions:** Add tasks, journal entries, and track mood in one place

### ✅ Smart Task Management
- **Intuitive task creation:** Add, edit, complete, and delete tasks
- **AI subtask suggestions:** Get intelligent task breakdowns
- **Priority levels:** Organize by importance and urgency
- **Calendar view:** Visual task planning and progress tracking
- **Completion tracking:** Monitor your productivity over time

### 📔 Journaling with AI Insights
- **Emotional reflection:** Express your thoughts and feelings
- **AI-powered analysis:** Get personalized insights from your entries
- **Mood correlation:** Connect emotions with daily activities
- **Private & secure:** All data encrypted and user-isolated
- **Rich text support:** Format your entries for better organization

### 🎯 Additional Features
- **Daily affirmations:** Positive affirmations library for mental wellness
- **Rewards system:** Achievement tracking and gamification
- **Calendar integration:** Visual planning and progress tracking
- **Dark mode:** Easy on the eyes for any time of day
- **Responsive design:** Perfect experience on any screen size

---

## 🏗️ Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Frontend     | Next.js 15 (App Router) + TypeScript    |
| Styling      | TailwindCSS + ShadCN UI                 |
| Backend      | Next.js API routes                      |
| Auth         | NextAuth.js (OAuth + Email)             |
| AI Layer     | Google Genkit + Gemini API              |
| Database     | MongoDB with user data isolation        |
| State Mgmt   | Zustand + React Query                   |
| PWA          | Service Worker + Web Push API           |
| Testing      | Jest + Testing Library                  |
| Deployment   | Vercel                                  |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier)
- Google Cloud account (for OAuth)
- Email service account (Resend recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/CjDaOne/Serene-Mind-App.git
cd Serene-Mind-App

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials (see setup guide below)

# 4. Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

---

## ⚙️ Environment Setup

### Required Environment Variables

Create a `.env.local` file with the following variables:

#### 1. MongoDB Configuration
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serene-mind
MONGODB_DB=serene-mind
```

Get your MongoDB URI from [MongoDB Atlas](https://cloud.mongodb.com).

#### 2. NextAuth Configuration
```env
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl
NEXTAUTH_URL=http://localhost:3000
```

Generate secret: `openssl rand -base64 32`

#### 3. Google OAuth
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

Get credentials from [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

**OAuth Callback URL:** `http://localhost:3000/api/auth/callback/google`

#### 4. Email Authentication (Magic Link)
```env
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
```

**Recommended:** Use [Resend](https://resend.com) (free tier available).  
**Alternatives:** SendGrid, AWS SES, Mailgun, Postmark.

#### 5. Push Notifications (PWA)
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:noreply@yourdomain.com
```

Generate VAPID keys: `npx web-push generate-vapid-keys`

#### 6. Google AI (Gemini)
```env
GOOGLE_GENAI_API_KEY=your-google-ai-api-key
GENKIT_MODEL=gemini-2.0-flash
```

Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

**See `.env.local.example` for complete configuration with detailed comments.**

---

## 📱 PWA Features & Setup

### Installing as PWA

#### On Mobile (iOS/Android)
1. Open the app in Safari (iOS) or Chrome (Android)
2. Tap the share button / menu
3. Select "Add to Home Screen"
4. The app will appear as a native app icon

#### On Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Or go to Menu → Install Serene Mind App
3. The app opens in its own window

### Offline Capabilities

The app works completely offline after first load:

- ✅ View cached tasks and journal entries
- ✅ Navigate between pages
- ✅ Access daily affirmations
- ✅ View mood tracking history
- ❌ Create new entries (requires internet)
- ❌ AI insights generation (requires internet)

**Note:** New data syncs automatically when connection is restored.

### Push Notifications

Enable notifications to receive:

- **Task reminders:** Get notified when tasks are due
- **Wellness prompts:** Daily check-in reminders
- **Journal reminders:** Evening reflection prompts
- **Achievement alerts:** Celebrate your progress

**Setup:**
1. Click "Enable Notifications" in settings
2. Allow notifications when prompted by browser
3. Notifications work even when app is closed

---

## 🛠️ Development

### Available Commands

```bash
# Development server (runs on port 3001 with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint

# Run tests
npm test

# AI development (Google Genkit)
npm run genkit:dev      # Start Genkit developer UI
npm run genkit:watch    # Auto-reload on changes
```

### Project Structure

```
serene-mind-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard page
│   │   ├── tasks/              # Task management
│   │   ├── journal/            # Journaling interface
│   │   ├── calendar/           # Calendar view
│   │   ├── affirmations/       # Daily affirmations
│   │   ├── rewards/            # Rewards system
│   │   ├── api/                # API routes
│   │   ├── auth/               # Authentication pages
│   │   ├── offline/            # Offline fallback page
│   │   ├── manifest.ts         # PWA manifest
│   │   └── sw.ts               # Service worker
│   ├── components/             # React components
│   │   ├── ui/                 # ShadCN UI components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── tasks/              # Task components
│   │   └── journal/            # Journal components
│   ├── lib/                    # Utility functions
│   │   ├── mongodb.ts          # Database connection
│   │   ├── types.ts            # TypeScript types
│   │   └── utils.ts            # Helper functions
│   ├── ai/                     # AI flows and configuration
│   │   ├── flows/              # Genkit AI flows
│   │   └── genkit.ts           # AI configuration
│   └── hooks/                  # Custom React hooks
├── public/                     # Static assets
│   ├── icons/                  # PWA icons
│   └── images/                 # App images
├── .env.local.example          # Environment variables template
├── DEPLOYMENT.md               # Deployment guide
└── README.md                   # This file
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project" → Import from GitHub
   - Select your repository

3. **Configure Environment Variables:**
   - Add all variables from `.env.local.example`
   - Set for Production, Preview, and Development environments

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live! 🎉

5. **Update OAuth Callbacks:**
   - Add Vercel URL to Google OAuth authorized redirect URIs:
     ```
     https://your-app.vercel.app/api/auth/callback/google
     ```

**For detailed step-by-step instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).**

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify:** Use Next.js runtime
- **AWS Amplify:** Connect GitHub repository
- **Railway:** One-click Next.js deployment
- **Self-hosted:** Run `npm run build` and `npm start`

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

The app includes tests for:

- ✅ Component rendering
- ✅ User interactions
- ✅ API routes
- ✅ Authentication flows
- ✅ Database operations
- ✅ AI integration

---

## 🤖 AI Integration

### Journaling Insights

The app uses Google Gemini AI to provide:

- **Emotional pattern analysis:** Identify recurring themes
- **Mood trend insights:** Understand emotional fluctuations
- **Reflection prompts:** Guided questions for deeper introspection
- **Coping strategy suggestions:** Personalized wellness tips

### Task Suggestions

AI-powered features for task management:

- **Smart subtask generation:** Break down complex tasks
- **Priority recommendations:** Suggest task importance
- **Time estimates:** Predict task duration
- **Related task suggestions:** Find connected activities

### Privacy & Security

- ✅ All AI processing uses Google's Gemini API (no data storage)
- ✅ Journal entries are private and user-isolated
- ✅ No data sharing with third parties
- ✅ MongoDB encryption at rest
- ✅ HTTPS encryption in transit

---

## 📄 License

MIT License © 2025 Carl'averis Jackson

See [LICENSE](LICENSE) file for details.

---

## 💬 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

**Please open an issue first to discuss major changes.**

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have an idea? [Open an issue](https://github.com/CjDaOne/Serene-Mind-App/issues) on GitHub.

---

## 📞 Support

- **Documentation:** See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- **API Reference:** Check [AGENTS.md](AGENTS.md) for development guidelines
- **Issues:** Report bugs via GitHub Issues
- **Discussions:** Join GitHub Discussions for questions

---

## 🪴 Project Philosophy

The Serene Mind project is part of an ongoing mission to support emotional wellness through thoughtful technology. Each iteration brings us closer to a fully accessible, AI-assisted wellness platform that:

- **Respects privacy:** Your data is yours alone
- **Reduces friction:** Simple, intuitive interfaces
- **Promotes wellness:** Evidence-based features
- **Stays accessible:** Free and open-source
- **Works everywhere:** Progressive Web App technology

---

## 🎯 Roadmap

### Coming Soon

- [ ] **Data export:** Download your journal and tasks as PDF/JSON
- [ ] **Mood analytics:** Advanced mood tracking with charts
- [ ] **Habit tracking:** Build positive daily habits
- [ ] **Community features:** Optional peer support (fully private)
- [ ] **Therapist portal:** Share selected insights with healthcare providers
- [ ] **Voice journaling:** Speak your thoughts, AI transcribes
- [ ] **Multi-language support:** Internationalization (i18n)
- [ ] **Desktop app:** Electron wrapper for native desktop experience

---

## 🙏 Acknowledgments

Built with:

- [Next.js](https://nextjs.org) - React framework
- [ShadCN UI](https://ui.shadcn.com) - Component library
- [NextAuth.js](https://next-auth.js.org) - Authentication
- [MongoDB](https://mongodb.com) - Database
- [Google Gemini](https://ai.google.dev) - AI insights
- [Vercel](https://vercel.com) - Hosting platform
- [TailwindCSS](https://tailwindcss.com) - Styling

Special thanks to the open-source community for making this possible.

---

**Ready to deploy?** Check out [DEPLOYMENT.md](DEPLOYMENT.md) for the complete guide! 🚀
