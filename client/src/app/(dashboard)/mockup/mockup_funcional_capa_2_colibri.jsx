type Project = {
  name: string;
  id: string;
  tramoCode: string;
  tramoName: string;
  status: string;
  updatedAt: string;
  ic: number;
  icMax: number;
  uncertainty: string;
  primaryRisk: string;
  window: string;
  strategicQuestion: string;
  currentPac: string;
  approvedPacs: number;
  totalPacs: number;
  currentCategory: string;
  microActions: number;
  evidences: number;
  densityNarrative: string;
  realSignals: { label: string; status: "done" | "pending" }[];
  blockers: string[];
  categories: { code: string; label: string; status: "done" | "current" | "next" }[];
  pacProgress: { code: string; status: "done" | "current" | "pending" }[];
};

type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
};

type ContextRowProps = {
  label: string;
  value: string;
};

type StatusChipProps = {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "current" | "pending";
};

type PacStepProps = {
  code: string;
  status: "done" | "current" | "pending";
};

export default function MockupCapa2Colibri(): JSX.Element {
  const project: Project = {
    name: "Aurora Labs",
    id: "COL-AR-00231",
    tramoCode: "T2",
    tramoName: "Validación temprana",
    status: "En avance estructural",
    updatedAt: "2026-04-03",
    ic: 2.43,
    icMax: 6.0,
    uncertainty: "Mercado",
    primaryRisk: "Inexistencia de demanda",
    window: "4 meses",
    strategicQuestion: "¿El mercado realmente quiere esta solución?",
    currentPac: "T2-C6",
    approvedPacs: 5,
    totalPacs: 7,
    currentCategory: "C6 · Factores exógenos",
    microActions: 15,
    evidences: 5,
    densityNarrative: "El tramo muestra avance operativo con respaldo verificable.",
    realSignals: [
      { label: "Hay actividad verificable en el tramo actual", status: "done" },
      { label: "Existe evidencia aprobada en el recorrido del tramo", status: "done" },
      { label: "Ya se activaron categorías estructurales del tramo", status: "done" },
      { label: "Falta completar el cierre del PAC actual", status: "pending" },
    ],
    blockers: [
      "El PAC actual aún no cumple condición de cierre.",
      "Falta al menos una evidencia para consolidar el avance.",
      "La validación del tramo sigue incompleta.",
    ],
    categories: [
      { code: "C2", label: "Potencial del problema", status: "done" },
      { code: "C3", label: "Modelo de negocio", status: "done" },
      { code: "C6", label: "Factores exógenos", status: "current" },
      { code: "C7", label: "Métricas y tracción", status: "next" },
    ],
    pacProgress: [
      { code: "T2-C1", status: "done" },
      { code: "T2-C2", status: "done" },
      { code: "T2-C3", status: "done" },
      { code: "T2-C4", status: "done" },
      { code: "T2-C5", status: "done" },
      { code: "T2-C6", status: "current" },
      { code: "T2-C7", status: "pending" },
    ],
  };

  const progressPct = (project.approvedPacs / project.totalPacs) * 100;

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/90 px-6 py-5 shadow-2xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                Avance estructural del tramo
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

        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Cabecera analítica del tramo
                </div>
                <h2 className="text-2xl font-semibold text-slate-50 md:text-3xl">
                  {project.tramoCode} · {project.tramoName}
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-slate-200">
                  {project.strategicQuestion}
                </p>
              </div>

              <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-3 lg:max-w-2xl lg:text-right">
                <ContextRow label="Incertidumbre dominante" value={project.uncertainty} />
                <ContextRow label="Riesgo principal del tramo" value={project.primaryRisk} />
                <ContextRow label="Ventana estimada" value={project.window} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-7">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                      Avance por PAC
                    </div>
                    <div className="text-2xl font-semibold text-slate-50">{project.currentPac}</div>
                    <div className="mt-1 text-sm text-slate-400">
                      PAC actual · {project.currentCategory}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-left md:min-w-[220px] md:text-right">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      PACs cerrados
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-slate-50">
                      {project.approvedPacs} <span className="text-slate-400">de {project.totalPacs}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                    <span>Progreso estructural del tramo</span>
                    <span>{Math.round(progressPct)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
                  {project.pacProgress.map((item) => (
                    <PacStep key={item.code} code={item.code} status={item.status} />
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <div className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Categorías activadas
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.categories.map((category) => (
                    <StatusChip
                      key={category.code}
                      tone={
                        category.status === "done"
                          ? "success"
                          : category.status === "current"
                            ? "current"
                            : "pending"
                      }
                    >
                      <span className="font-medium">{category.code}</span>
                      <span className="mx-1.5 text-slate-500">·</span>
                      <span>{category.label}</span>
                      <span className="ml-2 text-xs opacity-80">
                        {category.status === "done"
                          ? "✓"
                          : category.status === "current"
                            ? "actual"
                            : "próxima"}
                      </span>
                    </StatusChip>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 xl:col-span-5">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <div className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Densidad de avance del tramo
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <MetricCard
                    label="Microacciones"
                    value={String(project.microActions)}
                    helper="Actividad visible"
                  />
                  <MetricCard
                    label="Evidencias aprobadas"
                    value={String(project.evidences)}
                    helper="Soporte probatorio"
                  />
                </div>
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-sm leading-relaxed text-slate-300">
                  {project.densityNarrative}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <div className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Señales de avance real
                </div>
                <div className="space-y-3">
                  {project.realSignals.map((signal, index) => (
                    <div
                      key={`${signal.label}-${index}`}
                      className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3"
                    >
                      <div
                        className={[
                          "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border text-xs font-semibold",
                          signal.status === "done"
                            ? "border-emerald-800/70 bg-emerald-950/70 text-emerald-300"
                            : "border-amber-800/70 bg-amber-950/70 text-amber-300",
                        ].join(" ")}
                      >
                        {signal.status === "done" ? "✓" : "○"}
                      </div>
                      <div className="text-sm leading-relaxed text-slate-200">{signal.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <div className="mb-4 flex flex-col gap-2">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Bloqueos abiertos
                  </div>
                  <div className="text-sm text-slate-400">
                    Riesgo principal del tramo: {project.primaryRisk}
                  </div>
                </div>
                <div className="space-y-3">
                  {project.blockers.map((blocker, index) => (
                    <div
                      key={`${blocker}-${index}`}
                      className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm leading-relaxed text-slate-200"
                    >
                      {blocker}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value, helper }: MetricCardProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="text-3xl font-semibold text-slate-50">{value}</div>
      <div className="mt-2 text-sm text-slate-400">{helper}</div>
    </div>
  );
}

function ContextRow({ label, value }: ContextRowProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-slate-100">{value}</div>
    </div>
  );
}

function StatusChip({ children, tone = "neutral" }: StatusChipProps): JSX.Element {
  const toneClasses = {
    neutral: "border-slate-700 bg-slate-950/50 text-slate-300",
    success: "border-emerald-800/60 bg-emerald-950/40 text-emerald-300",
    current: "border-cyan-800/60 bg-cyan-950/40 text-cyan-300",
    pending: "border-amber-800/60 bg-amber-950/40 text-amber-300",
  } as const;

  return (
    <div className={`rounded-full border px-4 py-2 text-sm ${toneClasses[tone]}`}>{children}</div>
  );
}

function PacStep({ code, status }: PacStepProps): JSX.Element {
  const statusClasses = {
    done: "border-emerald-800/60 bg-emerald-950/40 text-emerald-300",
    current: "border-cyan-800/60 bg-cyan-950/40 text-cyan-300",
    pending: "border-slate-700 bg-slate-950/50 text-slate-400",
  } as const;

  const marker = {
    done: "✓",
    current: "●",
    pending: "○",
  } as const;

  return (
    <div className={`rounded-2xl border px-3 py-3 text-sm ${statusClasses[status]}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{code}</span>
        <span className="text-xs">{marker[status]}</span>
      </div>
      <div className="mt-2 text-xs opacity-80">
        {status === "done" ? "cerrado" : status === "current" ? "actual" : "pendiente"}
      </div>
    </div>
  );
}

function NftAvatar({ size = "sm" }: { size?: "sm" | "lg" }): JSX.Element {
  const isLarge = size === "lg";

  return (
    <div
      className={[
        "relative flex items-center justify-center rounded-full border bg-slate-950",
        isLarge
          ? "h-64 w-64 border-cyan-800/50 shadow-[0_0_80px_rgba(34,211,238,0.16)]"
          : "h-12 w-12 border-cyan-800/50 shadow-[0_0_30px_rgba(34,211,238,0.14)]",
      ].join(" ")}
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.24),transparent_35%),radial-gradient(circle_at_50%_70%,rgba(16,185,129,0.16),transparent_40%)]" />
      <div
        className={[
          "relative rounded-full border border-slate-700 bg-slate-900/90",
          isLarge ? "h-40 w-40" : "h-8 w-8",
        ].join(" ")}
      >
        <div className="absolute left-1/2 top-[18%] h-[26%] w-[22%] -translate-x-1/2 rounded-full bg-cyan-300/90 blur-[1px]" />
        <div className="absolute left-[26%] top-[42%] h-[16%] w-[42%] rounded-full bg-emerald-300/85 blur-[1px]" />
        <div className="absolute right-[22%] top-[38%] h-[14%] w-[18%] rounded-full bg-amber-300/80 blur-[1px]" />
        <div className="absolute left-[28%] top-[50%] h-[10%] w-[34%] -rotate-[22deg] rounded-full bg-cyan-200/80" />
        <div className="absolute right-[22%] top-[52%] h-[8%] w-[22%] rotate-[18deg] rounded-full bg-emerald-200/80" />
      </div>
    </div>
  );
}
