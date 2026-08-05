export default function EvidenceHeader({ evidence }) {
  return (
    <div className="border rounded-xl p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-overline">Evidencia</p>

          <h1 className="text-h2">
            {evidence.description || 'Sin descripción'}
          </h1>

          <p className="text-helper mt-2">
            Proyecto: {evidence.project?.projectName}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
          {evidence.status}
        </span>
      </div>
    </div>
  );
}
