import { z, ZodSchema } from 'zod';

const isDev = process.env.NODE_ENV === 'development';

export function validateResponse<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map(i => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    const msg = `[Contract] Response invalido:\n${issues}`;
    if (isDev) {
      console.warn(msg);
    }
    if (isDev && process.env.NEXT_PUBLIC_STRICT_CONTRACTS === 'true') {
      throw new Error(msg);
    }
  }
  return result.data;
}

export function createContractGuard<T>(schema: ZodSchema<T>) {
  return (data: unknown): T => {
    return validateResponse(schema, data);
  };
}
