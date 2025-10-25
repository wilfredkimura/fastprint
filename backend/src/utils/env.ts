import dotenv from 'dotenv';
dotenv.config();

function get(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Missing env var ${name}`);
  return v;
}

export const env = {
  NODE_ENV: get('NODE_ENV', 'development'),
  PORT: Number(get('PORT', '4000')),
  MONGODB_URI: get('MONGODB_URI', 'mongodb://127.0.0.1:27017/fastprintke'),
  JWT_SECRET: get('JWT_SECRET', 'dev-secret-change-me'),
  CORS_ORIGIN: get('CORS_ORIGIN', 'http://localhost:5173'),
};
