export default function RubricCard({ rubric }) {
  if (!rubric) return null;

  return (
    <section className="border rounded-xl p-6 flex flex-col gap-5">
      <div>
        <p className="text-overline">Rúbrica</p>

        <h2 className="text-h4">{rubric.name_es}</h2>

        <p className="text-helper">Versión {rubric.version}</p>
      </div>

      {rubric.description_es && (
        <div>
          <p className="text-helper mb-2">Descripción</p>

          <p>{rubric.description_es}</p>
        </div>
      )}

      {rubric.criteriaJson && (
        <div className="flex flex-col gap-3">
          <p className="text-helper">Criterios</p>

          {rubric.criteriaJson.dimensions.map((criterion, index) => (
            <div key={index} className="border rounded-lg p-3">
              <p className="font-medium">{criterion.name_es}</p>

              <p className="text-helper">{criterion.criteria_es}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
