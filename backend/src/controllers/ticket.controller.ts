import type { NextFunction, Request, Response } from 'express';
import z from 'zod';

import * as ticketService from '../services/ticket.service.js';

const ticketParamsSchema = z.object({
  id: z.string().trim().min(1),
});

const createTicketSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

const commentSchema = z.object({
  body: z.string().trim().min(1),
});

type TicketParams = z.infer<typeof ticketParamsSchema>;

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets = await ticketService.listTickets(req.user!);
    
    res.json(tickets);
  } catch (error) { next(error); }
};

export const get = async (req: Request<TicketParams>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const ticket = await ticketService.getTicket(id, req.user!);
    
    res.json(ticket);
  } catch (error) { next(error); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createTicketSchema.parse(req.body);

    const ticket = await ticketService.createTicket(
      {
        title: data.title,
        description: data.description,
        ...(data.priority && { priority: data.priority }),
      },
      req.user!.id,
    );

    res.status(201).json(ticket);
  } catch (error) { next(error); }
};

export const assign = async (req: Request<TicketParams>, res: Response, next: NextFunction) => {
  try {
    const { id } = ticketParamsSchema.parse(req.params);

    const ticket = await ticketService.assignTicketToMe(id, req.user!.id);

    res.json(ticket);
  } catch (error) { next(error); }
};

export const unassign = async (req: Request<TicketParams>, res: Response, next: NextFunction) => {
  try {
    const { id } = ticketParamsSchema.parse(req.params);

    const ticket = await ticketService.unassignTicket(id, req.user!.id);

    res.json(ticket);
  } catch (error) { next(error); }
};

export const close = async (req: Request<TicketParams>, res: Response, next: NextFunction) => {
  try {
    const { id } = ticketParamsSchema.parse(req.params);

    const ticket = await ticketService.closeTicket(id, req.user!.id);

    res.json(ticket);
  } catch (error) { next(error); }
};

export const cancel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = ticketParamsSchema.parse(req.params);

    const ticket = await ticketService.cancelTicket(id, req.user!);

    res.json(ticket);
  } catch (error) { next(error); }
};

export const comment = async (req: Request<TicketParams>, res: Response, next: NextFunction) => {
  try {
    const { id } = ticketParamsSchema.parse(req.params);
    const { body } = commentSchema.parse(req.body);

    const ticket = await ticketService.addComment(id, req.user!, body);

    res.status(201).json(ticket);
  } catch (error) { next(error); }
};
