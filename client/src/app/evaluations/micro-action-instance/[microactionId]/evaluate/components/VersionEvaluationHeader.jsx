import StatusBadge from '@/components/common/StatusBadge';

export default function VersionEvaluationHeader({
  microAction,
  version,
}) {
  return (
    <section className="glass-effect rounded-2xl p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
        <div className="min-w-0">
          <p className="text-overline">
            Evaluación de microacción
          </p>

          <h1 className="text-h2 mt-2">
            {microAction?.microActionDefinition?.name ||
              microAction?.microActionDefinition?.title ||
              'Microacción'}
          </h1>

          <p className="text-body--muted mt-3">
            Revisión de la versión #{version.versionNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-micro-label">
            Estado
          </span>

          <StatusBadge
            status={version.changeType || version.status}
          />
        </div>
      </div>

      <div className="border-theme-top mt-6 pt-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Info
            label="Proyecto"
            value={microAction?.project?.projectName}
          />

          <Info
            label="Versión"
            value={`#${version.versionNumber}`}
          />

          <Info
            label="Fecha de creación"
            value={formatDate(version.createdAt)}
          />
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-micro-label">
        {label}
      </p>

      <p className="text-data--label mt-1">
        {value || '-'}
      </p>
    </div>
  );
}

function formatDate(date) {
  if (!date) return '-';

  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}