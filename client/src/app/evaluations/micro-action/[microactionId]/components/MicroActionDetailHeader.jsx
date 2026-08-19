import StatusBadge from '@/app/evaluations/common/StatusBadge';

export default function MicroActionDetailHeader({ microAction }) {
  const definition = microAction.microActionDefinition;
  const project = microAction.project;

  return (
    <section className="glass-effect rounded-2xl p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-overline">{project?.projectName || 'Proyecto'}</p>

          <h1 className="text-h1 mt-3">
            {definition?.name ||
              definition?.name_es ||
              definition?.title ||
              'Microacción'}
          </h1>

          {definition?.description && (
            <p className="text-body--muted mt-4 max-w-4xl">
              {definition.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-5">
            <div className="counter-badge rounded-xl px-4 py-2">
              <span className="text-micro-label">ID</span>

              <span className="text-badge ml-2">{microAction.id}</span>
            </div>

            <div className="counter-badge rounded-xl px-4 py-2">
              <span className="text-micro-label">Versiones</span>

              <span className="text-badge ml-2">
                {microAction.versions?.length || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <StatusBadge status={microAction.status} />
        </div>
      </div>
    </section>
  );
}
