import { useQuery } from '@tanstack/react-query';
import { stockMovementService } from '../../services/stockMovementService';
import type { UseProductMovementHistoryOptions, UseProductMovementHistoryReturn } from './types';

export const useProductMovementHistory = (
  options: UseProductMovementHistoryOptions
): UseProductMovementHistoryReturn => {
  const { idProduct, filters, enabled = true } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['product-movement-history', idProduct, filters],
    queryFn: () => stockMovementService.getProductMovementHistory(idProduct, filters),
    enabled: enabled && !!idProduct,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
