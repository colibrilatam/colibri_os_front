import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createAuthSlice } from './authSlice';
import { createUiSlice } from './uiSlice';
import { createLanguageSlice } from './languageSlice';
import { createProjectSlice } from './projectSlice';
import { createDemoSlice } from './demoSlice';

export const useUserStore = create(
  persist(
    (set, get) => ({
      ...createAuthSlice(set, get),
      ...createUiSlice(set, get),
      ...createLanguageSlice(set, get),
      ...createProjectSlice(set, get),
      ...createDemoSlice(set, get),
    }),
    {
      name: 'app-state',
    },
  ),
);
