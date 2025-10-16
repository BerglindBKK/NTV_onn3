import type { Request, Response, NextFunction } from 'express';
import z from 'zod';

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
  if (err instanceof z.ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      error: { status: 400, message: 'Validation failed', details },
    });
  }

  // Handle regular errors
  const status = err.statusCode ?? 500;
  if (status === 500) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }

  res.status(status).json({
    success: false,
    error: message,
  });
}
