# 🌿 Serene Mind App

**Empowering wellness through self-awareness, reflection, and productivity.**

Serene Mind is a personal wellness suite designed to support users managing depression, anxiety, and PTSD. It combines **task management**, **journaling**, and **mood tracking** into a unified experience.

---

## 🧠 Current Version: Next.js Production Build

* Framework: **Next.js 15** with App Router, TypeScript, and TailwindCSS
* UI: ShadCN UI components with custom design system
* AI: Google Genkit + Gemini API for insights and suggestions
* Auth: NextAuth.js with Google OAuth
* Database: MongoDB with user data isolation
* Deployment: Vercel-ready configuration

---

## 🧩 Core Features

- **Dashboard View**: Overview with tasks, mood tracker, and journal insights
- **Task Management**: Create, edit, complete, and delete tasks with subtasks and AI subtask suggestions
- **Journaling**: Emotional reflection with mood tracking and AI-powered insights
- **Calendar View**: Visual task planning and progress tracking
- **Affirmations**: Daily positive affirmations library
- **Rewards System**: Achievement tracking and gamification with wellness points
- **AI Integration**: Subtask suggestions and journal insights via Google Gemini
- **Authentication**: Secure Google OAuth with session management
- **Data Persistence**: MongoDB with user-specific data isolation

## 🤖 Agent System

- **Core Agent**: Orchestrates development tasks and infrastructure validation
- **DB Agent**: MongoDB connection validation and API route checks
- **Auth Agent**: Authentication flow management and session verification
- **Data Agent**: State management migration and React Query integration
- **Docs Agent**: Automated documentation updates and project maintenance

---

## 🧩 Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | Next.js 15 (App Router) + TypeScript    |
| Styling    | TailwindCSS + ShadCN UI                 |
| Backend    | Next.js API routes                      |
| Auth       | NextAuth.js                             |
| AI Layer   | Google Genkit + Gemini API              |
| Database   | MongoDB with user data isolation        |
| State      | Zustand + React Query                   |
| Testing    | Jest + Testing Library                  |
| Automation | Custom Agent System                     |
| Deployment | Vercel                                  |

---

## 🧱 Local Development Setup

```bash
# Clone repository
git clone https://github.com/CjDaOne/Serene-Mind-App.git
cd Serene-Mind-App

# Switch to development branch
git checkout dev

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
# MONGODB_URI=mongodb://localhost:27017/serene-mind
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
# NEXTAUTH_SECRET=your_random_secret
# NEXTAUTH_URL=http://localhost:3001

# Start MongoDB (local)
sudo systemctl start mongod

# Run development server
npm run dev
```

App will be available at: [http://localhost:3001](http://localhost:3001)

## 🤖 Agent System Usage

```bash
# Run the complete agent system for infrastructure validation
npx tsx agents/core-agent.ts

# Check agent execution logs
cat agents/logs/agent-log.md
```

## 🚀 AI Development

```bash
# Run AI flows locally
npm run genkit:dev
```

## 🧾 License

MIT License © 2025 Carl’averis Jackson

---

## 💬 Contributing

Contributions, suggestions, and pull requests are welcome! Please open an issue before submitting PRs for discussion.

---

## 🪴 Notes

The Serene Mind project is part of an ongoing mission to support emotional wellness through thoughtful technology. Each iteration brings us closer to a fully accessible, AI-assisted wellness platform.


