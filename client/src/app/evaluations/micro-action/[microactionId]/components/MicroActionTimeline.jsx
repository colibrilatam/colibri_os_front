'use client';

import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  PlayCircle,
  RotateCcw,
  Send,
  XCircle,
} from 'lucide-react';

export default function MicroActionTimeline({ microAction }) {
  const events = buildTimeline(microAction);

  return (
    <section className="glass-effect rounded-2xl p-6 md:p-8">
      <div className="mb-7">
        <p className="text-overline">Seguimiento</p>

        <h2 className="text-h2 mt-2">Línea de tiempo</h2>

        <p className="text-body--muted mt-2">
          Historial temporal de los principales eventos de la microacción.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="empty-state rounded-xl p-8 text-center">
          <p className="text-body--muted">
            No hay eventos registrados para esta microacción.
          </p>
        </div>
      ) : (
        <div className="relative ml-2 md:ml-4">
          {/* Línea vertical */}
          <div
            className="
              absolute
              left-[19px]
              top-3
              bottom-3
              w-px
              bg-[var(--theme-surface-border)]
            "
          />

          <div className="space-y-7">
            {events.map((event, index) => (
              <TimelineItem
                key={`${event.type}-${event.date}-${index}`}
                event={event}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function TimelineItem({ event }) {
  const Icon = event.icon;

  return (
    <div className="relative flex gap-5">
      {/* Icono */}
      <div
        className={`
          relative
          z-10
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          ${event.iconClass}
        `}
      >
        <Icon size={20} />
      </div>

      {/* Contenido */}
      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-data--label">{event.title}</p>

            {event.description && (
              <p className="text-body--muted mt-1">{event.description}</p>
            )}
          </div>

          <p className="text-date shrink-0">{formatDateTime(event.date)}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Construye la línea de tiempo utilizando:
 *
 * - startedAt
 * - submittedAt
 * - completedAt
 * - validatedAt
 * - closedAt
 * - versiones
 */
function buildTimeline(microAction) {
  const events = [];

  if (microAction.startedAt) {
    events.push({
      type: 'started',
      date: microAction.startedAt,
      title: 'Microacción iniciada',
      description: 'Se creó la instancia y comenzó su ventana de ejecución.',
      icon: PlayCircle,
      iconClass: 'border-glass-dark text-accent-cyan bg-[rgba(0,207,207,0.08)]',
    });
  }

  const versions = [...(microAction.versions || [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  versions.forEach((version) => {
    events.push({
      type: `version-${version.id}`,
      date: version.createdAt,
      title: `Versión ${version.versionNumber}`,
      description:
        version.changeSummary || `Cambio registrado: ${version.changeType}`,
      icon: getVersionIcon(version.changeType),
      iconClass: getVersionIconClass(version.changeType),
    });
  });

  if (microAction.submittedAt) {
    events.push({
      type: 'submitted',
      date: microAction.submittedAt,
      title: 'Microacción enviada',
      description: 'La microacción fue enviada para revisión.',
      icon: Send,
      iconClass:
        'border-glass-dark text-accent-amber bg-[rgba(255,209,102,0.08)]',
    });
  }

  if (microAction.completedAt) {
    events.push({
      type: 'completed',
      date: microAction.completedAt,
      title: 'Microacción completada',
      description: 'La ejecución de la microacción fue completada.',
      icon: CheckCircle2,
      iconClass:
        'border-glass-green text-accent-emerald bg-[rgba(0,153,117,0.08)]',
    });
  }

  if (microAction.validatedAt) {
    events.push({
      type: 'validated',
      date: microAction.validatedAt,
      title: 'Microacción validada',
      description: 'La microacción fue validada.',
      icon: FileCheck2,
      iconClass:
        'border-glass-green text-accent-emerald bg-[rgba(0,153,117,0.08)]',
    });
  }

  if (microAction.closedAt) {
    events.push({
      type: 'closed',
      date: microAction.closedAt,
      title: 'Microacción cerrada',
      description: 'El ciclo de la microacción fue cerrado.',
      icon: CheckCircle2,
      iconClass:
        'border-glass-green text-accent-emerald bg-[rgba(0,153,117,0.08)]',
    });
  }

  return events
    .filter((event) => event.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getVersionIcon(changeType) {
  switch (changeType) {
    case 'submitted':
      return Send;

    case 'rejected':
      return XCircle;

    case 'reopened':
      return RotateCcw;

    case 'completed':
      return CheckCircle2;

    case 'status_change':
      return Clock3;

    default:
      return FileCheck2;
  }
}

function getVersionIconClass(changeType) {
  switch (changeType) {
    case 'rejected':
      return 'border-glass-red text-accent-red bg-[rgba(239,68,68,0.08)]';

    case 'reopened':
      return 'border-glass-dark text-accent-amber bg-[rgba(255,209,102,0.08)]';

    case 'completed':
      return 'border-glass-green text-accent-emerald bg-[rgba(0,153,117,0.08)]';

    case 'submitted':
      return 'border-glass-dark text-accent-cyan bg-[rgba(0,207,207,0.08)]';

    default:
      return 'border-theme text-secondary-theme bg-[var(--theme-secondary-background)]';
  }
}

function formatDateTime(date) {
  if (!date) return '-';

  return new Date(date).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
