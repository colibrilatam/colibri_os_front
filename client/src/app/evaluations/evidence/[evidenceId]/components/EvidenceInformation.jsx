import { useTranslation } from "@/hooks/useTranslation";
import Info from "../../../common/Info";

export default function EvidenceInformation({ evidence }) {
  const { t } = useTranslation('enums');
  return (
    <div className="glass-effect rounded-2xl p-6 flex flex-col gap-5">
      <p className="text-overline mb-2">Información de la evidencia</p>

      <Info label="Autor" value={evidence.author?.fullName} />
      <Info label="Proyecto" value={evidence.project?.projectName} />
      <Info label="Tipo" value={t(evidence.evidenceType)} />
      <Info
        label="Fecha de envío"
        value={
          evidence.submittedAt
            ? new Date(evidence.submittedAt).toLocaleDateString()
            : '-'
        }
      />

      <Info label="Descripción" value={evidence.description} />

      {evidence.canonicalUri && (
        <div>
          <p className="text-helper mb-2">Contenido</p>

          <a
            href={evidence.canonicalUri}
            target="_blank"
            className="text-accent-cyan text-body"
          >
            Abrir evidencia
          </a>
        </div>
      )}
    </div>
  );
}

