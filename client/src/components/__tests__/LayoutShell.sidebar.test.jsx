import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

import LayoutShell from './LayoutShell';
import { useUserStore } from '@/lib/store';

const mockStartOnborda = vi.fn();
const mockCloseOnborda = vi.fn();

let mediaQueryListeners = [];
let desktopMatches = false;

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard/project-123/tramo',
}));

vi.mock('onborda', () => ({
  useOnborda: () => ({
    startOnborda: mockStartOnborda,
    closeOnborda: mockCloseOnborda,
  }),
}));

vi.mock('@/components/Header', () => ({
  default: () => <header>Header</header>,
}));

vi.mock('@/components/Sidebar', () => ({
  default: ({ isOpen, onClose }) => (
    <div>
      <div data-testid="sidebar" data-mobile-open={String(isOpen)}>
        Sidebar
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar sidebar desde mock"
      >
        Cerrar sidebar
      </button>
    </div>
  ),
}));

vi.mock('@/components/ThemeLoader', () => ({
  default: () => null,
}));

vi.mock('@/components/Footer', () => ({
  default: () => <footer>Footer</footer>,
}));

vi.mock('@/hooks/useTranslatedContent', () => ({
  useTranslatedContent: () => ({
    project: {},
    evidences: {},
    microActions: {},
  }),
}));

vi.mock('@/lib/projectContext', () => ({
  ProjectContext: {
    Provider: ({ children }) => (
      <div data-testid="project-provider">{children}</div>
    ),
  },
}));

