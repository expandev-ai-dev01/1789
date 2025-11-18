/**
 * @summary
 * Internal (authenticated) API routes for Version 1.
 * Handles authenticated endpoints.
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as stockMovementController from '@/api/v1/internal/stock-movement/controller';
import * as productStockController from '@/api/v1/internal/product/stock/controller';
import * as productMovementHistoryController from '@/api/v1/internal/product/movement-history/controller';

const router = Router();

router.post('/stock-movement', stockMovementController.postHandler);
router.get('/stock-movement', stockMovementController.listHandler);

router.get('/product/:id/stock', productStockController.getHandler);
router.get('/product/:id/movement-history', productMovementHistoryController.getHandler);

export default router;
