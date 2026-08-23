'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Button from '@/components/ui/Button';

export default function RetryButton() {
  const router = useRouter();
  const { t } = useTranslation('errorScreen');
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    router.refresh();
  };

  return (
    <Button
      variant="danger-flat"
      disabled={retrying}
      onClick={handleRetry}
    >
      {retrying ? t('retrying') : t('retry')}
    </Button>
  );
}
