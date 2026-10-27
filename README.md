# PulseHub — Live Voting & Polling Platform

PulseHub is a full-stack, real-time polling platform. Build polls by hand or let an **AI assistant** draft them for you, share them with a link or QR code, and watch votes arrive live on your dashboard. It includes subscription plans (Razorpay), CSV export, and white-label **custom branding** for Premium users.

**Live App:** [pulsehub-board.vercel.app](https://pulsehub-board.vercel.app/)
**Repo:** [github.com/intekhabx/pulse-hub-live-voting](https://github.com/intekhabx/pulse-hub-live-voting)

---

## Table of Contents

- [Features](#features)
- [Plans](#plans)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Frontend Routes](#frontend-routes)
- [Deployment](#deployment)
- [Author](#author)

---

## Features

### Polls
- **Multi-question polls** with per-question options, a "required" flag per question, a title, description and expiry date
- **Draft and active status:** save a poll as a draft, edit it freely, then activate it. Active polls allow editing the basic details (title, description, expiry, anonymous setting)
- **Auto-expiry:** every poll gets a delayed BullMQ job that marks it expired and adds it to your recent activity
- **Anonymous or authenticated voting:** the owner decides whether people can vote without signing in. One vote per person per poll, tracked by user ID or a signed anonymous cookie
- **Share anywhere:** copy the public voting link or download a **QR code** (PNG) for each poll
- **Publish results:** make results public so voters see live percentages on the voting page

### AI Poll Assistant
- A chat panel inside the Create Poll page (side panel on desktop, popup on small screens)
- Asks only for what is missing (topic, expiry, anonymous or not) using tappable options, then generates the title, description, questions and options and **fills the form for you**
- Can research current topics on the web and works out relative expiry times in IST
- Guardrails reject requests that are not about creating polls
- Each plan has a monthly AI credit limit (see [Plans](#plans))

### Real-time dashboard
- Votes, new polls, deletions and expiries are pushed over **Socket.IO** with no page refresh
- **Overview** with account-wide stats and a recent-activity feed
- **Analytics** per poll: anonymous vs authenticated split, per-question results, daily and hourly response trends, and day-of-week breakdown

### Accounts & authentication
- Email and password sign-up and login
- **Google** and **GitHub** OAuth login
- Connect or disconnect Google and GitHub from **Settings**, and link an OAuth login to an existing email account after confirming the password
- Short-lived access tokens with a refresh token in an HTTP-only cookie, with automatic refresh
- Update profile and password, export data, and delete your account

### Subscriptions & payments
- **Free, Pro and Premium** plans billed monthly through **Razorpay** subscriptions
- Upgrade Pro to Premium (the old subscription is replaced), cancel anytime and keep access until the billing period ends
- Razorpay **webhooks** keep each subscription's status in sync
- Plan limits are enforced on the server: polls, questions per poll, responses per poll and AI calls

### Premium extras
- **Custom branding:** upload a logo (stored on ImageKit), set a brand name, primary colour, website URL and footer text. Turn on **Apply Custom Branding** per poll to show your brand on the public voting page
- **CSV export** of poll results (Pro and Premium), for a single poll or all polls
- **Priority support**

### Other
- Dark and light theme (remembered per browser)
- Landing page with Features, How It Works, Pricing, About and Contact sections
- Contact form, plus Privacy Policy, Terms & Conditions and Refund & Cancellation pages
- Fully responsive dashboard

---

## Plans

| | Free | Pro | Premium |
|---|---|---|---|
| **Price** | ₹0 | ₹99 / month | ₹299 / month |
| Polls | 3 | 50 | Unlimited |
| Questions per poll | 5 | 25 | Unlimited |
| Responses per poll | 100 | 2,500 | Unlimited |
| AI credits | 3 | 49 | 199 |
| Advanced analytics | No | Yes | Yes |
| CSV export | No | Yes | Yes |
| Custom branding | No | No | Yes |
| Priority support | No | No | Yes |

The limits live in `backend/src/constants/subscription-plan-details.ts` (and are mirrored in the Pricing component).

---

## Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite | Build tool and dev server |
| TanStack Router | File-based, type-safe routing |
| Tailwind CSS v4 | Styling |
| Socket.IO Client | Real-time updates |
| Axios | HTTP client with token refresh |
| qrcode.react | QR code generation |
| react-hot-toast | Notifications |
| Razorpay Checkout | Payments |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express 5 + TypeScript | API server (run with `tsx`) |
| MongoDB + Mongoose | Database, including transactions for plan limits |
| Redis (ioredis) | AI chat history and usage counters, recent activity, login OTPs, BullMQ backing store |
| BullMQ | Background jobs (poll expiry, subscription lifecycle) |
| Socket.IO | Real-time events, authenticated with the JWT |
| JWT + signed cookies | Authentication and anonymous voter identity |
| Google and GitHub OAuth | Social login and account connect |
| Zod | Request validation |
| Razorpay | Subscriptions and webhooks |
| LangChain + Google Gemini | AI poll agent |
| Tavily | Web search tool for the agent |
| Multer + ImageKit | Brand logo upload and hosting |
| Helmet, express-rate-limit, CORS | Security and hardening |

---

## How It Works

### Real-time updates
When a user opens the dashboard, the frontend connects to Socket.IO with the access token. The server verifies it and puts the socket in a private room, `user:<id>`. Whenever something changes the server emits to that room:

| Event | Fired when |
|---|---|
| `server:poll-created` | A poll is created or saved |
| `server:poll-updated` | Someone votes (carries fresh analytics) |
| `server:poll-deleted` | A poll is deleted |
| `server:poll-expired` | The expiry worker closes a poll |

### AI agent flow

```
User message
   |
   v
Input guardrail (Gemini) ---- not about polls? --> friendly rejection
   |
   v
Poll agent (LangChain + Gemini)
   |-- tool: get_current_datetime (Asia/Kolkata)
   |-- tool: web_search (Tavily)
   v
Structured response
   |-- "require-input"  -> asks for the missing detail (2-3 options)
   '-- "final-output"   -> title, description, questions, expiry, anonymous flag
                              |
                              v
                     Frontend fills the poll form
```

- Chat history is stored in Redis per user (latest 20 messages, 30-day TTL) and can be cleared from the chat panel
- Usage is counted per user in Redis over a 30-day window and checked against the plan's AI credits
- If the user cancels a request, the in-flight agent call is aborted

### Poll expiry and subscriptions
- Creating a poll with a future expiry adds a **delayed BullMQ job** (`poll-expiry-<pollId>`). Editing or deleting the poll removes or replaces the job
- Razorpay sends subscription events (`activated`, `charged`, `halted`, `cancelled`, `completed`) to the webhook. The server verifies the signature, updates the subscription and the user's plan, and schedules a job that moves the user back to Free when a paid period ends

### Custom branding on the voting page
`GET /api/polls/get-poll/:pollId` returns the poll plus a `customBranding` object. It is included only when the poll has branding enabled **and** the owner is on an active Premium plan, so branding disappears automatically if the plan lapses.

---

## Project Structure

```
pulse-hub-live-voting/
├── backend/
│   └── src/
│       ├── agent/                  # AI poll agent
│       │   ├── agent.ts            #   main agent (LangChain + Gemini)
│       │   ├── guardrails/         #   input guardrail
│       │   ├── tools/              #   web search, current date/time
│       │   └── utils/              #   system prompt, structured output, Redis chat history
│       ├── config/                 # DB, Redis, BullMQ, Google, ImageKit, Razorpay
│       ├── constants/              # Subscription plan limits
│       ├── middleware/             # Validation, errors, file upload, socket auth
│       ├── modules/
│       │   ├── auth/               # Register, login, OAuth, sessions, account linking
│       │   ├── polls/              # Poll CRUD, voting, analytics, AI agent endpoints
│       │   ├── response/           # Dashboard summary data
│       │   ├── subscription/       # Plans, Razorpay, webhook, custom branding
│       │   └── contact/            # Contact form messages
│       ├── socket/                 # Socket.IO setup
│       ├── workers/                # Poll expiry and subscription workers
│       ├── utils/                  # API response/error helpers, JWT, plan helpers
│       ├── app.ts
│       └── server.ts
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Dashboard/          # Sidebar, pages, AI panel, poll form, QR, custom branding...
        │   └── ...                 # Landing page sections, Navbar, Footer, auth pages
        ├── routes/                 # TanStack Router pages
        ├── Context/                # Global app, poll, poll-creation and settings state
        ├── services/               # API layer (auth, polls, subscription, ...)
        └── utils/                  # CSV export, Razorpay loader, poll status helpers
```

---

## Getting Started

### Prerequisites
- [Bun](https://bun.com) (or Node.js 20+ with npm)
- MongoDB connection URI
- Redis connection URI
- Google and GitHub OAuth app credentials (for social login)
- Razorpay account with a **Pro** and a **Premium** subscription plan created (for payments)
- Google AI (Gemini) API key and a [Tavily](https://tavily.com) API key (for the AI assistant)
- [ImageKit](https://imagekit.io) account (for brand logos)

### 1. Clone the repo
```bash
git clone https://github.com/intekhabx/pulse-hub-live-voting.git
cd pulse-hub-live-voting
```

### 2. Backend
```bash
cd backend
bun install
cp .env.example .env   # fill in the values (see below)
bun run dev            # starts the API on PORT (default 3000)
```

### 3. Frontend
```bash
cd frontend
bun install
cp .env.example .env   # set VITE_API_URL and VITE_BASE_URL
bun run dev
```

### 4. Razorpay webhook (for subscriptions)
In the Razorpay dashboard, add a webhook pointing to:

```
POST https://<your-backend>/api/subscription/webhook/razorpay
```

Enable the subscription events (`activated`, `charged`, `halted`, `cancelled`, `completed`) and use the same secret as `RAZORPAY_WEBHOOK_SECRET`.

> The backend must run as a long-lived server. Socket.IO and the BullMQ workers need a persistent process, so serverless hosting will not work.

---

## Environment Variables

### backend/.env

| Variable | Description |
|---|---|
| `PORT` | Server port |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_URI` | Redis connection string |
| `FRONTEND_BASE_URL` | Frontend origin (CORS, Socket.IO and OAuth redirects) |
| `COOKIE_SECRET` | Secret for signed cookies |
| `JWT_ACCESS_TOKEN` / `JWT_ACCESS_EXPIRES_IN` | Access token secret and lifetime (e.g. `10m`) |
| `JWT_REFRESH_TOKEN` / `JWT_REFRESH_EXPIRES_IN` | Refresh token secret and lifetime (e.g. `7d`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | Google login |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` / `GITHUB_CALLBACK_URL` | GitHub login |
| `GOOGLE_CONNECT_CALLBACK_URL` / `GITHUB_CONNECT_CALLBACK_URL` | Callbacks for connecting an account from Settings |
| `RAZORPAY_API_KEY` / `RAZORPAY_API_SECRET` | Razorpay credentials |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature secret |
| `RAZORPAY_PRO_PLAN_ID` / `RAZORPAY_PREMIUM_PLAN_ID` | Razorpay plan IDs |
| `GOOGLE_API_KEY` | Gemini API key |
| `LLM_MODEL` | Gemini model name used by the agent |
| `TAVILY_API_KEY` | Web search for the agent |
| `IMAGEKIT_PRIVATE_KEY` / `IMAGEKIT_URL_ENDPOINT` | Brand logo hosting |

### frontend/.env

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL |
| `VITE_BASE_URL` | Frontend URL |

---

## API Overview

All routes are under `/api`. "Auth" means a logged-in user is required.

### Auth - `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register`, `/login` | - | Email and password sign-up and login |
| POST | `/logout` | Yes | Log out |
| POST | `/refresh-token` | - | Get a new access token |
| GET | `/user` | Yes | Current user |
| PATCH | `/update-user`, `/update-password` | Yes | Update profile or password |
| DELETE | `/delete-user-account` | Yes | Delete the account |
| GET | `/user-session` | - | Issues the anonymous voter cookie |
| GET | `/google-login`, `/github-login` | - | Start social login |
| POST | `/exchange-otp` | - | Exchange the one-time code after OAuth for an access token |
| POST | `/link-oauth-account` | - | Link an OAuth login to an existing account |
| GET | `/google-connect`, `/github-connect` | Yes | Connect a provider from Settings |
| DELETE | `/google-disconnect`, `/github-disconnect` | Yes | Disconnect a provider |

### Polls - `/api/polls`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/create-poll`, `/create-poll-draft` | Yes | Create an active or draft poll |
| PATCH | `/update-poll/:pollId` | Yes | Edit a poll |
| PATCH | `/update-poll-as-active/:pollId` | Yes | Activate a draft |
| PATCH | `/update-active-poll/:pollId` | Yes | Edit basic details of an active poll |
| GET | `/get-mypolls`, `/get-mypoll/:pollId` | Yes | Your polls |
| GET | `/get-poll/:pollId` | - | Public poll (with branding if enabled) |
| POST | `/submit-vote/:pollId` | - | Vote (anonymous or logged in, depending on the poll) |
| GET | `/get-poll-analytics/:pollId` | Yes | Detailed analytics for a poll |
| GET | `/get-analytics-page-data` | Yes | Account-wide analytics |
| GET | `/get-recent-activity` | Yes | Latest activity feed |
| POST | `/publish-poll/:pollId` | Yes | Publish results |
| GET | `/get-published-poll-analytics/:pollId` | - | Public results of a published poll |
| DELETE | `/delete-poll/:pollId` | Yes | Delete a poll |
| POST | `/agent` | Yes | Send a message to the AI poll assistant |
| DELETE | `/reset` | Yes | Clear the AI chat history |

### Response - `/api/response`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/get-data` | Yes | Dashboard summary |

### Subscription - `/api/subscription`
| Method | Endpoint | Plan | Description |
|---|---|---|---|
| GET | `/user-plan-details` | Any | Plan and usage details |
| POST | `/create` | Any | Start a Razorpay subscription |
| DELETE | `/cancel` | Pro, Premium | Cancel (access stays until the period ends) |
| GET | `/can-user-use` | Pro, Premium | Check access to paid features |
| GET | `/export-everypoll-csv` | Pro, Premium | Data for CSV export |
| POST | `/upload-custom-branding` | Premium | Save branding (multipart, field `brandImage`, max 2 MB) |
| GET | `/custom-branding` | Premium | Read saved branding |
| POST | `/webhook/razorpay` | - | Razorpay webhook (signature verified) |

### Contact - `/api/contact`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/message` | Send a message from the contact form |

### Health
`GET /health` returns `{ healthy: true }`.

---

## Frontend Routes

| Route | Page |
|---|---|
| `/` | Landing page (Features, How It Works, Pricing, About, Contact) |
| `/login`, `/register` | Authentication |
| `/auth/callback`, `/auth/confirm` | OAuth return and account-link confirmation |
| `/dashboard` | Overview, My Polls, Analytics, Create Poll, Settings |
| `/dashboard/poll/$pollId` | Poll details and analytics |
| `/dashboard/poll-edit/$pollId` | Edit a poll |
| `/votes/$pollId` | Public voting page (supports custom branding) |
| `/privacy-policy`, `/terms-and-conditions`, `/refund-cancellation` | Legal pages |

---

## Deployment

- **Frontend:** [Vercel](https://vercel.com). `frontend/vercel.json` rewrites every path to `index.html` so client-side routes work on refresh
- **Backend:** any host that can run a persistent Node process (API, Socket.IO and BullMQ workers), with MongoDB and Redis reachable from it

Security defaults: Helmet headers, rate limiting (500 requests per 15 minutes per IP), a 16 KB JSON body limit, Zod validation on request bodies, signed cookies and CORS restricted to `FRONTEND_BASE_URL`.

---

## Author

**Intekhab**
- GitHub: [@intekhabx](https://github.com/intekhabx)
