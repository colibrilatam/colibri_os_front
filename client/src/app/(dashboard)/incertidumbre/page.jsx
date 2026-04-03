'use client';
import React, { useState } from 'react';
import { incertidumbreMock } from '@/lib/mock-data';
import IncertidumbreDominante from './components/IncertidumbreDominante';
import SeñalesDeCoherencia from './components/SeñalesDeCoherencia';
import TransicionEstructural from './components/TransicionEstructural';

export default function IncertidumbrePage() {
  const [selectedTransicionIndex, setSelectedTransicionIndex] = useState(0);
  // Mock data for Incertidumbre Dominante


  // Mock data for Transición Estructural
  const transicionData = [
    {
      name: 'Madurez del Equipo',
      levels: [0, 25, 50, 75, 100],
      progression: [20, 40, 60]
    },
    {
      name: 'Coherencia Interna',
      levels: [0, 25, 50, 75, 100],
      progression: [30, 50, 70]
    },
    {
      name: 'Capacidad de Ejecución',
      levels: [0, 25, 50, 75, 100],
      progression: [40, 65, 80]
    }
  ];

  // Señales de Coherencia
  const señales = [
    { nombre: 'Roles Definidos', nivel: 3, evidencia: 'https://notion.so/acta-fundacional' },
    { nombre: 'Fricción Documentada', nivel: 1, evidencia: 'https://notion.so/registro-fricciones' },
    { nombre: 'Toma de Decisiones bajo Presión', nivel: 2, evidencia: 'https://notion.so/minutas-reuniones' },
    { nombre: 'Coachability', nivel: 1, evidencia: 'https://notion.so/feedback-sesiones' }
  ];

  return (
    <main className="min-h-screen rounded glass-effect-dark border-glass p-6">
      <div className=" mx-auto space-y-8">
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)' }} className="font-semibold text-white">Reducción de Incertidumbre y Coherencia</h1>
          <p style={{ fontSize: 'var(--text-lg)' }} className="text-zinc-400 mt-2">Volver medible la esperanza. Evolución estructural bajo fricción real.</p>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between gap-6 ">
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
      {/* Incertidumbre Dominante */}
      <IncertidumbreDominante incertidumbreData={incertidumbreMock.incertidumbreDominante} />
      {/* Señales de Coherencia */}
      <SeñalesDeCoherencia señales={señales} />
      </div>
{/* Transición Estructural por PAC */}
      <TransicionEstructural 
        data={transicionData} 
        selectedIndex={selectedTransicionIndex}
        onSelectIndex={setSelectedTransicionIndex}
      />
      

        
      </div>
      </div>
    </main>
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
