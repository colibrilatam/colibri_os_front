'use client';
// contexto
import { useContext } from "react";
import { useProject } from '@/lib/projectContext';
import { getProjectIC } from '@/lib/hooks/createIcMap';
import { useUserStore } from '@/lib/store';

import { IconAccion, IconEvidencia, IconConsistencia, IconColaboracion, IconSostenibilidad } from "@/components/ui/Icons";

export default function ReputacionPage() {

  // contexto
    const { tramoData, dbProject, mockProject } = useProject();
    const subioTramo = useUserStore((state) => state.subioTramo);
  const { project, reputationSnapshot, pacProgress } = mockProject;
  const ic = subioTramo && dbProject.projectName === "FlujoClave" ? getProjectIC("FlujoClaveT4") : getProjectIC(dbProject.projectName);

  // Construir array de dimensiones a partir de los scores del reputationSnapshot
  const dimensions = [
    { key: "action",        label: "Acción",          raw: reputationSnapshot.actionScore,        weight: 0.25, color: "orange" },
    { key: "evidence",      label: "Evidencia",        raw: reputationSnapshot.evidenceScore,      weight: 0.25, color: "blue" },
    { key: "consistency",   label: "Consistencia",     raw: reputationSnapshot.consistencyScore,   weight: 0.20, color: "green" },
    { key: "collaboration", label: "Colaboración",     raw: reputationSnapshot.collaborationScore, weight: 0.15, color: "purple" },
    { key: "sustainability",label: "Sostenibilidad",   raw: reputationSnapshot.sustainabilityScore,weight: 0.15, color: "red" },
  ].map((d) => ({ ...d, weighted: parseFloat(((ic * d.weight) * (d.raw / 100)).toFixed(2)) }));

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

  // Paths SVG nativos de cada icono (sin foreignObject)
  const categoryIconPaths = [
    // Acción (rayo)
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    // Evidencia (documento)
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </>,
    // Consistencia (onda)
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    // Colaboración (personas)
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>,
    // Sostenibilidad (hoja)
    <>
      <path d="M2 22C2 22 4 10 12 10C20 10 22 22 22 22" />
      <path d="M12 10C12 10 10 4 14 2C16 6 13 8 12 10" />
    </>,
  ];

  return (
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto space-y-6">
        <section className="flex flex-col  gap-6 xl:grid-cols-12">
          <div className="rounded-3xl glass-effect border-glass p-4 shadow-2xl justify-around flex lg:flex-row flex-col gap-5">
            <div className="flex flex-col gap-1 w-full">
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
              <span className="mr-10 rounded-full border border-cyan-800/70 bg-cyan-950/40 px-3 py-1 text-xs text-cyan-300">
                5 dimensiones
              </span>
            </div>

            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[28px] glass-effect-dark border-glass p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.15),transparent_40%)]" />
              <RadarChart values={radarValues} max={100}  categoryIconPaths={categoryIconPaths}/>
            </div>
             <p className="mt-4 text-sm leading-relaxed text-slate-400">
              El radar opera como síntesis visual. No sustituye el desglose auditable por dimensión.
            </p>
            {/*<div className="mt-6 space-y-4">
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
            */}
            </div>

           
          <div className="flex flex-col gap-2 w-full">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                    Desglose composicional del IC
                  </div>
                  <h2 className="text-xl font-semibold text-slate-50">Composición auditable actual</h2>
                
                <div className="text-sm mt-1 text-slate-400">
                  Valor bruto + peso metodológico + aporte ponderado
                </div>
                </div>
              </div>

              <div className="space-y-4">
                {dimensions.map((dimension, index) => (
                  <DimensionRow
                    categoryIconPaths={categoryIconPaths}
                    index={index}
                    key={dimension.key}
                    label={dimension.label}
                    raw={dimension.raw}
                    weight={dimension.weight}
                    weighted={dimension.weighted}
                    max={100}
                    iconColor={dimension.color}
                  />
                ))}
              </div>
              </div>

            
          </div>

          <div className="space-y-6 xl:col-span-7">

            <div className="rounded-3xl glass-effect border-glass p-4 shadow-2xl">
              

            {<div className="mt-6 rounded-3xl glass-effect-dark border-glass p-5">
              <div className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                Lectura reputacional ejecutiva
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

            {/*<div className="grid grid-cols-1 gap-6">
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
            </div>*/}

            {/*<div className="rounded-3xl glass-effect border-glass p-4 shadow-2xl">
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
            </div>*/}
          </div>
        </section>
      </div>
    </div>
  );
}

function DimensionRow({ label, raw, weight, weighted, max = 100, index, categoryIconPaths, iconColor }) {
  const pct = (raw / max) * 100;
  const iconSvg = categoryIconPaths[index];

  return (
    <div className="rounded-2xl glass-effect-dark border-glass p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="w-full flex-col">
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke={iconColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              {iconSvg}
            </svg>
            <div className="text-sm font-medium text-slate-100">{label}</div>
          </div>
          <div className="flex-1 mt-3">
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
        </div>

        <div className="grid grid-cols-2 gap-3 lg:w-[200px] lg:grid-cols-1 lg:gap-2 lg:text-right">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Peso</div>
            <div className="text-base font-medium text-slate-200">{Math.round(weight * 100)}%</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Aporte</div>
            <div className="text-base font-bold text-green-500">{weighted.toFixed(2)}</div>
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

function RadarChart({ values, max = 100, categoryIconPaths }) {
  const size = 320;
  const center = size / 2;
  const radius = size * 0.34;
  const labelRadius = radius + 32;
  const angleStep = (Math.PI * 2) / values.length;
  const levels = 10;

  const getInitials = ["A", "E", "CON", "COL", "S"];

  const iconColor = ["orange", "blue", "green", "purple", "red"];
  const iconScale = 0.9; // escala del icono (viewBox 24x24 → ~22px)

  

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
              <g
                transform={`translate(${labelX - 12 * iconScale}, ${labelY - 12 * iconScale}) scale(${iconScale})`}
                fill="none"
                stroke={iconColor[index]}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {categoryIconPaths[index]}
              </g>
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

      {/*<div className="mt-6 w-full space-y-3 px-4">
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
      </div>*/}
    </div>
  );
}
