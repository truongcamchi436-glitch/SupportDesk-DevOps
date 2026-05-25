import cors from 'cors';
import type { Request, Response } from 'express';
import express, { type Application } from 'express';
import mongoose from 'mongoose';

import { errorMiddleware } from './middlewares/error.middleware.js';
import router from './routes/index.route.js';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use(router);

app.use(errorMiddleware);

export default app;
