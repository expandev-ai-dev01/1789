import { format } from 'date-fns';
import { useProductStock } from '../../hooks/useProductStock';
import { MOVEMENT_TYPE_LABELS, PRODUCT_STATUS_LABELS } from '../../types';
import type { ProductStockCardProps } from './types';

export const ProductStockCard = (props: ProductStockCardProps) => {
  const { idProduct } = props;

  const { data, isLoading, error } = useProductStock({ idProduct });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-600">Erro ao carregar saldo do produto</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Saldo Atual</h3>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Quantidade Disponível</p>
          <p className="text-3xl font-bold text-gray-900">{data.currentBalance}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>
          <span
            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              data.status === 'disponível'
                ? 'bg-green-100 text-green-800'
                : data.status === 'em_falta'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {PRODUCT_STATUS_LABELS[data.status]}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-500">Última Movimentação</p>
          <p className="text-sm text-gray-900">
            {MOVEMENT_TYPE_LABELS[data.lastMovementType]} em{' '}
            {format(new Date(data.lastMovementDate), 'dd/MM/yyyy HH:mm')}
          </p>
        </div>
      </div>
    </div>
  );
};
