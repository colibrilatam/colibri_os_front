"use client";

/* ============================================================
   MOCK DATA (luego reemplazás por fetch real)
   ============================================================ */
const data = {
  uncertaintyType: "Mercado",
  level: "en_proceso",
  levelLabel: "En proceso",
  description: "Validación parcial de hipótesis con evidencia en crecimiento.",

  risks: [
    { label: "Humano", value: 65 },
    { label: "Mercado", value: 55 },
    { label: "Técnico", value: 40 },
    { label: "Organizacional", value: 70 },
  ],

  start: 82,
  current: 54,
};

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */
export default function Capa2Page() {
  return (
    <section className="w-full min-h-screen p-6 flex flex-col gap-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">
          Reducción de incertidumbre por tramo
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Evolución estructural del riesgo durante el tramo actual
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="lg:col-span-2">
          <UncertaintyCard data={data} />
        </div>

        <RiskBars data={data} />

        <SlopeChart data={data} />

      </div>

      <Microcopy data={data} />

    </section>
  );
}

/* ============================================================
   A. TARJETA DE INCERTIDUMBRE
   ============================================================ */
function UncertaintyCard({ data }) {

  const getStatusStyle = (level) => {
    switch (level) {
      case "critica":
        return "bg-[var(--status-danger-bg)] text-[var(--status-danger)]";
      case "en_proceso":
        return "bg-[var(--status-warning-bg)] text-[var(--status-warning)]";
      case "reducida":
        return "bg-[var(--status-success-bg)] text-[var(--status-success)]";
      default:
        return "bg-gray-700 text-white";
    }
  };

  return (
    <div className="glass-effect border-glass rounded-2xl p-6 flex flex-col gap-4">

      <h3 className="text-xl font-semibold">
        Incertidumbre dominante
      </h3>

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-[var(--text-secondary)]">Tipo</p>
          <p className="text-2xl font-bold">
            {data.uncertaintyType}
          </p>
        </div>

        <div className={`px-4 py-2 rounded-xl ${getStatusStyle(data.level)}`}>
          {data.levelLabel}
        </div>

      </div>

      <p className="text-sm text-[var(--text-secondary)]">
        {data.description}
      </p>

    </div>
  );
}

/* ============================================================
   B. BARRAS DE RIESGO
   ============================================================ */
