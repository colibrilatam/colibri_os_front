import Info from "@/app/evaluations/common/Info";
import { useTranslation } from "@/hooks/useTranslation";

export default function ReviewHeader({ evidence }) {
  const { t } = useTranslation('enums');
  const evaluation = evidence.evaluations?.[0];

  return (
    <section className="glass-effect rounded-2xl p-6 flex flex-col gap-6">
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

        <Info label="Tipo de evidencia" value={t(evidence.evidenceType)} />
      </div>
    </section>
  );
}
