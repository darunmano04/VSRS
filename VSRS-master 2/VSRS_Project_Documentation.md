# VSRS — Vehicle Service Registration System
## Project Documentation

---

## 1. Project Overview

VSRS is a **full-stack web application** that connects vehicle owners with service centers. Customers can register their vehicles, browse available service centers, book service appointments, and track service history. Service centers can manage incoming requests, update booking status, and set price quotes. Administrators have a system-wide overview of all users and bookings.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | Single-page application with component-based UI |
| **Styling** | Tailwind CSS | Utility-first CSS framework for responsive design |
| **Routing** | React Router v6 | Client-side navigation with protected routes |
| **Backend** | Express.js (v5) | REST API server handling all business logic |
| **Database** | SQLite (better-sqlite3) | Lightweight embedded database, no external server needed |
| **Authentication** | JSON Web Tokens (JWT) | Stateless token-based auth via `jsonwebtoken` |
| **Password Hashing** | bcryptjs | Secure one-way password hashing with salt rounds |
| **Security** | Helmet | HTTP security headers (XSS, content-type sniffing, etc.) |
| **Rate Limiting** | express-rate-limit | Prevents brute-force attacks and API abuse |
| **Logging** | Morgan | HTTP request logging for debugging and monitoring |
| **Environment** | dotenv | Externalizes configuration (secrets, ports, DB path) |

---

## 3. Project Structure

```
W22/
├── server/                        # Backend
│   ├── index.js                   # Express app entry point
│   ├── db.js                      # SQLite database connection + schema + indexes
│   ├── database.sqlite            # SQLite database file (auto-created)
│   ├── middleware/
│   │   ├── auth.js                # JWT sign, verify, authenticate middleware
│   │   └── authorize.js           # Role-based access control middleware
│   └── routes/
│       ├── auth.js                # Register, login, get users, get service centers
│       ├── vehicles.js            # CRUD operations for vehicles
│       └── bookings.js            # CRUD operations for bookings
│
├── src/                           # Frontend
│   ├── main.jsx                   # App entry point
│   ├── App.jsx                    # Root component with routing and providers
│   ├── context/
│   │   ├── AuthContext.jsx        # Authentication state (user, token, login/logout)
│   │   └── DataContext.jsx        # API methods (vehicles, bookings, service centers)
│   ├── pages/
│   │   ├── Home.jsx               # Landing page
│   │   ├── Login.jsx              # Login form
│   │   ├── Register.jsx           # Registration form (customer / service-center)
│   │   ├── CustomerDashboard.jsx  # Customer overview (stats, recent bookings)
│   │   ├── AddVehicle.jsx         # Add new vehicle form
│   │   ├── BookService.jsx        # Book a service appointment
│   │   ├── ServiceHistory.jsx     # View all past/current bookings
│   │   ├── ServiceCenterDashboard.jsx  # Service center's booking management
│   │   └── AdminDashboard.jsx     # Admin panel (all users, all bookings)
│   └── components/
│       ├── Common/
│       │   ├── ProtectedRoute.jsx # Route guard (redirects if not authenticated/authorized)
│       │   └── ErrorBoundary.jsx  # Catches React crashes, shows fallback UI
│       ├── Layout/
│       │   └── Layout.jsx         # Sidebar + main content wrapper
│       └── UI/
│           ├── Card.jsx           # Reusable card component
│           ├── Button.jsx         # Styled button component
│           ├── Badge.jsx          # Status badge component
│           └── Input.jsx          # Styled input component
│
├── .env                           # Environment variables (not committed to git)
├── .env.example                   # Template showing required env vars
├── package.json                   # Dependencies and scripts
└── vite.config.js                 # Vite configuration with API proxy
```

---

## 4. Database Schema

### 4.1 Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Unique user ID (timestamp + random) |
| name | TEXT | Full name |
| email | TEXT (UNIQUE) | Email address (used for login) |
| password_hash | TEXT | bcrypt-hashed password |
| phone | TEXT | Phone number |
| role | TEXT | `customer`, `service-center`, or `admin` |
| created_at | TEXT | Account creation timestamp |

