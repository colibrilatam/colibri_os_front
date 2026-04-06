export default function IdentidadPage() {
  const project = {
    name: "Aurora Labs",
    id: "COL-AR-00231",
    tramoCode: "T2",
    tramoName: "Validación temprana",
    status: "En avance estructural",
    updatedAt: "2026-04-03",
    nftState: "T2",
    ic: 4.43,
    icMax: 6.0,
    icNarrative: "T2 en tránsito a T3",
    trendLabel: "Tendencia ascendente breve",
    currentPac: "T2-C6",
    approvedPacs: 5,
    totalPacs: 7,
    microActions: 15,
    evidences: 5,
    nextMilestone: "Cierre de T2-C6",
    uncertainty: "Mercado",
    primaryRisk: "Inexistencia de demanda",
    window: "4 meses",
  };

  const progressPct = (project.approvedPacs / project.totalPacs) * 100;
  const icPct = (project.ic / project.icMax) * 100;

  // Función para calcular el gradiente dinámico basado en el porcentaje
  const getProgressGradient = (percent) => {
    if (percent <= 30) {
      return `linear-gradient(90deg, #FFD166 0%, #FFD166 100%)`;
    } else if (percent <= 60) {
      const firstStop = (30 / percent) * 100;
      const fadeStart = Math.max(0, firstStop - 8);
      const fadeEnd = Math.min(100, firstStop + 8);
      return `linear-gradient(90deg, #FFD166 0%, #FFD166 ${fadeStart}%, #00CFCF ${fadeEnd}%, #00CFCF 100%)`;
    } else {
      const firstStop = (30 / percent) * 100;
      const secondStop = (60 / percent) * 100;
      const fadeStart1 = Math.max(0, firstStop - 8);
      const fadeEnd1 = Math.min(100, firstStop + 8);
      const fadeStart2 = Math.max(0, secondStop - 8);
      const fadeEnd2 = Math.min(100, secondStop + 8);
      return `linear-gradient(90deg, #FFD166 0%, #FFD166 ${fadeStart1}%, #00CFCF ${fadeEnd1}%, #00CFCF ${fadeStart2}%, #009975 ${fadeEnd2}%, #009975 100%)`;
    }
  };

  return (
    <main className="min-h-screen glass-effect border-glass rounded-2xl">
      {/* Header */}
      <div className="p-4">
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-cream)' }}>
          Identidad del Proyecto
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
          Estado, reputación y comportamiento dentro de Colibrí OS
        </p>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mx-auto w-full space-y-6">
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="glass-effect border-glass  rounded-3xl p-6 xl:col-span-5">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--text-secondary)' }}>
                    Identidad reputacional
                  </div>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-cream)' }}>
                    NFT Colibrí dinámico
                  </h2>
                  <p className="mt-1" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    Último tramo alcanzado: {project.nftState}
                  </p>
                </div>
                <span className="rounded-full border border-cyan-800/70 bg-cyan-950/40 px-3 py-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-turquoise)' }}>
                  Estado visual {project.nftState}
                </span>
              </div>

              <div className="relative flex h-[320px] items-center justify-center overflow-hidden rounded-[28px] glass-effect-dark border-glass">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_50%_55%,rgba(16,185,129,0.14),transparent_32%)]" />
                <NftAvatar size="lg" />
              </div>
            </div>

            <div className="space-y-6 xl:col-span-7">
              <div className="glass-effect border-glass rounded-3xl p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-2 text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--text-secondary)' }}>
                      Señal reputacional actual
                    </div>
                    <div className="flex items-end gap-3">
                      <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-cream)' }}>
                        {project.ic.toFixed(2)}
                      </div>
                      <div style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>/ {project.icMax.toFixed(2)}</div>
                    </div>
                    <div className="mt-3" style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
                      {project.icNarrative}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-800/60 bg-emerald-950/50 px-3 py-1.5" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-emerald)' }}>
                      <span>▲</span>
                      <span>{project.trendLabel}</span>
                    </div>
                  </div>

                  <div className="w-full md:max-w-xs">
                    <div className="mb-2 flex items-center justify-between" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                      <span>Lectura sobre escala completa</span>
                      <span>{Math.round(icPct)}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                      <div
                        className="h-full rounded-full"
                        style={{ 
                          width: `${icPct}%`,
                          background: getProgressGradient(icPct)
                        }}
                      />
                    </div>
                    <div className="mt-4 flex h-12 items-end gap-1">
                      {[22, 28, 31, 34, 40, 46, 52].map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-md border border-slate-600 bg-slate-700/80"
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                    <div className="mt-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      Microtendencia reciente
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-effect border-glass rounded-3xl p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--text-secondary)' }}>
                      Estado actual del avance
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                      <MetricCard label="PAC actual" value={project.currentPac} />
                      <MetricCard
                        label="PACs aprobados"
                        value={`${project.approvedPacs} de ${project.totalPacs}`}
                      />
                      <MetricCard
                        label="Microacciones acumuladas"
                        value={` ${String(project.microActions)} / 21`}
                      />
                      <MetricCard
                        label="Evidencias aprobadas"
                        value={`${String(project.evidences)} / 7`}
                      />
                    </div>
                  </div>

                  <div className="w-full glass-effect-dark border-glass rounded-2xl p-4 lg:max-w-xs">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>
                      Próximo hito
                    </div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', color: 'var(--color-cream)' }}>
                      {project.nextMilestone}
                    </div>
                    <div className="mb-2 mt-5 flex items-center justify-between" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                      <span>Progreso del tramo</span>
                      <span>{Math.round(progressPct)}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
            <div className="glass-effect border-glass rounded-3xl p-6 xl:col-span-12">
                <div className="mb-3 text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--text-secondary)' }}>
                  Contexto estructural del tramo
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                  <ContextCard
                    label="Incertidumbre dominante"
                    value={project.uncertainty}
                    helper="Contexto metodológico del tramo"
                  />
                  <ContextCard
                    label="Riesgo principal del tramo"
                    value={project.primaryRisk}
                    helper="No expresa score fino del proyecto"
                  />
                  <ContextCard
                    label="Ventana estimada"
                    value={project.window}
                    helper="Horizonte de trabajo esperado"
                  />
                </div>
              </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="glass-effect-dark border-glass rounded-2xl p-4">
      <div className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </div>
      <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', color: 'var(--color-cream)' }}>
        {value}
      </div>
    </div>
  );
}

