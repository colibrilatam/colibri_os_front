export default function EvidenceVersions({ versions }) {
  return (
    <div className="border rounded-xl p-6">
      <h2 className="text-h4 mb-5">Historial de versiones</h2>

      {versions.length === 0 && (
        <p className="text-helper">No existen versiones.</p>
      )}

      <div className="flex flex-col gap-4">
        {versions.map((version) => (
          <div key={version.id} className="border rounded-lg p-4">
            <Info label="Versión" value={`V${version.versionNumber}`} />

            <Info
              label="Fecha"
              value={new Date(version.createdAt).toLocaleDateString()}
            />

            <Info label="Resumen" value={version.changeSummary} />

            {version.storageUri && (
              <a
                href={version.storageUri}
                target="_blank"
                className="text-primary underline"
              >
                Abrir versión
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="mb-2">
      <p className="text-helper">{label}</p>
      <p>{value || '-'}</p>
    </div>
  );
}
