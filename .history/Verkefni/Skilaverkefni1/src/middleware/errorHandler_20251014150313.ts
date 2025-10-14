import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return response.status(400).json({
      success: false,
      error: 'Validation failed',
      details,
    });
  }

  // Handle regular errors
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  response.status(status).json({
    success: false,
    error: message,
  });
}
