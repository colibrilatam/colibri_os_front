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
    <Link href={`/evaluations/${evaluation.id}`}>
      <div
        className="
      w-full
      rounded-3xl
      border border-slate-800
      glass-effect
      p-5
      transition-all duration-300
      hover:border-cyan-500/40
      hover:bg-white/[0.03]
      cursor-pointer
    "
      >
        <div className="flex items-center justify-between gap-6">
          {/* Proyecto */}
          <div className="min-w-[220px]">
            <p className="text-micro-label">
              {evaluation.evidence.project.projectName}
            </p>

            <h3 className="font-semibold text-white">
              {evaluation.evidence.title}
            </h3>
          </div>

          {/* Descripción */}
          <div className="flex-1">
            <p className="text-body--muted line-clamp-2">
              {evaluation.evidence.description}
            </p>
          </div>

          {/* Score */}
          <div className="w-24 text-center">
            <p className="text-xs text-slate-500">Score</p>

            <p className="text-2xl font-bold text-white">{evaluation.score}</p>
          </div>

          {/* Rubrica */}
          <div className="w-48">
            <p className="text-xs text-slate-500">Rúbrica</p>

            <p className="text-white">{evaluation.rubric.name}</p>
          </div>

          {/* Estado */}
          <div>
            <ResultBadge result={evaluation.evaluationResult} />
          </div>

          {/* Fecha */}
          <div className="w-28 text-right text-slate-500 text-sm">
            {formatDate(evaluation.createdAt)}
          </div>
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
