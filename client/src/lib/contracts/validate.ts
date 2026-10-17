import { z, ZodSchema } from 'zod';
import { ContractValidationError } from '@/lib/api/errors';

const MAX_PAYLOAD_LENGTH = 2000;

function truncatePayload(data: unknown): string {
  let serialized: string;
  try {
    serialized = JSON.stringify(data);
  } catch {
    serialized = String(data);
  }
  if (serialized === undefined) {
    return String(data);
  }
  if (serialized.length <= MAX_PAYLOAD_LENGTH) {
    return serialized;
  }
  return `${serialized.slice(0, MAX_PAYLOAD_LENGTH)}… (truncado, ${serialized.length} chars)`;
}

export function validateResponse<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map(i => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    const msg = `[Contract] Response invalido:\n${issues}`;
    console.error(`${msg}\nPayload recibido: ${truncatePayload(data)}`, result.error);
    if (process.env.NEXT_PUBLIC_STRICT_CONTRACTS === 'false') {
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
