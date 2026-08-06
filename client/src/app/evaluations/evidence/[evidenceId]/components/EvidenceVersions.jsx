import Info from '../../../common/Info';

export default function EvidenceVersions({ versions }) {
  return (
    <div className="glass-effect rounded-2xl p-6">
      <p className="text-overline mb-2">Historial de versiones</p>

      {versions.length === 0 && (
        <p className="text-helper">No existen versiones.</p>
      )}

      <div className="flex flex-col gap-4">
        {versions.map((version) => (
          <div key={version.id} className="border-theme rounded-lg p-4">
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
                className="text-accent-cyan text-body"
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