function ContextCard({ label, value, helper }) {
  return (
    <div className="glass-effect-dark border-glass rounded-2xl p-4">
      <div className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </div>
      <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', color: 'var(--color-cream)', lineHeight: 'var(--leading-normal)' }}>
        {value}
      </div>
      <div className="mt-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
        {helper}
      </div>
    </div>
  );
}

export function NftAvatar({ size = "sm" }) {
  const isLarge = size === "lg";

  return (
    <div
      className={[
        "relative flex items-center justify-center rounded-full border bg-slate-950",
        isLarge
          ? "h-64 w-64 border-cyan-800/50 shadow-[0_0_80px_rgba(34,211,238,0.08)]"
          : "h-14 w-14 border-cyan-800/40 shadow-[0_0_24px_rgba(34,211,238,0.08)]",
      ].join(" ")}
    >
      <div
        className={[
          "absolute rounded-full border border-emerald-800/40",
          isLarge ? "h-52 w-52" : "h-10 w-10",
        ].join(" ")}
      />
      <div
        className={[
          "absolute rounded-full border border-cyan-700/30",
          isLarge ? "h-40 w-40" : "h-8 w-8",
        ].join(" ")}
      />
      <div className="relative flex flex-col items-center">
        <div className={isLarge ? "text-6xl" : "text-xl"}>🕊️</div>
      </div>
    </div>
  );
}
