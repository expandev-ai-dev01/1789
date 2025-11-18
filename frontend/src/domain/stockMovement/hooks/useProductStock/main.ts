import { useQuery } from '@tanstack/react-query';
import { stockMovementService } from '../../services/stockMovementService';
import type { UseProductStockOptions, UseProductStockReturn } from './types';

export const useProductStock = (options: UseProductStockOptions): UseProductStockReturn => {
  const { idProduct, enabled = true } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['product-stock', idProduct],
    queryFn: () => stockMovementService.getProductStock(idProduct),
    enabled: enabled && !!idProduct,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
