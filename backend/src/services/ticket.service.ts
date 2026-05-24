import type { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

import { Ticket } from '../models/Ticket.js';
import { AppError } from '../utils/AppError.js';

type TicketPriority = 'low' | 'medium' | 'high';
type TicketStatus = 'open' | 'in_progress' | 'closed';

const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
  open: ['in_progress'],
  in_progress: ['open', 'closed'],
  closed: [],
};

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
    throw new AppError('Access denied', 404, 'ACCESS_DENIED');
  }

  return ticket;
};

export const createTicket = (data: { title: string; description: string; priority?: TicketPriority }, userId: string) => {
  return Ticket.create({ ...data, createdBy: userId });
};

export const updateStatus = async (id: string, status: TicketStatus) => {
  const ticket = await findTicketOrFail(id);

  const currentStatus = ticket.status;

  if (!allowedTransitions[currentStatus].includes(status)) {
    throw new AppError(
      `Cannot change status from ${currentStatus} to ${status}`,
      400,
      'INVALID_STATUS_TRANSITION',
    );
  }

  ticket.status = status;
  await ticket.save();

  return ticket;
};

export const assignTicketToMe = async (id: string, agentId: string) => {
  const ticket = await findTicketOrFail(id);

  if (ticket.status !== 'open') {
    throw new AppError('Only open tickets can perform this action', 400, 'TICKET_NOT_OPEN');
  }

  ticket.assignedTo = new Types.ObjectId(agentId);
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
