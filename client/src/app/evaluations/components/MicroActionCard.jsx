import StatusBadge from '../common/StatusBadge';

export default function MicroActionCard({ microAction, onClick }) {
  const versions = microAction?.versions ?? [];

  const latestVersion = [...versions].sort(
    (a, b) => b.versionNumber - a.versionNumber,
  )[0];

  return (
    <div
      className="
        glass-effect
        rounded-2xl
        p-6
        transition-all
        duration-200
        hover:glass-effect-secondary
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-(--text-secondary) font-semibold">
            {microAction.project?.projectName ?? 'Proyecto'}
          </p>

          <h3 className="text-h3 mt-2">{getMicroActionName(microAction)}</h3>
        </div>

        <StatusBadge status={microAction.status} />
      </div>

      <div className="border-theme-bottom mt-5 pb-5" />

      {/* Información */}
      <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
        <Info label="Autor" value={microAction.actor?.fullName} />

        <Info label="Estado" value={formatStatus(microAction.status)} />

        <Info label="Versiones" value={versions.length} />

        <Info
          label="Última versión"
          value={
            latestVersion
              ? `Versión ${latestVersion.versionNumber}`
              : 'Sin versiones'
          }
        />

        <Info
          label="Estado última versión"
          value={
            latestVersion
              ? formatVersionStatus(latestVersion.changeType)
              : 'Sin versiones'
          }
        />

        <Info
          label="Fecha de creación"
          value={formatDate(microAction.createdAt)}
        />

      </div>

      {/* Footer */}
      <div className="border-theme-top mt-6 flex justify-end pt-5">
        <button
          type="button"
          onClick={onClick}
          className="
            btn-primary
            rounded-xl
            px-5
            py-2
            text-badge
            cursor-pointer
          "
        >
          Revisar
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-micro-label">{label}</p>

      <p className="text-data--label mt-1 truncate">{value ?? '-'}</p>
    </div>
  );
}

function getMicroActionName(microAction) {
  return (
    microAction.microActionDefinition?.name ??
    microAction.microActionDefinition?.name_es ??
    microAction.microActionDefinition?.title ??
    `Microacción [${microAction.microActionDefinition.code ?? ''}]`
  );
}

function formatStatus(status) {
  const map = {
    pending: 'Pendiente',
    submitted: 'Enviada',
    completed: 'Completada',
  };

  return map[status] ?? status ?? '-';
}

function formatVersionStatus(status) {
  const map = {
    created: 'Creada',
    status_change: 'Cambio de estado',
    notes_update: 'Notas actualizadas',
    submitted: 'Enviada',
    reopened: 'Reabierta',
    rejected: 'Rechazada',
    completed: 'Completada',
  };

  return map[status] ?? status ?? '-';
}

function formatDate(date) {
  if (!date) {
    return '-';
  }

  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
