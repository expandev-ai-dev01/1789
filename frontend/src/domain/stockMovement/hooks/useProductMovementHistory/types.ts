import type { ProductMovementHistory, ProductMovementHistoryParams } from '../../types';

export interface UseProductMovementHistoryOptions {
  idProduct: number;
  filters?: ProductMovementHistoryParams;
  enabled?: boolean;
}

export interface UseProductMovementHistoryReturn {
  data: ProductMovementHistory[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}
