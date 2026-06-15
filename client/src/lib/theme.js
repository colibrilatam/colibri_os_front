'use client';

const THEME_VARIABLES = [
  '--default-app-background',
  '--theme-surface-background',
  '--theme-secondary-background',
  '--font-body',
  '--font-display',
  '--text-primary',
  '--text-secondary',
  '--text-tertiary',
  '--theme-dark-surface-background',
  '--theme-surface-border',
  '--theme-primary-button',
  '--text-accent',
  '--bg-accent',
];

export function applyTheme(theme) {
  if (typeof window === 'undefined') return;
  if (!theme) return;

  const root = document.documentElement;

  root.style.setProperty(
    '--default-app-background',
    theme.pageBackground || '',
  );

  root.style.setProperty(
    '--theme-surface-background',
    theme.surfaceBackground || '',
  );

  root.style.setProperty(
    '--theme-secondary-background',
    theme.accentColor || '',
  );

  root.style.setProperty('--font-body', theme.fontFamily || '');
  root.style.setProperty('--font-display', theme.fontFamily || '');

  root.style.setProperty('--text-primary', theme.textPrimary || '');
  root.style.setProperty('--text-secondary', theme.textSecondary || '');
  root.style.setProperty('--text-tertiary', theme.textTertiary || '');

  root.style.setProperty(
    '--theme-dark-surface-background',
    theme.darkSurfaceBackground || '',
  );

  root.style.setProperty(
    '--theme-surface-border',
    theme.surfaceBorder || '',
  );

  root.style.setProperty(
    '--theme-primary-button',
    theme.primaryButtonBackground || '',
  );

  root.style.setProperty('--text-accent', theme.accentColor || '');
  root.style.setProperty('--bg-accent', theme.accentSurface || '');
}

export function resetTheme() {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  THEME_VARIABLES.forEach((variable) => {
    root.style.removeProperty(variable);
  });
}
