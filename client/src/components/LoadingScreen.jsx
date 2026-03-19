export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-700">Cargando...</p>
          <p className="text-sm text-slate-500 mt-1">Por favor espera</p>
        </div>
      </div>
    </div>
  );
}
