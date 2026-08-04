export default function EvaluationMetrics({ evidences }) {
  const pending = evidences.filter((e) => e.status === 'submitted').length;

  const review = evidences.filter((e) => e.status === 'under_review').length;

  const approved = evidences.filter((e) => e.status === 'approved').length;

  const rejected = evidences.filter((e) => e.status === 'rejected').length;

  const metrics = [
    {
      label: 'Pendientes',
      value: pending,
    },
    {
      label: 'En revisión',
      value: review,
    },
    {
      label: 'Aprobadas',
      value: approved,
    },
    {
      label: 'Rechazadas',
      value: rejected,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="border rounded-xl p-5 bg-background">
          <p className="text-helper">{metric.label}</p>

          <p className="text-h3 mt-2">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}
