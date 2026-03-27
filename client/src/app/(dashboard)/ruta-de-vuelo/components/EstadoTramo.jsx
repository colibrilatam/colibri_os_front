'use client';

import { motion } from 'framer-motion';

export default function EstadoTramo({ tramo }) {
  const { name, progress, elapsedDays, totalDays } = tramo;

  const progressPercent = Math.round(progress * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 shadow-xl"
    >
      {/* Glow */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-zinc-400">Estado del tramo</h3>

        <span className="text-xs text-zinc-500">
          {elapsedDays} / {totalDays} días
        </span>
      </div>

      {/* Nombre */}
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-white">{name}</h2>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="h-2 w-full rounded-full bg-zinc-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6 }}
            className="h-2 rounded-full bg-indigo-500"
          />
        </div>

        <div className="flex justify-between text-xs text-zinc-400">
          <span>Progreso</span>
          <span>{progressPercent}%</span>
        </div>
      </div>
    </motion.div>
  );
}
