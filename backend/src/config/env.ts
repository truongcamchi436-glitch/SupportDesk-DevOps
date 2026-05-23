import 'dotenv/config';

export const env = {
  PORT: Number(process.env.PORT) || 3000, 
  MONGO_URL: process.env.MONGO_URL, 
  MONGO_TEST_URL: process.env.MONGO_TEST_URL, 
  JWT_SECRET: process.env.JWT_SECRET, 
  NODE_ENV: process.env.NODE_ENV, 
};
