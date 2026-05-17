import express from 'express';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/authorize.js';

const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
const sanitize = (str) => (str || '').trim().slice(0, 500);

const VALID_STATUSES = ['pending', 'in-progress', 'completed', 'rejected'];

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

// GET /api/bookings — all bookings (admin only)
router.get('/', requireRole('admin'), (req, res) => {
  const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
  res.json(bookings);
});

// GET /api/bookings/my — bookings for the authenticated customer
router.get('/my', (req, res) => {
  const bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(bookings);
});

// GET /api/bookings/service-center — bookings assigned to the authenticated service center
router.get('/service-center', requireRole('service-center'), (req, res) => {
  const bookings = db.prepare('SELECT * FROM bookings WHERE service_center_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(bookings);
});

// POST /api/bookings — create a booking (customers only)
router.post('/', requireRole('customer'), (req, res) => {
  const userId = req.user.id;
  const userName = req.user.name;
  const serviceCenterId = sanitize(req.body.serviceCenterId);
  const serviceCenterName = sanitize(req.body.serviceCenterName);
  const serviceType = sanitize(req.body.serviceType);
  const date = sanitize(req.body.date);
  const description = sanitize(req.body.description);
  const vehicleId = sanitize(req.body.vehicleId);
  const vehicleLabel = sanitize(req.body.vehicleLabel);

  if (!serviceCenterId || !serviceType || !date) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Verify the vehicle belongs to the user (if provided)
  if (vehicleId) {
    const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ? AND user_id = ?').get(vehicleId, userId);
    if (!vehicle) {
      return res.status(403).json({ error: 'Vehicle does not belong to you' });
    }
  }

  // Verify the service center exists
  const sc = db.prepare("SELECT id FROM users WHERE id = ? AND role = 'service-center'").get(serviceCenterId);
  if (!sc) {
    return res.status(400).json({ error: 'Invalid service center' });
  }

  const id = genId();
  db.prepare(`
    INSERT INTO bookings (id, user_id, user_name, vehicle_id, vehicle_label, service_center_id, service_center_name, service_type, date, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, userId, userName, vehicleId, vehicleLabel, serviceCenterId, serviceCenterName, serviceType, date, description);
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
  res.status(201).json(booking);
});

// PATCH /api/bookings/:id — update status / price (service-center or admin)
router.patch('/:id', requireRole('service-center', 'admin'), (req, res) => {
  const status = sanitize(req.body.status);
  const priceQuote = req.body.priceQuote !== undefined ? sanitize(String(req.body.priceQuote)) : undefined;

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  // Service centers can only update their own bookings
  if (req.user.role === 'service-center' && booking.service_center_id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied: not your booking' });
  }

  // Validate status if provided
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  db.prepare('UPDATE bookings SET status = ?, price_quote = ? WHERE id = ?')
    .run(status || booking.status, priceQuote !== undefined ? priceQuote : booking.price_quote, req.params.id);

  const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  res.json(updated);
});

export default router;