describe('LayoutShell - Sidebar responsive behavior', () => {
  const projectInfo = {
    dbProject: {
      projectName: 'Test Project',
    },
    translatableContent: {
      project: {},
      evidences: {},
      microActions: {},
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mediaQueryListeners = [];
    desktopMatches = false;

    useUserStore.setState({
      sidebarMobileOpen: false,
      sidebarDesktopExpanded: false,
      subioTramo: false,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(min-width: 1024px)' ? desktopMatches : false,

        media: query,

        onchange: null,

        addEventListener: vi.fn((event, callback) => {
          if (event === 'change') {
            mediaQueryListeners.push(callback);
          }
        }),

        removeEventListener: vi.fn((event, callback) => {
          if (event === 'change') {
            mediaQueryListeners = mediaQueryListeners.filter(
              (listener) => listener !== callback,
            );
          }
        }),

        addListener: vi.fn((callback) => {
          mediaQueryListeners.push(callback);
        }),

        removeListener: vi.fn((callback) => {
          mediaQueryListeners = mediaQueryListeners.filter(
            (listener) => listener !== callback,
          );
        }),

        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function changeBreakpoint(matches) {
    desktopMatches = matches;

    act(() => {
      mediaQueryListeners.forEach((listener) => {
        listener({
          matches,
          media: '(min-width: 1024px)',
        });
      });
    });
  }

  it('should start with mobile sidebar closed', () => {
    render(
      <LayoutShell projectInfo={projectInfo}>
        <div>Content</div>
      </LayoutShell>,
    );

    expect(useUserStore.getState().sidebarMobileOpen).toBe(false);

    expect(screen.getByTestId('sidebar')).toHaveAttribute(
      'data-mobile-open',
      'false',
    );
  });

  it('should open mobile sidebar without modifying desktop state', () => {
    render(
      <LayoutShell projectInfo={projectInfo}>
        <div>Content</div>
      </LayoutShell>,
    );

    const openButton = screen.getByRole('button', {
      name: 'Abrir menú de navegación',
    });

    fireEvent.click(openButton);

    expect(useUserStore.getState().sidebarMobileOpen).toBe(true);

    expect(useUserStore.getState().sidebarDesktopExpanded).toBe(false);
  });

  it('should preserve desktop expansion when mobile sidebar opens', () => {
    useUserStore.setState({
      sidebarMobileOpen: false,
      sidebarDesktopExpanded: true,
    });

    render(
      <LayoutShell projectInfo={projectInfo}>
        <div>Content</div>
      </LayoutShell>,
    );

    const openButton = screen.getByRole('button', {
      name: 'Abrir menú de navegación',
    });

    fireEvent.click(openButton);

    expect(useUserStore.getState().sidebarMobileOpen).toBe(true);

    expect(useUserStore.getState().sidebarDesktopExpanded).toBe(true);
  });

  it('should close mobile sidebar when entering desktop breakpoint', () => {
    useUserStore.setState({
      sidebarMobileOpen: true,
      sidebarDesktopExpanded: false,
    });

    render(
      <LayoutShell projectInfo={projectInfo}>
        <div>Content</div>
      </LayoutShell>,
    );

    expect(useUserStore.getState().sidebarMobileOpen).toBe(true);

    changeBreakpoint(true);

    expect(useUserStore.getState().sidebarMobileOpen).toBe(false);
  });

  it('should close mobile sidebar when mounted directly on desktop', () => {
    desktopMatches = true;

    useUserStore.setState({
      sidebarMobileOpen: true,
      sidebarDesktopExpanded: false,
    });

    render(
      <LayoutShell projectInfo={projectInfo}>
        <div>Content</div>
      </LayoutShell>,
    );

    expect(useUserStore.getState().sidebarMobileOpen).toBe(false);
  });

  it('should not modify desktop state when entering desktop breakpoint', () => {
    useUserStore.setState({
      sidebarMobileOpen: true,
      sidebarDesktopExpanded: true,
    });

    render(
      <LayoutShell projectInfo={projectInfo}>
        <div>Content</div>
      </LayoutShell>,
    );

    changeBreakpoint(true);

    expect(useUserStore.getState().sidebarMobileOpen).toBe(false);

    expect(useUserStore.getState().sidebarDesktopExpanded).toBe(true);
  });

  it('should preserve desktop collapsed state when entering desktop breakpoint', () => {
    useUserStore.setState({
      sidebarMobileOpen: true,
      sidebarDesktopExpanded: false,
    });

    render(
      <LayoutShell projectInfo={projectInfo}>
        <div>Content</div>
      </LayoutShell>,
    );

    changeBreakpoint(true);

    expect(useUserStore.getState().sidebarMobileOpen).toBe(false);

    expect(useUserStore.getState().sidebarDesktopExpanded).toBe(false);
  });

  it('should not reopen mobile sidebar when returning to mobile', () => {
    useUserStore.setState({
      sidebarMobileOpen: true,
      sidebarDesktopExpanded: true,
    });

    render(
      <LayoutShell projectInfo={projectInfo}>
        <div>Content</div>
      </LayoutShell>,
    );

    // Mobile -> Desktop
    changeBreakpoint(true);

    expect(useUserStore.getState().sidebarMobileOpen).toBe(false);

    expect(useUserStore.getState().sidebarDesktopExpanded).toBe(true);

    // Desktop -> Mobile
    changeBreakpoint(false);

    expect(useUserStore.getState().sidebarMobileOpen).toBe(false);

    // El estado desktop tampoco debe modificarse
    expect(useUserStore.getState().sidebarDesktopExpanded).toBe(true);
  });

  it('should allow opening mobile sidebar again after returning from desktop', () => {
    useUserStore.setState({
      sidebarMobileOpen: true,
      sidebarDesktopExpanded: true,
    });

    render(
      <LayoutShell projectInfo={projectInfo}>
        <div>Content</div>
      </LayoutShell>,
    );

    // Mobile -> Desktop
    changeBreakpoint(true);

    expect(useUserStore.getState().sidebarMobileOpen).toBe(false);

    // Desktop -> Mobile
    changeBreakpoint(false);

    const openButton = screen.getByRole('button', {
      name: 'Abrir menú de navegación',
    });

    fireEvent.click(openButton);

    expect(useUserStore.getState().sidebarMobileOpen).toBe(true);

    expect(useUserStore.getState().sidebarDesktopExpanded).toBe(true);
  });

  it('should close mobile sidebar using the close callback without changing desktop state', () => {
    useUserStore.setState({
      sidebarMobileOpen: true,
      sidebarDesktopExpanded: true,
    });

    render(
      <LayoutShell projectInfo={projectInfo}>
        <div>Content</div>
      </LayoutShell>,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cerrar sidebar desde mock',
      }),
    );

    expect(useUserStore.getState().sidebarMobileOpen).toBe(false);

    expect(useUserStore.getState().sidebarDesktopExpanded).toBe(true);
  });

  it('should keep desktop state independent during mobile open/close cycle', () => {
    useUserStore.setState({
      sidebarMobileOpen: false,
      sidebarDesktopExpanded: true,
    });

    render(
      <LayoutShell projectInfo={projectInfo}>
        <div>Content</div>
      </LayoutShell>,
    );

    // Abrir mobile
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Abrir menú de navegación',
      }),
    );

    expect(useUserStore.getState().sidebarMobileOpen).toBe(true);

    expect(useUserStore.getState().sidebarDesktopExpanded).toBe(true);

    // Cerrar mobile
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cerrar sidebar desde mock',
      }),
    );

    expect(useUserStore.getState().sidebarMobileOpen).toBe(false);

    expect(useUserStore.getState().sidebarDesktopExpanded).toBe(true);
  });

  it('should register and remove the breakpoint listener', () => {
    const { unmount } = render(
      <LayoutShell projectInfo={projectInfo}>
        <div>Content</div>
      </LayoutShell>,
    );

    expect(mediaQueryListeners).toHaveLength(1);

    unmount();

    expect(mediaQueryListeners).toHaveLength(0);
  });
});
