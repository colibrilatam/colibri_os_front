type Project = {
  name: string;
  id: string;
  tramoCode: string;
  tramoName: string;
  status: string;
  updatedAt: string;
  nftState: string;
  ic: number;
  icMax: number;
  icNarrative: string;
  trendLabel: string;
  currentPac: string;
  approvedPacs: number;
  totalPacs: number;
  microActions: number;
  evidences: number;
  nextMilestone: string;
  uncertainty: string;
  primaryRisk: string;
  window: string;
};

type MetricCardProps = {
  label: string;
  value: string;
};

type ContextCardProps = {
  label: string;
  value: string;
  helper: string;
};

type NftAvatarProps = {
  size?: "sm" | "lg";
};

export default function MockupCapa0Colibri(): JSX.Element {
  const project: Project = {
    name: "Aurora Labs",
    id: "COL-AR-00231",
    tramoCode: "T2",
    tramoName: "Validación temprana",
    status: "En avance estructural",
    updatedAt: "2026-04-03",
    nftState: "T2",
    ic: 2.43,
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

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/90 px-6 py-5 shadow-2xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                Estado actual del proyecto
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-3">
                      <NftAvatar size="sm" />
                      <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
                        {project.name}
                      </h1>
                    </div>
                    <span className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">
                      ID {project.id}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
                    <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1">
                      {project.tramoCode} · {project.tramoName}
                    </span>
                    <span className="rounded-full border border-emerald-800/60 bg-emerald-950/60 px-3 py-1 text-emerald-300">
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="grid w-full gap-3 sm:grid-cols-2 md:max-w-md">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Índice Colibrí
                    </div>
                    <div className="mt-1 flex items-end gap-2">
                      <div className="text-2xl font-semibold text-slate-50">
                        {project.ic.toFixed(2)}
                      </div>
                      <div className="pb-0.5 text-sm text-slate-400">
                        / {project.icMax.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 sm:text-right">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Última actualización
                    </div>
                    <div className="mt-1 text-base text-slate-200">{project.updatedAt}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl xl:col-span-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Identidad reputacional
                </div>
                <h2 className="text-xl font-semibold text-slate-50">NFT Colibrí dinámico</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Último tramo alcanzado: {project.nftState}
                </p>
              </div>
              <span className="rounded-full border border-cyan-800/70 bg-cyan-950/40 px-3 py-1 text-xs text-cyan-300">
                Estado visual {project.nftState}
              </span>
            </div>

            <div className="relative flex h-[320px] items-center justify-center overflow-hidden rounded-[28px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_50%_55%,rgba(16,185,129,0.14),transparent_32%)]" />
              <NftAvatar size="lg" />
            </div>
          </div>

          <div className="space-y-6 xl:col-span-7">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                    Señal reputacional actual
                  </div>
                  <div className="flex items-end gap-3">
                    <div className="text-5xl font-semibold text-slate-50">
                      {project.ic.toFixed(2)}
                    </div>
                    <div className="mb-1 text-lg text-slate-400">/ {project.icMax.toFixed(2)}</div>
                  </div>
                  <div className="mt-3 text-lg text-slate-200">{project.icNarrative}</div>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-800/60 bg-emerald-950/50 px-3 py-1.5 text-sm text-emerald-300">
                    <span>▲</span>
                    <span>{project.trendLabel}</span>
                  </div>
                </div>

                <div className="w-full md:max-w-xs">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                    <span>Lectura sobre escala completa</span>
                    <span>{Math.round(icPct)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-400"
                      style={{ width: `${icPct}%` }}
                    />
                  </div>
                  <div className="mt-4 flex h-12 items-end gap-1">
                    {[22, 28, 31, 34, 40, 46, 52].map((value: number, index: number) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md border border-slate-600 bg-slate-700/80"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">Microtendencia reciente</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
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
                      value={String(project.microActions)}
                    />
                    <MetricCard
                      label="Evidencias aprobadas"
                      value={String(project.evidences)}
                    />
                  </div>
                </div>

                <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-4 lg:max-w-xs">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                    Próximo hito
                  </div>
                  <div className="text-lg font-medium text-slate-100">{project.nextMilestone}</div>
                  <div className="mb-2 mt-5 flex items-center justify-between text-sm text-slate-400">
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

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                Contexto estructural del tramo
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: MetricCardProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="text-lg font-medium text-slate-100">{value}</div>
    </div>
  );
}

function ContextCard({ label, value, helper }: ContextCardProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="text-lg leading-snug font-medium text-slate-100">{value}</div>
      <div className="mt-2 text-sm text-slate-400">{helper}</div>
    </div>
  );
}

function NftAvatar({ size = "sm" }: NftAvatarProps): JSX.Element {
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
