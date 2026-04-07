'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

const trendConfig = {
  up: {
    icon: ArrowUpRight,
    label: 'Subiendo',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  stable: {
    icon: ArrowRight,
    label: 'Estancado',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  down: {
    icon: ArrowRight,
    label: 'Bajando',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
};

export default function IndiceColibri({ data }) {
  const { value, trend, lastUpdated } = data;

  const trendData = trendConfig[trend];
  const TrendIcon = trendData.icon;

  const formattedDate = new Date(lastUpdated).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 shadow-xl"
    >
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-400">Índice Colibrí</h3>

        <div
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${trendData.bg} ${trendData.color}`}
        >
          <TrendIcon size={14} />
          {trendData.label}
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end gap-2">
        <motion.span
          key={value}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-5xl font-bold text-white"
        >
          {value.toFixed(2)}
        </motion.span>

        <span className="mb-1 text-sm text-zinc-400">/ 6.00</span>
      </div>

      {/* Progress bar */}
      <div className="mt-6 flex items-center justify-center">
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
            stroke="#10b981"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 50}
            initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 50 * (1 - value / 6),
            }}
            transition={{ duration: 0.6 }}
          />
        </svg>

        {/* Valor centrado */}
        <div className="absolute text-center">
          <span className="text-2xl font-bold text-white">
            {value.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-zinc-500">
        Última actualización: {formattedDate}
      </div>
    </motion.div>
  );
}
