'use client';

import { useEffect } from 'react';
import { applyTheme } from '@/lib/theme';
import { useUserStore } from '@/lib/store';

export default function ThemeLoader() {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user?.theme) return;

    applyTheme(user.theme);
  }, [user]);

  return null;
}
