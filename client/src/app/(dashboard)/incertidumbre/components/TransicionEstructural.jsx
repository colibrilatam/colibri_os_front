import React from 'react';
import SlopeChart from '@/components/SlopeChart';

export default function TransicionEstructural({ data }) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl shadow-md border border-white/10">
      <h2 style={{ fontSize: 'var(--text-2xl)', color: 'white' }} className="font-semibold mb-6">Transición Estructural por PAC</h2>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }} className="mb-8">Comparativa antes y después de ejecutar un Protocolo de Acción Colibrí</p>
      
      <div className="space-y-12">
        {data.map((item, index) => (
          <div key={index}>
            <SlopeChart
              xLabels={['Antes del PAC', 'Después del PAC']}
              yLabels={item.levels}
              levels={item.progression}
              title={item.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}