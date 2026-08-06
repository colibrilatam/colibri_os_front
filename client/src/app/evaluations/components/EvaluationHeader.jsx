export default function EvaluationHeader({ total }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-overline">Evaluaciones</p>

        <h1 className="text-h2">Bandeja de revisión</h1>
      </div>

      <div className="text-helper">{total} evidencias pendientes</div>
    </div>
  );
}
