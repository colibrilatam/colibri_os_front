'use client';

import { useUserStore } from '@/lib/store';
import { useEffect } from 'react';


export default function ThemeInitializer({ theme }) {
  const setTheme = useUserStore((state) => state.setTheme);

  useEffect(() => {
    if (theme) {
      setTheme(theme);
    }
  }, [theme, setTheme]);

  return null;
}