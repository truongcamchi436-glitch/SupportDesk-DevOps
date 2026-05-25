import type { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

import { Ticket } from '../models/Ticket.js';
import { AppError } from '../utils/AppError.js';

type TicketPriority = 'low' | 'medium' | 'high';

export const listTickets = (user: JwtPayload) => {
  const filter = user.role === 'client' ? { createdBy: user.id } : {};
  return Ticket.find(filter)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });
};

export const getTicket = async (id: string, user: JwtPayload) => {
  const ticket = await Ticket.findById(id)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .populate('comments.author', 'name email');

  if (!ticket) {throw new AppError('Ticket not found', 404, 'TICKET_NOT_FOUND');}

  if (user.role === 'client' && ticket.createdBy._id.toString() !== user.id) {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED');
  }

  return ticket;
};

export const createTicket = (data: { title: string; description: string; priority?: TicketPriority }, userId: string) => {
  return Ticket.create({ ...data, createdBy: userId });
};

export const assignTicketToMe = async (id: string, agentId: string) => {
  const ticket = await findTicketOrFail(id);

  if (ticket.status !== 'open') {
    throw new AppError('Only open tickets can be assigned', 400, 'TICKET_NOT_OPEN');
  }

  ticket.assignedTo = new Types.ObjectId(agentId);
  ticket.status = 'in_progress';

  await ticket.save();

  return ticket;
};

export const unassignTicket = async (id: string, agentId: string) => {
  const ticket = await findTicketOrFail(id);

  if (ticket.status !== 'in_progress') {
    throw new AppError(
      'Only in progress tickets can be unassigned',
      400,
      'TICKET_NOT_IN_PROGRESS',
    );
  }

  if (ticket.assignedTo?.toString() !== agentId) {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED');
  }

  ticket.assignedTo = null;
  ticket.status = 'open';

  await ticket.save();

  return ticket;
};

export const closeTicket = async (id: string, agentId: string) => {
  const ticket = await findTicketOrFail(id);

  if (ticket.status !== 'in_progress') {
    throw new AppError('Only in progress tickets can be closed', 400, 'TICKET_NOT_IN_PROGRESS');
  }

  if (ticket.assignedTo?.toString() !== agentId) {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED');
  }

  ticket.status = 'closed';

  await ticket.save();

  return ticket;
};

export const cancelTicket = async (id: string, user: JwtPayload) => {
  const ticket = await findTicketOrFail(id);

  if (user.role !== 'client' || ticket.createdBy.toString() !== user.id) {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED');
  }

  if (ticket.status !== 'open') {
    throw new AppError('Only open tickets can be canceled', 400, 'TICKET_NOT_OPEN');
  }

  ticket.status = 'canceled';

  await ticket.save();

  return ticket;
};

export const addComment = async (id: string, user: JwtPayload, body: string) => {
  const ticket = await findTicketOrFail(id);

  if (ticket.status === 'closed') {
    throw new AppError('Cannot comment on closed ticket', 400, 'TICKET_CLOSED');
  }

  const isClientOwner =
    user.role === 'client' && ticket.createdBy.toString() === user.id;

  const isAssignedAgent =
    user.role === 'agent' && ticket.assignedTo?.toString() === user.id;

  const isOpenUnassignedAgent =
    user.role === 'agent' && ticket.status === 'open' && !ticket.assignedTo;

  if (!isClientOwner && !isAssignedAgent && !isOpenUnassignedAgent) {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED');
  }

  ticket.comments.push({
    author: new Types.ObjectId(user.id),
    body,
    createdAt: new Date(),
  });

  await ticket.save();

  return ticket;
};

const findTicketOrFail = async (id: string) => {
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new AppError('Ticket not found', 404, 'TICKET_NOT_FOUND');
  }

  return ticket;
};
