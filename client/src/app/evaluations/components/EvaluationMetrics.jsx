'use client';

import { useMemo } from 'react';

export default function EvaluationMetrics({ evaluations }) {
  const metrics = useMemo(() => {
    const total = evaluations.length;

    const approved = evaluations.filter(
      (e) => e.evaluationResult === 'approved',
    ).length;

    const rejected = evaluations.filter(
      (e) => e.evaluationResult === 'rejected',
    ).length;

    const pending = evaluations.filter(
      (e) => e.evaluationResult === 'needs_revision',
    ).length;

    return {
      total,
      approved,
      rejected,
      pending,
    };
  }, [evaluations]);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <MetricCard
        label="Total"
        value={metrics.total}
      />

      <MetricCard
        label="Aprobadas"
        value={metrics.approved}
      />

      <MetricCard
        label="Rechazadas"
        value={metrics.rejected}
      />

      <MetricCard
        label="Pendientes"
        value={metrics.pending}
      />
    </div>
  );
}

/* ================= UI ================= */

function MetricCard({ label, value }) {
  return (
    <div
  className="
    rounded-2xl
    border border-slate-800
    bg-white/[0.03]
    p-5
    flex items-center gap-3
  "
>
  <span className="text-3xl font-bold text-white">
    {value}
  </span>

  <span className="text-sm text-slate-400">
    {label}
  </span>
</div>
  );
}