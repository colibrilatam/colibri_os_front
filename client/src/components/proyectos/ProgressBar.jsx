'use client';

export default function ProgressBar({ porcentaje }) {
  // Validar que está entre 0 y 100
  const validoPorcentaje = Math.min(Math.max(porcentaje, 0), 100);

  // Determinar color según progreso
  let colorBarra = 'bg-red-500';
  if (validoPorcentaje >= 75) {
    colorBarra = 'bg-green-500';
  } else if (validoPorcentaje >= 50) {
    colorBarra = 'bg-blue-500';
  } else if (validoPorcentaje >= 25) {
    colorBarra = 'bg-yellow-500';
  }

  return (
    <div className="mb-8">
      {/* Encabezado con label y porcentaje */}
      <div className="flex items-center justify-between mb-3">
        <label className="text-xl font-semibold text-gray-900">
          Progreso del Proyecto
        </label>
        <span className="text-2xl font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
          {validoPorcentaje}%
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-sm">
        <div
          className={`h-full ${colorBarra} transition-all duration-500 ease-out flex items-center justify-end pr-2`}
          style={{ width: `${validoPorcentaje}%` }}
          role="progressbar"
          aria-valuenow={validoPorcentaje}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label={`Proyecto ${validoPorcentaje} por ciento completado`}
        >
          {/* Mostrar número dentro de la barra si hay espacio */}
          {validoPorcentaje > 20 && (
            <span className="text-sm font-bold text-white">
              {validoPorcentaje}%
            </span>
          )}
        </div>
      </div>

      {/* Texto indicador de estado */}
      <div className="mt-3 text-lg text-gray-700">
        {validoPorcentaje === 100 ? (
          <span>✓ <strong>Proyecto completado</strong></span>
        ) : validoPorcentaje >= 75 ? (
          <span>🎯 <strong>Casi listo</strong> - Falta poco para terminar</span>
        ) : validoPorcentaje >= 50 ? (
          <span>⏳ <strong>En progreso</strong> - Vamos a mitad de camino</span>
        ) : validoPorcentaje >= 25 ? (
          <span>🚀 <strong>Iniciado</strong> - Comenzamos el proyecto</span>
        ) : (
          <span>📋 <strong>Próximo a comenzar</strong></span>
        )}
      </div>
    </div>
  );
}
