import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';

import app from '../src/app';

let clientToken: string;
let agentToken: string;
let otherAgentToken: string;
let otherClientToken: string;
let ticketId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();

  const client = await request(app)
    .post('/auth/register')
    .send({
      name: 'Client',
      email: 'client@test.com',
      password: '123456',
      role: 'client',
    });

  clientToken = client.body.token;

  const otherClient = await request(app)
    .post('/auth/register')
    .send({
      name: 'Other Client',
      email: 'other-client@test.com',
      password: '123456',
      role: 'client',
    });

  otherClientToken = otherClient.body.token;

  const agent = await request(app)
    .post('/auth/register')
    .send({
      name: 'Agent',
      email: 'agent@test.com',
      password: '123456',
      role: 'agent',
    });

  agentToken = agent.body.token;

  const otherAgent = await request(app)
    .post('/auth/register')
    .send({
      name: 'Other Agent',
      email: 'other-agent@test.com',
      password: '123456',
      role: 'agent',
    });

  otherAgentToken = otherAgent.body.token;

  const ticket = await request(app)
    .post('/tickets')
    .set('Authorization', `Bearer ${clientToken}`)
    .send({
      title: 'My ticket',
      description: 'Problem X',
      priority: 'high',
    });

  ticketId = ticket.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Tickets', () => {
  it('should create a ticket as client', async () => {
    const response = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        title: 'New ticket',
        description: 'Problem Y',
        priority: 'medium',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.status).toBe('open');
  });

  it('should not allow agent to create a ticket', async () => {
    const response = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        title: 'Invalid ticket',
        description: 'This should not work',
      });

    expect(response.status).toBe(403);
  });

  it('should list tickets for authenticated client', async () => {
    const response = await request(app)
      .get('/tickets')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get own ticket as client', async () => {
    const response = await request(app)
      .get(`/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(ticketId);
  });

  it('should not allow another client to get a ticket they did not create', async () => {
    const response = await request(app)
      .get(`/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${otherClientToken}`);

    expect(response.status).toBe(403);
  });

  it('should assign an open ticket to agent', async () => {
    const response = await request(app)
      .patch(`/tickets/${ticketId}/assign`)
      .set('Authorization', `Bearer ${agentToken}`);

    expect(response.status).toBe(200);
    expect(response.body.assignedTo).toBeDefined();
    expect(response.body.status).toBe('in_progress');
  });

  it('should not assign a ticket as client', async () => {
    const response = await request(app)
      .patch(`/tickets/${ticketId}/assign`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(response.status).toBe(403);
  });

  it('should unassign own assigned ticket as agent', async () => {
    await request(app)
      .patch(`/tickets/${ticketId}/assign`)
      .set('Authorization', `Bearer ${agentToken}`);

    const response = await request(app)
      .patch(`/tickets/${ticketId}/unassign`)
      .set('Authorization', `Bearer ${agentToken}`);

    expect(response.status).toBe(200);
    expect(response.body.assignedTo).toBeNull();
    expect(response.body.status).toBe('open');
  });

  it('should not allow another agent to unassign a ticket they are not assigned to', async () => {
    await request(app)
      .patch(`/tickets/${ticketId}/assign`)
      .set('Authorization', `Bearer ${agentToken}`);

    const response = await request(app)
      .patch(`/tickets/${ticketId}/unassign`)
      .set('Authorization', `Bearer ${otherAgentToken}`);

    expect(response.status).toBe(403);
  });

  it('should close own assigned ticket as agent', async () => {
    await request(app)
      .patch(`/tickets/${ticketId}/assign`)
      .set('Authorization', `Bearer ${agentToken}`);

    const response = await request(app)
      .patch(`/tickets/${ticketId}/close`)
      .set('Authorization', `Bearer ${agentToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('closed');
  });

  it('should not allow another agent to close a ticket they are not assigned to', async () => {
    await request(app)
      .patch(`/tickets/${ticketId}/assign`)
      .set('Authorization', `Bearer ${agentToken}`);

    const response = await request(app)
      .patch(`/tickets/${ticketId}/close`)
      .set('Authorization', `Bearer ${otherAgentToken}`);

    expect(response.status).toBe(403);
  });

  it('should cancel own open ticket as client', async () => {
    const response = await request(app)
      .patch(`/tickets/${ticketId}/cancel`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('canceled');
  });

  it('should not allow another client to cancel a ticket they did not create', async () => {
    const response = await request(app)
      .patch(`/tickets/${ticketId}/cancel`)
      .set('Authorization', `Bearer ${otherClientToken}`);

    expect(response.status).toBe(403);
  });

  it('should allow client to comment on own open ticket', async () => {
    const response = await request(app)
      .post(`/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        body: 'Still having this problem',
      });

    expect(response.status).toBe(201);
    expect(response.body.comments).toHaveLength(1);
  });

  it('should allow assigned agent to comment on assigned ticket', async () => {
    await request(app)
      .patch(`/tickets/${ticketId}/assign`)
      .set('Authorization', `Bearer ${agentToken}`);

    const response = await request(app)
      .post(`/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        body: 'I am checking this issue',
      });

    expect(response.status).toBe(201);
    expect(response.body.comments).toHaveLength(1);
  });

  it('should not allow comment on closed ticket', async () => {
    await request(app)
      .patch(`/tickets/${ticketId}/assign`)
      .set('Authorization', `Bearer ${agentToken}`);

    await request(app)
      .patch(`/tickets/${ticketId}/close`)
      .set('Authorization', `Bearer ${agentToken}`);

    const response = await request(app)
      .post(`/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        body: 'Can I still comment?',
      });

    expect(response.status).toBe(400);
  });

  it('should not access tickets without token', async () => {
    const response = await request(app).get('/tickets');

    expect(response.status).toBe(401);
  });
});
