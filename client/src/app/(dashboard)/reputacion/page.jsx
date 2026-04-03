'use client';

import { reputationData } from '@/lib/mock/homeData';

export default function Reputation() {
  const { global, breakdown, trend, factors } = reputationData;

  return (
    <div className="space-y-6 pb-10">
      <Header global={global} />

      <Breakdown data={breakdown} />

      <Trend data={trend} />

      <Factors factors={factors} />

      <Insight global={global} />
    </div>
  );
}
function Header({ global }) {
  return (
    <div className="glass-effect border-glass rounded-[26px] p-5">
      <div className="text-xs text-[var(--text-secondary)] uppercase">
        Reputación
      </div>

      <h1 className="mt-2 text-[var(--text-2xl)]">Índice Colibrí</h1>

      <div className="mt-4 flex items-center gap-6">
        <div className="text-[var(--text-4xl)] font-bold">{global.score}</div>

        <div className="text-[var(--status-success)]">
          ↑ {global.tendencia} pts
        </div>

        <div className="px-3 py-1 rounded-full bg-white/5">{global.nivel}</div>
      </div>
    </div>
  );
}

function Breakdown({ data }) {
  return (
    <div className="glass-effect border-glass rounded-[22px] p-5">
      <h2 className="text-[var(--text-xl)]">Estructura del score</h2>

      <div className="mt-6 space-y-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>

            <div className="h-3 mt-2 bg-white/10 rounded-full">
              <div
                className="h-3 rounded-full"
                style={{
                  width: `${item.value}%`,
                  background:
                    'linear-gradient(90deg, var(--color-turquoise), var(--color-nectar))',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Trend({ data }) {
  const path = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * 40} ${100 - v}`)
    .join(' ');

  return (
    <div className="glass-effect border-glass rounded-[22px] p-5">
      <h2 className="text-[var(--text-xl)]">Evolución del score</h2>

      <svg viewBox="0 0 240 100" className="w-full h-32 mt-4">
        <path
          d={path}
          stroke="var(--color-turquoise)"
          strokeWidth="3"
          fill="none"
        />
      </svg>
    </div>
  );
}

function Factors({ factors }) {
  return (
    <div className="space-y-3">
      {factors.map((f, i) => (
        <Factor key={i} {...f} />
      ))}
    </div>
  );
}

function Factor({ type, text }) {
  const color =
    type === 'positivo' ? 'var(--color-emerald)' : 'var(--color-magenta)';

  return (
    <div className="glass-effect border-glass rounded-xl p-4 flex items-center gap-3">
      <div className="h-3 w-3 rounded-full" style={{ background: color }} />

      <p className="text-[var(--text-base)]">{text}</p>
    </div>
  );
}

function Insight({ global }) {
  let message = '';

  if (global.score > 75) {
    message = 'El proyecto presenta alta consistencia estructural.';
  } else if (global.score > 60) {
    message = 'El proyecto es prometedor pero aún requiere validación.';
  } else {
    message = 'El proyecto presenta debilidades estructurales relevantes.';
  }

  return (
    <div className="glass-effect border-glass rounded-[22px] p-5">
      <h2 className="text-[var(--text-xl)]">Lectura institucional</h2>

      <p className="mt-3 text-[var(--text-base)] text-[var(--text-secondary)]">
        {message}
      </p>
    </div>
  );
}
