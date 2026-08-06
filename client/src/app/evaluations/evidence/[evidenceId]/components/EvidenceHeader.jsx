import StatusBadge from '@/app/evaluations/common/StatusBadge';

export default function EvidenceHeader({ evidence }) {
  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-overline">Evidencia</p>

          <h1 className="text-h2">
            {evidence.description || 'Sin descripción'}
          </h1>

          <p className="text-helper mt-2">{evidence.project?.projectName}</p>
        </div>
        <StatusBadge status={evidence.status} />
      </div>
    </div>
  );
}
