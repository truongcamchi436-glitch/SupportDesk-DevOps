import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { AppError } from '../utils/AppError.js';

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: 'Validation error',
      code: 'VALIDATION_ERROR',
    });
  }

  console.error(error);

  return res.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  });
}
