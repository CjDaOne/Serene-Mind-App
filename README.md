

🧠 Serene Mind App (Next.js Migration Edition)

A wellness-focused productivity suite powered by Next.js, TailwindCSS, and MongoDB


---

🚀 Overview

Serene Mind is a modern mental wellness and productivity platform designed to help users manage tasks, track moods, and engage in mindful journaling.

This version marks a major migration from Vite + React to Next.js 14 (App Router) — optimizing for scalability, performance, and production-readiness using TailwindCSS, shadcn/ui, and NextAuth.js.


---

🧩 Migration Summary

Area	Old Stack	New Stack

Framework	React (Vite)	Next.js 14 (App Router)
Styling	TailwindCSS	TailwindCSS + shadcn/ui
State Mgmt	useState / Context	Next.js Server Components + Client Hooks
Backend	None / Local JSON	MongoDB via Mongoose
Auth	N/A	NextAuth.js
Deployment	Netlify (manual)	Vercel (auto CI/CD)



---

🏗️ Core Features

🗓️ Task Calendar: Create and view daily tasks with FullCalendar integration

🪞 Mood Tracker: Log and visualize daily moods through charts

📔 Journaling: Reflect with guided prompts

🔐 Authentication: Secure sessions using NextAuth.js

☁️ Database Integration: MongoDB for persistent data

🎨 UI Components: Built with TailwindCSS and shadcn/ui

🧠 AI Integration (Planned): Gemini + Genkit for smart journaling insights



---

⚙️ Tech Stack

Category	Tech

Framework	Next.js 14 (App Router)
Styling	TailwindCSS + shadcn/ui
Database	MongoDB (Mongoose)
Auth	NextAuth.js
Charts	Recharts
Calendar	FullCalendar
Deployment	Vercel
Language	TypeScript



---

🛠️ Local Setup Guide

1️⃣ Clone the Repository

git clone https://github.com/CjDaOne/Serene-Mind-App.git
cd Serene-Mind-App

2️⃣ Install Dependencies

npm install

3️⃣ Configure Environment Variables

Copy .env.example into .env.local:

cp .env.example .env.local

Then update:

MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

4️⃣ Run the Development Server

npm run dev

Visit:
👉 http://localhost:3000


---

📂 Project Structure

Serene-Mind-App/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/
│   ├── calendar/
│   ├── mood/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── TaskModal.tsx
│   ├── JournalModal.tsx
│   └── MoodChart.tsx
│
├── lib/
│   ├── db.ts
│   └── auth.ts
│
├── models/
│   ├── User.ts
│   ├── Task.ts
│   └── Mood.ts
│
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│
├── .env.example
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── package.json


---

🧱 Development Roadmap

Phase 1 – Core Migration

✅ Convert from Vite → Next.js
✅ Add TailwindCSS + shadcn/ui
✅ Create basic layout and pages
✅ Add reusable UI components

Phase 2 – Backend Integration

⬜ Connect MongoDB
⬜ Implement NextAuth.js
⬜ Add API routes for Tasks and Moods

Phase 3 – Frontend Features

⬜ Integrate FullCalendar for task scheduling
⬜ Create MoodChart (Recharts)
⬜ Add JournalModal with autosave

Phase 4 – AI & Insights

⬜ Integrate Genkit (Gemini AI) for journaling insights
⬜ Add vector search + semantic retrieval

Phase 5 – PWA Deployment

⬜ Enable offline mode & caching
⬜ Make installable on mobile (PWA manifest + service worker)
⬜ Deploy to Vercel production


---

🧠 Design Principles

Accessibility-first: WCAG compliant color and contrast

Responsive: Optimized for mobile and desktop

Component-Driven: Modular UI built from shadcn primitives

Wellness-oriented: Minimalist design focused on clarity



---

🧰 Available Scripts

Command	Description

npm run dev	Run local dev server
npm run build	Build for production
npm run lint	Run linter
npm run start	Run production build



---

🌍 Deployment Instructions (Vercel)

1. Push to GitHub


2. Connect your repo to Vercel


3. Add environment variables from .env.local


4. Deploy


5. Verify routes:

/dashboard

/calendar

/mood





---

📘 Contribution Guide

Fork the repo

Create a new branch:

git checkout -b feature/your-feature-name

Commit changes:

git commit -m "Add: feature summary"

Push branch and open a PR



---

❤️ Author

Carl’averis Jackson
Full-Stack Developer | Wellness Tech Builder | Member of 100Devs

📍 Dayton, Ohio
🌐 GitHub: @CjDaOne


---

🔮 Next Steps

[ ] Finalize MongoDB + NextAuth integration

[ ] Add journaling autosave

[ ] Connect AI insight service (Genkit/Gemini)

[ ] Prepare PWA version for mobile install

[ ] Write onboarding guide for new contributors



---


