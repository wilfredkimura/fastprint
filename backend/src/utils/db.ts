import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
}
