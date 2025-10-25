import { Router } from 'express';

const router = Router();

router.get('/status', (_req, res) => {
  res.json({ ok: true });
});

router.use('/auth', (await import('./auth.js')).default);
router.use('/products', (await import('./products.js')).default);
router.use('/categories', (await import('./categories.js')).default);
router.use('/orders', (await import('./orders.js')).default);
router.use('/upload', (await import('./upload.js')).default);
router.use('/users', (await import('./users.js')).default);

export default router;
