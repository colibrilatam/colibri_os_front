import { describe, it, expect, vi } from 'vitest';

// SEC-002: pendiente FE4.
//
// Estos tests verifican que el DemoGuard de UI oculta los botones de
// escritura cuando isDemo viene del servidor (role=demo_readonly).
//
// IMPORTANTE: esto NO es seguridad. Es UX. La restricción real es el
// 403 del backend (DemoReadOnlyGuard, PR-BE2). Este suite solo verifica
// que la interfaz expresa correctamente el estado.
//
// Se activa en PR-FE4, que:
//   1. Deriva isDemo del claim del servidor en store.js.
//   2. Crea components/common/DemoGuard.jsx.
//   3. Envuelve los 6 componentes de escritura/aprobación.
describe.skip('SEC-002 — DemoGuard: botones de escritura ocultos en modo demo', () => {
  // ── ResoluciónActions (aprobar/rechazar microacción) ──────────────────────
  it('no renderiza "Aprobar versión" cuando isDemo', () => {});
  it('no renderiza "Rechazar versión" cuando isDemo', () => {});

  // ── ScoreCard (aprobar/rechazar evidencia) ────────────────────────────────
  it('no renderiza "Aprobar" cuando isDemo', () => {});
  it('no renderiza "Rechazar" cuando isDemo', () => {});

  // ── ReviewActions (enviar revisión) ───────────────────────────────────────
  it('no renderiza el botón de enviar revisión cuando isDemo', () => {});

  // ── UploadModal (subir evidencia) ─────────────────────────────────────────
  it('no renderiza el botón de subir evidencia cuando isDemo', () => {});

  // ── Regresión: isDemo viene del servidor ──────────────────────────────────
  it('isDemo se deriva de user.role === "demo_readonly"', () => {});
  it('isDemo es false cuando el rol no es demo_readonly', () => {});
});