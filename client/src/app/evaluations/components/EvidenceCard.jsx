import StatusBadge from '../common/StatusBadge';

export default function EvidenceCard({ evidence, onClick }) {
  return (
    <div
      className="
glass-effect
rounded-2xl
p-6
transition-all
hover:glass-effect-secondary
"
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <p className="text-overline">
            {evidence.evidence.project?.projectName}
          </p>

          <h3 className="text-h3 mt-2">{evidence.evidence.description}</h3>
        </div>
        <StatusBadge status={evidence.evidence.status} />
      </div>
      <div className="border-theme-bottom pb-5"></div>
      {/* Información */}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        <Info label="Autor" value={evidence.evidence.author?.fullName} />

        <Info
          label="Tipo de evidencia"
          value={formatEvidenceType(evidence.evidence.evidenceType)}
        />

        <Info
          label="Rúbrica"
          value={
            evidence.rubric
              ? `${evidence.rubric.name_es} (${evidence.rubric.version})`
              : '-'
          }
        />

        <Info
          label="Tipo de evaluación"
          value={formatEvaluationType(evidence.evaluationType)}
        />

        <Info
          label="Fecha de envío"
          value={formatDate(
            evidence.evidence.submittedAt ?? evidence.evidence.createdAt,
          )}
        />

        <Info label="Estado" value="Pendiente" />
      </div>
      <div className="border-theme-top mt-6 pt-5 flex justify-end"></div>
      {/* Footer */}

      <div className="flex justify-end mt-6">
        <button
          onClick={onClick}
          className="
btn-primary
rounded-xl
px-5
py-2
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
    <div>
      <p className="text-micro-label">{label}</p>

      <p className="text-data--label">{value || '-'}</p>
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

function formatEvaluationType(type) {
  const map = {
    automatic: 'Automática',
    human: 'Humana',
    hybrid: 'Híbrida',
  };

  return map[type] || type;
}

function formatEvidenceType(type) {
  const map = {
    text: 'Texto',
    file: 'Archivo',
    document: 'Documento',
    image: 'Imagen',
    video: 'Video',
    link: 'Enlace',
    presentation: 'Presentación',
    metrics: 'Métricas',
  };

  return map[type] || type;
}
