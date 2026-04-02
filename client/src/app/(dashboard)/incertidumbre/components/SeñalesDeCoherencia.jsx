import React from 'react';

const nivelLabels = ['Sin iniciar', 'Principiante', 'Intermedio', 'Avanzado'];
const nivelColors = ['#71717A', '#FF7C7C', '#FFCA28', '#78D9B4'];

export default function SeñalesDeCoherencia({ señales }) {
  return (
    <div className="glass-effect border-glass p-6 rounded-2xl shadow-md">
      <h2 style={{ fontSize: 'var(--text-3xl)', color: 'white' }} className="font-semibold mb-6">Señales de Coherencia</h2>
      <div className="space-y-8">
        {señales.map((señal, index) => (
          <div key={index} className="space-y-3">
            {/* Nombre y enlace de evidencia */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 'var(--text-xl)', color: 'white' }} className="font-semibold">{señal.nombre}</span>
              <a href={señal.evidencia} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-base)', color: 'var(--text-link)' }} className="hover:underline">Ver evidencia</a>
            </div>
            
            {/* Barra de progreso dividida en 3 secciones */}
            <div className="space-y-2">
              <div className="h-8 rounded-lg overflow-hidden flex">
                {[1, 2, 3].map((levelValue) => {
                  const isActive = señal.nivel >= levelValue;
                  return (
                    <div
                      key={levelValue}
                      className="flex-1 border-r border-zinc-700 last:border-r-0 transition-all duration-500 flex items-center justify-center"
                      style={{
                        backgroundColor: isActive ? 'var(--color-turquoise)' : '#3f3f46'
                      }}
                    >
                      <span style={{ fontSize: 'var(--text-sm)', color: '#000' }} className="font-bold">
                        {isActive ? '✓' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Etiquetas debajo */}
              <div className="flex justify-between text-center">
                <div style={{ width: '33.33%' }}>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>Principiante</p>
                </div>
                <div style={{ width: '33.33%' }}>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>Intermedio</p>
                </div>
                <div style={{ width: '33.33%' }}>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>Avanzado</p>
                </div>
              </div>
            </div>
            
            {/* Indicador de nivel actual */}
            <div className="flex items-center pt-2">
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>Nivel actual:&nbsp;</span>
              <span style={{ fontSize: 'var(--text-base)', color: nivelColors[señal.nivel] }} className="font-semibold">
                {nivelLabels[señal.nivel]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}