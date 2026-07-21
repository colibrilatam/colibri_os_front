'use client';
import { useOnborda } from 'onborda';
import Button from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserStore } from '@/lib/store';

export default function TourButton({ tourName }) {
  const { t } = useTranslation('sidebar');

  const setSidebarMobileOpen = useUserStore(
    (state) => state.setSidebarMobileOpen,
  );
  const setSidebarDesktopExpanded = useUserStore(
    (state) => state.setSidebarDesktopExpanded,
  );

  const { startOnborda } = useOnborda();

  function handleClick(e) {
    setSidebarMobileOpen(false);
    setSidebarDesktopExpanded(false);
    startOnborda(tourName);
  }
  return <Button /* content="Iniciar tutorial" */ content={t('tour')} onClick={() => handleClick()} />;
}
