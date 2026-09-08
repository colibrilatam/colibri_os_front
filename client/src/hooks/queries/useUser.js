'use client';

import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user';
import { queryKeys } from '@/lib/query-keys';

export function useUser(userId, options = {}) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => userService.userData(userId),
    enabled: Boolean(userId),
    ...options,
  });
}
