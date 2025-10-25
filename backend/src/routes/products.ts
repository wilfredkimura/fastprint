import { Router } from 'express';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { page = '1', limit = '12', q, category, sort, featured } = req.query as Record<string, string>;
    const filter: any = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    if (typeof featured !== 'undefined') filter.isFeatured = featured === 'true' || featured === '1';

    const sortMap: any = { price_asc: { basePrice: 1 }, price_desc: { basePrice: -1 }, newest: { createdAt: -1 } };
    const sortObj = sortMap[sort as string] || { createdAt: -1 };

    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, Math.max(1, parseInt(limit)));
    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip((p - 1) * l).limit(l),
      Product.countDocuments(filter),
    ]);
    res.json({ items, total, page: p, pages: Math.ceil(total / l) });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await Product.create(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.post('/seed', async (_req, res, next) => {
  try {
    const bySlug = async (slug: string) => {
      const c = await Category.findOne({ slug })
      if (!c) throw new Error(`Missing category: ${slug}. Seed categories first.`)
      return c._id
    }

    const examples = [
      {
        name: 'Classic T-Shirt',
        slug: 'classic-tshirt',
        categorySlug: 'tshirts',
        basePrice: 1500,
        images: [],
        customizationOptions: [
          { type: 'select', label: 'Size', key: 'size', options: ['S','M','L','XL','XXL'] },
          { type: 'imageUpload', label: 'Reference Image', key: 'refImage' },
          { type: 'text', label: 'Custom Text', key: 'customText' },
        ],
      },
      {
        name: 'Branded Mug',
        slug: 'branded-mug',
        categorySlug: 'mugs',
        basePrice: 800,
        images: [],
        customizationOptions: [
          { type: 'imageUpload', label: 'Artwork', key: 'artwork' },
          { type: 'text', label: 'Name on Mug', key: 'name' },
        ],
      },
      {
        name: 'Stylish Hat',
        slug: 'stylish-hat',
        categorySlug: 'hats',
        basePrice: 1200,
        images: [],
        customizationOptions: [
          { type: 'select', label: 'Size', key: 'size', options: ['S','M','L','XL','XXL'] },
          { type: 'imageUpload', label: 'Reference Image', key: 'refImage' },
        ],
      },
      {
        name: 'Christian Wall Art',
        slug: 'christian-wall-art-verse',
        categorySlug: 'christian-wall-art',
        basePrice: 2500,
        images: [],
        customizationOptions: [
          { type: 'select', label: 'Size', key: 'size', options: ['A4','A3','A2'] },
          { type: 'text', label: 'Verse or Quote', key: 'verse' },
          { type: 'imageUpload', label: 'Reference Image', key: 'refImage' },
        ],
      },
      {
        name: 'Personalized Frame',
        slug: 'personalized-frame',
        categorySlug: 'personalized-frames',
        basePrice: 3000,
        images: [],
        customizationOptions: [
          { type: 'select', label: 'Size', key: 'size', options: ['8x10','A4','A3'] },
          { type: 'select', label: 'Fitting', key: 'fitting', options: ['Stand','Wall Hook'] },
          { type: 'imageUpload', label: 'Photo to Frame', key: 'photo' },
          { type: 'text', label: 'Message', key: 'message' },
        ],
      },
    ] as any[]

    let created = 0
    for (const e of examples) {
      const exists = await Product.findOne({ name: e.name })
      if (exists) continue
      const category = await bySlug(e.categorySlug)
      await Product.create({
        name: e.name,
        description: e.name,
        basePrice: e.basePrice,
        category,
        images: e.images,
        customizationOptions: e.customizationOptions,
      })
      created++
    }
    res.json({ ok: true, created })
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
