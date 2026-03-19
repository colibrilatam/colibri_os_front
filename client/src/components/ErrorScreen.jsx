'use client';

export default function ErrorScreen({ error, reset }) {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col items-center gap-6 max-w-md">
        {/* Error Icon */}
        <div className="p-4 rounded-full bg-red-100">
          <div className="w-12 h-12 flex items-center justify-center text-red-600 text-2xl font-bold">
            ⚠️
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            ¡Algo salió mal!
          </h1>
          <p className="text-slate-600 mb-4">
            Ocurrió un error al cargar la página. Por favor, intenta de nuevo.
          </p>
          {error?.message && (
            <p className="text-sm text-slate-500 p-3 bg-red-50 rounded border border-red-200 mt-2">
              {error.message}
            </p>
          )}
        </div>

        {/* Retry Button */}
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
        >
          ↻ Reintentar
        </button>
      </div>
    </div>
  );
}
