export * from './types';
export * from './services/stockMovementService';
export * from './hooks/useStockMovementCreate';
export * from './hooks/useStockMovementList';
export * from './hooks/useProductStock';
export * from './hooks/useProductMovementHistory';
export * from './components/StockMovementForm';
export * from './components/StockMovementList';
export * from './components/ProductStockCard';
export * from './components/ProductMovementHistoryList';

export const moduleMetadata = {
  name: 'stockMovement',
  domain: 'functional',
  version: '1.0.0',
  publicComponents: [
    'StockMovementForm',
    'StockMovementList',
    'ProductStockCard',
    'ProductMovementHistoryList',
  ],
  publicHooks: [
    'useStockMovementCreate',
    'useStockMovementList',
    'useProductStock',
    'useProductMovementHistory',
  ],
  publicServices: ['stockMovementService'],
  dependencies: {
    internal: ['@/core/lib/api', '@/core/components'],
    external: ['react', 'react-hook-form', 'zod', '@tanstack/react-query', 'date-fns'],
    domains: [],
  },
  exports: {
    components: [
      'StockMovementForm',
      'StockMovementList',
      'ProductStockCard',
      'ProductMovementHistoryList',
    ],
    hooks: [
      'useStockMovementCreate',
      'useStockMovementList',
      'useProductStock',
      'useProductMovementHistory',
    ],
    services: ['stockMovementService'],
    types: [
      'StockMovement',
      'CreateStockMovementDto',
      'StockMovementListParams',
      'ProductStock',
      'ProductMovementHistory',
      'ProductMovementHistoryParams',
    ],
  },
} as const;
