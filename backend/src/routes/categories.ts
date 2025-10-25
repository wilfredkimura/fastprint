import { Router } from 'express';
import { Category } from '../models/Category.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const items = await Category.find({}).sort({ name: 1 });
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/seed', async (_req, res, next) => {
  try {
    const presets = [
      { name: 'T-Shirts', slug: 'tshirts' },
      { name: 'Hats', slug: 'hats' },
      { name: 'Mugs', slug: 'mugs' },
      { name: 'Christian Wall Art', slug: 'christian-wall-art' },
      { name: 'Personalized Frames', slug: 'personalized-frames' },
    ];
    const results: any[] = [];
    for (const p of presets) {
      const existed = await Category.findOne({ slug: p.slug });
      if (!existed) {
        const created = await Category.create(p);
        results.push(created);
      }
    }
    res.json({ ok: true, created: results.length });
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await Category.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