### 4.2 Vehicles Table
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Unique vehicle ID |
| user_id | TEXT (FK → users) | Owner's user ID |
| vehicle_number | TEXT | Registration/plate number |
| vehicle_type | TEXT | Car, Bike, Truck, etc. |
| brand | TEXT | Manufacturer (Toyota, Honda, etc.) |
| model | TEXT | Model name |
| year | INTEGER | Year of manufacture |
| created_at | TEXT | Record creation timestamp |

### 4.3 Bookings Table
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | Unique booking ID |
| user_id | TEXT (FK → users) | Customer who booked |
| user_name | TEXT | Customer's name |
| vehicle_id | TEXT | Vehicle being serviced |
| vehicle_label | TEXT | Display label (e.g., "Toyota Camry - ABC1234") |
| service_center_id | TEXT | Assigned service center's user ID |
| service_center_name | TEXT | Service center's name |
| service_type | TEXT | Type of service (General, Oil Change, etc.) |
| date | TEXT | Preferred service date (YYYY-MM-DD) |
| description | TEXT | Additional notes from customer |
| status | TEXT | `pending` → `in-progress` → `completed` or `rejected` |
| price_quote | TEXT | Price set by service center |
| created_at | TEXT | Booking creation timestamp |

### Database Indexes
- `idx_users_email` — Fast login lookups
- `idx_users_role` — Fast role filtering (e.g., list service centers)
- `idx_vehicles_user_id` — Fast "my vehicles" queries
- `idx_bookings_user_id` — Fast "my bookings" queries
- `idx_bookings_service_center_id` — Fast service center dashboard queries
- `idx_bookings_status` — Fast status filtering

---

## 5. API Endpoints

### 5.1 Authentication (`/api/auth`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | ❌ | — | Create new account, returns JWT |
| POST | `/api/auth/login` | ❌ | — | Login, returns JWT |
| GET | `/api/auth/users` | ✅ | admin | List all users |
| GET | `/api/auth/service-centers` | ❌ | — | List registered service centers |

### 5.2 Vehicles (`/api/vehicles`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/vehicles` | ✅ | any | Get authenticated user's vehicles |
| POST | `/api/vehicles` | ✅ | any | Add a new vehicle |
| DELETE | `/api/vehicles/:id` | ✅ | owner | Delete own vehicle |

### 5.3 Bookings (`/api/bookings`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/bookings` | ✅ | admin | Get all bookings |
| GET | `/api/bookings/my` | ✅ | any | Get authenticated user's bookings |
| GET | `/api/bookings/service-center` | ✅ | service-center | Get bookings assigned to this SC |
| POST | `/api/bookings` | ✅ | customer | Create a new booking |
| PATCH | `/api/bookings/:id` | ✅ | service-center/admin | Update status/price |

### 5.4 Health Check
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | ❌ | Server status check |

---

## 6. Authentication & Security

### How Authentication Works

```
1. User registers/logs in → Server returns JWT token
2. Frontend stores token in localStorage as 'vsrs_token'
3. Every API request includes header: Authorization: Bearer <token>
4. Server middleware verifies token → extracts user info → attaches to req.user
5. Route handlers use req.user.id and req.user.role for data access control
```

### Security Layers

| Layer | Implementation |
|-------|---------------|
| **Password Security** | bcrypt hashing with 10 salt rounds |
| **Token Auth** | JWT with 7-day expiry |
| **Role Control** | `requireRole()` middleware on every protected route |
| **Data Isolation** | Users can only access their own vehicles/bookings |
| **Rate Limiting** | 20 requests/15min on auth, 100 requests/15min on API |
| **Security Headers** | Helmet middleware (XSS, clickjacking, MIME sniffing protection) |
| **Input Validation** | Email format, password length, date format, status enum, text sanitization |
| **Request Size** | Limited to 1MB JSON payloads |

---

## 7. User Flows

### 7.1 Customer Flow
```
Register (customer) → Login → Dashboard
  ├── Add Vehicle (number, type, brand, model, year)
  ├── Book Service (select vehicle, service center, date, type)
  └── View Service History (all bookings with status tracking)
```

### 7.2 Service Center Flow
```
Register (service-center) → Login → Service Center Dashboard
  ├── View incoming booking requests
  ├── Accept or Reject bookings
  ├── Set price quotes
  └── Mark bookings as completed
```

