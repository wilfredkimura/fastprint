import { Router } from 'express';
import { User } from '../models/User.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id, '-password');
    if (!u) return res.status(404).json({ message: 'Not found' });
    res.json(u);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { password, ...rest } = req.body; // disallow password change here
    const updated = await User.findByIdAndUpdate(req.params.id, rest, { new: true, projection: '-password' });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
