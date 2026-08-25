# 📊 PulseHub — Live Voting & Polling Platform

PulseHub is a full-stack, real-time polling and voting application. Create polls with multiple questions, share them instantly via link or QR code, and watch responses roll in live — no page refresh needed.

**Live App:** [pulsehub-board.vercel.app](https://pulsehub-board.vercel.app/)
**Repo:** [github.com/intekhabx/pulse-hub-live-voting](https://github.com/intekhabx/pulse-hub-live-voting)

---

## ✨ Features

- **Poll creation & management** — Multi-question polls with per-question options, draft/active status, and expiry dates
- **Real-time results** — Live vote updates pushed to the dashboard via WebSockets (Socket.IO), no polling/refresh required
- **Anonymous or authenticated voting** — Poll owners can allow anonymous responses or require sign-in
- **Shareable QR codes** — Every poll gets a scannable QR code for quick, in-person distribution
- **Analytics dashboard** — Per-poll and account-wide analytics with recent activity tracking
- **Auth options** — Email/password login plus OAuth via **Google** and **GitHub**, with account linking/unlinking support
- **Auto-expiring polls** — Background worker (BullMQ + Redis) automatically closes polls once they hit their expiry time
- **Published results** — Poll owners can publish results publicly

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| TanStack Router | Type-safe routing |
| Tailwind CSS v4 | Styling |
| Socket.IO Client | Real-time updates |
| Axios | HTTP client |
| qrcode.react | QR code generation |
| react-hot-toast | Notifications |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express 5 + TypeScript | API server |
| MongoDB + Mongoose | Primary database |
| Redis + ioredis | Caching / queue backing store |
| BullMQ | Background jobs (poll expiry worker) |
| Socket.IO | Real-time vote broadcasting |
| JWT (access + refresh tokens) | Authentication |
| Google & GitHub OAuth (googleapis) | Social login |
| Zod | Request validation |
| Helmet, express-rate-limit, cookie-parser | Security & hardening |
| Bun | Package manager / runtime |

---

## 📁 Project Structure

```
pulse-hub-live-voting/
├── backend/
│   └── src/
│       ├── config/          # DB, Redis, BullMQ, Google OAuth config
│       ├── middleware/      # Auth, validation, error handling
│       ├── modules/
│       │   ├── auth/        # Register, login, OAuth, session
│       │   ├── polls/       # Poll CRUD, voting, analytics
│       │   └── response/    # Dashboard aggregate data
│       ├── socket/          # Socket.IO setup & auth
│       ├── workers/         # Poll expiry background worker
│       └── server.ts
│
└── frontend/
    └── src/
        ├── components/
        │   └── Dashboard/   # Sidebar, TopNavBar, StatCards, QR, Delete modal, etc.
        ├── routes/           # TanStack Router pages (auth, dashboard, votes)
        ├── Context/          # Global app state
        ├── services/         # API layer
        └── utils/
```

---

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.com) installed
- A MongoDB connection URI
- A Redis connection URI
- Google & GitHub OAuth app credentials (optional, for social login)

### 1. Clone the repo
```bash
git clone https://github.com/intekhabx/pulse-hub-live-voting.git
cd pulse-hub-live-voting
```

### 2. Backend setup
```bash
cd backend
bun install
cp .env.example .env   # fill in your MongoDB, Redis, JWT, and OAuth values
bun run dev
```

### 3. Frontend setup
```bash
cd frontend
bun install
cp .env.example .env   # set VITE_API_URL and VITE_BASE_URL
bun run dev
```

### Environment Variables

**backend/.env**
```
PORT=5000
MONGODB_URI=
JWT_ACCESS_TOKEN=
JWT_ACCESS_EXPIRES_IN=10m
JWT_REFRESH_TOKEN=
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=
REDIS_URI=
FRONTEND_BASE_URL=
NODE_ENV=development
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=
GOOGLE_CONNECT_CALLBACK_URL=
GITHUB_CONNECT_CALLBACK_URL=
```

**frontend/.env**
```
VITE_API_URL=your-backend-url
VITE_BASE_URL=your-frontend-url
```

---

## 📡 API Overview

| Module | Endpoints |
|---|---|
| **Auth** | register, login, logout, refresh-token, user-session, Google/GitHub OAuth login & connect/disconnect |
| **Polls** | create-poll, create-poll-draft, update-poll, publish-poll, get-mypolls, get-poll/:id, submit-vote/:id, get-poll-analytics, delete-poll |
| **Response** | get-data (dashboard summary) |

---

## 🌐 Deployment

- **Frontend** — Deployed on [Vercel](https://vercel.com)
- **Backend** — Node/Express API (Socket.IO + Redis + MongoDB)

---

## 👤 Author

**Intekhab**
- GitHub: [@intekhabx](https://github.com/intekhabx)