### 7.3 Admin Flow
```
Login (admin) → Admin Dashboard
  ├── View all registered users (customers + service centers)
  └── View all bookings system-wide
```

### Booking Status Lifecycle
```
pending → in-progress → completed
   └──→ rejected
```

---

## 8. How to Run

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start both frontend (port 5173) and backend (port 3001)
```

### Production (Local)
```bash
npm start            # Builds frontend + starts Express serving everything on port 3001
```

### Environment Configuration
Copy `.env.example` → `.env` and set your values:
```
PORT=3001
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=change_this_to_a_strong_random_string
JWT_EXPIRES_IN=7d
DB_PATH=./server/database.sqlite
```

---

## 9. Deployment

### 9.1 Live URL

> **🔗 https://vsrs.onrender.com**

The application is deployed on **Render** (free tier) as a single Web Service that serves both the Express API and the Vite-built React frontend.

### 9.2 Platform — Render

| Setting | Value |
|---------|-------|
| **Platform** | [Render](https://render.com/) — Free Web Service |
| **Region** | Auto-selected (closest to deployment) |
| **Branch** | `master` |
| **Runtime** | Node.js |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node server/index.js` |
| **Instance Type** | Free |
| **Auto-Deploy** | Yes — every `git push origin master` triggers a new deploy |

### 9.3 Production Environment Variables (on Render)

| Variable | Value | Notes |
|----------|-------|-------|
| `PORT` | `10000` | Render assigns this port internally |
| `NODE_ENV` | `production` | Enables production optimizations |
| `JWT_SECRET` | *(strong random string)* | Different from dev secret |
| `JWT_EXPIRES_IN` | `7d` | Same as development |
| `DB_PATH` | `./server/database.sqlite` | SQLite file path |
| `CORS_ORIGIN` | `https://vsrs.onrender.com` | Same-origin in production |

### 9.4 How Deployment Works

```
1. Developer pushes code to GitHub (master branch)
2. Render detects the push via webhook
3. Render runs: npm install && npm run build
   → Installs dependencies
   → Vite compiles React app into dist/ folder
4. Render runs: node server/index.js
   → Express starts, serves API on /api/*
   → Express serves built React app from dist/ for all other routes
5. App is live at https://vsrs.onrender.com
```

### 9.5 Free Tier Limitations

| Limitation | Impact |
|------------|--------|
| **Cold Start** | App sleeps after ~15 minutes of inactivity; first request takes ~30–50 seconds to wake up |
| **Ephemeral Disk** | SQLite database resets on every redeploy (all user data is lost) |
| **750 hours/month** | Sufficient for demo/academic use |

> **Note:** For persistent data in production, a migration to PostgreSQL (Render offers a free managed PostgreSQL instance) would be recommended.

### 9.6 GitHub Repository

