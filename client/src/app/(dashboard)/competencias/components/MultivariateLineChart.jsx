'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import { motion } from 'framer-motion';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function MultivariateLineChart({
  data,
  lines,
  title,
  description,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 shadow-xl"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm text-zinc-400">{title}</h3>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#27272a" />

            <XAxis dataKey="date" tick={{ fill: '#a1a1aa', fontSize: 11 }} />

            <YAxis domain={[0, 6]} tick={{ fill: '#71717a', fontSize: 10 }} />

            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
              }}
              labelStyle={{ color: '#fff' }}
            />

            {lines.map((line, index) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
