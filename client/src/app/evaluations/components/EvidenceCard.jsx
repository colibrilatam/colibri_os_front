import { useTranslation } from '@/hooks/useTranslation';
import StatusBadge from '../common/StatusBadge';

export default function EvidenceCard({ evidence, onClick }) {
  const { t } = useTranslation('enums');

  return (
    <div
      className="
        glass-effect
        border-glass-dark
        rounded-2xl
        p-6
        transition-all
        duration-normal
        hover:bg-[rgba(0,207,207,0.045)]
        hover:border-[rgba(0,207,207,0.16)]
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          {/* Proyecto */}
          <p className="text-micro-label text-[var(--color-turquoise)]">
            {evidence.evidence.project?.projectName}
          </p>

          {/* Título */}
          <h3
            className="
              text-h3
              mt-2
              text-[var(--text-primary)]
              leading-[1.35]
            "
          >
            {evidence.evidence.description}
          </h3>
        </div>

        <div className="shrink-0">
          <StatusBadge status={evidence.evidence.status} />
        </div>
      </div>

      {/* Separador */}
      <div className="border-theme-bottom mt-6 pb-1" />

      {/* Información */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7 mt-7">
        <Info
          label="Autor"
          value={evidence.evidence.author?.fullName}
        />

        <Info
          label="Tipo de evidencia"
          value={t(evidence.evidence.evidenceType)}
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
          value={t(evidence.evaluationType)}
        />

        <Info
          label="Fecha de envío"
          value={formatDate(
            evidence.evidence.submittedAt ??
              evidence.evidence.createdAt,
          )}
        />

        <Info
          label="Estado"
          value="Pendiente"
          accent
        />
      </div>

      {/* Footer separator */}
      <div className="border-theme-top mt-7 pt-5" />

      {/* Footer */}
      <div className="flex justify-end mt-5">
        <button
          onClick={onClick}
          className="
            btn-primary
            rounded-xl
            px-6
            py-2.5
            cursor-pointer
            text-[var(--text-primary)]
            text-[var(--text-sm)]
            font-[var(--font-weight-semibold)]
            transition-all
            duration-250
            hover:brightness-110
            hover:-translate-y-0.5
            active:translate-y-0
          "
        >
          Revisar
        </button>
      </div>
    </div>
  );
}

function Info({ label, value, accent = false }) {
  return (
    <div className="min-w-0">
      <p
        className="
          text-micro-label
          text-[var(--text-tertiary)]
          mb-1.5
        "
      >
        {label}
      </p>

      <p
        className={`
          text-data--label
          leading-[1.45]
          break-words
          ${
            accent
              ? 'text-[var(--color-nectar)]'
              : 'text-[var(--text-primary)]'
          }
        `}
      >
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