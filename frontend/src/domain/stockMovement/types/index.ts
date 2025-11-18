export interface StockMovement {
  idStockMovement: number;
  idProduct: number;
  productName?: string;
  movementType: 0 | 1 | 2 | 3;
  quantity: number;
  movementDate: string;
  idUser: number;
  userName?: string;
  referenceDocument?: string | null;
  batchNumber?: string | null;
  expirationDate?: string | null;
  location?: string | null;
  reason?: string | null;
}

export interface CreateStockMovementDto {
  idProduct: number;
  movementType: 0 | 1 | 2 | 3;
  quantity: number;
  referenceDocument?: string | null;
  batchNumber?: string | null;
  expirationDate?: string | null;
  location?: string | null;
  reason?: string | null;
}

export interface StockMovementListParams {
  startDate?: string;
  endDate?: string;
  idProduct?: number;
  movementType?: 0 | 1 | 2 | 3;
  idUser?: number;
  orderBy?: 'date_asc' | 'date_desc' | 'product_asc' | 'product_desc';
  limitRecords?: number;
}

export interface ProductStock {
  idProduct: number;
  currentBalance: number;
  lastMovementDate: string;
  lastMovementType: 0 | 1 | 2 | 3;
  status: 'disponível' | 'em_falta' | 'excluído';
}

export interface ProductMovementHistory {
  idStockMovement: number;
  movementType: 0 | 1 | 2 | 3;
  quantity: number;
  movementDate: string;
  userName: string;
  referenceDocument?: string | null;
  batchNumber?: string | null;
  expirationDate?: string | null;
  location?: string | null;
  reason?: string | null;
  balanceAfter: number;
}

export interface ProductMovementHistoryParams {
  startDate?: string;
  endDate?: string;
  movementType?: 0 | 1 | 2 | 3;
}

export const MOVEMENT_TYPE_LABELS: Record<0 | 1 | 2 | 3, string> = {
  0: 'Entrada',
  1: 'Saída',
  2: 'Ajuste',
  3: 'Exclusão',
};

export const PRODUCT_STATUS_LABELS: Record<'disponível' | 'em_falta' | 'excluído', string> = {
  disponível: 'Disponível',
  em_falta: 'Em Falta',
  excluído: 'Excluído',
};
