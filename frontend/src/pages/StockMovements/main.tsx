import { useState } from 'react';
import { StockMovementForm, StockMovementList } from '@/domain/stockMovement/_module';
import type { StockMovementListParams } from '@/domain/stockMovement/_module';

export const StockMovementsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<StockMovementListParams>({
    orderBy: 'date_desc',
    limitRecords: 100,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Movimentações de Estoque</h1>
          <p className="mt-2 text-gray-600">
            Registre e consulte todas as movimentações do estoque
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Ocultar Formulário' : 'Nova Movimentação'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Registrar Nova Movimentação
            </h2>
            <StockMovementForm
              onSuccess={() => {
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Histórico de Movimentações</h2>
          </div>
          <div className="p-6">
            <StockMovementList filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockMovementsPage;
