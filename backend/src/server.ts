import { createServer } from 'http';
import app from './app.js';
import { connectDB } from './utils/db.js';
import { env } from './utils/env.js';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';

async function seedDefaultAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || '12345678';
  const name = process.env.ADMIN_NAME || 'Admin';
  if (!email || !password) return;
  const existing = await User.findOne({ email });
  if (existing) {
    let changed = false;
    if (existing.role !== 'admin') { existing.role = 'admin'; changed = true; }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      existing.password = hash;
      changed = true;
    }
    if (changed) await existing.save();
    // eslint-disable-next-line no-console
    console.log('Admin user ensured:', existing.email);
  } else {
    const hash = await bcrypt.hash(password, 10);
    const created = await User.create({ name, email, password: hash, role: 'admin' });
    // eslint-disable-next-line no-console
    console.log('Admin user created:', created.email);
  }
}

async function start() {
  await connectDB();
  await seedDefaultAdmin();

  const server = createServer(app);
  const PORT = env.PORT;
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});
