/**
 * @summary
 * Type definitions for stock movement service.
 *
 * @module services/stockMovement/stockMovementTypes
 */

/**
 * @interface StockMovementCreateParams
 * @description Parameters for creating a stock movement
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idProduct - Product identifier
 * @property {number} movementType - Movement type (0=entrada, 1=saida, 2=ajuste, 3=exclusao)
 * @property {number} quantity - Quantity moved
 * @property {string} [referenceDocument] - Reference document number
 * @property {string} [batchNumber] - Batch number
 * @property {string} [expirationDate] - Expiration date
 * @property {string} [location] - Storage location
 * @property {string} [reason] - Movement reason
 */
export interface StockMovementCreateParams {
  idAccount: number;
  idUser: number;
  idProduct: number;
  movementType: number;
  quantity: number;
  referenceDocument?: string | null;
  batchNumber?: string | null;
  expirationDate?: string | null;
  location?: string | null;
  reason?: string | null;
}

/**
 * @interface StockMovementCreateResult
 * @description Result of stock movement creation
 *
 * @property {number} idStockMovement - Created movement identifier
 */
export interface StockMovementCreateResult {
  idStockMovement: number;
}

/**
 * @interface StockMovementListParams
 * @description Parameters for listing stock movements
 *
 * @property {number} idAccount - Account identifier
 * @property {string} [startDate] - Start date filter
 * @property {string} [endDate] - End date filter
 * @property {number} [idProduct] - Product filter
 * @property {number} [movementType] - Movement type filter
 * @property {number} [idUser] - User filter
 * @property {string} [orderBy] - Sort order
 * @property {number} [limitRecords] - Maximum records
 */
export interface StockMovementListParams {
  idAccount: number;
  startDate?: string;
  endDate?: string;
  idProduct?: number;
  movementType?: number;
  idUser?: number;
  orderBy?: string;
  limitRecords?: number;
}

/**
 * @interface StockMovementListResult
 * @description Stock movement list item
 *
 * @property {number} idStockMovement - Movement identifier
 * @property {number} idProduct - Product identifier
 * @property {string} productName - Product name
 * @property {string} productCode - Product code
 * @property {number} movementType - Movement type
 * @property {string} movementTypeName - Movement type description
 * @property {number} quantity - Quantity moved
 * @property {string | null} referenceDocument - Reference document
 * @property {string | null} batchNumber - Batch number
 * @property {string | null} expirationDate - Expiration date
 * @property {string | null} location - Storage location
 * @property {string | null} reason - Movement reason
 * @property {number} idUser - User identifier
 * @property {string} dateCreated - Creation timestamp
 */
export interface StockMovementListResult {
  idStockMovement: number;
  idProduct: number;
  productName: string;
  productCode: string;
  movementType: number;
  movementTypeName: string;
  quantity: number;
  referenceDocument: string | null;
  batchNumber: string | null;
  expirationDate: string | null;
  location: string | null;
  reason: string | null;
  idUser: number;
  dateCreated: string;
}
