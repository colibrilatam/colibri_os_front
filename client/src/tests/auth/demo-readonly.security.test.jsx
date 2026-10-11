import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createElement } from 'react';

// SEC-002 / FE4: DemoGuard es UX, no control de acceso. La restricción
// real es el 403 del backend (DemoReadOnlyGuard APP_GUARD, PR-BE2).
// Fail-open en UI es intencional: user null → isDemo false → otras
// capas protegen.

// ── Store mockeado con un solo state compartido ─────────────────────────────
const mockState = { user: null };
vi.mock('@/lib/store', () => ({
  useUserStore: vi.fn((selector) =>
    selector ? selector(mockState) : mockState,
  ),
  useIsDemo: () => mockState.user?.role === 'demo_readonly',
}));

import { DemoGuard, DemoOnly, DemoBanner } from '@/components/common/DemoGuard';
import { useIsDemo } from '@/lib/store';

const DEMO_USER = { id: '1', role: 'demo_readonly', email: 'demo@test' };
const MENTOR_USER = { id: '2', role: 'mentor', email: 'mentor@test' };

beforeEach(() => {
  mockState.user = null;
});

describe('useIsDemo — selector derivado de user.role', () => {
  it('devuelve true cuando user.role es demo_readonly', () => {
    mockState.user = DEMO_USER;
    expect(useIsDemo()).toBe(true);
  });

  it('devuelve false cuando user.role es mentor', () => {
    mockState.user = MENTOR_USER;
    expect(useIsDemo()).toBe(false);
  });

  it('devuelve false cuando user es null (fail-open)', () => {
    mockState.user = null;
    expect(useIsDemo()).toBe(false);
  });
});

describe('DemoGuard — oculta acciones de escritura en modo demo', () => {
  const ActionButton = () => <button>Aprobar</button>;

  it('NO renderiza children cuando isDemo (role=demo_readonly)', () => {
    mockState.user = DEMO_USER;
    render(
      createElement(DemoGuard, null, createElement(ActionButton)),
    );
    expect(screen.queryByText('Aprobar')).toBeNull();
  });

  it('SÍ renderiza children cuando role=mentor', () => {
    mockState.user = MENTOR_USER;
    render(
      createElement(DemoGuard, null, createElement(ActionButton)),
    );
    expect(screen.getByText('Aprobar')).toBeTruthy();
  });

  it('fail-open: renderiza children cuando user es null (la ruta protegida lo cubre)', () => {
    // DemoGuard es fail-open: user null → isDemo false → children se
    // renderizan. Esto es intencional — la protección de rutas sin
    // usuario la hace ClientLayout (route.protected), no DemoGuard.
    mockState.user = null;
    render(
      createElement(DemoGuard, null, createElement(ActionButton)),
    );
    expect(screen.getByText('Aprobar')).toBeTruthy();
  });
});

describe('DemoOnly — renderiza solo en modo demo', () => {
  it('renderiza children cuando isDemo', () => {
    mockState.user = DEMO_USER;
    render(
      createElement(DemoOnly, null, createElement('span', null, 'Demo content')),
    );
    expect(screen.getByText('Demo content')).toBeTruthy();
  });

  it('NO renderiza children cuando role=mentor', () => {
    mockState.user = MENTOR_USER;
    render(
      createElement(DemoOnly, null, createElement('span', null, 'Demo content')),
    );
    expect(screen.queryByText('Demo content')).toBeNull();
  });
});

describe('DemoBanner — banner visible solo con isDemo', () => {
  it('aparece cuando isDemo', () => {
    mockState.user = DEMO_USER;
    render(createElement(DemoBanner));
    expect(screen.getByText(/modo demo/i)).toBeTruthy();
  });

  it('NO aparece cuando role=mentor', () => {
    mockState.user = MENTOR_USER;
    render(createElement(DemoBanner));
    expect(screen.queryByText(/modo demo/i)).toBeNull();
  });

  it('NO aparece cuando user es null', () => {
    mockState.user = null;
    render(createElement(DemoBanner));
    expect(screen.queryByText(/modo demo/i)).toBeNull();
  });
});
