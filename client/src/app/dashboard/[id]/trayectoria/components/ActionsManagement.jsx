'use client';

import { motion } from 'framer-motion';

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'bg-zinc-700 text-zinc-300',
  },
  in_progress: {
    label: 'En progreso',
    color: 'bg-blue-500/10 text-blue-400',
  },
  submitted: {
    label: 'Enviada',
    color: 'bg-yellow-500/10 text-yellow-400',
  },
  validated: {
    label: 'Validada',
    color: 'bg-emerald-500/10 text-emerald-400',
  },
  locked: {
    label: 'Bloqueada',
    color: 'bg-zinc-800 text-zinc-500',
  },
};

export default function ActionsManagement({ data }) {
  const { current, next } = data;

  return (
    <div className="rounded-2xl glass-effect border-glass p-6 shadow-xl">
      
      {/* HEADER */}
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Gestión de acciones
      </h3>

      {/* 🔵 ACTUAL */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          En curso
        </h4>

        <div className="rounded-xl bg-zinc-900/50 p-4 space-y-3">
          <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
            {current.pacTitle}
          </p>

          {current.microActions.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between text-base"
            >
              <span style={{ color: 'var(--text-secondary)' }}>{m.name}</span>

              <span
                className={`px-2 py-1 rounded-full text-sm ${statusConfig[m.status].color}`}
              >
                {statusConfig[m.status].label}
              </span>
            </div>
          ))}

          {/* Evidence */}
          <div className="flex items-center justify-between text-base border-t border-zinc-800 pt-2">
            <span style={{ color: 'var(--text-secondary)' }}>
              Evidencia: {current.evidence.name}
            </span>

            <span
              className={`px-2 py-1 rounded-full text-sm ${statusConfig[current.evidence.status].color}`}
            >
              {statusConfig[current.evidence.status].label}
            </span>
          </div>
        </div>
      </div>

      {/* 🟣 SIGUIENTE */}
      <div>
        <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Próximas acciones
        </h4>

        <div className="rounded-xl bg-zinc-900/30 p-4 space-y-2 opacity-80">
          <p className="text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
            {next.pacTitle}
          </p>

          {next.microActions.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between text-base"
            >
              <span style={{ color: 'var(--text-tertiary)' }}>{m.name}</span>

              <span
                className={`px-2 py-1 rounded-full text-sm ${statusConfig[m.status].color}`}
              >
                {statusConfig[m.status].label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}