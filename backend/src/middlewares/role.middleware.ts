import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../utils/AppError.js';

export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('Access denied', 403, 'ACCESS_DENIED');
    }
    next();
  };
};
