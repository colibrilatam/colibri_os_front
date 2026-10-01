import { z, ZodSchema } from 'zod';
import { ContractValidationError } from '@/lib/api/errors';

export function validateResponse<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map(i => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    const msg = `[Contract] Response invalido:\n${issues}`;
    if (process.env.NEXT_PUBLIC_STRICT_CONTRACTS === 'false') {
      console.warn(msg);
      return data as T;
    }
    throw new ContractValidationError(msg, result.error);
  }
  return result.data;
}

export function createContractGuard<T>(schema: ZodSchema<T>) {
  return (data: unknown): T => {
    return validateResponse(schema, data);
  };
}
