'use client';

import { useUserStore } from '@/lib/store';
import { useTranslation } from '@/hooks/useTranslation';

export default function RolIndicator() {
  const { t } = useTranslation('rolIndicator');
  const rol = useUserStore((state) => state.rol);

  const mensajesPorRol = {
    CEO: t('ceoView'),
    Colaborador: t('collaboratorView'),
    Mecenas: t('patronView'),
    Visitante: t('visitorView'),
  };

  return (
    <div className="glass-effect border-glass p-4 mb-4">
      <p className="text-base text-zinc-300">{t('currentUserType')}</p>
      <p className="text-xl font-semibold text-white mt-1">{rol}</p>
      <p className="text-base text-zinc-400 mt-2">{mensajesPorRol[rol]}</p>
    </div>
  );
}
