'use client';

import { useUserStore } from '@/lib/store';
import { useEffect } from 'react';

export default function ThemeLoader() {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user?.theme) return;

    const root = document.documentElement;

    // EJEMPLO >>>>>>>>>>>>>>>>>>>
    root.style.setProperty(
      '--theme-page-background',
      user.theme.pageBackground || '',
    );

    root.style.setProperty(
      '--theme-surface-background',
      user.theme.surfaceBackground || '',
    );

    root.style.setProperty('--theme-surface-border', user.theme.surfaceBorder || '');

    root.style.setProperty(
      '--theme-primary-button',
      user.theme.primaryButtonBackground || '',
    );

    root.style.setProperty('--theme-text-primary', user.theme.textPrimary || '');

    root.style.setProperty('--theme-text-secondary', user.theme.textSecondary || '');
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  }, [user]);

  return null;
}
