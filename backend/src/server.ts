import mongoose from 'mongoose';

import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT;

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
