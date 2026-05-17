# VSRS — Vehicle Service Registration System

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-vsrs.onrender.com-4CAF50?style=for-the-badge)](https://vsrs.onrender.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

A full-stack vehicle service booking application that connects vehicle owners with service centers. Built with **React + Vite** (frontend) and **Express + SQLite** (backend).

> **🔗 Live Demo:** [https://vsrs.onrender.com](https://vsrs.onrender.com/)

---

## Features

- 🚗 **Vehicle Management** — Register and manage multiple vehicles
- 📅 **Service Booking** — Book appointments with registered service centers
- 🔧 **Service Center Dashboard** — Accept/reject bookings, set price quotes
- 👑 **Admin Panel** — System-wide overview of all users and bookings
- 🔐 **JWT Authentication** — Secure token-based auth with role-based access
- 🛡️ **Production Hardened** — Helmet, rate limiting, input validation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS |
| **Routing** | React Router v6 |
| **Backend** | Express.js v5 |
| **Database** | SQLite (better-sqlite3) |
| **Auth** | JWT + bcryptjs |
| **Security** | Helmet + Rate Limiting |

---

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start both frontend (port 5173) and backend (port 3001)
npm run dev
```

### Production

```bash
# Build frontend + start Express serving everything on port 3001
npm start
```

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
DB_PATH=./server/database.sqlite
```

---

## User Roles

| Role | Access |
|------|--------|
| `customer` | Add vehicles, book services, view own history |
| `service-center` | View/manage bookings assigned to them |
| `admin` | View all users, all bookings, system-wide access |

### Demo Admin Credentials

```
Email: admin@vsrs.com
Password: admin123
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create new account |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/users` | ✅ Admin | List all users |
| GET | `/api/auth/service-centers` | ❌ | List service centers |
| GET | `/api/vehicles` | ✅ | Get user's vehicles |
| POST | `/api/vehicles` | ✅ | Add a vehicle |
| DELETE | `/api/vehicles/:id` | ✅ | Delete own vehicle |
| GET | `/api/bookings/my` | ✅ | Get user's bookings |
| POST | `/api/bookings` | ✅ Customer | Create a booking |
| PATCH | `/api/bookings/:id` | ✅ SC/Admin | Update status/price |
| GET | `/api/health` | ❌ | Server health check |

---

## Deployment

This project is deployed on **[Render](https://render.com/)** (free tier).

| Setting | Value |
|---------|-------|
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node server/index.js` |
| **Runtime** | Node.js |

> ⚠️ The free tier has a cold start (~30s) after inactivity and an ephemeral filesystem (database resets on redeploy).

---

## Project Structure

```
W22/
├── server/                  # Backend
│   ├── index.js             # Express entry point
│   ├── db.js                # SQLite connection + schema
│   ├── middleware/           # Auth & authorization
│   └── routes/              # API route handlers
├── src/                     # Frontend (React)
│   ├── App.jsx              # Root component + routing
│   ├── context/             # Auth & Data providers
│   ├── pages/               # Page components
│   └── components/          # Reusable UI components
├── .env.example             # Environment template
├── package.json             # Dependencies & scripts
└── vite.config.js           # Vite config with API proxy
```

---

## Database Queries (Development)

```bash
# View all users
node -e "import('./server/db.js').then(m => console.table(m.default.prepare('SELECT name,email,role FROM users').all()))"

# View all vehicles
node -e "import('./server/db.js').then(m => console.table(m.default.prepare('SELECT vehicle_number,brand,model,year FROM vehicles').all()))"

# View all bookings
node -e "import('./server/db.js').then(m => console.table(m.default.prepare('SELECT user_name,service_type,status,date FROM bookings').all()))"
```

Or install the **SQLite Viewer** extension in VS Code and open `server/database.sqlite`.

---

## License

This project was built as an academic project.
