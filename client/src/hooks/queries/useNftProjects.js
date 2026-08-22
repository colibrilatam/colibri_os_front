'use client';

import { useQuery } from '@tanstack/react-query';
import { nftService } from '@/services/nft';
import { queryKeys } from '@/lib/query-keys';

export function useNftProjects(options = {}) {
  return useQuery({
    queryKey: queryKeys.nft.projects,
    queryFn: () => nftService.getNftProjects(),
    ...options,
  });
}
