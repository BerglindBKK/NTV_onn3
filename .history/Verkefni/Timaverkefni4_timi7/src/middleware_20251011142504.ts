import { NextFunction, Request, Response } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
}

export const errorHandler = (
  error: ErrorWithStatus,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.error(error);
  response
    .status(error.status || 500)
    .json({ success: false, error: error.message });
};
