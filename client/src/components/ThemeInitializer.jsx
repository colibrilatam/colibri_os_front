'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/lib/store';

export default function ThemeInitializer({ theme }) {
  const setTheme = useUserStore((state) => state.setTheme);

  useEffect(() => {
    if (theme) {
      setTheme(theme);
    }
  }, [theme, setTheme]);

  return null;
}