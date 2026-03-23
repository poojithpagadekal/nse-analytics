# NSE Analytics

A full-stack platform for tracking NSE-listed stocks, analyzing earnings, and setting price alerts. Backend designed around async job processing, automated data ingestion, and event-driven notifications.

![NSE Analytics](https://img.shields.io/badge/stack-Node.js%20%7C%20React%20%7C%20PostgreSQL%20%7C%20Redis-00c896)

---

## Why I built this

NSE publishes daily market data as public CSV files. I wanted to build something that actually ingests, stores, and reacts to real financial data — not mock APIs. The goal was to practice backend systems design: job queues, scheduled ingestion, event-driven alerts, and near real-time delivery to the frontend.

---

## Features

- **Daily stock data** — automatically ingests NSE Bhavcopy CSV data every weekday at 7pm IST via a scheduled BullMQ job
- **Price charts** — interactive OHLC charts with 1W / 1M / 3M / 1Y range selection
- **Earnings history** — quarterly revenue, net profit, EPS, and YoY growth per stock
- **Price alerts** — set threshold-based alerts that evaluate against daily closing prices and notify in near real-time via WebSocket
- **Auth** — JWT-based authentication with register, login, profile management, and password/email change

---

## Screenshots

> Stocks page — price cards with daily % change

![Stocks Page](./docs/screenshots/stocks.png)

> Alert triggered — toast notification on the frontend

![Alert Toast](./docs/screenshots/alert-toast.png)

---

## Architecture

```
Browser
  └── Nginx :80
        ├── /api/*        → Express backend :3000
        ├── /socket.io/*  → Socket.io (WebSocket)
        └── /*            → React SPA (built files)

Express backend
  ├── REST API (auth, stocks, earnings, alerts, ingest)
  ├── BullMQ worker
  │     ├── Downloads NSE Bhavcopy ZIP from nsearchives.nseindia.com
  │     ├── Parses ~2000 EQ stocks from CSV
  │     ├── Upserts DailyPrice records into PostgreSQL
  │     └── Evaluates active PRICE_CHANGE alerts → emits alert:triggered via Socket.io
  └── node-cron → enqueues Bhavcopy job at 7pm IST Mon–Fri

Data layer
  ├── PostgreSQL (via Prisma ORM) — stocks, prices, earnings, alerts, users
  └── Redis — BullMQ job queue + worker connection
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, TypeScript |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Database | PostgreSQL 16, Prisma ORM |
| Queue | BullMQ, Redis 7 |
| Real-time | Socket.io |
| Auth | JWT, bcrypt |
| Infra | Docker, Docker Compose, Nginx |
| CI | GitHub Actions (TypeScript typecheck) |

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js 20+
- npm

### Development setup

**1. Clone the repo**
```bash
git clone https://github.com/poojithpagadekal/nse-analytics.git
cd nse-analytics
```

**2. Set up environment variables**
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env and fill in your values

# Frontend
cp frontend/.env.example frontend/.env
```

**3. Start PostgreSQL and Redis**
```bash
docker compose -f docker-compose.dev.yml up -d
```

**4. Run database migrations**
```bash
cd backend
npx prisma migrate dev
```

**5. Start the backend**
```bash
cd backend
npm install
npm run dev
```

**6. Start the frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3000`.

---

### Production setup (full Docker)

```bash
cp .env.example .env
# Edit .env with production values

docker compose up -d
```

App is available at `http://localhost`.

---

## Database Schema

```
User          — id, email, password (hashed), name
Stock         — id, symbol (unique), name, sector, industry
DailyPrice    — stockId, date, open, high, low, close, volume  [unique: stockId+date]
EarningResult — stockId, quarter, revenue, netProfit, eps, yoyGrowth, announcedAt  [unique: stockId+quarter]
Pattern       — stockId, date, type, confidence
Alert         — userId, stockId, type, condition, threshold, isActive, triggeredAt
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Login, returns JWT |
| GET | `/auth/me` | ✓ | Get current user |
| PATCH | `/auth/profile` | ✓ | Update display name |
| PATCH | `/auth/password` | ✓ | Change password |
| PATCH | `/auth/email` | ✓ | Change email |

### Stocks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/stocks` | — | All stocks with latest price |
| GET | `/stocks/:symbol` | — | Single stock |
| GET | `/stocks/:symbol/prices` | — | Daily prices (`?from=YYYY-MM-DD&to=YYYY-MM-DD`) |

### Earnings
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/earnings/:symbol` | — | Earnings history (`?quarter=Q1FY25`) |

### Alerts
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/alerts` | ✓ | User's alerts (`?symbol=TCS&isActive=true`) |
| POST | `/alerts` | ✓ | Create alert |
| PATCH | `/alerts/:id/deactivate` | ✓ | Deactivate alert |
| PATCH | `/alerts/:id/reactivate` | ✓ | Reactivate alert |
| DELETE | `/alerts/:id` | ✓ | Delete alert |

### Ingest
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/ingest/bhavcopy` | ✓ | Manually trigger Bhavcopy ingestion for a date |

```bash
# Example
curl -X POST http://localhost:3000/ingest/bhavcopy \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-03-20"}'
```

---

## How Alerts Work

1. User creates a `PRICE_CHANGE` alert — e.g. TCS rises above ₹4000
2. Every weekday at 7pm IST, the Bhavcopy worker ingests closing prices
3. After ingestion, the alert evaluator queries all active alerts and compares conditions against the new closing prices
4. Triggered alerts are marked `isActive: false` with a `triggeredAt` timestamp
5. An `alert:triggered` Socket.io event is emitted to the user's personal room
6. The frontend shows a toast notification and refreshes the alerts list

---

## Known Limitations

- **Company names** — Bhavcopy CSV does not include company names. Stocks ingested via Bhavcopy show the ticker symbol as the name until a separate company master data source is integrated.
- **Sector data** — not available in Bhavcopy. Sector badges only appear for stocks manually created via `POST /stocks`.
- **Alert types** — only `PRICE_CHANGE` alerts are evaluated. `EPS_GROWTH`, `REVENUE_GROWTH`, and `PATTERN_DETECTED` are defined in the schema but reserved for future implementation.
- **NSE data availability** — Bhavcopy files are only published on market trading days. Weekend and holiday ingestion requests will fail with a download error.
-**Earnings data** — not sourced automatically. Earnings must be added manually via POST /earnings. A futureimprovement would be ingesting from NSE's quarterly results calendar.

---

## Project Structure

```
nse-analytics/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/          # env, prisma, redis, socket singletons
│       ├── lib/             # errorHandler, errors, health, ingest router
│       ├── middlewares/     # authenticate (JWT)
│       ├── modules/
│       │   ├── auth/        # register, login, profile management
│       │   ├── stocks/      # stock + daily price endpoints
│       │   ├── earnings/    # earnings history endpoints
│       │   └── alerts/      # alert CRUD
│       └── workers/
│           ├── queues/      # BullMQ queue definitions
│           └── processors/  # bhavcopy.processor, alert-evaluator.processor
├── frontend/
│   └── src/
│       ├── api/             # axios client + endpoint functions
│       ├── components/      # reusable UI components
│       ├── hooks/           # TanStack Query hooks + useSocket
│       ├── pages/           # one file per route
│       └── types/           # shared TypeScript interfaces
├── nginx/
│   └── nginx.conf
├── docker-compose.yml       # production — all services
├── docker-compose.dev.yml   # development — postgres + redis only
└── .github/workflows/ci.yml
```

---