function RiskBars({ data }) {

  const getColor = (value) => {
    if (value < 40) return "var(--score-excellent)";
    if (value < 60) return "var(--score-medium)";
    return "var(--score-low)";
  };

  return (
    <div className="glass-effect border-glass rounded-2xl p-6">

      <h3 className="text-xl font-semibold mb-4">
        Riesgo por bloque
      </h3>

      {data.risks.map((r, i) => (
        <div key={i} className="mb-4">

          <div className="flex justify-between text-sm mb-1">
            <span>{r.label}</span>
            <span>{r.value}%</span>
          </div>

          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${r.value}%`,
                background: getColor(r.value),
              }}
            />
          </div>

        </div>
      ))}

    </div>
  );
}

/* ============================================================
   C. SLOPE CHART SIMPLE
   ============================================================ */
function SlopeChart({ data }) {

  const diff = data.current - data.start;

  return (
    <div className="glass-effect border-glass rounded-2xl p-6">

      <h3 className="text-xl font-semibold mb-4">
        Evolución del tramo
      </h3>

      <div className="flex items-center justify-between">

        {/* Inicio */}
        <div>
          <p className="text-sm text-secondary">Inicio</p>
          <p className="text-lg font-bold">{data.start}%</p>
        </div>

        {/* Línea */}
        <div className="flex-1 mx-4 relative">
          <div className="h-[2px] bg-gray-600 w-full"></div>

          <div
            className="absolute top-[-4px] w-3 h-3 rounded-full transition-all duration-500"
            style={{
              left: diff < 0 ? "20%" : "80%",
              background: diff < 0
                ? "var(--color-emerald)"
                : "var(--color-magenta)"
            }}
          />
        </div>

        {/* Actual */}
        <div>
          <p className="text-sm text-secondary">Actual</p>
          <p className="text-lg font-bold text-[var(--color-emerald)]">
            {data.current}%
          </p>
        </div>

      </div>

    </div>
  );
}

/* ============================================================
   MICROCOPY DINÁMICO
   ============================================================ */
function Microcopy({ data }) {

  const generateText = () => {

    if (data.current < data.start) {
      return "La incertidumbre dominante pasó de crítica a en proceso.";
    }

    if (data.risks[0].value < 50) {
      return "Se redujo riesgo humano mediante evidencia de coordinación y coachability.";
    }

    if (data.risks[1].value < 50) {
      return "La validación temprana disminuyó incertidumbre de mercado.";
    }

    return "La reducción estructural aún es parcial.";
  };

  return (
    <div className="text-sm text-secondary">
      {generateText()}
    </div>
  );
}


/* 'use client';

import { uncertaintyData } from '@/lib/mock/homeData';

export default function Uncertainty() {
  const { global, radar, trend, risks } = uncertaintyData;

  return (
    <div className="space-y-6 pb-10">
      <Header global={global} />

      <DecisionMeter score={global.decisionScore} />

      <Radar data={radar} />

      <Trend data={trend} prediccion={global.prediccion} />

      <RiskBars risks={risks} />

      <Insight global={global} risks={risks} />
    </div>
  );
} */

/* ================= HEADER ================= */

/* function Header({ global }) {
  return (
    <div className="glass-effect border-glass rounded-[26px] p-5 sm:p-6">
      <div className="text-[var(--text-secondary)] text-xs uppercase tracking-wide">
        Incertidumbre
      </div>

      <h1 className="mt-2 text-[var(--text-2xl)]">
        Estado estructural del proyecto
      </h1>

      <div className="mt-4 flex items-center gap-4">
        <div className="text-[var(--text-4xl)] font-bold">{global.indice}</div>

        <div className="text-[var(--status-success)] text-sm">
          ↓ {global.tendencia} pts
        </div>
      </div>

      <p className="mt-3 text-[var(--text-base)] text-[var(--text-secondary)]">
        Reducción progresiva de incertidumbre en el sistema.
      </p>
    </div>
  );
} */

/* ================= DECISION ================= */

/* function DecisionMeter({ score }) {
  const config = {
    bajo: {
      color: 'var(--color-emerald)',
      label: 'Riesgo bajo',
    },
    medio: {
      color: 'var(--color-nectar)',
      label: 'Riesgo medio',
    },
    alto: {
      color: 'var(--color-magenta)',
      label: 'Riesgo alto',
    },
  };

  const s = config[score];

  return (
    <div className="glass-effect border-glass rounded-[22px] p-5">
      <h2 className="text-[var(--text-xl)]">Lectura de inversión</h2>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-4 w-4 rounded-full"
            style={{ background: s.color }}
          />

          <div className="text-[var(--text-lg)]">{s.label}</div>
        </div>

        <div
          className="px-3 py-1 rounded-full text-sm"
          style={{
            background: `${s.color}20`,
            color: s.color,
          }}
        >
          {score.toUpperCase()}
        </div>
      </div>
    </div>
  );
} */

/* ================= RADAR ================= */

/* function Radar({ data }) {
  return (
    <div className="glass-effect border-glass rounded-[22px] p-5">
      <h2 className="text-[var(--text-xl)]">Estructura del proyecto</h2>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>

            <div className="h-2 mt-2 bg-white/10 rounded-full">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${item.value}%`,
                  background:
                    'linear-gradient(90deg, var(--color-turquoise), var(--color-emerald))',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} */

/* ================= TREND ================= */

/* function Trend({ data, prediccion }) {
  const path = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * 40} ${100 - v}`)
    .join(' ');

  return (
    <div className="glass-effect border-glass rounded-[22px] p-5">
      <h2 className="text-[var(--text-xl)]">Proyección de incertidumbre</h2>

      <svg viewBox="0 0 260 100" className="w-full h-32 mt-4">
       
        <path
          d={path}
          stroke="var(--color-nectar)"
          strokeWidth="3"
          fill="none"
        />

      
        <line
          x1={(data.length - 1) * 40}
          y1={100 - data[data.length - 1]}
          x2={data.length * 40}
          y2={100 - prediccion}
          stroke="var(--color-magenta)"
          strokeDasharray="4"
        />

      
        <circle
          cx={data.length * 40}
          cy={100 - prediccion}
          r="4"
          fill="var(--color-magenta)"
        />
      </svg>
    </div>
  );
}
 */
/* ================= RISKS ================= */

/* function RiskBars({ risks }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {risks.map((r) => (
        <Risk key={r.title} {...r} />
      ))}
    </div>
  );
}

function Risk({ title, value }) {
  const getGradient = () => {
    if (value < 30)
      return 'linear-gradient(90deg, var(--color-light-green), var(--color-emerald))';

    if (value < 60)
      return 'linear-gradient(90deg, var(--color-nectar), var(--color-solar-yellow))';

    return 'linear-gradient(90deg, var(--color-soft-coral), var(--color-magenta))';
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
} */

/* ================= INSIGHT ================= */

/* function Insight({ global, risks }) {
  const avgRisk = risks.reduce((acc, r) => acc + r.value, 0) / risks.length;

  const highRisk = risks.filter((r) => r.value > 50).length;

  let message = '';

  if (global.prediccion < 50 && avgRisk < 40) {
    message = 'El sistema indica condiciones favorables para inversión.';
  } else if (highRisk > 1) {
    message = 'Persisten riesgos estructurales que requieren validación.';
  } else {
    message = 'El proyecto muestra progreso, pero aún necesita consolidación.';
  }

  return (
    <div className="glass-effect border-glass rounded-[22px] p-5">
      <h2 className="text-[var(--text-xl)]">Lectura institucional</h2>

      <p className="mt-3 text-[var(--text-base)] text-[var(--text-secondary)]">
        {message}
      </p>
    </div>
  );
} */
