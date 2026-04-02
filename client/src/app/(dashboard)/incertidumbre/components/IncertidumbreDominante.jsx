import React from 'react';

export default function IncertidumbreDominante({ incertidumbreData }) {
  return (
    <div style={{color: 'var(--color-cream)'}} className="h-fit glass-effect border-glass p-6 rounded-2xl shadow-md">
      <h2 style={{ fontSize: 'var(--text-2xl)', color: 'white' }} className="font-semibold mb-6">Incertidumbre Dominante</h2>
      <div className='flex flex-col gap-4'>
        <p style={{ fontSize: 'var(--text-base)' }}>Riesgo principal del tramo actual</p>
        <p style={{ fontSize: 'var(--text-lg)', color: 'white' }} className="font-bold">{incertidumbreData.name}</p>
        <p style={{ fontSize: 'var(--text-base)' }}>Nivel: <span style={{ color: 'var(--status-danger)' }} className="font-bold">Crítica</span> - {incertidumbreData.level}%</p>
      </div>
      
      <div className="mt-8">
        <p style={{ fontSize: 'var(--text-sm)', color: 'white' }} className="font-semibold mb-2">Nivel de Riesgo</p>
        <div className="relative mb-4">
          <div className="w-full flex flex-row rounded-full h-8 overflow-hidden">
            <div style={{ width: '25%', backgroundColor: 'var(--status-success)' }}></div>
            <div style={{ width: '50%', backgroundColor: 'var(--status-warning)' }}></div>
            <div style={{ width: '25%', backgroundColor: 'var(--status-danger)' }}></div>
          </div>
          <div className='absolute top-0 h-full w-1 bg-white' style={{ left: `${incertidumbreData.level}%`, transform: 'translateX(-50%)' }}></div>
        </div>
        <div className="flex justify-between text-center">
          <div style={{ width: '25%' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Estable</p>
          </div>
          <div style={{ width: '50%' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Aceptable</p>
          </div>
          <div style={{ width: '25%' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Crítica</p>
          </div>
        </div>
      </div>
    </div>
  );
}