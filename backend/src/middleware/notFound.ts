/**
 * @summary
 * 404 Not Found middleware for Express application.
 * Handles requests to undefined routes.
 *
 * @module middleware/notFound
 */

import { Request, Response } from 'express';

export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      details: {
        method: req.method,
        path: req.path,
      },
    },
    timestamp: new Date().toISOString(),
  });
};
