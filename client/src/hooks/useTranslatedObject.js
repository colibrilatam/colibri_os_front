import { useEffect, useState } from 'react';
import { translationService } from '@/services/translation';
import { useUserStore } from '@/lib/store';

export function useTranslatedObject(
  object,
  fields = [],
) {
  const language = useUserStore(
    (state) => state.language,
  );

  const translationsCache = useUserStore(
    (state) => state.translationsCache,
  );

  const setTranslation = useUserStore(
    (state) => state.setTranslation,
  );

  const [translatedObject, setTranslatedObject] =
    useState(object);

  useEffect(() => {
    if (!object) return;

    if (language === 'en') {
      setTranslatedObject(object);
      return;
    }

    async function translateFields() {
      const result = {
        ...object,
      };

      for (const field of fields) {
        const value = object[field];

        if (!value) continue;

        const cacheKey =
          `en-es-${field}-${value}`;

        if (
          translationsCache[cacheKey]
        ) {
          result[field] =
            translationsCache[
              cacheKey
            ];

          continue;
        }

        try {
          const translated =
            await translationService.translate(
              value,
            );

          result[field] =
            translated;

          setTranslation(
            cacheKey,
            translated,
          );
        } catch (error) {
          console.error(error);
        }
      }

      setTranslatedObject(result);
    }

    translateFields();
  }, [
    object,
    language,
    fields,
    translationsCache,
    setTranslation,
  ]);

  return translatedObject;
}