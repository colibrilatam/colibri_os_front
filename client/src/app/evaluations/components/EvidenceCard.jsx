export default function EvidenceCard({ evidence, onClick }) {
  return (
    <div
      className="
        border
        rounded-xl
        p-5
        hover:border-primary
        hover:shadow-sm
        transition-all
      "
    >
      {/* Header */}

      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-overline">
            {evidence.evidence.project?.projectName}
          </p>

          <h3 className="text-h5">{evidence.evidence.description}</h3>
        </div>

        <StatusBadge status={evidence.evidence.status} />
      </div>

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

      {/* Footer */}

      <div className="flex justify-end mt-6">
        <button
          onClick={onClick}
          className="
            px-5
            py-2
            rounded-lg
            bg-primary
            text-white
            hover:opacity-90
            transition
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
      <p className="text-helper">{label}</p>
      <p className="text-body">{value || '-'}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const labels = {
    submitted: 'Pendiente',
    under_review: 'En revisión',
    approved: 'Aprobada',
    rejected: 'Rechazada',
    draft: 'Borrador',
  };

  const styles = {
    submitted: 'bg-yellow-100 text-yellow-700',
    under_review: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-700',
  };

  return (
    <span
      className={`
        px-3
        py-1
        rounded-full
        text-xs
        font-medium
        ${styles[status]}
      `}
    >
      {labels[status]}
    </span>
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
