'use client';

import { useIsDemo } from '@/lib/store';

/**
 * SEC-002 / FE4: oculta sus children cuando el usuario es demo.
 *
 * DemoGuard es UX, no control de acceso. La restricción real es el
 * 403 del backend (DemoReadOnlyGuard APP_GUARD, PR-BE2). Fail-open
 * en UI es intencional: user null → isDemo false → otras capas
 * protegen.
 *
 * Uso:
 *   <DemoGuard>
 *     <button onClick={approve}>Aprobar</button>
 *   </DemoGuard>
 */
export function DemoGuard({ children }) {
  const isDemo = useIsDemo();

  if (isDemo) return null;
  return children;
}

/**
 * SEC-002 / FE4: renderiza sus children SOLO cuando el usuario es demo.
 * Útil para banners, tooltips y mensajes de "modo demo".
 */
export function DemoOnly({ children }) {
  const isDemo = useIsDemo();

  if (!isDemo) return null;
  return children;
}

/**
 * SEC-002 / FE4: banner visible cuando isDemo. El usuario debe entender
 * por qué no ve botones de escritura.
 */
export function DemoBanner() {
  return (
    <DemoOnly>
      <div
        role="status"
        aria-live="polite"
        className="w-full bg-amber-500/15 border-b border-amber-500/30 text-amber-200 text-sm text-center py-2 px-4"
      >
        Estás en modo demo — solo lectura. Las acciones de escritura no están
        disponibles.
      </div>
    </DemoOnly>
  );
}