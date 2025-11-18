/**
 * @summary
 * Type definitions for product service.
 *
 * @module services/product/productTypes
 */

/**
 * @interface ProductStockGetParams
 * @description Parameters for retrieving product stock
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idProduct - Product identifier
 */
export interface ProductStockGetParams {
  idAccount: number;
  idProduct: number;
}

/**
 * @interface ProductStockGetResult
 * @description Product stock information
 *
 * @property {number} idProduct - Product identifier
 * @property {string} productName - Product name
 * @property {string} productCode - Product code
 * @property {number} currentStock - Current stock balance
 * @property {string | null} lastMovementDate - Last movement timestamp
 * @property {number | null} lastMovementType - Last movement type
 * @property {string | null} lastMovementTypeName - Last movement type description
 * @property {string} status - Product status (disponivel, em_falta, excluido)
 * @property {boolean} deleted - Deletion flag
 */
export interface ProductStockGetResult {
  idProduct: number;
  productName: string;
  productCode: string;
  currentStock: number;
  lastMovementDate: string | null;
  lastMovementType: number | null;
  lastMovementTypeName: string | null;
  status: string;
  deleted: boolean;
}

/**
 * @interface ProductMovementHistoryListParams
 * @description Parameters for retrieving product movement history
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idProduct - Product identifier
 * @property {string} [startDate] - Start date filter
 * @property {string} [endDate] - End date filter
 * @property {number} [movementType] - Movement type filter
 */
export interface ProductMovementHistoryListParams {
  idAccount: number;
  idProduct: number;
  startDate?: string;
  endDate?: string;
  movementType?: number;
}

/**
 * @interface ProductMovementHistoryListResult
 * @description Product movement history item
 *
 * @property {number} idStockMovement - Movement identifier
 * @property {number} movementType - Movement type
 * @property {string} movementTypeName - Movement type description
 * @property {number} quantity - Quantity moved
 * @property {number} balanceAfter - Stock balance after movement
 * @property {string | null} referenceDocument - Reference document
 * @property {string | null} batchNumber - Batch number
 * @property {string | null} expirationDate - Expiration date
 * @property {string | null} location - Storage location
 * @property {string | null} reason - Movement reason
 * @property {number} idUser - User identifier
 * @property {string} dateCreated - Creation timestamp
 */
export interface ProductMovementHistoryListResult {
  idStockMovement: number;
  movementType: number;
  movementTypeName: string;
  quantity: number;
  balanceAfter: number;
  referenceDocument: string | null;
  batchNumber: string | null;
  expirationDate: string | null;
  location: string | null;
  reason: string | null;
  idUser: number;
  dateCreated: string;
}
