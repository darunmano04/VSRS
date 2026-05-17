import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { signToken, authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/authorize.js';

const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const router = express.Router();

// --- Validation helpers ---
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const sanitize = (str) => (str || '').trim().slice(0, 255);

// POST /api/auth/register
router.post('/register', (req, res) => {
  const name = sanitize(req.body.name);
  const email = sanitize(req.body.email).toLowerCase();
  const phone = sanitize(req.body.phone);
  const password = req.body.password || '';
  const role = sanitize(req.body.role);

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const allowedRoles = ['customer', 'service-center'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  try {
    const passwordHash = bcrypt.hashSync(password, 10);
    const id = genId();
    db.prepare(`INSERT INTO users (id, name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(id, name, email, passwordHash, phone, role);

    const user = { id, name, email, phone, role };
    const token = signToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const email = sanitize(req.body.email).toLowerCase();
  const password = req.body.password || '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  const { password_hash, ...safeUser } = user;
  const token = signToken(safeUser);
  res.json({ user: safeUser, token });
});

// GET /api/auth/users  (admin only)
router.get('/users', authenticate, requireRole('admin'), (req, res) => {
  const users = db.prepare('SELECT id, name, email, phone, role, created_at FROM users').all();
  res.json(users);
});

// GET /api/auth/service-centers — returns registered service centers (public, for booking form)
router.get('/service-centers', (req, res) => {
  const centers = db.prepare(
    "SELECT id, name, email, phone, created_at FROM users WHERE role = 'service-center' ORDER BY name"
  ).all();
  res.json(centers);
});

export default router;
