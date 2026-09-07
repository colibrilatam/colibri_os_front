import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './store';

describe('useUserStore - Sidebar', () => {
  beforeEach(() => {
    // Limpiamos el estado del sidebar antes de cada prueba.
    useUserStore.setState({
      sidebarMobileOpen: false,
      sidebarDesktopExpanded: false,
    });

    // Limpiamos la persistencia de Zustand.
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app-state');
    }
  });

  describe('sidebarMobileOpen', () => {
    it('should start closed', () => {
      const state = useUserStore.getState();

      expect(state.sidebarMobileOpen).toBe(false);
    });

    it('should open the mobile sidebar without modifying desktop state', () => {
      const { setSidebarMobileOpen } = useUserStore.getState();

      setSidebarMobileOpen(true);

      const state = useUserStore.getState();

      expect(state.sidebarMobileOpen).toBe(true);
      expect(state.sidebarDesktopExpanded).toBe(false);
    });

    it('should close the mobile sidebar without modifying desktop state', () => {
      useUserStore.setState({
        sidebarMobileOpen: true,
        sidebarDesktopExpanded: true,
      });

      const { setSidebarMobileOpen } = useUserStore.getState();

      setSidebarMobileOpen(false);

      const state = useUserStore.getState();

      expect(state.sidebarMobileOpen).toBe(false);
      expect(state.sidebarDesktopExpanded).toBe(true);
    });

    it('should toggle only the mobile sidebar state', () => {
      const { toggleSidebarMobile } = useUserStore.getState();

      toggleSidebarMobile();

      let state = useUserStore.getState();

      expect(state.sidebarMobileOpen).toBe(true);
      expect(state.sidebarDesktopExpanded).toBe(false);

      toggleSidebarMobile();

      state = useUserStore.getState();

      expect(state.sidebarMobileOpen).toBe(false);
      expect(state.sidebarDesktopExpanded).toBe(false);
    });
  });

  describe('sidebarDesktopExpanded', () => {
    it('should start collapsed', () => {
      const state = useUserStore.getState();

      expect(state.sidebarDesktopExpanded).toBe(false);
    });

    it('should expand the desktop sidebar without modifying mobile state', () => {
      const { setSidebarDesktopExpanded } = useUserStore.getState();

      setSidebarDesktopExpanded(true);

      const state = useUserStore.getState();

      expect(state.sidebarDesktopExpanded).toBe(true);
      expect(state.sidebarMobileOpen).toBe(false);
    });

    it('should collapse the desktop sidebar without modifying mobile state', () => {
      useUserStore.setState({
        sidebarMobileOpen: true,
        sidebarDesktopExpanded: true,
      });

      const { setSidebarDesktopExpanded } = useUserStore.getState();

      setSidebarDesktopExpanded(false);

      const state = useUserStore.getState();

      expect(state.sidebarDesktopExpanded).toBe(false);
      expect(state.sidebarMobileOpen).toBe(true);
    });

    it('should toggle only the desktop sidebar state', () => {
      const { toggleSidebarDesktop } = useUserStore.getState();

      toggleSidebarDesktop();

      let state = useUserStore.getState();

      expect(state.sidebarDesktopExpanded).toBe(true);
      expect(state.sidebarMobileOpen).toBe(false);

      toggleSidebarDesktop();

      state = useUserStore.getState();

      expect(state.sidebarDesktopExpanded).toBe(false);
      expect(state.sidebarMobileOpen).toBe(false);
    });
  });

  describe('state independence', () => {
    it('should allow both states to have different values simultaneously', () => {
      useUserStore.setState({
        sidebarMobileOpen: true,
        sidebarDesktopExpanded: false,
      });

      let state = useUserStore.getState();

      expect(state.sidebarMobileOpen).toBe(true);
      expect(state.sidebarDesktopExpanded).toBe(false);

      useUserStore.setState({
        sidebarDesktopExpanded: true,
      });

      state = useUserStore.getState();

      expect(state.sidebarMobileOpen).toBe(true);
      expect(state.sidebarDesktopExpanded).toBe(true);
    });

    it('should not close desktop sidebar when mobile sidebar closes', () => {
      useUserStore.setState({
        sidebarMobileOpen: true,
        sidebarDesktopExpanded: true,
      });

      useUserStore.getState().setSidebarMobileOpen(false);

      const state = useUserStore.getState();

      expect(state.sidebarMobileOpen).toBe(false);
      expect(state.sidebarDesktopExpanded).toBe(true);
    });

    it('should not open mobile sidebar when desktop sidebar expands', () => {
      useUserStore.setState({
        sidebarMobileOpen: false,
        sidebarDesktopExpanded: false,
      });

      useUserStore.getState().setSidebarDesktopExpanded(true);

      const state = useUserStore.getState();

      expect(state.sidebarDesktopExpanded).toBe(true);
      expect(state.sidebarMobileOpen).toBe(false);
    });
  });

  describe('persistence', () => {
    it('should persist desktop sidebar state', async () => {
      useUserStore.getState().setSidebarDesktopExpanded(true);

      // Zustand persist escribe de forma síncrona con localStorage
      // en el entorno de test.
      const persisted = JSON.parse(localStorage.getItem('app-state'));

      expect(persisted).toBeTruthy();
      expect(persisted.state.sidebarDesktopExpanded).toBe(true);
    });

    it('should not persist mobile sidebar state', () => {
      useUserStore.getState().setSidebarMobileOpen(true);

      const persisted = JSON.parse(localStorage.getItem('app-state'));

      expect(persisted).toBeTruthy();

      expect(
        persisted.state.sidebarMobileOpen,
      ).toBeUndefined();
    });

    it('should persist desktop state without persisting mobile state', () => {
      useUserStore.setState({
        sidebarMobileOpen: true,
        sidebarDesktopExpanded: true,
      });

      const persisted = JSON.parse(localStorage.getItem('app-state'));

      expect(persisted).toBeTruthy();

      expect(persisted.state.sidebarDesktopExpanded).toBe(true);
      expect(persisted.state.sidebarMobileOpen).toBeUndefined();
    });
  });

  describe('logout', () => {
    it('should reset both sidebar states', () => {
      useUserStore.setState({
        sidebarMobileOpen: true,
        sidebarDesktopExpanded: true,
      });

      useUserStore.getState().logout();

      const state = useUserStore.getState();

      expect(state.sidebarMobileOpen).toBe(false);
      expect(state.sidebarDesktopExpanded).toBe(false);
    });
  });
});