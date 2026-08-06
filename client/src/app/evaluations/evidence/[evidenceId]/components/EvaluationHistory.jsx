import Info from '../../../common/Info';

export default function EvaluationHistory({ evaluations = [] }) {
  return (
    <div className="glass-effect rounded-2xl p-6">
      <p className="text-overline mb-2">Historial de evaluaciones</p>

      {evaluations.length === 0 && (
        <p className="text-helper">No existen evaluaciones previas.</p>
      )}

      <div className="flex flex-col gap-4">
        {evaluations.map((evaluation, index) => (
          <div key={evaluation.id} className="border-theme rounded-lg p-4">
            <h4 className="text-body text-primary-theme font-semibold border-theme-bottom pb-3 mb-3">
              Evaluación #{index + 1}
            </h4>

            <Info label="Resultado" value={evaluation.evaluationResult} />

            <Info label="Puntaje" value={evaluation.score} />

            <Info label="Comentario" value={evaluation.comment} />
          </div>
        ))}
      </div>
    </div>
  );
}
