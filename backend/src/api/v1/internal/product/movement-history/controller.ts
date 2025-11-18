/**
 * @api {get} /internal/product/:id/movement-history Get Product Movement History
 * @apiName GetProductMovementHistory
 * @apiGroup Product
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves complete movement history for a product
 *
 * @apiParam {Number} id Product identifier
 * @apiParam {String} [startDate] Start date filter (ISO format)
 * @apiParam {String} [endDate] End date filter (ISO format)
 * @apiParam {Number} [movementType] Movement type filter
 *
 * @apiSuccess {Array} history Movement history
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { productMovementHistoryList } from '@/services/product';

const securable = 'PRODUCT';

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const querySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  movementType: z.coerce.number().int().min(0).max(3).optional(),
});

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validatedParams, paramsError] = await operation.read(req, paramsSchema);

  if (!validatedParams) {
    return next(paramsError);
  }

  const [validatedQuery, queryError] = await operation.list(req, querySchema);

  if (!validatedQuery) {
    return next(queryError);
  }

  try {
    const data = await productMovementHistoryList({
      ...validatedParams.credential,
      idProduct: validatedParams.params.id,
      ...validatedQuery.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
