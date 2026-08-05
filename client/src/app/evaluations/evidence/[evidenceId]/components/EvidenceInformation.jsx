export default function EvidenceInformation({ evidence }) {
  return (
    <div className="border rounded-xl p-6 flex flex-col gap-5">
      <h2 className="text-h4">Información de la evidencia</h2>

      <Info label="Autor" value={evidence.author?.fullName} />
      <Info label="Proyecto" value={evidence.project?.projectName} />
      <Info label="Tipo" value={evidence.evidenceType} />
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
            className="text-primary underline"
          >
            Abrir evidencia
          </a>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-helper">{label}</p>
      <p>{value || '-'}</p>
    </div>
  );
}
