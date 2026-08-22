'use client';

import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user';
import { queryKeys } from '@/lib/query-keys';

export function useUserProfile(options = {}) {
  return useQuery({
    queryKey: queryKeys.users.profile,
    queryFn: () => userService.profile(),
    ...options,
  });
}
