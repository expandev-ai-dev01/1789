/**
 * @summary
 * Database utility functions for SQL Server operations.
 * Provides connection pooling and query execution helpers.
 *
 * @module utils/database
 */

import sql from 'mssql';
import { config } from '@/config';

let pool: sql.ConnectionPool | null = null;

export enum ExpectedReturn {
  None = 'None',
  Single = 'Single',
  Multi = 'Multi',
}

export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (!pool) {
    pool = await sql.connect(config.database);
  }
  return pool;
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.close();
    pool = null;
  }
};

export const dbRequest = async (
  routine: string,
  parameters: { [key: string]: any },
  expectedReturn: ExpectedReturn,
  transaction?: sql.Transaction,
  resultSetNames?: string[]
): Promise<any> => {
  const currentPool = transaction ? transaction : await getPool();
  const request = currentPool.request();

  Object.keys(parameters).forEach((key) => {
    request.input(key, parameters[key]);
  });

  const result = await request.execute(routine);

  switch (expectedReturn) {
    case ExpectedReturn.None:
      return null;
    case ExpectedReturn.Single:
      return result.recordset[0];
    case ExpectedReturn.Multi:
      if (resultSetNames && resultSetNames.length > 0) {
        const namedResults: { [key: string]: any[] } = {};
        if (Array.isArray(result.recordsets)) {
          const recordsets = result.recordsets;
          resultSetNames.forEach((name, index) => {
            const recordset = recordsets[index];
            namedResults[name] = recordset || [];
          });
        } else if (result.recordsets) {
          const recordsetsObject = result.recordsets as { [key: string]: sql.IRecordSet<any> };
          resultSetNames.forEach((name) => {
            namedResults[name] = recordsetsObject[name] || [];
          });
        }
        return namedResults;
      }
      // When not using named result sets, return the first recordset's data array.
      if (Array.isArray(result.recordsets)) {
        return result.recordsets[0] ?? [];
      }
      return [];
    default:
      return result.recordset;
  }
};

export const beginTransaction = async (): Promise<sql.Transaction> => {
  const currentPool = await getPool();
  const transaction = new sql.Transaction(currentPool);
  await transaction.begin();
  return transaction;
};

export const commitTransaction = async (transaction: sql.Transaction): Promise<void> => {
  await transaction.commit();
};

export const rollbackTransaction = async (transaction: sql.Transaction): Promise<void> => {
  await transaction.rollback();
};
