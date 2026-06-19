'use client';

const THEME_VARIABLES = [
  /* FONDOS */
  '--default-app-background',
  '--theme-surface-background',
  '--theme-dark-surface-background',
  '--bg-accent',

  /* BORDES */
  '--theme-surface-border',

  /* ACCIONES */
  '--theme-primary-button',

  /* COLORES DE TEXTO */
  '--text-primary',
  '--text-secondary',
  '--text-tertiary',
  '--text-accent',
  '--text-accent-contrast',
  '--text-primary-contrast',

  /* TIPOGRAFÍA */
  '--font-body',
  '--font-display',

  /* COLOR DE ACENTO GLOBAL */
  '--theme-secondary-background',
];

export function applyTheme(theme) {
  if (typeof window === 'undefined') return;
  if (!theme) return;

  const root = document.documentElement;

  /* FONDOS */
  root.style.setProperty(
    '--default-app-background',
    theme.pageBackground || '',
  );
  root.style.setProperty(
    '--theme-surface-background',
    theme.surfaceBackground || '',
  );
  root.style.setProperty(
    '--theme-dark-surface-background',
    theme.darkSurfaceBackground || '',
  );
  root.style.setProperty('--bg-accent', theme.accentSurface || '');

  /* BORDES */
  root.style.setProperty(
    '--theme-surface-border',
    theme.surfaceBorder || '',
  );

  /* ACCIONES */
  root.style.setProperty(
    '--theme-primary-button',
    theme.primaryButtonBackground || '',
  );

  /* COLORES DE TEXTO */
  root.style.setProperty('--text-primary', theme.textPrimary || '');
  root.style.setProperty('--text-secondary', theme.textSecondary || '');
  root.style.setProperty('--text-tertiary', theme.textTertiary || '');
  root.style.setProperty('--text-accent', theme.accentColor || '');
  root.style.setProperty('--text-accent-contrast', theme.accentContrast || '');
  root.style.setProperty(
    '--text-primary-contrast',
    theme.primaryContrast || '',
  );

  /* TIPOGRAFÍA */
  root.style.setProperty('--font-body', theme.fontFamily || '');
  root.style.setProperty('--font-display', theme.fontFamily || '');

  /* COLOR DE ACENTO GLOBAL */
  root.style.setProperty(
    '--theme-secondary-background',
    theme.accentColor || '',
  );
}

export function resetTheme() {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  THEME_VARIABLES.forEach((variable) => {
    root.style.removeProperty(variable);
  });
}
