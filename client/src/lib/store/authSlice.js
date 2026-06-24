export const createAuthSlice = (set, get) => ({
  token: null,
  user: null,
  rol: 'CEO',
  isGuest: false,

  setToken: () => {},
  setUser: () => {},
  setRol: () => {},
  setIsGuest: () => {},
  logout: () => {},
  isAuthenticated: () => {},
});