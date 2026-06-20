import { useEffect, useState } from 'react';
import { useUserStore } from '@/lib/store';
import { translationService } from '@/services/translation';

export function useTranslatedContent(content) {
  const language = useUserStore(
    (state) => state.language,
  );

  const translationsCache = useUserStore(
    (state) => state.translationsCache,
  );

  const setTranslation = useUserStore(
    (state) => state.setTranslation,
  );

  const [translated, setTranslated] =
    useState(content);

  useEffect(() => {
    if (!content) return;

    if (language === 'en') {
      setTranslated(content);
      return;
    }

    async function translate() {
      const result = structuredClone(content);

      if (content.project?.tagline) {
        const key = `project-tagline-${content.project.tagline}`;

        if (translationsCache[key]) {
          result.project.tagline =
            translationsCache[key];
        } else {
          const translation =
            await translationService.translate(
              content.project.tagline,
            );

          result.project.tagline =
            translation;

          setTranslation(
            key,
            translation,
          );
        }
      }

      if (
        content.project?.shortDescription
      ) {
        const key =
          `project-shortDescription-${content.project.shortDescription}`;

        if (translationsCache[key]) {
          result.project.shortDescription =
            translationsCache[key];
        } else {
          const translation =
            await translationService.translate(
              content.project.shortDescription,
            );

          result.project.shortDescription =
            translation;

          setTranslation(
            key,
            translation,
          );
        }
      }

      setTranslated(result);
    }

    translate();
  }, [
    content,
    language,
    translationsCache,
    setTranslation,
  ]);

  return translated;
}