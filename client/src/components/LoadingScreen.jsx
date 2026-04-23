export default function LoadingScreen() {
  return (
    <div className="overflow-hidden absolute z-2 p-4 flex items-center justify-center w-full h-full min-w-lvw min-h-lvh bg-slate-900/40 rounded-2xl">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 border-r-green-600 animate-spin"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-lg font-semibold text-(--text-secondary)">Cargando...</p>
          <p className="text-sm text-(--text-secondary) mt-1">Por favor espera</p>
        </div>
      </div>
    </div>
  );
}
