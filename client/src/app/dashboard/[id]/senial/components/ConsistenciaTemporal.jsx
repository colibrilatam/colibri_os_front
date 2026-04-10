'use client';

import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const levelConfig = {
  Alta: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    label: 'Alta consistencia',
    description:
      'El proyecto ejecuta acciones de forma constante y dentro de los tiempos esperados.',
  },
  Media: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    label: 'Consistencia media',
    description:
      'El proyecto mantiene cierta regularidad, pero presenta retrasos o irregularidades.',
  },
  Baja: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    label: 'Baja consistencia',
    description:
      'El proyecto muestra ejecución irregular o fuera de los tiempos esperados.',
  },
};

export default function ConsistenciaTemporal({ data }) {
  const { level, updatedAt } = data;

  const config = levelConfig[level];

  const formattedDate = new Date(updatedAt).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border ${config.border} bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 shadow-xl`}
    >
      {/* Glow */}
      <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-zinc-400">Consistencia temporal</h3>

        {/* Tooltip */}
        <div className="group relative cursor-pointer">
          <Info size={16} className="text-zinc-500" />

          <div className="pointer-events-none absolute right-0 top-6 w-64 rounded-lg bg-zinc-800 p-3 text-xs text-zinc-300 opacity-0 shadow-lg transition group-hover:opacity-100">
            {config.description}
          </div>
        </div>
      </div>

      {/* Nivel */}
      <div
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${config.bg} ${config.color}`}
      >
        {config.label}
      </div>

      {/* Indicador circular */}
      <div className="relative mt-6 flex items-center justify-center">
        <svg width="120" height="120" className="rotate-[-90deg]">
          {/* Fondo */}
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="#3f3f46"
            strokeWidth="8"
            fill="transparent"
          />

          {/* Progreso */}
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            stroke={
              level === 'Alta'
                ? '#34d399'
                : level === 'Media'
                  ? '#facc15'
                  : '#f87171'
            }
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 50}
            initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
            animate={{
              strokeDashoffset:
                2 *
                Math.PI *
                50 *
                (1 -
                  (level === 'Alta' ? 0.85 : level === 'Media' ? 0.55 : 0.25)),
            }}
            transition={{ duration: 0.6 }}
          />
        </svg>

        {/* Texto centrado */}
        <div className="absolute text-center">
          <span className={`text-sm font-semibold ${config.color}`}>
            {level}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-zinc-500">
        Actualizado: {formattedDate}
      </div>
    </motion.div>
  );
}
