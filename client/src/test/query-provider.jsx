import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/query-client';

export function createTestQueryClient(options = {}) {
  return createQueryClient();
}

export function QueryProvider({ children, client }) {
  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}
