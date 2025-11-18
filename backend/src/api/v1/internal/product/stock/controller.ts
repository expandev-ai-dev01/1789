/**
 * @api {get} /internal/product/:id/stock Get Product Stock
 * @apiName GetProductStock
 * @apiGroup Product
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves current stock balance and status for a product
 *
 * @apiParam {Number} id Product identifier
 *
 * @apiSuccess {Object} stock Stock information
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
import { productStockGet } from '@/services/product';

const securable = 'PRODUCT';

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await productStockGet({
      ...validated.credential,
      idProduct: validated.params.id,
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
