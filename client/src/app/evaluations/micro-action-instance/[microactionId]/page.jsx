'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import MicroActionDetailHeader from './components/MicroActionDetailHeader';
import MicroActionOverview from './components/MicroActionOverview';
import MicroActionVersions from './components/MicroActionVersions';
import MicroActionEvidenceList from './components/MicroActionEvidenceList';
import { microActionService } from '@/services/micro-action';
import MicroActionTimeline from './components/MicroActionTimeline';
import { getMockVersions } from './mocks/microActionVersionsMock';

export default function MicroActionDetailPage() {
  const pathname = usePathname();
  const microactionId = pathname.split('/').pop();

  const router = useRouter();

  const [microAction, setMicroAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!microactionId) return;

    async function loadMicroAction() {
      try {
        setLoading(true);
        setError(null);

        const data = await microActionService.getById(microactionId);
        const microActionWithMockVersions = {
          ...data,
          versions: getMockVersions(data),
        };

        setMicroAction(microActionWithMockVersions);
      } catch (err) {
        console.error('Error cargando microacción:', err);

        setError(
          err?.response?.data?.message ||
            'No se pudo cargar la información de la microacción.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadMicroAction();
  }, [microactionId]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center p-6">
        <div className="glass-effect rounded-2xl p-10 text-center">
          <p className="text-body">Cargando microacción...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center p-6">
        <div className="glass-effect rounded-2xl p-10 text-center max-w-xl">
          <p className="text-h3 mb-4">No se pudo cargar la microacción</p>

          <p className="text-body--muted mb-6">{error}</p>

          <button
            onClick={() => router.back()}
            className="btn-primary rounded-xl px-5 py-3 cursor-pointer"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!microAction) {
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col p-6">
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <div className="mx-auto max-w-7xl space-y-6 pb-8">
          {/* Volver */}
          <button
            onClick={() => router.back()}
            className="
              filter-chip
              inline-flex
              items-center
              gap-2
              rounded-xl
              px-4
              py-2.5
              cursor-pointer
            "
          >
            <ArrowLeft size={20} />
            <span className="text-data--label">Volver a microacciones</span>
          </button>

          {/* Header */}
          <MicroActionDetailHeader microAction={microAction} />

          {/* Información general */}
          <MicroActionOverview microAction={microAction} />
          <MicroActionTimeline microAction={microAction} />

          {/* Evidencias 
          <MicroActionEvidenceList evidences={microAction.evidences} />
          */}

          {/* Versiones */}
          <MicroActionVersions autor={microAction.actor} versions={microAction.versions || []} />
        </div>
      </div>
    </div>
  );
}
