import dotenv from 'dotenv';
dotenv.config();

function get(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Missing env var ${name}`);
  return v;
}

// Prefer MONGODB_URL if present (Render screenshot), fallback to MONGODB_URI
const MONGODB = process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fastprintke'

export const env = {
  NODE_ENV: get('NODE_ENV', 'development'),
  PORT: Number(get('PORT', '4000')),
  MONGODB_URI: MONGODB,
  JWT_SECRET: get('JWT_SECRET', 'dev-secret-change-me'),
  CORS_ORIGIN: get('CORS_ORIGIN', 'http://localhost:5173'),
  // Optional Cloudinary URL (cloudinary://<api_key>:<api_secret>@<cloud_name>)
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLERK_ISSUER: process.env.CLERK_ISSUER,
};