| Detail | Value |
|--------|-------|
| **Repository** | [github.com/THARSHAN719/VSRS](https://github.com/THARSHAN719/VSRS) |
| **Branch** | `master` |
| **README** | Includes live demo badge, tech stack, API docs, and deployment instructions |

---

## 10. Viewing Database Records

### Terminal Commands (from W22 folder)
```powershell
# All users
node -e "import('./server/db.js').then(m => console.table(m.default.prepare('SELECT name,email,role FROM users').all()))"

# All vehicles
node -e "import('./server/db.js').then(m => console.table(m.default.prepare('SELECT vehicle_number,brand,model,year FROM vehicles').all()))"

# All bookings
node -e "import('./server/db.js').then(m => console.table(m.default.prepare('SELECT user_name,service_type,status,date FROM bookings').all()))"

# Count users by role
node -e "import('./server/db.js').then(m => console.table(m.default.prepare('SELECT role, COUNT(*) as count FROM users GROUP BY role').all()))"
```

### VS Code Extension
Install **"SQLite Viewer"** → open `server/database.sqlite` → browse tables visually.

---

## 11. SDLC Model — Agile (Iterative Incremental)

### 11.1 Why Agile?

For VSRS — a multi-role web application with evolving requirements — the **Agile Model** is the most effective SDLC approach. Key reasons:

- **Iterative Development:** The project was built in functional increments (sprints), delivering a working product at each stage — starting with the frontend UI, then adding a backend, then hardening for production.
- **Flexibility for Changes:** Requirements evolved during development — e.g., adding role-based access control, switching from localStorage to a real database, adding security headers. Agile accommodates these changes without derailing the timeline.
- **Continuous Testing:** Each sprint included testing (API validation, UI testing, route protection checks), catching bugs early rather than at the end.
- **Stakeholder Feedback:** After each sprint, the working product was reviewed, and feedback directly shaped the next sprint's priorities.

### 11.2 Sprint Breakdown (How VSRS Was Built)

| Sprint | Duration | Deliverables |
|--------|----------|-------------|
| **Sprint 1** — Frontend Foundation | Week 1 | React + Vite setup, Tailwind CSS styling, page components (Home, Login, Register, Dashboard), client-side routing with React Router v6 |
| **Sprint 2** — Backend Integration | Week 2 | Express.js server, SQLite database schema, REST API endpoints (auth, vehicles, bookings), JWT authentication, replaced localStorage with API calls |
| **Sprint 3** — Role-Based Features | Week 2–3 | Customer dashboard, Service Center dashboard, Admin dashboard, role-based route protection (`ProtectedRoute`, `authorize` middleware) |
| **Sprint 4** — Production Hardening | Week 3 | Helmet security headers, rate limiting, input validation & sanitization, database indexes, error boundaries, `.env` configuration, production build & static serving |
| **Sprint 5** — Deployment | Week 4 | Deployed to Render (free tier), configured production environment variables, updated README with badges and live demo link, pushed to GitHub with deployment documentation |

### 11.3 Agile Practices Used

| Practice | How It Was Applied in VSRS |
|----------|---------------------------|
| **User Stories** | "As a customer, I can register my vehicle and book a service." "As a service center, I can accept/reject bookings and set price quotes." |
| **Incremental Delivery** | Sprint 1 delivered a working UI; Sprint 2 added a real backend; Sprint 3 added multi-role features; Sprint 4 hardened everything; Sprint 5 deployed to production |
| **Continuous Integration** | Code committed to GitHub after each working increment; auto-deploy configured via Render |
| **Refactoring** | Frontend was refactored from localStorage to API-driven data (AuthContext + DataContext) |
| **Timeboxing** | Each sprint was ~1 week, ensuring consistent delivery pace |

### 11.4 Agile vs Other SDLC Models — Why Agile Was Chosen

| Model | Pros | Cons (for VSRS) | Verdict |
|-------|------|-----------------|---------|
| **Waterfall** | Simple, linear, well-documented | No flexibility — can't adapt when requirements change (e.g., adding security layers mid-project) | ❌ Too rigid |
| **V-Model** | Strong testing focus | Requires complete requirements upfront; VSRS requirements evolved sprint-to-sprint | ❌ Not suitable |
| **Spiral** | Good for risk-heavy projects | Overkill for a web app; excessive overhead for a small team | ❌ Too complex |
| **RAD** | Fast prototyping | Sacrifices code quality for speed; VSRS needed proper security and architecture | ❌ Quality concerns |
| **Agile** | Iterative, flexible, delivers working software every sprint | Requires discipline in sprint planning | ✅ **Best fit** |

### 11.5 Agile Workflow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      AGILE SPRINT CYCLE                      │
│                                                              │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────┐ │
│   │  PLAN    │───→│  DESIGN  │───→│  BUILD   │───→│ TEST  │ │
│   │          │    │          │    │  & CODE  │    │       │ │
│   └──────────┘    └──────────┘    └──────────┘    └───┬───┘ │
│        ↑                                              │     │
│        │          ┌──────────┐    ┌──────────┐        │     │
│        └──────────│  REVIEW  │←───│  DEPLOY  │←───────┘     │
│                   │ FEEDBACK │    │          │              │
│                   └──────────┘    └──────────┘              │
│                                                              │
│              ↻ Repeat for each Sprint (1–5)                  │
└──────────────────────────────────────────────────────────────┘
```

---

## Admin Credentials

| Field | Value |
|-------|-------|
| **Email** | admin@vsrs.com |
| **Password** | admin123 |

---

*Last Updated: April 21, 2026*
