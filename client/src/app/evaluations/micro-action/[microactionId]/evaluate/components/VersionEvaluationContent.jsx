import { ExternalLink, FileText, ClipboardCheck } from 'lucide-react';

export default function VersionEvaluationContent({ microAction, version }) {
  const definition = microAction?.microActionDefinition;

  return (
    <section className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="glass-effect-cyan rounded-xl p-3">
          <ClipboardCheck className="h-6 w-6 text-accent-cyan" />
        </div>

        <div>
          <p className="text-overline">Contenido</p>

          <h2 className="text-h3 mt-1">Información presentada</h2>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <ContentBlock
          title="Notas de ejecución"
          icon={<FileText className="h-5 w-5" />}
          value={version.executionNotes}
        />

        <ContentBlock
          title="Resumen del cambio"
          value={version.changeSummary}
        />

        {definition && (
          <div className="glass-effect-secondary rounded-xl p-5">
            <p className="text-micro-label mb-3">
              Definición de la microacción
            </p>

            <h3 className="text-h3">{definition.instruction_es || '-'}</h3>

            {(definition.description || definition.description_es) && (
              <p className="text-body--muted mt-3">
                {definition.description || definition.description_es}
              </p>
            )}
          </div>
        )}

        {version.canonicalUri && (
          <div className="border-theme-top pt-5">
            <p className="text-micro-label mb-3">
              Archivo / evidencia presentada
            </p>

            <a
              href={version.canonicalUri}
              target="_blank"
              rel="noopener noreferrer"
              className="
                filter-chip
                rounded-xl
                px-5
                py-3
                inline-flex
                items-center
                gap-3
              "
            >
              <ExternalLink className="h-5 w-5" />

              <span className="text-data">Abrir evidencia</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function ContentBlock({ title, value, icon }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-accent-cyan">{icon}</span>}

        <p className="text-micro-label">{title}</p>
      </div>

      <div className="glass-effect-secondary rounded-xl p-5">
        <p className="text-body">{value || 'No se proporcionó información.'}</p>
      </div>
    </div>
  );
}
