'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const formatDate = (date) => {
  if (!date) return '-';

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

export default function EvaluationCard({ evaluation }) {
  const params = useParams();

  const projectId = params.id;

  console.log(projectId);
  return (
    <Link href={`/dashboard/${projectId}/evaluations/${evaluation.id}`}>
      <div
        className="
          h-full
          rounded-3xl
          border border-slate-800
          glass-effect
          p-5
          transition-all duration-300
          hover:border-cyan-500/40
          hover:bg-white/[0.03]
          hover:-translate-y-1
          cursor-pointer
        "
      >
        {/* HEADER */}

        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-micro-label">
              {evaluation.evidence.project.projectName}
            </p>

            <h3 className="text-lg font-semibold text-white mt-1">
              {evaluation.evidence.title}
            </h3>
          </div>

          <ResultBadge result={evaluation.evaluationResult} />
        </div>

        {/* DESCRIPTION */}

        <p className="text-body--muted line-clamp-3 mb-5">
          {evaluation.evidence.description}
        </p>

        {/* SCORE */}

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-slate-500">Score</p>

            <p className="text-3xl font-bold text-white">
              {evaluation.score ?? '-'}
            </p>
          </div>

          {evaluation.evidence.isValidForIc && (
            <span
              className="
                px-3 py-1 rounded-full text-xs
                bg-emerald-500/10
                border border-emerald-500/20
                text-emerald-300
              "
            >
              Impacta IC
            </span>
          )}
        </div>

        {/* FOOTER */}

        <div className="pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-500">
          <span>{evaluation.rubric.name}</span>

          <span>{formatDate(evaluation.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}

/* ================= UI ================= */

function ResultBadge({ result }) {
  const styles = {
    approved: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',

    rejected: 'bg-red-500/10 text-red-300 border-red-500/20',

    needs_revision: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  };

  const labels = {
    approved: 'Aprobada',
    rejected: 'Rechazada',
    needs_revision: 'Revisión',
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs border
        ${styles[result]}
      `}
    >
      {labels[result]}
    </span>
  );
}
