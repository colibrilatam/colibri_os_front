export default function RubricCard({ rubric }) {
  if (!rubric) return null;

  return (
    <section className="glass-effect rounded-2xl p-6 flex flex-col gap-6">
      <div>
        <p className="text-overline">Rúbrica</p>

        <h2 className="text-h3 text-primary-theme">{rubric.name_es}</h2>

        <p className="text-helper">Versión {rubric.version}</p>
      </div>

      {rubric.description_es && (
        <div>
          <p className="text-helper mb-2">Descripción</p>

          <p className="text-body text-secondary-theme">
            {rubric.description_es}
          </p>
        </div>
      )}

      {rubric.criteriaJson && (
        <div className="flex flex-col gap-3">
          <p className="text-helper">Criterios</p>

          {rubric.criteriaJson.dimensions.map((criterion, index) => (
            <div key={index} className="border-theme rounded-xl p-4">
              <p className="text-body text-primary-theme font-semibold">
                {criterion.name_es}
              </p>

              <p className="text-body--muted">{criterion.criteria_es}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
