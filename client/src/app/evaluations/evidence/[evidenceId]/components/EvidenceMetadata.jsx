export default function EvidenceMetadata({ evidence }) {
  return (
    <div className="border rounded-xl p-6 flex flex-col gap-5">
      <h2 className="text-h4">Metadatos</h2>

      <Info label="Estado" value={evidence.status} />

      <Info label="Validación" value={evidence.validationStatus} />

      <Info label="Confianza" value={evidence.validationConfidence} />

      <Info label="Privacidad" value={evidence.privacyLevel} />

      <Info
        label="Válida para IC"
        value={evidence.isValidForIc ? 'Sí' : 'No'}
      />

      <Info label="Hash" value={evidence.contentHash} />

      <Info
        label="Creada"
        value={new Date(evidence.createdAt).toLocaleString()}
      />

      <Info
        label="Actualizada"
        value={new Date(evidence.updatedAt).toLocaleString()}
      />
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
