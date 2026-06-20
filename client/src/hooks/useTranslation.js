'use client';
import { useMemo } from 'react';
import { useUserStore } from '@/lib/store';

import en from '@/locales/en.json';
import es from '@/locales/es.json';

const dictionaries = {
  en,
  es,
};

export function useTranslation(section) {
  const language = useUserStore(
    (state) => state.language,
  );

  const dictionary = useMemo(() => {
    return dictionaries[language] || dictionaries.en;
  }, [language]);

  const t = (key) => {
    const fullKey = section ? `${section}.${key}` : key;
    const keys = fullKey.split('.');
    let value = dictionary;
    for (const k of keys) {
      if (value == null || typeof value !== 'object') return fullKey;
      value = value[k];
    }
    return value ?? fullKey;
  };

  return {
    t,
    language,
  };
}
