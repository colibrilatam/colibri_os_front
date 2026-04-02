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
  // Mapear a C1, C2, etc
  const mappedData = data.map((item, index) => ({
    ...item,
    short: `C${index + 1}`,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl glass-effect border-glass p-6 shadow-xl"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg text-zinc-300 font-semibold">Radar de Competencias</h3>
        <p className="text-base text-zinc-400 mt-1">
          Señal analítica por categoría (C1–C7)
        </p>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer>
          <RadarChart data={mappedData}>
            <PolarGrid stroke="#3f3f46" />

            <PolarAngleAxis
              dataKey="short" // 👈 usamos C1, C2...
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

      {/* Leyenda abajo */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-base text-zinc-300">
        {mappedData.map((item, index) => (
          <div key={index}>
            <span className="font-semibold text-zinc-200">{item.short}:</span>{' '}
            {item.category}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
