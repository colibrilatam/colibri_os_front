import { useState } from "react";

type EvidenceRow = {
  id: string;
  title: string;
  pac: string;
  category: string;
  status: "Aprobada" | "En revisión" | "Observada";
  approvedAt: string;
  mentor: string;
  role: string;
  summary: string;
  sourceLabel: string;
  sourceType: string;
  evaluationResult: string;
  evaluationScore: string;
  evaluationComment: string;
  version: string;
};

type CompetencySignal = {
  label: string;
  value: number;
};

type SkillSignal = {
  label: string;
  level: string;
};

type FilterKey = "all" | "Aprobada" | "En revisión" | "Observada";

export default function MockupCapa4Colibri(): JSX.Element {
  const project = {
    name: "Aurora Labs",
    id: "COL-AR-00231",
    tramoCode: "T2",
    tramoName: "Validación temprana",
    status: "En avance estructural",
    updatedAt: "2026-04-03",
    ic: 2.43,
    icMax: 6.0,
    nftState: "T2",
    evidenceCount: 5,
    proofState: "Base validada en consolidación",
    latestEvidence: "Entrevistas fundacionales con usuarios tempranos",
    latestEvidenceDate: "2026-04-02",
    currentPac: "T2-C6",
    nextRequirement: "Evidencia comparativa de validación de mercado",
    approver: "Laura Méndez",
    approverRole: "Mentor de validación",
    evaluationResult: "Aprobada con observaciones",
    evaluationDate: "2026-04-02",
    evaluationComment:
      "Evidencia consistente, decisión clara y aprendizaje visible respecto al segmento objetivo.",
    affectedCategories: ["C2", "C7"],
    structuralReading: "Evidencia concentrada en validación de mercado y señales tempranas de tracción.",
  };

  const evidenceRows: EvidenceRow[] = [
    {
      id: "EV-201",
      title: "Entrevistas fundacionales con usuarios tempranos",
      pac: "T2-C6",
      category: "C2",
      status: "Aprobada",
      approvedAt: "2026-04-02",
      mentor: "Laura Méndez",
      role: "Mentor de validación",
      summary:
        "Tres entrevistas estructuradas con usuarios potenciales que confirman dolor recurrente y lenguaje de problema compartido.",
      sourceLabel: "Abrir documento fuente",
      sourceType: "PDF validado",
      evaluationResult: "Aprobada con observaciones",
      evaluationScore: "8.8 / 10",
      evaluationComment:
        "La evidencia muestra coherencia entre hipótesis inicial y feedback real, aunque aún falta ampliar contraste competitivo.",
      version: "v1.3",
    },
    {
      id: "EV-194",
      title: "Matriz comparativa de señales de mercado",
      pac: "T2-C6",
      category: "C2",
      status: "Aprobada",
      approvedAt: "2026-03-29",
      mentor: "Laura Méndez",
      role: "Mentor de validación",
      summary:
        "Comparación entre hipótesis de valor, objeciones de usuarios y señales de disposición a probar la solución.",
      sourceLabel: "Abrir documento fuente",
      sourceType: "Hoja validada",
      evaluationResult: "Aprobada",
      evaluationScore: "8.4 / 10",
      evaluationComment:
        "Buena trazabilidad entre observación y decisión. Conviene reforzar evidencia de rechazo explícito.",
      version: "v1.1",
    },
    {
      id: "EV-188",
      title: "Registro de feedback temprano y patrones de rechazo",
      pac: "T2-C5",
      category: "C7",
      status: "Aprobada",
      approvedAt: "2026-03-21",
      mentor: "Iván Rojas",
      role: "Mentor de seguimiento",
      summary:
        "Bitácora de respuestas de usuarios con clasificación de objeciones, aceptación y ambigüedad.",
      sourceLabel: "Abrir documento fuente",
      sourceType: "Bitácora estructurada",
      evaluationResult: "Aprobada",
      evaluationScore: "8.1 / 10",
      evaluationComment:
        "Buen registro de fricción. La calidad mejora porque diferencia claramente interés de intención de uso.",
      version: "v2.0",
    },
    {
      id: "EV-176",
      title: "Mapa de microacciones de contraste de segmento",
      pac: "T2-C5",
      category: "C2",
      status: "En revisión",
      approvedAt: "2026-03-18",
      mentor: "Iván Rojas",
      role: "Mentor de seguimiento",
      summary:
        "Secuencia de microacciones ejecutadas para contrastar hipótesis de usuario prioritario.",
      sourceLabel: "Abrir documento fuente",
      sourceType: "Documento operativo",
      evaluationResult: "En revisión",
      evaluationScore: "Pendiente",
      evaluationComment:
        "La secuencia está bien documentada, pero falta una relación más explícita entre acción y resultado observado.",
      version: "v0.9",
    },
    {
      id: "EV-169",
      title: "Síntesis de observaciones de mentoría de mercado",
      pac: "T2-C4",
      category: "C7",
      status: "Observada",
      approvedAt: "2026-03-12",
      mentor: "Ana Beltrán",
      role: "Mentor externo",
      summary:
        "Resumen de observaciones sobre formulación de propuesta de valor y señales débiles de tracción.",
      sourceLabel: "Abrir documento fuente",
      sourceType: "Nota evaluativa",
      evaluationResult: "Observada",
      evaluationScore: "6.9 / 10",
      evaluationComment:
        "Hay lectura útil del mercado, pero aún no se sostiene suficientemente con evidencia comparativa.",
      version: "v1.0",
    },
  ];

  const competencies: CompetencySignal[] = [
    { label: "Aprendizaje experiencial", value: 82 },
    { label: "Gestión de incertidumbre", value: 74 },
    { label: "Coordinación", value: 68 },
    { label: "Iniciativa", value: 61 },
  ];

  const skills: SkillSignal[] = [
    { label: "Pensamiento crítico", level: "Alta" },
    { label: "Colaboración", level: "Media-alta" },
    { label: "Confiabilidad", level: "Media" },
    { label: "Empatía", level: "Media" },
  ];

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "Todas" },
    { key: "Aprobada", label: "Aprobadas" },
    { key: "En revisión", label: "En revisión" },
    { key: "Observada", label: "Observadas" },
  ];

  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(evidenceRows[0].id);

  const filteredRows =
    activeFilter === "all"
      ? evidenceRows
      : evidenceRows.filter((row: EvidenceRow) => row.status === activeFilter);

  const selectedEvidence =
    filteredRows.find((row: EvidenceRow) => row.id === selectedEvidenceId) ?? filteredRows[0] ?? evidenceRows[0];

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/90 px-6 py-5 shadow-2xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                Evidencia, competencias y trazabilidad
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
          <div className="space-y-6 xl:col-span-7">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-8">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl lg:col-span-5">
                <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Estado actual de prueba
                </div>
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-end gap-3">
                      <div className="text-5xl font-semibold text-slate-50">{project.evidenceCount}</div>
                      <div className="pb-1 text-base text-slate-400">evidencias aprobadas</div>
                    </div>
                    <div className="mt-3 inline-flex rounded-full border border-cyan-800/60 bg-cyan-950/40 px-3 py-1.5 text-sm text-cyan-300">
                      {project.proofState}
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                      <p>
                        <span className="text-slate-500">Última evidencia:</span> {project.latestEvidence}
                      </p>
                      <p>
                        <span className="text-slate-500">Aprobada:</span> {project.latestEvidenceDate}
                      </p>
                    </div>
                  </div>

                  <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 p-4 md:max-w-xs">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Próximo requisito crítico
                    </div>
                    <div className="mt-2 text-base font-medium text-slate-100">{project.nextRequirement}</div>
                    <div className="mt-4 text-sm text-slate-400">PAC actual: {project.currentPac}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl lg:col-span-3">
                <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Validación asociada
                </div>
                <div className="space-y-3 text-sm text-slate-300">
                  <div>
                    <div className="text-slate-500">Aprobado por</div>
                    <div className="mt-1 text-base font-medium text-slate-100">{project.approver}</div>
                    <div className="text-slate-400">{project.approverRole}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Resultado</div>
                    <div className="mt-1 text-base text-slate-100">{project.evaluationResult}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Fecha</div>
                    <div className="mt-1 text-slate-100">{project.evaluationDate}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3 text-slate-300">
                    {project.evaluationComment}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex flex-col gap-4 border-b border-slate-800 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                    Evidencia trazable
                  </div>
                  <h2 className="text-xl font-semibold text-slate-50">Base probatoria verificable</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => {
                    const isActive = activeFilter === filter.key;
                    return (
                      <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={[
                          "rounded-full border px-3 py-1.5 text-sm transition",
                          isActive
                            ? "border-cyan-700 bg-cyan-950/50 text-cyan-300"
                            : "border-slate-700 bg-slate-950/40 text-slate-300 hover:border-slate-600 hover:text-slate-100",
                        ].join(" ")}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800">
                <div className="hidden grid-cols-[2.2fr,0.7fr,0.7fr,0.9fr,0.9fr,1fr,0.8fr] gap-3 border-b border-slate-800 bg-slate-950/70 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-slate-500 md:grid">
                  <div>Evidencia</div>
                  <div>PAC</div>
                  <div>Categoría</div>
                  <div>Estado</div>
                  <div>Fecha</div>
                  <div>Mentor</div>
                  <div>Fuente</div>
                </div>

                <div className="divide-y divide-slate-800">
                  {filteredRows.map((row: EvidenceRow) => {
                    const isSelected = selectedEvidence.id === row.id;
                    return (
                      <button
                        key={row.id}
                        onClick={() => setSelectedEvidenceId(row.id)}
                        className={[
                          "grid w-full grid-cols-1 gap-3 px-4 py-4 text-left transition md:grid-cols-[2.2fr,0.7fr,0.7fr,0.9fr,0.9fr,1fr,0.8fr] md:items-center",
                          isSelected ? "bg-slate-950/70" : "bg-slate-900 hover:bg-slate-950/45",
                        ].join(" ")}
                      >
                        <div>
                          <div className="font-medium text-slate-100">{row.title}</div>
                          <div className="mt-1 text-sm text-slate-400 md:hidden">{row.summary}</div>
                        </div>
                        <div className="text-sm text-slate-300">{row.pac}</div>
                        <div className="text-sm text-slate-300">{row.category}</div>
                        <div>
                          <StatusBadge status={row.status} />
                        </div>
                        <div className="text-sm text-slate-300">{row.approvedAt}</div>
                        <div className="text-sm text-slate-300">{row.mentor}</div>
                        <div className="text-sm text-cyan-300">Ver</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 xl:col-span-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                Detalle de trazabilidad
              </div>
              <div className="space-y-5">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold leading-snug text-slate-50">
                      {selectedEvidence.title}
                    </h3>
                    <span className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                      {selectedEvidence.version}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{selectedEvidence.summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <DetailStat label="PAC asociado" value={selectedEvidence.pac} />
                  <DetailStat label="Categoría troncal" value={selectedEvidence.category} />
                  <DetailStat label="Resultado" value={selectedEvidence.evaluationResult} />
                  <DetailStat label="Score" value={selectedEvidence.evaluationScore} />
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Evaluación asociada
                  </div>
                  <div className="text-sm leading-6 text-slate-300">{selectedEvidence.evaluationComment}</div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                    <span>{selectedEvidence.mentor}</span>
                    <span>·</span>
                    <span>{selectedEvidence.role}</span>
                    <span>·</span>
                    <span>{selectedEvidence.approvedAt}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Historial de versiones
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <VersionRow version={selectedEvidence.version} label="Versión vigente" date={selectedEvidence.approvedAt} />
                    <VersionRow version="v1.0" label="Primera carga trazable" date="2026-03-14" />
                    <VersionRow version="v0.8" label="Borrador de contraste inicial" date="2026-03-10" />
                  </div>
                </div>

                <button className="w-full rounded-2xl border border-cyan-800/60 bg-cyan-950/40 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:border-cyan-700 hover:bg-cyan-950/60">
                  {selectedEvidence.sourceLabel} · {selectedEvidence.sourceType}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <div className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Competencias activadas
                </div>
                <div className="space-y-4">
                  {competencies.map((item: CompetencySignal) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full border border-slate-700 bg-slate-950/60">
                        <div className="h-full rounded-full bg-slate-300" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <div className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Skills activadas
                </div>
                <div className="space-y-3">
                  {skills.map((skill: SkillSignal) => (
                    <div
                      key={skill.label}
                      className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm"
                    >
                      <span className="text-slate-100">{skill.label}</span>
                      <span className="text-slate-400">{skill.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                Contexto estructural activado
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.affectedCategories.map((category: string) => (
                    <span
                      key={category}
                      className="rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1 text-sm text-slate-200"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300">
                  <div>
                    <span className="text-slate-500">PAC asociado principal:</span> {project.currentPac}
                  </div>
                  <div className="mt-2">
                    <span className="text-slate-500">Lectura:</span> {project.structuralReading}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: EvidenceRow["status"] }): JSX.Element {
  const statusClass =
    status === "Aprobada"
      ? "border-emerald-800/60 bg-emerald-950/50 text-emerald-300"
      : status === "En revisión"
        ? "border-amber-800/60 bg-amber-950/40 text-amber-300"
        : "border-rose-800/60 bg-rose-950/40 text-rose-300";

  return <span className={`rounded-full border px-3 py-1 text-xs ${statusClass}`}>{status}</span>;
}

function DetailStat({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="text-sm font-medium text-slate-100">{value}</div>
    </div>
  );
}

function VersionRow({ version, label, date }: { version: string; label: string; date: string }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
      <div>
        <div className="text-slate-100">{label}</div>
        <div className="mt-1 text-xs text-slate-500">{date}</div>
      </div>
      <div className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{version}</div>
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
          ? "h-64 w-64 border-cyan-800/50 shadow-[0_0_80px_rgba(34,211,238,0.14)]"
          : "h-11 w-11 border-cyan-800/50 shadow-[0_0_30px_rgba(34,211,238,0.12)]",
      ].join(" ")}
    >
      <div className="absolute inset-[10%] rounded-full border border-cyan-500/30" />
      <div className="absolute inset-[22%] rounded-full border border-emerald-500/20" />
      <div className="absolute h-[58%] w-[58%] rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.95),rgba(15,23,42,0.2)_55%,transparent_75%)] blur-[2px]" />
      <div className="relative flex items-center justify-center">
        <div className={isLarge ? "text-4xl" : "text-sm"}>✦</div>
      </div>
    </div>
  );
}
