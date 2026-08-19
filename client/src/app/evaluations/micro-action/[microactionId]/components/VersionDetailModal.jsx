'use client';

import StatusBadge from '@/app/evaluations/common/StatusBadge';
import {
  X,
  CalendarDays,
  FileText,
  UserRound,
  GitBranch,
  RotateCcw,
  Link as LinkIcon,
} from 'lucide-react';

export default function VersionDetailModal({ version, onClose, autor }) {
  if (!version) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[var(--z-modal)]
        overlay-bg
        flex
        items-center
        justify-center
        p-4
        md:p-6
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          glass-effect
          rounded-2xl
          w-full
          max-w-4xl
          max-h-[90vh]
          overflow-hidden
          flex
          flex-col
        "
      >
        {/* Header */}

        <div className="border-theme-bottom p-6 md:p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-overline">Historial de versión</p>

              <div className="flex flex-wrap items-center gap-3 mt-2">
                <h2 className="text-h2">Versión {version.versionNumber}</h2>

                <StatusBadge status={version.changeType} />
              </div>

              <p className="text-body--muted mt-3">
                {version.changeSummary || 'Sin resumen de cambios'}
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="
                filter-chip
                rounded-xl
                p-2.5
                cursor-pointer
                shrink-0
              "
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}

        <div className="overflow-y-auto custom-scrollbar p-6 md:p-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Info
              icon={<GitBranch size={21} />}
              label="Estado actual"
              value={version.changeType}
            />

            <Info
              icon={<CalendarDays size={21} />}
              label="Fecha de creación"
              value={formatDate(version.createdAt)}
            />

            <Info
              icon={<UserRound size={21} />}
              label="Creada por"
              value={
                autor?.fullName ||
                autor?.name ||
                version.createdBy?.fullName ||
                version.createdBy?.name ||
                version.createdBy?.email ||
                version.createdByUserId ||
                '-'
              }
            />

            {/*<Info
              icon={<RotateCcw size={21} />}
              label="Número de intento"
              value={version.attemptNumber}
            />

            <Info
              icon={<RotateCcw size={21} />}
              label="Reaperturas"
              value={version.reopenedCount}
            />
*/}
            <Info
              icon={<GitBranch size={21} />}
              label="Versión que reemplaza"
              value={
                version.supersedesVersionNumber
                  ? `Versión ${version.supersedesVersionNumber}`
                  : 'Ninguna'
              }
            />
            
          </div>

          {/* Estados */}

          <div className="border-theme-top mt-7 pt-6">
            <p className="text-micro-label mb-4">Estado de la versión</p>

            <div className="surface-secondary rounded-xl p-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <p className="text-micro-label">Estado actual</p>

                  <div className="mt-2">
                    <StatusBadge status={version.changeType} />
                  </div>
                </div>

                <div>
                  <p className="text-micro-label">Estado anterior</p>

                  <div className="mt-2">
                    {version.previousStatus ? (
                      <StatusBadge status={version.previousStatus} />
                    ) : (
                      <span className="text-data">Sin estado anterior</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}

          <div className="border-theme-top mt-7 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={21} className="text-accent-cyan" />

              <p className="text-micro-label">Notas de ejecución</p>
            </div>

            <div className="surface-secondary rounded-xl p-5">
              <p className="text-body">
                {version.changeSummary ||
                  'Esta versión no contiene notas de ejecución.'}
              </p>
            </div>
          </div>

          {/* URI */}

          {version.canonicalUri && (
            <div className="border-theme-top mt-7 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <LinkIcon size={21} className="text-accent-cyan" />

                <p className="text-micro-label">Recurso asociado</p>
              </div>

              <a
                href={version.canonicalUri}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-body
                  break-all
                  text-accent-cyan
                  hover:underline
                "
              >
                {version.canonicalUri}
              </a>
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="border-theme-top p-5 md:p-6 flex justify-end">
          <button
            onClick={onClose}
            className="
              filter-chip
              rounded-xl
              px-5
              py-2.5
              cursor-pointer
            "
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="surface-secondary border-theme rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="text-accent-cyan mt-1">{icon}</div>

        <div className="min-w-0">
          <p className="text-micro-label">{label}</p>

          <p className="text-data--label mt-1 break-words">{value ?? '-'}</p>
        </div>
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return '-';

  return new Date(date).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
