'use client';

import { useUserStore } from '@/lib/store';
import { useEffect } from 'react';
import { applyTheme } from '@/lib/theme';

export default function ThemeLoader() {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user?.theme) return;

    applyTheme(user.theme);
  }, [user]);

  return null;
}
