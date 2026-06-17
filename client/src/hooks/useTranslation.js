import { useMemo } from 'react';
import { useUserStore } from '@/lib/store';

import en from '@/locales/en.json';
import es from '@/locales/es.json';

const dictionaries = {
  en,
  es,
};

export function useTranslation() {
  const language = useUserStore(
    (state) => state.language,
  );

  const dictionary = useMemo(() => {
    return dictionaries[language] || dictionaries.en;
  }, [language]);

  const t = (key) => {
    return dictionary[key] || key;
  };

  return {
    t,
    language,
  };
}