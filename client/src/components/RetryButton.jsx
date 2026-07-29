'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function RetryButton() {
  const router = useRouter();
  const { t } = useTranslation('errorScreen');
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    router.refresh();
  };

  return (
    <button
      onClick={handleRetry}
      disabled={retrying}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {retrying ? t('retrying') : t('retry')}
    </button>
  );
}
