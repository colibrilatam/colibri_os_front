'use client';

import { useUserStore } from '@/lib/store';

export default function LanguageSwitcher() {
  const language = useUserStore((state) => state.language);
  const setLanguage = useUserStore((state) => state.setLanguage);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage('es')}
        className={`border border-gray text-(--text-secondary) px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
          language === 'es' ? 'accent-contrast-text btn-primary' : ''
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`border border-gray text-(--text-secondary) px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
          language === 'en' ? 'accent-contrast-text btn-primary' : ''
        }`}
      >
        EN
      </button>
    </div>
  );
}
