import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH
  ? join(process.cwd(), process.env.DB_PATH)
  : join(__dirname, 'database.sqlite');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// --- Tables ---
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    vehicle_number TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    vehicle_id TEXT,
    vehicle_label TEXT,
    service_center_id TEXT NOT NULL,
    service_center_name TEXT NOT NULL,
    service_type TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    price_quote TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// --- Indexes for query performance ---
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_service_center_id ON bookings(service_center_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
`);

// --- Seed default admin account ---
const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@vsrs.com');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, phone, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    `admin_${Date.now()}`,
    'System Admin',
    'admin@vsrs.com',
    hashedPassword,
    '',
    'admin'
  );
  console.log('✅ Default admin account seeded (admin@vsrs.com / admin123)');
}

export default db;
