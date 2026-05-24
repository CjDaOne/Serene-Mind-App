# SereneMind

## Recovery-Oriented Productivity System

SereneMind is a Progressive Web App (PWA) designed to support functional recovery after periods of overwhelm, burnout, anxiety, depression, and executive dysfunction.

It helps users rebuild structure, routine, and daily momentum through adaptive task management, reflection tools, and re-entry-aware workflows.

This system is not therapy software, crisis support, or a diagnostic tool.

---

## Core Design Principles

SereneMind is built around recovery-first product design:

- Interruption is expected, not treated as failure
- Productivity adapts to user capacity, not fixed schedules
- Re-entry after inactivity is supported, not penalized
- Cognitive load reduction is a primary system goal
- Small actions are treated as valid progress

---

## System Overview

SereneMind consists of four core functional layers:

### 1. Adaptive Task System
Tasks are structured beyond simple priority tracking.

Each task can be evaluated by:
- cognitive load
- emotional friction
- energy demand
- urgency

This enables more realistic planning for users experiencing fluctuating capacity.

---

### 2. Minimum Viable Day System
Users can define daily functional capacity levels (e.g. survive, stabilize, productive).

The system adapts task suggestions and expectations based on selected capacity.

---

### 3. Re-Entry Mode
When users return after inactivity, the system reduces cognitive overload by:
- minimizing backlog pressure
- simplifying task visibility
- prioritizing essential actions
- offering structured restart flow

This is a core behavioral feature, not a UI enhancement.

---

### 4. Reflection System
Lightweight mood and journaling tools support:
- emotional tracking
- pattern awareness
- self-reflection over time

This data is used for personal insight, not clinical interpretation.

---

## Tech Stack

| Layer        | Technology |
|-------------|------------|
| Frontend    | Next.js 15 (App Router) + TypeScript |
| Styling     | TailwindCSS + ShadCN UI |
| Backend     | Next.js API Routes |
| Database    | MongoDB |
| Auth        | NextAuth.js |
| PWA         | Service Worker + Web Push API |
| AI Layer    | Google Genkit + Gemini API |
| Testing     | Jest + Playwright |
| Deployment  | Vercel |

---

## Local Development

### Requirements
- Node.js 18+
- MongoDB instance

### Setup

```bash
git clone https://github.com/CjDaOne/Serene-Mind-App.git
cd Serene-Mind-App
npm install
