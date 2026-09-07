'use client';

import { useQuery } from '@tanstack/react-query';
import { nftService } from '@/services/nft';
import { queryKeys } from '@/lib/query-keys';

export function useNftStats(userId, options = {}) {
  return useQuery({
    queryKey: queryKeys.nft.stats(userId),
    queryFn: () => nftService.getStats(userId),
    enabled: Boolean(userId),
    ...options,
  });
}
