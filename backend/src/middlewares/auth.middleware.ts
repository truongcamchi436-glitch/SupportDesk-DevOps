import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export interface JwtPayload {
  id: string
  role: 'client' | 'agent'
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Token not provided', 401, 'TOKEN_NOT_PROVIDED');
  }

  const token = header.split(' ')[1]!;

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as unknown as JwtPayload;

    req.user = decoded;
    next();
  } catch {
    throw new AppError('Invalid or expired token', 401, 'INVALID_OR_EXPIRED_TOKEN');
  }
};
