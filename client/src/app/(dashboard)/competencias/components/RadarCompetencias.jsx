'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

import { motion } from 'framer-motion';

export default function RadarCompetencias({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 shadow-xl"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm text-zinc-400">
          Radar de Competencias
        </h3>
        <p className="text-xs text-zinc-500">
          Señal analítica por categoría (C1–C7)
        </p>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer>
          <RadarChart data={data}>
            <PolarGrid stroke="#3f3f46" />

            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
            />

            <PolarRadiusAxis
              angle={30}
              domain={[0, 6]}
              tick={{ fill: '#71717a', fontSize: 10 }}
            />

            <Radar
              name="Competencias"
              dataKey="value"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}