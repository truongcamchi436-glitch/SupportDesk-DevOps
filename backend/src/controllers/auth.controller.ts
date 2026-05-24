import type { Response, Request, NextFunction } from 'express';
import z from 'zod';

import * as authService from '../services/auth.service.js';


const registerSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(6),
  role: z.enum(['client', 'agent']).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);

    const result = await authService.register(
      data.name, 
      data.email, 
      data.password, 
      data.role,
    );

    res.status(201).json(result);
  } catch (error) { next(error); }  
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await authService.login(data.email, data.password);
    
    res.status(200).json(result);
  } catch (error) { next(error); }
};
