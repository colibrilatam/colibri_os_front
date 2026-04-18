export default function SelectRole({ onSelectRole }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* EMPRENDEDOR */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:bg-white/10 hover:scale-[1.02] transition-all duration-200">
        <div>
          <div className="text-3xl mb-4">🚀</div>
          <p className="text-h2 mb-2">Emprendedor</p>
          <p className="text-body--muted mb-4">
            Construí, validá y demostrá tu proyecto con evidencia real.
          </p>
        </div>
        <button
          onClick={() => onSelectRole('emprendedor')}
          className="mt-6 w-full py-3 rounded-lg font-semibold bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] transition cursor-pointer"
        >
          Continuar como Emprendedor
        </button>
      </div>

      {/* MECENAS */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:bg-white/10 hover:scale-[1.02] transition-all duration-200">
        <div>
          <div className="text-3xl mb-4">🤝</div>
          <p className="text-h2 mb-2">Mecenas</p>
          <p className="text-body--muted mb-4">
            Apoyá proyectos con impacto sin tomar participación.
          </p>
        </div>
        <button
          onClick={() => onSelectRole('mecenas')}
          className="mt-6 w-full py-3 rounded-lg font-semibold bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] transition cursor-pointer"
        >
          Continuar como Mecenas
        </button>
      </div>
    </div>
  );
}
