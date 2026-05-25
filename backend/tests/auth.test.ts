import mongoose from 'mongoose';
import request from 'supertest';

import app from '../src/app';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Auth', () => {
  it('should register a user and return a token', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: '123456',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).not.toHaveProperty('password');
  });

  it('should not register a duplicated email', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'A',
        email: 'dup@test.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/auth/register')
      .send({
        name: 'B',
        email: 'dup@test.com',
        password: '123456',
      });

    expect(response.status).toBe(409);
  });

  it('should login and return a token', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: '123456',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'wrong-password',
      });

    expect(response.status).toBe(401);
  });
});
