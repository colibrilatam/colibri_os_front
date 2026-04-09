import { useState } from "react";

type Project = {
  name: string;
  id: string;
  tramoCode: string;
  tramoName: string;
  status: string;
  updatedAt: string;
  ic: number;
  icMax: number;
  currentPacId: string;
  totalVisiblePacs: number;
  microActions: number;
  evidences: number;
};

type PacStatus = "completed" | "current" | "pending";

type PacNode = {
  id: string;
  categoryCode: string;
  categoryName: string;
  title: string;
  objective: string;
  status: PacStatus;
  startedAt?: string;
  closedAt?: string;
  microActions: string[];
  evidenceLabel?: string;
  evidenceSummary?: string;
};

type SummaryCardProps = {
  label: string;
  value: string;
};

type TimelineNodeProps = {
  pac: PacNode;
  isSelected: boolean;
  isLast: boolean;
  onSelect: (id: string) => void;
};

type HitoItem = {
  date: string;
  label: string;
};

export default function MockupFuncionalCapa3Colibri(): JSX.Element {
  const project: Project = {
    name: "Aurora Labs",
    id: "COL-AR-00231",
    tramoCode: "T2",
    tramoName: "Validación temprana",
    status: "En avance estructural",
    updatedAt: "2026-04-03",
    ic: 2.43,
    icMax: 6.0,
    currentPacId: "T2-C6",
    totalVisiblePacs: 7,
    microActions: 15,
    evidences: 5,
  };

  const pacs: PacNode[] = [
    {
      id: "T2-C1",
      categoryCode: "C1",
      categoryName: "Equipo emprendedor",
      title: "Alineación del equipo base",
      objective: "Confirmar roles, coordinación y capacidad de respuesta operativa del equipo en etapa temprana.",
      status: "completed",
      startedAt: "2026-01-10",
      closedAt: "2026-01-22",
      microActions: [
        "Definición de roles y responsables críticos",
        "Sesión de ajuste de coordinación interna",
        "Registro de acuerdos operativos del equipo",
      ],
      evidenceLabel: "Evidencia aprobada #01",
      evidenceSummary: "Validación de estructura mínima del equipo y claridad de roles.",
    },
    {
      id: "T2-C2",
      categoryCode: "C2",
      categoryName: "Potencial del problema",
      title: "Contraste inicial del problema",
      objective: "Verificar que el problema observado sea real, relevante y suficientemente urgente para el mercado objetivo.",
      status: "completed",
      startedAt: "2026-01-24",
      closedAt: "2026-02-02",
      microActions: [
        "Entrevistas con usuarios objetivo",
        "Registro de señales de urgencia del problema",
        "Síntesis de hallazgos de validación temprana",
      ],
      evidenceLabel: "Evidencia aprobada #02",
      evidenceSummary: "Señales consistentes de dolor de usuario y relevancia del problema.",
    },
    {
      id: "T2-C3",
      categoryCode: "C3",
      categoryName: "Modelo de negocio",
      title: "Ajuste preliminar de propuesta de valor",
      objective: "Ordenar la propuesta de valor y su conexión con el segmento objetivo antes de escalar pruebas.",
      status: "completed",
      startedAt: "2026-02-03",
      closedAt: "2026-02-11",
      microActions: [
        "Reformulación del mensaje principal",
        "Contraste de propuesta con usuarios tempranos",
        "Ajuste de hipótesis de segmento prioritario",
      ],
      evidenceLabel: "Evidencia aprobada #03",
      evidenceSummary: "Coherencia inicial entre problema, solución y segmento objetivo.",
    },
    {
      id: "T2-C4",
      categoryCode: "C4",
      categoryName: "Finanzas",
      title: "Estimación inicial de viabilidad financiera",
      objective: "Comprobar si la estructura inicial de costos y esfuerzo requerido es compatible con la etapa actual.",
      status: "completed",
      startedAt: "2026-02-12",
      closedAt: "2026-02-20",
      microActions: [
        "Levantamiento de costos críticos",
        "Mapa de necesidades operativas mínimas",
        "Revisión de tensión entre alcance y recursos",
      ],
      evidenceLabel: "Evidencia aprobada #04",
      evidenceSummary: "Justificación básica del esfuerzo y recursos requeridos para avanzar.",
    },
    {
      id: "T2-C5",
      categoryCode: "C5",
      categoryName: "Timing y estrategia",
      title: "Lectura del momento estratégico",
      objective: "Evaluar si el proyecto está atacando el problema en un momento razonable y con una dirección estratégica coherente.",
      status: "completed",
      startedAt: "2026-02-21",
      closedAt: "2026-03-02",
      microActions: [
        "Revisión de ventana de oportunidad",
        "Análisis comparado del entorno competitivo",
        "Definición de prioridad táctica inmediata",
      ],
      evidenceLabel: "Evidencia aprobada #05",
      evidenceSummary: "Alineación aceptable entre contexto de mercado y decisión estratégica.",
    },
    {
      id: "T2-C6",
      categoryCode: "C6",
      categoryName: "Factores exógenos",
      title: "Validación de señales críticas del entorno",
      objective: "Contrastar variables externas que podrían afectar la validación del tramo y documentar sus implicancias operativas.",
      status: "current",
      startedAt: "2026-03-03",
      microActions: [
        "Identificación de señales regulatorias relevantes",
        "Revisión de condiciones externas que afectan la demanda",
        "Registro de evidencia contextual del entorno",
      ],
      evidenceLabel: "Evidencia en preparación",
      evidenceSummary: "El PAC sigue abierto y requiere consolidar señal probatoria suficiente para cierre.",
    },
    {
      id: "T2-C7",
      categoryCode: "C7",
      categoryName: "Métricas y tracción",
      title: "Lectura inicial de tracción verificable",
      objective: "Consolidar indicadores tempranos que permitan distinguir actividad de señal estructural real.",
      status: "pending",
      microActions: [
        "Pendiente de apertura",
        "Pendiente de definición de métricas iniciales",
        "Pendiente de evidencia de cierre",
      ],
    },
  ];

  const hitos: HitoItem[] = [
    { date: "2026-02-11", label: "Cierre de T2-C3" },
    { date: "2026-03-02", label: "Evidencia aprobada #05" },
    { date: "2026-03-03", label: "Apertura de T2-C6" },
  ];

  const [selectedPacId, setSelectedPacId] = useState<string>(project.currentPacId);

  const selectedPac = pacs.find((pac) => pac.id === selectedPacId) ?? pacs[0];
  const icPct = (project.ic / project.icMax) * 100;

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/90 px-6 py-5 shadow-2xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                Trayectoria operativa por PAC
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
                      <div className="pb-0.5 text-sm text-slate-400">/ {project.icMax.toFixed(2)}</div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-400"
                        style={{ width: `${icPct}%` }}
                      />
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

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                Trayectoria operativa del tramo
              </div>
              <h2 className="text-2xl font-semibold text-slate-50">
                {project.tramoCode} · {project.tramoName}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Esta capa muestra unidades de trabajo verificables recorridas por el proyecto dentro del tramo actual.
                No describe una narrativa expandida del recorrido; organiza la trayectoria operativa visible.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <SummaryCard label="PAC actual" value={project.currentPacId} />
              <SummaryCard label="PACs visibles" value={String(project.totalVisiblePacs)} />
              <SummaryCard label="Microacciones" value={String(project.microActions)} />
              <SummaryCard label="Evidencias" value={String(project.evidences)} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                Secuencia operativa por PAC
              </div>
              <h3 className="text-xl font-semibold text-slate-50">Timeline estructural del tramo</h3>
            </div>
            <div className="text-sm text-slate-500">
              ● completado · ◉ actual · ○ pendiente
            </div>
          </div>

          <div className="hidden xl:block">
            <div className="grid grid-cols-7 gap-3">
              {pacs.map((pac, index) => (
                <TimelineNode
                  key={pac.id}
                  pac={pac}
                  isSelected={pac.id === selectedPacId}
                  isLast={index === pacs.length - 1}
                  onSelect={setSelectedPacId}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3 xl:hidden">
            {pacs.map((pac, index) => (
              <TimelineRowMobile
                key={pac.id}
                pac={pac}
                isSelected={pac.id === selectedPacId}
                isLast={index === pacs.length - 1}
                onSelect={setSelectedPacId}
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl xl:col-span-4">
            <div className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">
              Hitos principales del recorrido
            </div>

            <div className="space-y-4">
              {hitos.map((hito, index) => (
                <div key={`${hito.date}-${index}`} className="flex gap-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  <div>
                    <div className="text-sm font-medium text-slate-100">{hito.label}</div>
                    <div className="mt-1 text-sm text-slate-500">{hito.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl xl:col-span-8">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Detalle del PAC seleccionado
                </div>
                <h3 className="text-2xl font-semibold text-slate-50">
                  {selectedPac.id} · {selectedPac.categoryCode}
                </h3>
                <p className="mt-1 text-sm text-slate-400">{selectedPac.categoryName}</p>
              </div>

              <StatusBadge status={selectedPac.status} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                    Título del PAC
                  </div>
                  <div className="text-lg font-medium text-slate-100">{selectedPac.title}</div>

                  <div className="mt-5 mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                    Objetivo estructural
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{selectedPac.objective}</p>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                    Microacciones ejecutadas
                  </div>
                  <div className="space-y-3">
                    {selectedPac.microActions.map((action, index) => (
                      <div key={`${selectedPac.id}-action-${index}`} className="flex gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                        <div className="text-sm leading-6 text-slate-300">{action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                    Señal probatoria visible
                  </div>
                  <div className="text-base font-medium text-slate-100">
                    {selectedPac.evidenceLabel ?? "Sin evidencia visible"}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {selectedPac.evidenceSummary ?? "Este PAC aún no expone una evidencia curada para visualización."}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                    Corte temporal
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">Inicio</span>
                      <span>{selectedPac.startedAt ?? "—"}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">Cierre</span>
                      <span>{selectedPac.closedAt ?? "—"}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                    Lectura de diseño
                  </div>
                  <p className="text-sm leading-6 text-slate-400">
                    La profundidad de esta capa se concentra en una unidad operativa seleccionada. El timeline organiza la trayectoria; el panel lateral sostiene la verificabilidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: SummaryCardProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 text-lg font-medium text-slate-100">{value}</div>
    </div>
  );
}

function TimelineNode({ pac, isSelected, isLast, onSelect }: TimelineNodeProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onSelect(pac.id)}
      className={[
        "group relative rounded-2xl border p-4 text-left transition",
        isSelected
          ? "border-cyan-700 bg-slate-950 shadow-[0_0_0_1px_rgba(8,145,178,0.35)]"
          : "border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-950",
      ].join(" ")}
    >
      {!isLast && (
        <div className="pointer-events-none absolute left-[calc(100%-8px)] top-[39px] hidden h-px w-6 bg-slate-700 2xl:block" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-100">{pac.id}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{pac.categoryCode}</div>
        </div>
        <NodeGlyph status={pac.status} />
      </div>

      <div className="mt-4 text-sm font-medium leading-5 text-slate-200">{pac.title}</div>
      <div className="mt-2 text-sm text-slate-500">{pac.categoryName}</div>
      <div className="mt-4 text-xs text-slate-500">{statusLabel(pac.status)}</div>
    </button>
  );
}

function TimelineRowMobile({ pac, isSelected, isLast, onSelect }: TimelineNodeProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onSelect(pac.id)}
      className={[
        "w-full rounded-2xl border p-4 text-left transition",
        isSelected
          ? "border-cyan-700 bg-slate-950 shadow-[0_0_0_1px_rgba(8,145,178,0.35)]"
          : "border-slate-800 bg-slate-950/50",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <NodeGlyph status={pac.status} />
          {!isLast && <div className="mt-2 h-10 w-px bg-slate-700" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-semibold text-slate-100">{pac.id}</div>
            <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[11px] uppercase tracking-[0.16em] text-slate-400">
              {pac.categoryCode}
            </span>
          </div>
          <div className="mt-2 text-sm font-medium leading-6 text-slate-200">{pac.title}</div>
          <div className="mt-1 text-sm text-slate-500">{pac.categoryName}</div>
          <div className="mt-2 text-xs text-slate-500">{statusLabel(pac.status)}</div>
        </div>
      </div>
    </button>
  );
}

function StatusBadge({ status }: { status: PacStatus }): JSX.Element {
  const styles: Record<PacStatus, string> = {
    completed: "border-emerald-800/60 bg-emerald-950/50 text-emerald-300",
    current: "border-cyan-800/60 bg-cyan-950/40 text-cyan-300",
    pending: "border-slate-700 bg-slate-800 text-slate-300",
  };

  return (
    <span className={["rounded-full border px-3 py-1.5 text-sm", styles[status]].join(" ")}>
      {statusLabel(status)}
    </span>
  );
}

function NodeGlyph({ status }: { status: PacStatus }): JSX.Element {
  if (status === "completed") {
    return <div className="h-4 w-4 rounded-full border border-emerald-400 bg-emerald-400" />;
  }

  if (status === "current") {
    return (
      <div className="flex h-4 w-4 items-center justify-center rounded-full border border-cyan-400 bg-slate-950">
        <div className="h-2 w-2 rounded-full bg-cyan-400" />
      </div>
    );
  }

  return <div className="h-4 w-4 rounded-full border border-slate-500 bg-transparent" />;
}

function NftAvatar({ size = "sm" }: { size?: "sm" | "lg" }): JSX.Element {
  const isLarge = size === "lg";

  return (
    <div
      className={[
        "relative flex items-center justify-center rounded-full border bg-slate-950",
        isLarge
          ? "h-64 w-64 border-cyan-800/50 shadow-[0_0_80px_rgba(34,211,238,0.18)]"
          : "h-11 w-11 border-cyan-800/50 shadow-[0_0_20px_rgba(34,211,238,0.16)]",
      ].join(" ")}
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.16),transparent_45%),radial-gradient(circle_at_50%_60%,rgba(16,185,129,0.12),transparent_50%)]" />
      <div
        className={[
          "relative rounded-full border border-slate-700 bg-slate-900",
          isLarge ? "h-52 w-52" : "h-8 w-8",
        ].join(" ")}
      >
        <div className="absolute inset-x-[24%] top-[18%] h-[20%] rounded-full bg-cyan-300/80 blur-[2px]" />
        <div className="absolute left-[22%] top-[32%] h-[28%] w-[38%] rounded-[55%_45%_50%_50%] bg-cyan-400/80" />
        <div className="absolute right-[18%] top-[34%] h-[24%] w-[28%] rounded-[50%_50%_60%_40%] bg-emerald-400/75" />
        <div className="absolute left-[40%] top-[44%] h-[28%] w-[12%] rounded-full bg-amber-300/80" />
        <div className="absolute bottom-[18%] left-[30%] h-[10%] w-[40%] rounded-full bg-slate-700/80" />
      </div>
    </div>
  );
}

function statusLabel(status: PacStatus): string {
  switch (status) {
    case "completed":
      return "Completado";
    case "current":
      return "En tránsito";
    case "pending":
      return "Pendiente";
    default:
      return "Pendiente";
  }
}
