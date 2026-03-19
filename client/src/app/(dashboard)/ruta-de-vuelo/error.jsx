'use client';

import ErrorScreen from '@/components/ErrorScreen';

export default function Error({ error, reset }) {
  return <ErrorScreen error={error} reset={reset} />;
}
