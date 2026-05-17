import express from 'express';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';

const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
const sanitize = (str) => (str || '').trim().slice(0, 255);

const router = express.Router();

// All vehicle routes require authentication
router.use(authenticate);

// GET /api/vehicles — get vehicles for the authenticated user
router.get('/', (req, res) => {
  const userId = req.user.id;
  const vehicles = db.prepare('SELECT * FROM vehicles WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  res.json(vehicles);
});

// POST /api/vehicles — add a vehicle for the authenticated user
router.post('/', (req, res) => {
  const vehicleNumber = sanitize(req.body.vehicleNumber);
  const vehicleType = sanitize(req.body.vehicleType);
  const brand = sanitize(req.body.brand);
  const model = sanitize(req.body.model);
  const year = parseInt(req.body.year);
  const userId = req.user.id;

  if (!vehicleNumber || !brand || !model || !year) {
    return res.status(400).json({ error: 'All fields required' });
  }

  if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
    return res.status(400).json({ error: 'Invalid year' });
  }

  const id = genId();
  db.prepare(`INSERT INTO vehicles (id, user_id, vehicle_number, vehicle_type, brand, model, year) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(id, userId, vehicleNumber, vehicleType, brand, model, year);
  const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
  res.status(201).json(vehicle);
});

// DELETE /api/vehicles/:id — delete own vehicle only
router.delete('/:id', (req, res) => {
  const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  if (vehicle.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied: not your vehicle' });
  }

  db.prepare('DELETE FROM vehicles WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
