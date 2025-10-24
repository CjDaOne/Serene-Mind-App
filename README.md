# 🌿 Serene Mind App

**Empowering wellness through self-awareness, reflection, and productivity.**

Serene Mind is a personal wellness suite designed to support users managing depression, anxiety, and PTSD. It combines **task management**, **journaling**, and **mood tracking** into a unified experience.

---

## 🧠 Current Version: Next.js Production Build

* Framework: **Next.js 15** with App Router, TypeScript, and TailwindCSS
* UI: ShadCN UI components with custom design system
* AI: Google Genkit + Gemini API for insights and suggestions
* Auth: NextAuth.js with Google OAuth
* Database: MongoDB (planned integration)
* Deployment: Vercel-ready configuration

---

**Migration Goals:**

* Convert frontend from **Vite + React → Next.js 15 (App Router)**
* Maintain styling with **TailwindCSS + ShadCN UI**
* Integrate **NextAuth.js** for authentication
* Connect to **MongoDB Atlas** via **Mongoose**
* Add AI-powered journaling features with **Google Genkit / Gemini API**
* Implement **vector search and LangChain.js** for enhanced journaling insights
* Prepare for **Vercel deployment** with PWA support

---

## 🧩 Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | Next.js 15 (App Router) + TypeScript    |
| Styling    | TailwindCSS + ShadCN UI                 |
| Backend    | Next.js API routes                      |
| Auth       | NextAuth.js                             |
| AI Layer   | Google Genkit + Gemini API              |
| Database   | MongoDB (planned)                       |
| State      | Zustand                                 |
| Deployment | Vercel                                  |
| Dev Tools  | Git, GitHub, VS Code                    |

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

# Run development server
npm run dev
```

App will be available at: [http://localhost:3000](http://localhost:3000)

---

## 🚀 AI Development

```bash
# Run AI flows locally
npm run genkit:dev
```

---



---

## 🧑‍💻 Developer Guide

| Action                   | Command         |
| ------------------------ | --------------- |
| Install dependencies     | `npm install`   |
| Start development server | `npm run dev`   |
| Build for production     | `npm run build` |
| Lint code                | `npm run lint`  |

---

## 🧾 License

MIT License © 2025 Carl’averis Jackson

---

## 💬 Contributing

Contributions, suggestions, and pull requests are welcome! Please open an issue before submitting PRs for discussion.

---

## 🪴 Notes

The Serene Mind project is part of an ongoing mission to support emotional wellness through thoughtful technology. Each iteration brings us closer to a fully accessible, AI-assisted wellness platform.


