import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stockMovementService } from '../../services/stockMovementService';
import type { UseStockMovementCreateOptions, UseStockMovementCreateReturn } from './types';

export const useStockMovementCreate = (
  options: UseStockMovementCreateOptions = {}
): UseStockMovementCreateReturn => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: create,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: stockMovementService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['product-stock'] });
      queryClient.invalidateQueries({ queryKey: ['product-movement-history'] });
      options.onSuccess?.(data);
    },
    onError: (err: unknown) => {
      options.onError?.(err);
    },
  });

  return {
    create,
    isCreating,
    error,
  };
};
