import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';

const router = Router();

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// store in memory; we'll either push to Cloudinary or save to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET; // use unsigned preset for simplicity

  try {
    if (cloudName && uploadPreset) {
      // Upload to Cloudinary using data URI to avoid Blob typing issues
      const form = new FormData();
      const ext = path.extname(file.originalname) || '.jpg';
      const mime = file.mimetype || 'image/jpeg';
      const base64 = (file.buffer as Buffer).toString('base64');
      const dataUri = `data:${mime};base64,${base64}`;
      form.append('file', dataUri);
      form.append('upload_preset', uploadPreset);

      const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: form as any,
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Cloudinary upload failed: ${text}`);
      }
      const data = await resp.json() as any;
      return res.status(201).json({ url: data.secure_url || data.url, public_id: data.public_id });
    }

    // Fallback: save to local disk (ephemeral on some hosts)
    const ext = path.extname(file.originalname) || '.jpg';
    const name = crypto.randomBytes(16).toString('hex') + ext;
    const target = path.join(uploadDir, name);
    fs.writeFileSync(target, file.buffer);
    const url = `/uploads/${name}`;
    return res.status(201).json({ url, filename: name });
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Upload failed' });
  }
});

export default router;
