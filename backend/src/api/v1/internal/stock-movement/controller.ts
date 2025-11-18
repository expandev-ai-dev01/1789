/**
 * @api {post} /internal/stock-movement Create Stock Movement
 * @apiName CreateStockMovement
 * @apiGroup StockMovement
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new stock movement record
 *
 * @apiParam {Number} idProduct Product identifier
 * @apiParam {Number} movementType Movement type (0=entrada, 1=saida, 2=ajuste, 3=exclusao)
 * @apiParam {Number} quantity Quantity moved
 * @apiParam {String} [referenceDocument] Reference document number
 * @apiParam {String} [batchNumber] Batch number
 * @apiParam {String} [expirationDate] Expiration date (ISO format)
 * @apiParam {String} [location] Storage location
 * @apiParam {String} [reason] Movement reason
 *
 * @apiSuccess {Number} idStockMovement Movement identifier
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
import { stockMovementCreate, stockMovementList } from '@/services/stockMovement';

const securable = 'STOCK_MOVEMENT';

const createBodySchema = z.object({
  idProduct: z.number().int().positive(),
  movementType: z.number().int().min(0).max(3),
  quantity: z.number(),
  referenceDocument: z.string().max(50).nullable().optional(),
  batchNumber: z.string().max(30).nullable().optional(),
  expirationDate: z.string().nullable().optional(),
  location: z.string().max(100).nullable().optional(),
  reason: z.string().max(500).nullable().optional(),
});

const listQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  idProduct: z.coerce.number().int().positive().optional(),
  movementType: z.coerce.number().int().min(0).max(3).optional(),
  idUser: z.coerce.number().int().positive().optional(),
  orderBy: z.enum(['date_asc', 'date_desc', 'product_asc', 'product_desc']).optional(),
  limitRecords: z.coerce.number().int().min(1).max(1000).optional(),
});

export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const [validated, error] = await operation.create(req, createBodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await stockMovementCreate({
      ...validated.credential,
      ...validated.body,
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

/**
 * @api {get} /internal/stock-movement List Stock Movements
 * @apiName ListStockMovements
 * @apiGroup StockMovement
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists stock movements with optional filters
 *
 * @apiParam {String} [startDate] Start date filter (ISO format)
 * @apiParam {String} [endDate] End date filter (ISO format)
 * @apiParam {Number} [idProduct] Product filter
 * @apiParam {Number} [movementType] Movement type filter
 * @apiParam {Number} [idUser] User filter
 * @apiParam {String} [orderBy] Sort order
 * @apiParam {Number} [limitRecords] Maximum records
 *
 * @apiSuccess {Array} movements List of movements
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.list(req, listQuerySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await stockMovementList({
      ...validated.credential,
      ...validated.params,
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
