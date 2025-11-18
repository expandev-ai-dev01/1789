/**
 * @summary
 * Product business logic and database operations.
 * Handles stock balance calculation and movement history.
 *
 * @module services/product/productRules
 */

import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  ProductStockGetParams,
  ProductStockGetResult,
  ProductMovementHistoryListParams,
  ProductMovementHistoryListResult,
} from './productTypes';

/**
 * @summary
 * Retrieves current stock balance and status for a product.
 *
 * @function productStockGet
 * @module product
 *
 * @param {ProductStockGetParams} params - Stock query parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idProduct - Product identifier
 *
 * @returns {Promise<ProductStockGetResult>} Stock information
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function productStockGet(
  params: ProductStockGetParams
): Promise<ProductStockGetResult> {
  const result = await dbRequest(
    '[dbo].[spProductStockGet]',
    {
      idAccount: params.idAccount,
      idProduct: params.idProduct,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Retrieves complete movement history for a product.
 *
 * @function productMovementHistoryList
 * @module product
 *
 * @param {ProductMovementHistoryListParams} params - History query parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idProduct - Product identifier
 * @param {string} [params.startDate] - Start date filter
 * @param {string} [params.endDate] - End date filter
 * @param {number} [params.movementType] - Movement type filter
 *
 * @returns {Promise<ProductMovementHistoryListResult[]>} Movement history
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function productMovementHistoryList(
  params: ProductMovementHistoryListParams
): Promise<ProductMovementHistoryListResult[]> {
  const result = await dbRequest(
    '[dbo].[spProductMovementHistoryList]',
    {
      idAccount: params.idAccount,
      idProduct: params.idProduct,
      startDate: params.startDate || null,
      endDate: params.endDate || null,
      movementType: params.movementType !== undefined ? params.movementType : null,
    },
    ExpectedReturn.Multi
  );

  return result;
}
