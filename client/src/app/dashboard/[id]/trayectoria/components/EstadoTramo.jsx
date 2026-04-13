'use client';

import { motion } from 'framer-motion';

export default function EstadoTramo({ tramo }) {
  const { name, progress, elapsedDays, totalDays } = tramo;

  const progressPercent = Math.round(progress * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl glass-effect border-glass p-6 shadow-xl"
    >
      {/* Glow */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-white font-semibold">Estado del tramo</h3>

        <span className="text-base text-zinc-300">
          {elapsedDays} / {totalDays} días
        </span>
      </div>

      {/* Nombre */}
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-white">{name}</h2>
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
