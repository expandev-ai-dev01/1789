import type { StockMovement, StockMovementListParams } from '../../types';

export interface UseStockMovementListOptions {
  filters?: StockMovementListParams;
  enabled?: boolean;
}

export interface UseStockMovementListReturn {
  data: StockMovement[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}
