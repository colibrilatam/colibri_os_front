import InfoCard from '@/components/ui/InfoCard';

export default function VersionEvaluationSummary({
  microAction,
  version,
}) {
  return (
    <section className="glass-effect rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-overline">
            Información de la versión
          </p>

          <h2 className="text-h3 mt-2">
            Datos de ejecución
          </h2>
        </div>

        <div className="glass-effect-secondary rounded-xl px-4 py-3 text-center">
          <p className="text-micro-label">
            Versión
          </p>

          <p className="text-value-card--large">
            #{version.versionNumber}
          </p>
        </div>
      </div>

      <div className="border-theme-bottom pb-5" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <InfoCard
          label="Intento"
          value={version.attemptNumber}
        />

        <InfoCard
          label="Reaperturas"
          value={version.reopenedCount}
        />

        <InfoCard
          label="Tipo de cambio"
          value={formatChangeType(version.changeType)}
        />

        <InfoCard
          label="Estado anterior"
          value={formatStatus(version.previousStatus)}
        />

        <InfoCard
          label="Versión reemplazada"
          value={
            version.supersedesVersionNumber
              ? `#${version.supersedesVersionNumber}`
              : 'Primera versión'
          }
        />

        <InfoCard
          label="Creado por"
          value={
            version.createdBy?.fullName ||
            version.createdByUserId
          }
        />

        <InfoCard
          label="Estado de la microacción"
          value={formatStatus(microAction.status)}
        />

        <InfoCard
          label="Inicio"
          value={formatDate(microAction.startedAt)}
        />

        <InfoCard
          label="Enviado"
          value={formatDate(microAction.submittedAt)}
        />
      </div>
    </section>
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

function formatStatus(status) {
  if (!status) return '-';

  const map = {
    pending: 'Pendiente',
    submitted: 'Enviada',
    completed: 'Completada',
    rejected: 'Rechazada',
  };

  return map[status] || status;
}

function formatChangeType(type) {
  if (!type) return '-';

  const map = {
    created: 'Creación',
    status_change: 'Cambio de estado',
    notes_update: 'Actualización de notas',
    submitted: 'Envío',
    reopened: 'Reapertura',
    rejected: 'Rechazo',
    completed: 'Completada',
  };

  return map[type] || type;
}