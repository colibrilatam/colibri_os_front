'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

import { microActionService } from '@/services/microAction';

import VersionEvaluationHeader from '@/components/micro-action-evaluation/VersionEvaluationHeader';
import VersionEvaluationSummary from '@/components/micro-action-evaluation/VersionEvaluationSummary';
import VersionEvaluationContent from '@/components/micro-action-evaluation/VersionEvaluationContent';
import ResolutionActions from '@/components/micro-action-evaluation/ResolutionActions';

export default function MicroActionEvaluationPage() {
  const params = useParams();
  const router = useRouter();

  const instanceId = params?.instanceId;
  const versionId = params?.versionId;

  const [microAction, setMicroAction] = useState(null);
  const [version, setVersion] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!instanceId || !versionId) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await microActionService.getById(instanceId);

        const versions = Array.isArray(data?.versions) ? data.versions : [];

        const selectedVersion = versions.find((item) => item.id === versionId);

        if (!selectedVersion) {
          throw new Error(
            'No se encontró la versión solicitada dentro de la microacción.',
          );
        }

        setMicroAction(data);
        setVersion(selectedVersion);
      } catch (err) {
        console.error(err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            'No fue posible cargar la información.',
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [instanceId, versionId]);

  const isResolved = useMemo(() => {
    if (!version) return false;

    return ['completed', 'rejected'].includes(
      version.changeType || version.status,
    );
  }, [version]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center p-6">
        <div className="glass-effect rounded-2xl px-8 py-6 flex items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />

          <span className="text-body">Cargando versión...</span>
        </div>
      </div>
    );
  }

  if (error || !microAction || !version) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center p-6">
        <div className="glass-effect rounded-2xl max-w-xl w-full p-8 text-center">
          <div className="flex justify-center mb-5">
            <div className="badge-danger rounded-full p-4">
              <AlertCircle className="h-8 w-8" />
            </div>
          </div>

          <h2 className="text-h2">No se pudo cargar la evaluación</h2>

          <p className="text-body--muted mt-4">
            {error || 'La información solicitada no está disponible.'}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="btn-primary rounded-xl px-6 py-3 mt-6 cursor-pointer"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col p-6">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="
            filter-chip
            rounded-xl
            px-4
            py-2
            inline-flex
            items-center
            gap-2
            cursor-pointer
          "
        >
          <ArrowLeft className="h-5 w-5" />

          <span className="text-data">Volver al detalle</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto pb-8">
          <VersionEvaluationHeader
            microAction={microAction}
            version={version}
          />

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 mt-6">
            <main className="flex flex-col gap-6">
              <VersionEvaluationSummary
                microAction={microAction}
                version={version}
              />

              <VersionEvaluationContent
                microAction={microAction}
                version={version}
              />
            </main>

            <aside>
              <ResolutionActions
                version={version}
                disabled={isResolved}
                onResolved={(updatedVersion) => {
                  setVersion((current) => ({
                    ...current,
                    ...updatedVersion,
                  }));
                }}
              />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
