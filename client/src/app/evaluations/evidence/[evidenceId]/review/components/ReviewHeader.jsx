export default function ReviewHeader({ evidence }) {
  const evaluation = evidence.evaluations?.[0];

  return (
    <section className="border rounded-xl p-6 flex flex-col gap-6">
      <div>
        <p className="text-overline">Resumen de la evidencia</p>

        <h1 className="text-h3">{evidence.description || 'Sin descripción'}</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
        <Info label="Proyecto" value={evidence.project?.projectName} />

        <Info label="Autor" value={evidence.author?.fullName} />

        <Info
          label="Microacción"
          value={evidence.microActionInstance?.microActionDefinition?.code}
        />

        <Info label="Rúbrica" value={evaluation?.rubric?.code} />

        <Info label="Tipo de evidencia" value={evidence.evidenceType} />
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-helper">{label}</p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  );
}
