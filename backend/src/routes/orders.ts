import { Router } from 'express';
import { Order } from '../models/Order.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const items = await Order.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await Order.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await Order.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) { next(e); }
});

router.get('/:id/track', async (req, res, next) => {
  try {
    const item = await Order.findById(req.params.id).select('orderStatus trackingNumber totalAmount orderedAt');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

export default router;
