/**
 * @summary
 * Error handling middleware for Express application.
 * Provides centralized error processing and response formatting.
 *
 * @module middleware/error
 */

import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorMiddleware = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const errorCode = error.code || 'INTERNAL_SERVER_ERROR';

  console.error('Error:', {
    message: error.message,
    code: errorCode,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: error.message,
      details: error.details,
    },
    timestamp: new Date().toISOString(),
  });
};

export const StatusGeneralError: ApiError = {
  name: 'GeneralError',
  message: 'An unexpected error occurred',
  statusCode: 500,
  code: 'GENERAL_ERROR',
};
