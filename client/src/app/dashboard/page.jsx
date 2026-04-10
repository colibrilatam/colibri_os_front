"use client";

import { homeData } from "@/lib/mock/homeData";

export default function Home() {
  const { project, ic, incertidumbre, señales, contexto, insight } = homeData;

  const linePath = (data, width = 320, height = 90) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const step = width / (data.length - 1);

    return data
      .map((v, i) => {
        const x = i * step;
        const y =
          height - ((v - min) / (max - min || 1)) * (height - 10) - 5;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  return (
    <div className="space-y-6 pb-10">

      {/* HERO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* PROYECTO */}
        <Card title="Proyecto">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

            <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full border border-[var(--color-nectar)]/30 flex items-center justify-center text-3xl sm:text-4xl">
              🕊
            </div>

            <div className="w-full space-y-4 text-center sm:text-left">

              <div className="text-xl sm:text-2xl font-semibold">
                {project.name}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Metric label="Tramo" value={project.tramo} />
                <Metric label="Consistencia" value={project.consistencia} />
                <Metric label="Estado" value={project.estado} />
                <Metric label="Última evolución" value={project.ultimaEvolucion} />
              </div>

            </div>
          </div>
        </Card>

        {/* IC */}
        <Card title="Índice Colibrí">
          <div className="flex flex-col gap-4">

            <div className="text-4xl sm:text-5xl font-bold text-[var(--color-nectar)]">
              {ic.value}
            </div>

            <div className="text-[var(--status-success)] text-base">
              ↑ {ic.change}
            </div>

            <svg viewBox="0 0 320 90" className="w-full h-24">
              <path
                d={linePath(ic.trend)}
                fill="none"
                stroke="var(--color-turquoise)"
                strokeWidth="3"
              />
            </svg>

          </div>
        </Card>

      </div>

      {/* INCERTIDUMBRE */}
      <Card title="Incertidumbre">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <h2 className="text-lg sm:text-xl font-semibold">
            Reducción de riesgo
          </h2>

          <Badge text={`Dominante: ${incertidumbre.dominante}`} />

        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {incertidumbre.riesgos.map((r) => (
            <Risk key={r.label} title={r.label} value={r.value} />
          ))}
        </div>

      </Card>

      {/* SEÑALES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TinyMetric label="Avance tramo" value={señales.avance} />
        <TinyMetric label="PACs validados" value={señales.pacs} />
        <TinyMetric label="Estado" value={señales.estado} />
      </div>

      {/* CONTEXTO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TinyMetric label="Última evidencia" value={contexto.ultimaEvidencia} />
        <TinyMetric label="Próximo hito" value={contexto.proximoHito} />
        <TinyMetric label="Mentor" value={contexto.mentor} />
      </div>

      {/* INSIGHT */}
      <Card title="Insight">

        <p className="text-base sm:text-lg leading-relaxed text-[var(--text-primary)]">
          {insight}
        </p>

      </Card>

    </div>
  );
}

/* COMPONENTES */

function Card({ title, children }) {
  return (
    <div className="glass-effect border-glass rounded-[22px] sm:rounded-[26px] p-5 sm:p-6">

      <div className="text-[var(--text-secondary)] text-xs sm:text-sm uppercase tracking-wide mb-4">
        {title}
      </div>

      {children}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="glass-effect border-glass rounded-xl px-3 py-3">

      <div className="text-[var(--text-secondary)] text-sm uppercase">
        {label}
      </div>

      <div className="text-[var(--text-primary)] text-base mt-1 font-medium">
        {value}
      </div>

    </div>
  );
}

function TinyMetric({ label, value }) {
  return (
    <div className="glass-effect border-glass rounded-xl px-4 py-4 text-center">

      <div className="text-[var(--text-secondary)] text-sm uppercase">
        {label}
      </div>

      <div className="text-lg font-semibold mt-2 text-[var(--text-primary)]">
        {value}
      </div>

    </div>
  );
}

function Risk({ title, value }) {

  const getGradient = () => {
    if (value < 30)
      return "linear-gradient(90deg, var(--color-light-green), var(--color-emerald))";

    if (value < 60)
      return "linear-gradient(90deg, var(--color-nectar), var(--color-solar-yellow))";

    return "linear-gradient(90deg, var(--color-soft-coral), var(--color-magenta))";
  };

  return (
    <div className="glass-effect border-glass rounded-xl p-4">

      <div className="flex justify-between text-base">
        <span>{title}</span>
        <span className="text-[var(--text-secondary)]">{value}%</span>
      </div>

      <div className="h-3 mt-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
            background: getGradient(),
          }}
        />
      </div>

    </div>
  );
}

function Badge({ text }) {
  return (
    <span
      className="px-4 py-2 text-sm rounded-full border"
      style={{
        background: "var(--status-warning-bg)",
        color: "var(--status-warning)",
        borderColor: "rgba(255, 209, 102, 0.25)",
      }}
    >
      {text}
    </span>
  );
}