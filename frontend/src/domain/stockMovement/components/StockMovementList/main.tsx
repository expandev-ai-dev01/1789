import { format } from 'date-fns';
import { useStockMovementList } from '../../hooks/useStockMovementList';
import { MOVEMENT_TYPE_LABELS } from '../../types';
import type { StockMovementListProps } from './types';

export const StockMovementList = (props: StockMovementListProps) => {
  const { filters } = props;

  const { data, isLoading, error } = useStockMovementList({ filters });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Erro ao carregar movimentações</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nenhuma movimentação encontrada</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data/Hora
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantidade
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuário
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Documento
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((movement) => (
            <tr key={movement.idStockMovement} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(movement.movementDate), 'dd/MM/yyyy HH:mm')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {movement.productName || `Produto #${movement.idProduct}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    movement.movementType === 0
                      ? 'bg-green-100 text-green-800'
                      : movement.movementType === 1
                      ? 'bg-red-100 text-red-800'
                      : movement.movementType === 2
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {MOVEMENT_TYPE_LABELS[movement.movementType]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {movement.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {movement.userName || `Usuário #${movement.idUser}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {movement.referenceDocument || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
