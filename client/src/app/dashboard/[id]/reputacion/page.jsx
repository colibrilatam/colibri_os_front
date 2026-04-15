'use client';
// contexto
import { useContext } from "react";
import { useProject } from '@/lib/projectContext';


export default function ReputacionPage() {

  // contexto
    const { tramoData, dbProject, mockProject } = useProject();
  const { project, reputationSnapshot, pacProgress } = mockProject;

  // Construir array de dimensiones a partir de los scores del reputationSnapshot
  const dimensions = [
    { key: "action",        label: "Acción",          raw: reputationSnapshot.actionScore,        weight: 0.25 },
    { key: "evidence",      label: "Evidencia",        raw: reputationSnapshot.evidenceScore,      weight: 0.25 },
    { key: "consistency",   label: "Consistencia",     raw: reputationSnapshot.consistencyScore,   weight: 0.20 },
    { key: "collaboration", label: "Colaboración",     raw: reputationSnapshot.collaborationScore, weight: 0.15 },
    { key: "sustainability",label: "Sostenibilidad",   raw: reputationSnapshot.sustainabilityScore,weight: 0.15 },
  ].map((d) => ({ ...d, weighted: parseFloat(((d.raw / 100) * d.weight * 10).toFixed(2)) }));

  // Construir "eventos reputacionales" a partir de los PACs con actividad
  const events = pacProgress
    .filter((pac) => pac.status === "approved" || pac.status === "in_progress")
    .map((pac) => ({
      date: pac.closedAt
        ? new Date(pac.closedAt).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" })
        : new Date(pac.updatedAt).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" }),
      title: pac.title,
      impact: pac.status === "approved" ? "PAC aprobado" : "En progreso",
      description: `${pac.categoryName} · ${pac.completedMicroactions}/${pac.requiredMicroactions} microacciones completadas`,
    }));

  const icPct = (reputationSnapshot.icPublic / 10) * 100;
  const variationIsPositive = true; // sin dato histórico previo en el JSON, asumimos positivo

  const leader = dimensions.reduce((max, item) => item.weighted > max.weighted ? item : max);
  const weakest = dimensions.reduce((min, item) => item.weighted < min.weighted ? item : min);
  const recentImprovement = dimensions.find((item) => item.key === "consistency") ?? leader;
  const mainLag = dimensions.find((item) => item.key === "sustainability") ?? weakest;

  const strongestTwo = [...dimensions]
    .sort((a, b) => b.weighted - a.weighted)
    .slice(0, 2)
    .map((item) => item.label)
    .join(", ");

  const weakestTwo = [...dimensions]
    .sort((a, b) => a.weighted - b.weighted)
    .slice(0, 2)
    .map((item) => item.label)
    .join(", ");

  const radarValues = [
    reputationSnapshot.actionScore,
    reputationSnapshot.evidenceScore,
    reputationSnapshot.consistencyScore,
    reputationSnapshot.collaborationScore,
    reputationSnapshot.sustainabilityScore,
  ];

  return (
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto space-y-6">
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="rounded-3xl glass-effect border-glass p-4 shadow-2xl xl:col-span-5">
            <div className="mb-5 flex flex-col lg:flex-row items-start justify-between gap-4">
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

            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[28px] glass-effect-dark border-glass p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.15),transparent_50%)]" />
              <RadarChart values={radarValues} max={100} />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              El radar opera como síntesis visual. No sustituye el desglose auditable por dimensión.
            </p>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl glass-effect-green border-glass p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Sostiene hoy</div>
                  <div className="text-lg font-medium text-slate-100">{strongestTwo}</div>
                  <div className="mt-2 text-sm text-slate-400">Dimensiones con mayor aporte reputacional actual.</div>
                </div>
                <div className="rounded-2xl glass-effect-red border-glass p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Frena hoy</div>
                  <div className="text-lg font-medium text-slate-100">{weakestTwo}</div>
                  <div className="mt-2 text-sm text-slate-400">Dimensiones con menor contribución relativa hoy.</div>
                </div>
              </div>
            </div>

            {<div className="mt-6 rounded-3xl glass-effect-dark border-glass p-5">
              <div className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                Lectura reputacional ejecutiva
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-2xl glass-effect-green border-glass p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Dimensión líder</div>
                  <div className="text-lg font-medium text-slate-100">{leader.label}</div>
                  <div className="mt-2 text-sm text-slate-400">Sostiene el mayor aporte reputacional visible hoy.</div>
                </div>
                <div className="rounded-2xl glass-effect-red border-glass p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Dimensión más débil</div>
                  <div className="text-lg font-medium text-slate-100">{weakest.label}</div>
                  <div className="mt-2 text-sm text-slate-400">Su contribución actual se mantiene por debajo del resto.</div>
                </div>
                <div className="rounded-2xl glass-effect-cyan border-glass p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Mejora reciente</div>
                  <div className="text-lg font-medium text-slate-100">{recentImprovement.label}</div>
                  <div className="mt-2 text-sm text-slate-400">Registra continuidad verificable en las últimas semanas.</div>
                </div>
                <div className="rounded-2xl glass-effect-cyan border-glass p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Principal rezago</div>
                  <div className="text-lg font-medium text-slate-100">{mainLag.label}</div>
                  <div className="mt-2 text-sm text-slate-400">Todavía no convierte continuidad en solidez estructural.</div>
                </div>
              </div>
            </div>}
          </div>

          <div className="space-y-6 xl:col-span-7">

            <div className="rounded-3xl glass-effect border-glass p-4 shadow-2xl">
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
                {dimensions.map((dimension) => (
                  <DimensionRow
                    key={dimension.key}
                    label={dimension.label}
                    raw={dimension.raw}
                    weight={dimension.weight}
                    weighted={dimension.weighted}
                    max={100}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="rounded-3xl glass-effect border-glass p-4 shadow-2xl">
                <div className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                  Eventos recientes que alteran reputación
                </div>
                <div className="space-y-4">
                  {events.map((event) => (
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

            <div className="rounded-3xl glass-effect border-glass p-4 shadow-2xl">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                Nota metodológica
              </div>
              <div className="text-lg font-medium text-slate-100">
                Algoritmo IC vigente: {reputationSnapshot.algorithmVersionId}
              </div>
              <div className="mt-2 text-sm text-slate-400">
                Ponderación reputacional activa para snapshot{" "}
                {new Date(reputationSnapshot.calculatedAt).toLocaleDateString("es-VE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DimensionRow({ label, raw, weight, weighted, max = 100 }) {
  const pct = (raw / max) * 100;

  return (
    <div className="rounded-2xl glass-effect-dark border-glass p-4">
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

function EventItem({ date, title, impact, description }) {
  return (
    <div className="rounded-2xl glass-effect-dark border-glass p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-100">{title}</div>
          <div className="mt-1 text-sm text-slate-400">{description}</div>
        </div>
        <div className="shrink-0 text-left md:text-right">
          <div className="text-sm text-slate-300">{date}</div>
          <div className={`mt-1 text-xs uppercase tracking-[0.18em]   ${impact === "PAC aprobado" ? "text-green-300" : "text-cyan-300"}`}>{impact}</div>
        </div>
      </div>
    </div>
  );
}

function RadarChart({ values, max = 100 }) {
  const size = 320;
  const center = size / 2;
  const radius = size * 0.34;
  const labelRadius = radius + 32;
  const angleStep = (Math.PI * 2) / values.length;
  const levels = 10;

  const getInitials = ["A", "E", "CON", "COL", "S"];

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
    .map((value, index) => {
      const angle = -Math.PI / 2 + index * angleStep;
      const pointRadius = (value / max) * radius;
      const x = center + Math.cos(angle) * pointRadius;
      const y = center + Math.sin(angle) * pointRadius;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative w-full flex flex-col items-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-sm mx-auto overflow-visible" style={{ aspectRatio: '1' }}>
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
          const initials = getInitials[index];

          return (
            <g key={getInitials[index]}>
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
                fill="rgb(0, 207, 207)"
                fontSize="18"
                fontWeight="700"
                letterSpacing="1"
              >
                {initials}
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

        {values.map((value, index) => {
          const angle = -Math.PI / 2 + index * angleStep;
          const pointRadius = (value / max) * radius;
          const x = center + Math.cos(angle) * pointRadius;
          const y = center + Math.sin(angle) * pointRadius;

          return (
            <circle
              key={`${getInitials[index]}-point`}
              cx={x}
              cy={y}
              r="4"
              fill="rgb(34,211,238)"
              filter="drop-shadow(0 0 4px rgba(34,211,238,0.5))"
            />
          );
        })}

        <circle cx={center} cy={center} r="3" fill="rgba(148,163,184,0.8)" />
      </svg>

      <div className="mt-6 w-full space-y-3 px-4">
        {values.map((item, index) => {
          const pct = (item / max) * 100;
          return (
            <div key={getInitials[index]} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium">{getInitials[index]}</span>
                <span>{item.toFixed(1)}/{max}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-500 via-cyan-500 to-emerald-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
