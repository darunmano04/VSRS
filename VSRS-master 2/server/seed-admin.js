import db from './db.js';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = 'admin@vsrs.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'System Admin';

const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(ADMIN_EMAIL);

if (existing) {
  console.log(`⚠️  Admin user already exists (${ADMIN_EMAIL}). Skipping.`);
  process.exit(0);
}

const id = `admin_${Date.now()}`;
const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);

db.prepare(
  'INSERT INTO users (id, name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?, ?)'
).run(id, ADMIN_NAME, ADMIN_EMAIL, passwordHash, '', 'admin');

console.log('✅ Admin user created successfully!');
console.log(`   Email:    ${ADMIN_EMAIL}`);
console.log(`   Password: ${ADMIN_PASSWORD}`);
console.log('   ⚠️  Change the password after first login!');
