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
      '--default-app-background',
      user.theme.pageBackground || '',
    );

    root.style.setProperty(
      '--theme-surface-background',
      user.theme.surfaceBackground || '',
    );

    root.style.setProperty(
      '--theme-secondary-background',
      user.theme.accentColor || '',
    );

    root.style.setProperty('--font-body', user.theme.fontFamily || '');

    root.style.setProperty('--font-display', user.theme.fontFamily || '');
    root.style.setProperty('--text-primary', user.theme.textPrimary || '');

    root.style.setProperty('--text-secondary', user.theme.textSecondary || '');
    root.style.setProperty('--text-tertiary', user.theme.textTertiary || '');

    root.style.setProperty(
      '--theme-dark-surface-background',
      user.theme.darkSurfaceBackground || '',
    );

    root.style.setProperty(
      '--theme-surface-border',
      user.theme.surfaceBorder || '',
    );

    root.style.setProperty(
      '--theme-primary-button',
      user.theme.primaryButtonBackground || '',
    );
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  }, [user]);

  return null;
}
