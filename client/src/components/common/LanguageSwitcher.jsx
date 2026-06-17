'use client';

import { useUserStore } from '@/lib/store';

export default function LanguageSwitcher() {
  const language = useUserStore((state) => state.language);
  const setLanguage = useUserStore((state) => state.setLanguage);
 // console.log(language)
 // console.log(setLanguage)

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`
          px-3 py-1 rounded-lg transition-all duration-200
          text-sm
          ${
            language === 'en'
              ? 'btn-primary'
              : 'card-surface hover-surface text-body'
          }
        `}
      >
        EN
      </button>

      <button
        onClick={() => setLanguage('es')}
        className={`
          px-3 py-1 rounded-lg transition-all duration-200
          text-sm
          ${
            language === 'es'
              ? 'btn-primary'
              : 'card-surface hover-surface text-body'
          }
        `}
      >
        ES
      </button>
    </div>
  );
}