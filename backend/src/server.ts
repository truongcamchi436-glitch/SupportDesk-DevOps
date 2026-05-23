import type { NextFunction, Request, Response } from 'express';
import express, { type Application } from 'express';
import mongoose from 'mongoose';

import { env } from './config/env.js';

const app: Application = express();
const PORT = env.PORT;

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const start = async () => {
  try {
    await mongoose.connect(env.MONGO_URL);
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch(err) {
    console.error('Startup error: ', err);
    process.exit(1);
  }
};

start();

export default app;
