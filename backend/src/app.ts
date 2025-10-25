import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { env } from './utils/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import router from './routes/index.js';

const app = express();

app.set('trust proxy', 1);
// Allow images from this API to be embedded by the frontend dev server (different origin)
// while keeping the rest of Helmet protections enabled.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({ origin: env.CORS_ORIGIN.split(','), credentials: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.use('/api', router);

// static uploads with explicit headers for cross-origin embedding
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  // Images are public; allow embedding from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.resolve(process.cwd(), 'uploads')));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'fastprintke-backend' });
});

app.use(notFound);
app.use(errorHandler);

export default app;
