import { create } from 'zustand';

export const useUserStore = create((set) => ({
  rol: 'CEO',
  setRol: (newRol) => set({ rol: newRol }),
}));
