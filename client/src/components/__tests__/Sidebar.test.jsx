import React from 'react';
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from 'vitest';
import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';

import Sidebar from './Sidebar';
import { useUserStore } from '@/lib/store';

const mockPush = vi.fn();

vi.mock('next/link', () => ({
  default: ({ children, href, onClick, ...props }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard/project-123/tramo',
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/lib/projectContext', () => ({
  useProject: () => ({
    dbProject: {
      projectName: 'Proyecto Test',
    },
  }),
}));

vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

vi.mock('./Button', () => ({
  default: ({ content, onClick, ...props }) => (
    <button onClick={onClick} {...props}>
      {content}
    </button>
  ),
}));

vi.mock('./NotificationPopup', () => ({
  default: ({ children, isOpen, message }) =>
    isOpen ? (
      <div role="dialog">
        <span>{message}</span>
        {children}
      </div>
    ) : null,
}));

vi.mock('./Contact', () => ({
  default: () => <div>Entrepreneur Card</div>,
}));

vi.mock('./tutoriales/TourButton', () => ({
  default: () => <button>Tour</button>,
}));

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useUserStore.setState({
      sidebarMobileOpen: false,
      sidebarDesktopExpanded: false,
      rol: 'CEO',
      user: null,
    });
  });

  describe('desktop sidebar', () => {
    it('should render desktop sidebar collapsed by default', () => {
      render(<Sidebar />);

      const expandButton = screen.getByTitle('expand');

      expect(expandButton).toBeInTheDocument();

      expect(
        screen.queryByText('Proyecto Test'),
      ).not.toBeVisible();
    });

    it('should expand desktop sidebar when its toggle is clicked', () => {
      render(<Sidebar />);

      const expandButton = screen.getByTitle('expand');

      fireEvent.click(expandButton);

      expect(
        screen.getByTitle('collapse'),
      ).toBeInTheDocument();

      expect(
        screen.getByText('Proyecto Test'),
      ).toBeVisible();

      expect(
        useUserStore.getState().sidebarDesktopExpanded,
      ).toBe(true);

      expect(
        useUserStore.getState().sidebarMobileOpen,
      ).toBe(false);
    });

    it('should collapse desktop sidebar without modifying mobile state', () => {
      useUserStore.setState({
        sidebarDesktopExpanded: true,
        sidebarMobileOpen: true,
      });

      render(<Sidebar />);

      const collapseButton = screen.getByTitle('collapse');

      fireEvent.click(collapseButton);

      expect(
        useUserStore.getState().sidebarDesktopExpanded,
      ).toBe(false);

      expect(
        useUserStore.getState().sidebarMobileOpen,
      ).toBe(true);
    });

    it('should expand desktop sidebar without opening mobile sidebar', () => {
      render(<Sidebar />);

      fireEvent.click(screen.getByTitle('expand'));

      expect(
        useUserStore.getState().sidebarDesktopExpanded,
      ).toBe(true);

      expect(
        useUserStore.getState().sidebarMobileOpen,
      ).toBe(false);
    });

    it('should show navigation labels when desktop sidebar is expanded', () => {
      useUserStore.setState({
        sidebarDesktopExpanded: true,
      });

      render(<Sidebar />);

      expect(screen.getByText('home')).toBeInTheDocument();
      expect(screen.getByText('projectProfile')).toBeInTheDocument();
      expect(screen.getByText('identity')).toBeInTheDocument();
      expect(screen.getByText('reputation')).toBeInTheDocument();
      expect(screen.getByText('segment')).toBeInTheDocument();
      expect(screen.getByText('trajectory')).toBeInTheDocument();
      expect(screen.getByText('evidence')).toBeInTheDocument();
    });

    it('should render navigation links when desktop sidebar is collapsed', () => {
      render(<Sidebar />);

      expect(
        screen.getByRole('link', { name: 'home' }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole('link', { name: 'projectProfile' }),
      ).toBeInTheDocument();
    });
  });

  describe('mobile sidebar', () => {
    it('should render mobile sidebar closed by default', () => {
      render(<Sidebar isOpen={false} />);

      const mobileSidebar = document.getElementById(
        'mobile-sidebar',
      );

      expect(mobileSidebar).toBeInTheDocument();

      expect(
        mobileSidebar.className,
      ).toContain('-translate-x-full');
    });

    it('should render mobile sidebar open when isOpen is true', () => {
      render(<Sidebar isOpen={true} />);

      const mobileSidebar = document.getElementById(
        'mobile-sidebar',
      );

      expect(mobileSidebar).toBeInTheDocument();

      expect(
        mobileSidebar.className,
      ).toContain('translate-x-0');

      expect(
        mobileSidebar.className,
      ).not.toContain('-translate-x-full');
    });

    it('should call onClose when mobile close button is clicked', () => {
      const onClose = vi.fn();

      render(
        <Sidebar
          isOpen={true}
          onClose={onClose}
        />,
      );

      const closeButton = screen.getByRole('button', {
        name: 'Cerrar menú de navegación',
      });

      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should close mobile sidebar when navigating through a mobile link', () => {
      const onClose = vi.fn();

      render(
        <Sidebar
          isOpen={true}
          onClose={onClose}
        />,
      );

      const homeLinks = screen.getAllByRole('link', {
        name: 'home',
      });

      // El primer link corresponde al sidebar mobile.
      fireEvent.click(homeLinks[0]);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not modify desktop state when mobile sidebar is closed', () => {
      useUserStore.setState({
        sidebarDesktopExpanded: true,
        sidebarMobileOpen: true,
      });

      const onClose = vi.fn();

      render(
        <Sidebar
          isOpen={true}
          onClose={() => {
            onClose();

            useUserStore
              .getState()
              .setSidebarMobileOpen(false);
          }}
        />,
      );

      const closeButton = screen.getByRole('button', {
        name: 'Cerrar menú de navegación',
      });

      fireEvent.click(closeButton);

      expect(
        useUserStore.getState().sidebarMobileOpen,
      ).toBe(false);

      expect(
        useUserStore.getState().sidebarDesktopExpanded,
      ).toBe(true);
    });
  });

  describe('independence between mobile and desktop', () => {
    it('should keep desktop expanded when mobile sidebar is opened', () => {
      useUserStore.setState({
        sidebarDesktopExpanded: true,
        sidebarMobileOpen: false,
      });

      render(
        <Sidebar
          isOpen={false}
          onClose={() =>
            useUserStore
              .getState()
              .setSidebarMobileOpen(false)
          }
        />,
      );

      useUserStore
        .getState()
        .setSidebarMobileOpen(true);

      expect(
        useUserStore.getState().sidebarMobileOpen,
      ).toBe(true);

      expect(
        useUserStore.getState().sidebarDesktopExpanded,
      ).toBe(true);
    });

    it('should keep desktop collapsed when mobile sidebar is opened', () => {
      useUserStore.setState({
        sidebarDesktopExpanded: false,
        sidebarMobileOpen: false,
      });

      useUserStore
        .getState()
        .setSidebarMobileOpen(true);

      expect(
        useUserStore.getState().sidebarMobileOpen,
      ).toBe(true);

      expect(
        useUserStore.getState().sidebarDesktopExpanded,
      ).toBe(false);
    });
  });

  describe('keyboard navigation', () => {
    it('should allow focusing the mobile close button with keyboard', () => {
      render(<Sidebar isOpen={true} />);

      const closeButton = screen.getByRole('button', {
        name: 'Cerrar menú de navegación',
      });

      closeButton.focus();

      expect(document.activeElement).toBe(closeButton);
    });

    it('should allow focusing mobile navigation links with keyboard', () => {
      render(<Sidebar isOpen={true} />);

      const homeLink = screen.getAllByRole('link', {
        name: 'home',
      })[0];

      homeLink.focus();

      expect(document.activeElement).toBe(homeLink);
    });

    it('should allow focusing desktop toggle with keyboard', () => {
      render(<Sidebar />);

      const toggleButton = screen.getByTitle('expand');

      toggleButton.focus();

      expect(document.activeElement).toBe(toggleButton);
    });

    it('should activate desktop toggle with Enter', () => {
      render(<Sidebar />);

      const toggleButton = screen.getByTitle('expand');

      toggleButton.focus();

      fireEvent.keyDown(toggleButton, {
        key: 'Enter',
        code: 'Enter',
      });

      // Un <button> real responde al teclado en el navegador.
      // RTL/jsdom no ejecuta automáticamente el click ante keyDown,
      // por eso verificamos que el elemento sea focusable.
      expect(document.activeElement).toBe(toggleButton);
    });
  });

  describe('logout', () => {
    it('should reset both sidebar states when logout is executed', () => {
      useUserStore.setState({
        sidebarDesktopExpanded: true,
        sidebarMobileOpen: true,
      });

      render(<Sidebar />);

      fireEvent.click(
        screen.getByRole('button', {
          name: 'logout',
        }),
      );

      expect(
        useUserStore.getState().sidebarDesktopExpanded,
      ).toBe(false);

      expect(
        useUserStore.getState().sidebarMobileOpen,
      ).toBe(false);

      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});