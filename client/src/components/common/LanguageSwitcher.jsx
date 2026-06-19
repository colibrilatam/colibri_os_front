'use client';

import { useUserStore } from '@/lib/store';

export default function LanguageSwitcher() {
  const language = useUserStore((state) => state.language);
  const setLanguage = useUserStore((state) => state.setLanguage);

  const handleToggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <button
      onClick={handleToggleLanguage}
      className="
        btn-primary
        px-3 py-1
        rounded-lg
        text-sm
        transition-all
        duration-200
      "
      title={language === 'en' ? 'Switch to Spanish' : 'Cambiar al Ingles'}
    >
      {language === 'en' ? 'ES' : 'EN'}
    </button>
  );
}
