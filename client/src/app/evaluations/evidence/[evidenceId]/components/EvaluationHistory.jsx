export default function EvaluationHistory({ evaluations = [] }) {
  return (
    <div className="border rounded-xl p-6">
      <h2 className="text-h4 mb-5">Historial de evaluaciones</h2>

      {evaluations.length === 0 && (
        <p className="text-helper">No existen evaluaciones previas.</p>
      )}

      <div className="flex flex-col gap-4">
        {evaluations.map((evaluation, index) => (
          <div key={evaluation.id} className="border rounded-lg p-4">
            <h4 className="font-semibold">Evaluación #{index + 1}</h4>

            <Info label="Resultado" value={evaluation.evaluationResult} />

            <Info label="Puntaje" value={evaluation.score} />

            <Info label="Comentario" value={evaluation.comment} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="mt-2">
      <p className="text-helper">{label}</p>
      <p>{value || '-'}</p>
    </div>
  );
}
