import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLanguageStore = create(
  persist(
    (set) => ({
      language: 'en',

      setLanguage: (language) =>
        set({
          language,
        }),
    }),
    {
      name: 'language-storage',
    },
  ),
);