import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function TransicionEstructural({ data, selectedIndex, onSelectIndex }) {
  const selectedItem = data[selectedIndex];

  // Preparar datos para recharts
  const chartData = [
    {
      name: 'Antes del PAC',
      valor: selectedItem.progression[0]
    },
    {
      name: 'Después del PAC',
      valor: selectedItem.progression[2]
    }
  ];

  return (
    <div className="min-w-3/6 h-fit glass-effect border-glass p-6 rounded-2xl shadow-md">
      <h2 style={{ fontSize: 'var(--text-3xl)', color: 'white' }} className="font-semibold mb-6">Transición Estructural por PAC</h2>
      <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }} className="mb-6">Comparativa antes y después de ejecutar un Protocolo de Acción Colibrí</p>
      
      {/* Selector de gráficos */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {data.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectIndex(index)}
            style={{
              backgroundColor: selectedIndex === index ? 'var(--color-turquoise)' : 'rgba(0, 207, 207, 0.2)',
              color: selectedIndex === index ? '#000' : 'var(--color-turquoise)',
              fontSize: 'var(--text-sm)'
            }}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-current"
          >
            {item.name}
          </button>
        ))}
      </div>
      
      {/* Gráfico seleccionado con border */}
      <div className="border border-white/10 rounded-lg p-4">
        <ResponsiveContainer className="p-4"  width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--text-secondary)"
              style={{ fontSize: 'var(--text-sm)' }}
            />
            <YAxis 
              stroke="var(--text-secondary)"
              style={{ fontSize: 'var(--text-sm)' }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              label={{ value: 'Puntaje', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(10, 15, 26, 0.8)',
                border: '1px solid rgba(0, 207, 207, 0.3)',
                borderRadius: '8px',
                color: 'white'
              }}
              formatter={(value) => `${value}%`}
            />
            <Legend 
              wrapperStyle={{
                paddingTop: '1rem',
                color: 'white'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="valor" 
              stroke="var(--color-turquoise)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-turquoise)', r: 6 }}
              activeDot={{ r: 8 }}
              name="Evolución"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}