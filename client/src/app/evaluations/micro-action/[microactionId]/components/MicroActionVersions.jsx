'use client';

import { useState } from 'react';
import { Eye, History } from 'lucide-react';

import VersionDetailModal from './VersionDetailModal';
import StatusBadge from '@/app/evaluations/common/StatusBadge';
import { useRouter } from 'next/navigation';

export default function MicroActionVersions({
  versions = [],
  microAction,
  autor,
}) {
  //console.log(microAction)
  const [selectedVersion, setSelectedVersion] = useState(null);

  const sortedVersions = [...versions].sort(
    (a, b) => b.versionNumber - a.versionNumber,
  );

  //console.log(autor)
  return (
    <>
      <section className="glass-effect rounded-2xl p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-7">
          <div>
            <p className="text-overline">Historial</p>

            <h2 className="text-h2 mt-2">Versiones de la microacción</h2>

            <p className="text-body--muted mt-2">
              Historial completo de envíos y cambios realizados.
            </p>
          </div>

          <div className="counter-badge rounded-xl px-4 py-2 inline-flex items-center gap-2 self-start">
            <History size={20} />
            <span className="text-badge">{versions.length} versiones</span>
          </div>
        </div>

        {sortedVersions.length === 0 ? (
          <div className="empty-state rounded-xl p-8 text-center">
            <p className="text-body--muted">
              Todavía no existen versiones para esta microacción.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedVersions.map((version, index) => (
              <VersionCard
                key={version.id}
                version={version}
                microAction={microAction}
                isLatest={index === 0}
                onView={() => setSelectedVersion(version)}
              />
            ))}
          </div>
        )}
      </section>

      {selectedVersion && (
        <VersionDetailModal
          version={selectedVersion}
          onClose={() => setSelectedVersion(null)}
          autor={autor}
        />
      )}
    </>
  );
}

function VersionCard({ version, isLatest, onView, microAction }) {
  const router = useRouter();

  return (
    <div
      className={`
        rounded-2xl
        p-5
        md:p-6
        transition-all
        duration-200
        ${isLatest ? 'card-active' : 'surface-secondary border-theme'}
      `}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4 min-w-0">
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              glass-effect-cyan
              border-glass-dark
            "
          >
            <span className="text-value-card--large">
              v{version.versionNumber}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-h3">Versión {version.versionNumber}</p>

              {isLatest && (
                <span className="badge badge-info">Última versión</span>
              )}

              <StatusBadge status={version.changeType} />
            </div>

            <p className="text-body--muted mt-2">
              {version.changeSummary || 'Sin resumen de cambios'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="text-left sm:text-right">
            <p className="text-micro-label">Fecha</p>

            <p className="text-date">{formatDate(version.createdAt)}</p>
          </div>

          <button
            onClick={onView}
            className="
              btn-primary
              rounded-xl
              px-5
              py-3
              cursor-pointer
              inline-flex
              items-center
              justify-center
              gap-2
            "
          >
            <Eye size={20} />
            Ver detalles
          </button>
          {version.status === 'pending' && (
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/evaluations/micro-action/${microAction.id}/evaluate/${version.id}`,
                )
              }
              className="btn-primary rounded-xl px-5 py-3"
            >
              Evaluar versión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return '-';

  return new Date(date).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
