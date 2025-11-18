import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStockMovementCreate } from '../../hooks/useStockMovementCreate';
import type { StockMovementFormProps } from './types';
import type { CreateStockMovementDto } from '../../types';

const stockMovementSchema = z
  .object({
    idProduct: z.number().int().positive({ message: 'Produto é obrigatório' }),
    movementType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)], {
      message: 'Tipo de movimentação é obrigatório',
    }),
    quantity: z.number({ message: 'Quantidade é obrigatória' }),
    referenceDocument: z.string().max(50).nullable().optional(),
    batchNumber: z.string().max(30).nullable().optional(),
    expirationDate: z.string().nullable().optional(),
    location: z.string().max(100).nullable().optional(),
    reason: z.string().max(500).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.movementType === 2 || data.movementType === 3) {
        return !!data.reason && data.reason.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Motivo é obrigatório para ajustes e exclusões',
      path: ['reason'],
    }
  );

export const StockMovementForm = (props: StockMovementFormProps) => {
  const { onSuccess, onCancel, defaultValues } = props;

  const { create, isCreating } = useStockMovementCreate({
    onSuccess: (data) => {
      reset();
      onSuccess?.(data);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateStockMovementDto>({
    resolver: zodResolver(stockMovementSchema),
    defaultValues,
  });

  const movementType = watch('movementType');

  const onSubmit = async (data: CreateStockMovementDto) => {
    await create(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="idProduct" className="block text-sm font-medium text-gray-700 mb-1">
          Produto *
        </label>
        <input
          id="idProduct"
          type="number"
          {...register('idProduct', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.idProduct && (
          <p className="mt-1 text-sm text-red-600">{errors.idProduct.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="movementType" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Movimentação *
        </label>
        <select
          id="movementType"
          {...register('movementType', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione...</option>
          <option value={0}>Entrada</option>
          <option value={1}>Saída</option>
          <option value={2}>Ajuste</option>
          <option value={3}>Exclusão</option>
        </select>
        {errors.movementType && (
          <p className="mt-1 text-sm text-red-600">{errors.movementType.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
          Quantidade *
        </label>
        <input
          id="quantity"
          type="number"
          step="0.01"
          {...register('quantity', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
      </div>

      <div>
        <label htmlFor="referenceDocument" className="block text-sm font-medium text-gray-700 mb-1">
          Documento de Referência
        </label>
        <input
          id="referenceDocument"
          type="text"
          {...register('referenceDocument')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.referenceDocument && (
          <p className="mt-1 text-sm text-red-600">{errors.referenceDocument.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Número do Lote
        </label>
        <input
          id="batchNumber"
          type="text"
          {...register('batchNumber')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.batchNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.batchNumber.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
          Data de Validade
        </label>
        <input
          id="expirationDate"
          type="date"
          {...register('expirationDate')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.expirationDate && (
          <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Localização
        </label>
        <input
          id="location"
          type="text"
          {...register('location')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
      </div>

      {(movementType === 2 || movementType === 3) && (
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Motivo *
          </label>
          <textarea
            id="reason"
            rows={3}
            {...register('reason')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isCreating}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isCreating}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isCreating ? 'Registrando...' : 'Registrar Movimentação'}
        </button>
      </div>
    </form>
  );
};
