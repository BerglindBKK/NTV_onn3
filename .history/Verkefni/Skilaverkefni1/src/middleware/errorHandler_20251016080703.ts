import type { Request, Response, NextFunction } from 'express';
import z from 'zod';

interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
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
    return;
  }

  // Handle regular errors
  const status = err.statusCode ?? 500;

  if (status === 500) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
    return;
  }

  res.status(status).json({
    error: { status, message: err.message || 'Error' },
  });
  return;
}
