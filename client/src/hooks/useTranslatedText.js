'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/lib/store';
import { translationService } from '@/services/translation';

export const useTranslatedText = (text) => {
  const language = useUserStore((state) => state.language);

  const translationsCache = useUserStore((state) => state.translationsCache);

  const setTranslation = useUserStore((state) => state.setTranslation);

  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    if (!text) return;

    if (language === 'en') {
      setTranslatedText(text);
      return;
    }

    const cacheKey = `en-es-${text}`;

    const cached = translationsCache[cacheKey];

    if (cached) {
      setTranslatedText(cached);
      return;
    }

    const translate = async () => {
      try {
        const translation = await translationService.translate(text);

        setTranslation(cacheKey, translation);

        setTranslatedText(translation);
      } catch (error) {
        console.error(error);

        setTranslatedText(text);
      }
    };

    translate();
  }, [text, language, translationsCache, setTranslation]);

  return translatedText;
};
