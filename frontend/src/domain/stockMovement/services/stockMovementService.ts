import { authenticatedClient } from '@/core/lib/api';
import type {
  StockMovement,
  CreateStockMovementDto,
  StockMovementListParams,
  ProductStock,
  ProductMovementHistory,
  ProductMovementHistoryParams,
} from '../types';

export const stockMovementService = {
  async create(data: CreateStockMovementDto): Promise<{ idStockMovement: number }> {
    const response = await authenticatedClient.post('/stock-movement', data);
    return response.data.data;
  },

  async list(params?: StockMovementListParams): Promise<StockMovement[]> {
    const response = await authenticatedClient.get('/stock-movement', { params });
    return response.data.data;
  },

  async getProductStock(idProduct: number): Promise<ProductStock> {
    const response = await authenticatedClient.get(`/product/${idProduct}/stock`);
    return response.data.data;
  },

  async getProductMovementHistory(
    idProduct: number,
    params?: ProductMovementHistoryParams
  ): Promise<ProductMovementHistory[]> {
    const response = await authenticatedClient.get(`/product/${idProduct}/movement-history`, {
      params,
    });
    return response.data.data;
  },
};
