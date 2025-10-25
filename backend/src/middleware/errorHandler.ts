import type { Request, Response, NextFunction } from 'express';

export function notFound(_req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ message: 'Not Found' });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = process.env.NODE_ENV !== 'production' ? err.stack : undefined;
  res.status(status).json({ message, details });
}
