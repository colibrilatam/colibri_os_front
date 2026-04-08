export function HeroSection({ stats }) {
  const summaryStats = [
    { label: "Proyectos activos", value: stats.activeProjects },
    { label: "Tramos en curso", value: stats.tramosEnCurso },
    { label: "Países activos", value: stats.paisesActivos },
    { label: "Actualizaciones hoy", value: stats.actualizacionesHoy },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-100 w-175 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 -left-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:gap-16">
        <div className="flex-1 text-center md:text-left">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cyan-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            Plataforma activa
          </span>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            Descubre proyectos{" "}
            <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              en evolución
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500 md:text-lg">
            Monitoreá el avance, estado e índice Colibrí de cada proyecto del
            portafolio. Filtros, métricas y trazabilidad en un solo lugar.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <button className="rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-150 hover:opacity-90 active:scale-95">
              Explorar proyectos
            </button>
            <button className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-150 hover:border-white/25 hover:bg-white/10 active:scale-95">
              Ver métricas globales
            </button>
          </div>
        </div>

        <div className="grid w-full max-w-88 shrink-0 grid-cols-2 gap-4 md:w-72">
          {summaryStats.map((statItem) => (
            <div
              key={statItem.label}
              className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
            >
              <div className="text-2xl font-bold leading-none text-white md:text-3xl">
                {statItem.value}
              </div>

              <div className="mt-2 text-[12px] leading-5 text-slate-400">
                {statItem.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}