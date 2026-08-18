import { FileText, ExternalLink } from 'lucide-react';

export default function MicroActionEvidenceList({ evidences = [] }) {
  return (
    <section className="glass-effect rounded-2xl p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-overline">Evidencias</p>

          <h2 className="text-h2 mt-2">Evidencias asociadas</h2>
        </div>

        <div className="counter-badge rounded-xl px-4 py-2">
          <span className="text-badge">{evidences.length}</span>
        </div>
      </div>

      {evidences.length === 0 ? (
        <div className="empty-state rounded-xl p-8 text-center">
          <p className="text-body--muted">
            Esta microacción todavía no tiene evidencias asociadas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {evidences.map((evidence) => (
            <EvidenceItem key={evidence.id} evidence={evidence} />
          ))}
        </div>
      )}
    </section>
  );
}

function EvidenceItem({ evidence }) {
  return (
    <div
      className="
        surface-secondary
        border-theme
        rounded-xl
        p-5
        flex
        flex-col
        gap-4
        md:flex-row
        md:items-center
        md:justify-between
      "
    >
      <div className="flex items-start gap-4 min-w-0">
        <div className="text-accent-cyan mt-1">
          <FileText size={24} />
        </div>

        <div className="min-w-0">
          <p className="text-micro-label">
            {evidence.evidenceType || 'Evidencia'}
          </p>

          <p className="text-data--label mt-1">
            {evidence.description ||
              evidence.title ||
              evidence.name ||
              'Sin descripción'}
          </p>

          {evidence.createdAt && (
            <p className="text-date mt-1">{formatDate(evidence.createdAt)}</p>
          )}
        </div>
      </div>

      {evidence.canonicalUri && (
        <a
          href={evidence.canonicalUri}
          target="_blank"
          rel="noopener noreferrer"
          className="
            filter-chip
            rounded-xl
            px-4
            py-2
            inline-flex
            items-center
            justify-center
            gap-2
          "
        >
          <ExternalLink size={18} />
          Ver evidencia
        </a>
      )}
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
