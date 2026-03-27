'use client';

export default function ProjectCard({ project, isMiProyecto, onClick }) {
  // Truncar descripción a máximo 80 caracteres para la preview
  const descripcionTruncada = 
    project.descripción.length > 80 
      ? project.descripción.substring(0, 80) + '...' 
      : project.descripción;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-6 rounded-2xl transition-all duration-200 active:scale-98 ${
        isMiProyecto
          ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-blue-500 shadow-md hover:shadow-lg'
          : 'bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300'
      }`}
      style={{ minHeight: '160px', color: "var(--text-primary)" }}
      aria-label={`Ver detalles del proyecto ${project.nombre}`}
    >
      <div className="flex items-start gap-4">
        {/* Contenido principal */}
        <div className="flex-1">
          {/* Badge "Tu proyecto" */}
          {isMiProyecto && (
            <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-3">
              ✓ Tu Proyecto
            </div>
          )}

          {/* Título */}
          <h3 className="text-2xl font-bold  mb-3">
            {project.nombre}
          </h3>

          {/* Descripción truncada */}
          <p className="text-lg text-gray-400 mb-4 leading-snug">
            {descripcionTruncada}
          </p>

          {/* Información de miembros */}
          <div className="flex items-center gap-3 text-lg text-gray-600">
            <span className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg font-semibold">
              👥 {project.miembros.length} miembro{project.miembros.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Indicador de interactividad */}
        <div className="shrink-0 flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full">
          <span className="text-2xl text-blue-600">›</span>
        </div>
      </div>
    </button>
  );
}
