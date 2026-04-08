type Project = {
  name: string;
  id: string;
  nftTramo: string;
  ic: number;
  icMax: number;
  icNarrative: string;
  variationLabel: string;
  variationValue: number;
  snapshotDate: string;
  algorithmVersion: string;
  dimensions: Array<{
    key: string;
    label: string;
    raw: number;
    weight: number;
    weighted: number;
  }>;
  events: Array<{
    date: string;
    title: string;
    impact: string;
    description: string;
  }>;
};

type DimensionRowProps = {
  label: string;
  raw: number;
  weight: number;
  weighted: number;
  max?: number;
};

type ExecutiveInsightProps = {
  label: string;
  value: string;
  helper: string;
};

type EventItemProps = {
  date: string;
  title: string;
  impact: string;
  description: string;
};

type RadarChartProps = {
  values: Array<{
    label: string;
    value: number;
  }>;
  size?: number;
  levels?: number;
  max?: number;
};

type RadarSummaryItemProps = {
  label: string;
  value: string;
  helper: string;
  tone?: "neutral" | "positive" | "warning";
};


export default function MockupFuncionalCapa1Colibri(): JSX.Element {
  const project: Project = {
    name: "Aurora Labs",
    id: "COL-AR-00231",
    nftTramo: "T2",
    ic: 2.43,
    icMax: 6.0,
    icNarrative: "T2 en tránsito a T3",
    variationLabel: "+0.18 en los últimos 30 días",
    variationValue: 0.18,
    snapshotDate: "2026-04-03",
    algorithmVersion: "v1.3",
    dimensions: [
      { key: "action", label: "Acción", raw: 3.8, weight: 0.22, weighted: 0.84 },
      { key: "evidence", label: "Evidencia", raw: 4.1, weight: 0.26, weighted: 1.07 },
      { key: "consistency", label: "Constancia", raw: 2.9, weight: 0.2, weighted: 0.58 },
      { key: "collaboration", label: "Colaboración", raw: 2.1, weight: 0.16, weighted: 0.34 },
      { key: "sustainability", label: "Sostenibilidad", raw: 2.5, weight: 0.16, weighted: 0.4 },
    ],
    events: [
      {
        date: "2026-04-02",
        title: "Evidencia validada",
        impact: "Impacta Evidencia",
        description: "Se aprobó evidencia asociada al PAC T2-C6.",
      },
      {
        date: "2026-03-29",
        title: "Constancia reciente",
        impact: "Impacta Constancia",
        description: "Se sostuvieron microacciones verificables en 3 cortes seguidos.",
      },
      {
        date: "2026-03-25",
        title: "Colaboración verificable",
        impact: "Impacta Colaboración",
        description: "Se registró interacción validada con agente externo relevante.",
      },
    ],
  };

  const icPct = (project.ic / project.icMax) * 100;
  const variationIsPositive = project.variationValue >= 0;

  const leader = project.dimensions.reduce((max, item) =>
    item.weighted > max.weighted ? item : max,
  );
  const weakest = project.dimensions.reduce((min, item) =>
    item.weighted < min.weighted ? item : min,
  );
  const recentImprovement = project.dimensions.find((item) => item.key === "consistency") ?? leader;
  const mainLag = project.dimensions.find((item) => item.key === "sustainability") ?? weakest;

  const strongestTwo = [...project.dimensions]
    .sort((a, b) => b.weighted - a.weighted)
    .slice(0, 2)
    .map((item) => item.label)
    .join(", ");

  const weakestTwo = [...project.dimensions]
    .sort((a, b) => a.weighted - b.weighted)
    .slice(0, 2)
    .map((item) => item.label)
    .join(", ");

  const radarValues = project.dimensions.map((item) => ({
    label: item.label,
    value: item.raw,
  }));

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/90 px-6 py-5 shadow-2xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                Reputación actual y composición del IC
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
                      {project.nftTramo} · {project.icNarrative}
                    </span>
                    <span className="rounded-full border border-emerald-800/60 bg-emerald-950/60 px-3 py-1 text-emerald-300">
                      En avance estructural
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
                    <div className="mt-1 text-base text-slate-200">{project.snapshotDate}</div>
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
                  Composición sintética
                </div>
                <h2 className="text-xl font-semibold text-slate-50">Radar reputacional</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Lectura visual y sintética de las 5 dimensiones del IC
                </p>
              </div>
              <span className="rounded-full border border-cyan-800/70 bg-cyan-950/40 px-3 py-1 text-xs text-cyan-300">
                5 dimensiones
              </span>
            </div>

            <div className="relative flex h-[320px] items-center justify-center overflow-hidden rounded-[28px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_50%_55%,rgba(16,185,129,0.10),transparent_34%)]" />
              <RadarChart values={radarValues} size={320} levels={4} max={5} />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              El radar opera como síntesis visual. No sustituye el desglose auditable por dimensión.
            </p>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <RadarSummaryItem
                  label="Sostiene hoy"
                  value={strongestTwo}
                  helper="Dimensiones con mayor aporte reputacional actual."
                  tone="positive"
                />
                <RadarSummaryItem
                  label="Frena hoy"
                  value={weakestTwo}
                  helper="Dimensiones con menor contribución relativa hoy."
                  tone="warning"
                />
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/35 p-5">
              <div className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                Lectura reputacional ejecutiva
              </div>
              <div className="grid grid-cols-1 gap-4">
                <ExecutiveInsight
                  label="Dimensión líder"
                  value={leader.label}
                  helper="Sostiene el mayor aporte reputacional visible hoy."
                />
                <ExecutiveInsight
                  label="Dimensión más débil"
                  value={weakest.label}
                  helper="Su contribución actual se mantiene por debajo del resto."
                />
                <ExecutiveInsight
                  label="Mejora reciente"
                  value={recentImprovement.label}
                  helper="Registra continuidad verificable en las últimas semanas."
                />
                <ExecutiveInsight
                  label="Principal rezago"
                  value={mainLag.label}
                  helper="Todavía no convierte continuidad en solidez estructural."
                />
              </div>
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
                  <div
                    className={[
                      "mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
                      variationIsPositive
                        ? "border-emerald-800/60 bg-emerald-950/50 text-emerald-300"
                        : "border-rose-800/60 bg-rose-950/50 text-rose-300",
                    ].join(" ")}
                  >
                    <span>{variationIsPositive ? "▲" : "▼"}</span>
                    <span>{project.variationLabel}</span>
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
                    {[24, 28, 33, 36, 42, 46, 52].map((value: number, index: number) => (
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
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                    Desglose composicional del IC
                  </div>
                  <h2 className="text-xl font-semibold text-slate-50">Composición auditable actual</h2>
                </div>
                <div className="text-sm text-slate-400">
                  Valor bruto + peso metodológico + aporte ponderado
                </div>
              </div>

              <div className="space-y-4">
                {project.dimensions.map((dimension) => (
                  <DimensionRow
                    key={dimension.key}
                    label={dimension.label}
                    raw={dimension.raw}
                    weight={dimension.weight}
                    weighted={dimension.weighted}
                    max={5}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <div className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Eventos recientes que alteran reputación
                </div>
                <div className="space-y-4">
                  {project.events.map((event) => (
                    <EventItem
                      key={`${event.date}-${event.title}`}
                      date={event.date}
                      title={event.title}
                      impact={event.impact}
                      description={event.description}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                Nota metodológica
              </div>
              <div className="text-lg font-medium text-slate-100">
                Algoritmo IC vigente: {project.algorithmVersion}
              </div>
              <div className="mt-2 text-sm text-slate-400">
                Ponderación reputacional activa para snapshot {project.snapshotDate}.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DimensionRow({ label, raw, weight, weighted, max = 5 }: DimensionRowProps): JSX.Element {
  const pct = (raw / max) * 100;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="w-full lg:max-w-[180px]">
          <div className="text-sm font-medium text-slate-100">{label}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
            Valor bruto {raw.toFixed(1)}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
            <span>Escala relativa</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:w-[200px] lg:grid-cols-1 lg:gap-2 lg:text-right">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Peso</div>
            <div className="text-base font-medium text-slate-200">{Math.round(weight * 100)}%</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Aporte
            </div>
            <div className="text-base font-medium text-slate-50">{weighted.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExecutiveInsight({ label, value, helper }: ExecutiveInsightProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="text-lg font-medium text-slate-100">{value}</div>
      <div className="mt-2 text-sm text-slate-400">{helper}</div>
    </div>
  );
}

function EventItem({ date, title, impact, description }: EventItemProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-100">{title}</div>
          <div className="mt-1 text-sm text-slate-400">{description}</div>
        </div>
        <div className="shrink-0 text-left md:text-right">
          <div className="text-sm text-slate-300">{date}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-300">{impact}</div>
        </div>
      </div>
    </div>
  );
}

function RadarSummaryItem({
  label,
  value,
  helper,
  tone = "neutral",
}: RadarSummaryItemProps): JSX.Element {
  const toneClasses =
    tone === "positive"
      ? "border-emerald-800/40 bg-emerald-950/20"
      : tone === "warning"
        ? "border-amber-800/40 bg-amber-950/20"
        : "border-slate-800 bg-slate-950/50";

  return (
    <div className={`rounded-2xl border p-4 ${toneClasses}`}>
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="text-lg font-medium text-slate-100">{value}</div>
      <div className="mt-2 text-sm text-slate-400">{helper}</div>
    </div>
  );
}

function RadarChart({ values, size = 280, levels = 4, max = 5 }: RadarChartProps): JSX.Element {
  const center = size / 2;
  const radius = size * 0.34;
  const labelRadius = radius + 26;
  const angleStep = (Math.PI * 2) / values.length;

  const levelPolygons = Array.from({ length: levels }, (_, index) => {
    const levelRadius = ((index + 1) / levels) * radius;
    return values
      .map((_, pointIndex) => {
        const angle = -Math.PI / 2 + pointIndex * angleStep;
        const x = center + Math.cos(angle) * levelRadius;
        const y = center + Math.sin(angle) * levelRadius;
        return `${x},${y}`;
      })
      .join(" ");
  });

  const dataPolygon = values
    .map((item, index) => {
      const angle = -Math.PI / 2 + index * angleStep;
      const pointRadius = (item.value / max) * radius;
      const x = center + Math.cos(angle) * pointRadius;
      const y = center + Math.sin(angle) * pointRadius;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex items-center justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-[280px] w-[280px] overflow-visible">
        {levelPolygons.map((points, index) => (
          <polygon
            key={`level-${index}`}
            points={points}
            fill="none"
            stroke="rgba(148,163,184,0.22)"
            strokeWidth="1"
          />
        ))}

        {values.map((item, index) => {
          const angle = -Math.PI / 2 + index * angleStep;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          const labelX = center + Math.cos(angle) * labelRadius;
          const labelY = center + Math.sin(angle) * labelRadius;

          return (
            <g key={item.label}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(148,163,184,0.22)"
                strokeWidth="1"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor={labelX < center - 4 ? "end" : labelX > center + 4 ? "start" : "middle"}
                dominantBaseline="middle"
                fill="rgba(203,213,225,0.9)"
                fontSize="11"
              >
                {item.label}
              </text>
            </g>
          );
        })}

        <polygon
          points={dataPolygon}
          fill="rgba(34,211,238,0.18)"
          stroke="rgba(34,211,238,0.95)"
          strokeWidth="2"
        />

        {values.map((item, index) => {
          const angle = -Math.PI / 2 + index * angleStep;
          const pointRadius = (item.value / max) * radius;
          const x = center + Math.cos(angle) * pointRadius;
          const y = center + Math.sin(angle) * pointRadius;

          return <circle key={`${item.label}-point`} cx={x} cy={y} r="3.5" fill="rgb(34,211,238)" />;
        })}

        <circle cx={center} cy={center} r="2.5" fill="rgba(148,163,184,0.8)" />
      </svg>
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
          ? "h-64 w-64 border-cyan-800/50 shadow-[0_0_80px_rgba(34,211,238,0.18)]"
          : "h-12 w-12 border-cyan-800/50 shadow-[0_0_24px_rgba(34,211,238,0.14)]",
      ].join(" ")}
    >
      <div className="absolute inset-[10%] rounded-full border border-cyan-700/30" />
      <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.28),transparent_42%),radial-gradient(circle_at_50%_65%,rgba(16,185,129,0.22),transparent_44%)]" />
      <div className={isLarge ? "scale-[1.25]" : "scale-100"}>
        <svg
          width={isLarge ? "120" : "28"}
          height={isLarge ? "120" : "28"}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M74 29C58 34 46 47 42 65C49 60 56 59 64 61C54 67 48 76 46 88C59 79 66 71 72 58C74 68 80 76 92 81C90 67 84 57 74 50C84 49 92 45 98 37C88 35 81 33 74 29Z"
            className="fill-cyan-300"
          />
          <circle cx="78" cy="43" r="3.2" className="fill-slate-950" />
          <path d="M23 82C37 83 46 79 55 70" stroke="rgb(16 185 129)" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
