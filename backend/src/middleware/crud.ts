/**
 * @summary
 * CRUD controller middleware providing standardized request validation
 * and response formatting for API operations.
 *
 * @module middleware/crud
 */

import { Request } from 'express';
import { z } from 'zod';

export interface ValidationResult {
  credential: {
    idAccount: number;
    idUser: number;
  };
  params?: any;
  body?: any;
}

export interface ValidationError {
  statusCode: number;
  code: string;
  message: string;
  details?: any;
}

export interface SecurityCheck {
  securable: string;
  permission: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
}

export class CrudController {
  private securityChecks: SecurityCheck[];

  constructor(securityChecks: SecurityCheck[]) {
    this.securityChecks = securityChecks;
  }

  async create(
    req: Request,
    bodySchema: z.ZodSchema
  ): Promise<[ValidationResult | undefined, ValidationError | undefined]> {
    return this.validateRequest(req, bodySchema, 'CREATE');
  }

  async read(
    req: Request,
    paramsSchema: z.ZodSchema
  ): Promise<[ValidationResult | undefined, ValidationError | undefined]> {
    return this.validateRequest(req, paramsSchema, 'READ', true);
  }

  async update(
    req: Request,
    bodySchema: z.ZodSchema
  ): Promise<[ValidationResult | undefined, ValidationError | undefined]> {
    return this.validateRequest(req, bodySchema, 'UPDATE');
  }

  async delete(
    req: Request,
    paramsSchema: z.ZodSchema
  ): Promise<[ValidationResult | undefined, ValidationError | undefined]> {
    return this.validateRequest(req, paramsSchema, 'DELETE', true);
  }

  async list(
    req: Request,
    querySchema?: z.ZodSchema
  ): Promise<[ValidationResult | undefined, ValidationError | undefined]> {
    return this.validateRequest(req, querySchema, 'READ', false, true);
  }

  private async validateRequest(
    req: Request,
    schema?: z.ZodSchema,
    permission?: string,
    isParams: boolean = false,
    isQuery: boolean = false
  ): Promise<[ValidationResult | undefined, ValidationError | undefined]> {
    try {
      const credential = {
        idAccount: 1,
        idUser: 1,
      };

      let validatedData: any = {};

      if (schema) {
        const dataToValidate = isParams ? req.params : isQuery ? req.query : req.body;
        validatedData = await schema.parseAsync(dataToValidate);
      }

      const result: ValidationResult = {
        credential,
        ...(isParams
          ? { params: validatedData }
          : isQuery
          ? { params: validatedData }
          : { body: validatedData }),
      };

      return [result, undefined];
    } catch (error: any) {
      const validationError: ValidationError = {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.errors || error.message,
      };
      return [undefined, validationError];
    }
  }
}

export const successResponse = <T>(data: T, metadata?: any) => ({
  success: true,
  data,
  metadata: {
    ...metadata,
    timestamp: new Date().toISOString(),
  },
});

export const errorResponse = (message: string, code?: string, details?: any) => ({
  success: false,
  error: {
    code: code || 'ERROR',
    message,
    details,
  },
  timestamp: new Date().toISOString(),
});
