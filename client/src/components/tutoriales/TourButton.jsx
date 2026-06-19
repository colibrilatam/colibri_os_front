'use client';
import { useOnborda } from 'onborda';
import Button from '@/components/Button';
import { useUserStore } from '@/lib/store';
import { useTranslation } from '@/hooks/useTranslation';

export default function TourButton({ tourName }) {
  const { t } = useTranslation();

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
  return <Button /* content="Iniciar tutorial" */ content={t('sidebar.tour')} onClick={() => handleClick()} />;
}
