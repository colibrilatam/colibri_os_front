export default function EvaluationHeader({ total }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-overline">Evaluaciones</p>

        <h1 className="text-h2">Bandeja de revisión</h1>
      </div>

      <div className="counter-badge rounded-xl px-4 py-2 text-badge">
        {total} microacciones
      </div>
    </div>
  );
}
