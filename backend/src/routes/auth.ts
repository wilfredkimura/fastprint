import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../utils/env.js';
import { clerkAuth } from '../middleware/clerk.js';

const router = Router();

function setAuthCookie(res: any, payload: { id: string; role: 'customer' | 'admin' }) {
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string };
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    setAuthCookie(res, { id: user.id, role: user.role });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    setAuthCookie(res, { id: user.id, role: user.role });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (e) { next(e); }
});

router.get('/me', async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('name email role');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    res.json(user);
  } catch (e) { next(e); }
});

router.post('/logout', async (_req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: 0,
  });
  res.json({ ok: true });
});

// Clerk-authenticated me endpoint: verifies Clerk token, upserts user, returns app user shape
router.get('/clerk/me', clerkAuth, async (req, res) => {
  const u = await User.findById((req as any).user.id).select('name email role')
  if (!u) return res.status(401).json({ message: 'Unauthorized' })
  res.json({ id: u.id, name: u.name, email: u.email, role: u.role })
});

export default router;
