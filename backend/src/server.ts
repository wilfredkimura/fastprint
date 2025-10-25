import { createServer } from 'http';
import app from './app.js';
import { connectDB } from './utils/db.js';
import { env } from './utils/env.js';

async function start() {
  await connectDB();

  const server = createServer(app);
  const PORT = env.PORT;
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});
