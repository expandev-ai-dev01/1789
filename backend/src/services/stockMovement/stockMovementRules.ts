/**
 * @summary
 * Stock movement business logic and database operations.
 * Handles creation and listing of stock movements.
 *
 * @module services/stockMovement/stockMovementRules
 */

import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  StockMovementCreateParams,
  StockMovementCreateResult,
  StockMovementListParams,
  StockMovementListResult,
} from './stockMovementTypes';

/**
 * @summary
 * Creates a new stock movement record.
 *
 * @function stockMovementCreate
 * @module stockMovement
 *
 * @param {StockMovementCreateParams} params - Movement creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idProduct - Product identifier
 * @param {number} params.movementType - Movement type (0=entrada, 1=saida, 2=ajuste, 3=exclusao)
 * @param {number} params.quantity - Quantity moved
 * @param {string} [params.referenceDocument] - Reference document number
 * @param {string} [params.batchNumber] - Batch number
 * @param {string} [params.expirationDate] - Expiration date
 * @param {string} [params.location] - Storage location
 * @param {string} [params.reason] - Movement reason
 *
 * @returns {Promise<StockMovementCreateResult>} Created movement data
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 */
export async function stockMovementCreate(
  params: StockMovementCreateParams
): Promise<StockMovementCreateResult> {
  const result = await dbRequest(
    '[dbo].[spStockMovementCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idProduct: params.idProduct,
      movementType: params.movementType,
      quantity: params.quantity,
      referenceDocument: params.referenceDocument || null,
      batchNumber: params.batchNumber || null,
      expirationDate: params.expirationDate || null,
      location: params.location || null,
      reason: params.reason || null,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Lists stock movements with optional filters.
 *
 * @function stockMovementList
 * @module stockMovement
 *
 * @param {StockMovementListParams} params - List parameters
 * @param {number} params.idAccount - Account identifier
 * @param {string} [params.startDate] - Start date filter
 * @param {string} [params.endDate] - End date filter
 * @param {number} [params.idProduct] - Product filter
 * @param {number} [params.movementType] - Movement type filter
 * @param {number} [params.idUser] - User filter
 * @param {string} [params.orderBy] - Sort order
 * @param {number} [params.limitRecords] - Maximum records
 *
 * @returns {Promise<StockMovementListResult[]>} List of movements
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function stockMovementList(
  params: StockMovementListParams
): Promise<StockMovementListResult[]> {
  const result = await dbRequest(
    '[dbo].[spStockMovementList]',
    {
      idAccount: params.idAccount,
      startDate: params.startDate || null,
      endDate: params.endDate || null,
      idProduct: params.idProduct || null,
      movementType: params.movementType !== undefined ? params.movementType : null,
      idUser: params.idUser || null,
      orderBy: params.orderBy || 'date_desc',
      limitRecords: params.limitRecords || 100,
    },
    ExpectedReturn.Multi
  );

  return result;
}
