import React from 'react';

export default function SlopeChart({ xLabels, yLabels, levels, title }) {
  if (!xLabels || xLabels.length !== 2 || !yLabels || !levels || levels.length !== 3) {
    return <div style={{ color: 'red' }}>Error: Propiedades inválidas para SlopeChart</div>;
  }

  const [label1, label2] = xLabels;
  
  // Calcula los porcentajes de posición (normaliza entre 0-100)
  const maxValue = Math.max(...yLabels, ...levels);
  const minValue = Math.min(...yLabels, 0);
  const range = maxValue - minValue;

  const getYPosition = (value) => {
    if (range === 0) return 150;
    return 300 - ((value - minValue) / range) * 300;
  };

  // Posiciones de los 3 puntos en X (0%, 50%, 100%) - en valores SVG (0-300)
  const point1Y = getYPosition(levels[0]);
  const point2Y = getYPosition(levels[1]);
  const point3Y = getYPosition(levels[2]);

  // Conversión a porcentajes para etiquetas
  const point1YPercent = (point1Y / 300) * 100;
  const point2YPercent = (point2Y / 300) * 100;
  const point3YPercent = (point3Y / 300) * 100;

  // Colores para la leyenda
  const colors = [
    '#009975',
    '#00CFCF',
    '#FFD166',
    '#FF4D6D',
    '#78D9B4',
  ];

  return (
    <div className="w-full">
      {title && (
        <h3 style={{ fontSize: 'var(--text-lg)', color: 'white', marginBottom: '1rem' }} className="font-semibold">
          {title}
        </h3>
      )}
      
      {/* Contenedor del gráfico */}
      <div className="relative w-full" style={{ height: '320px', paddingTop: '1rem', paddingBottom: '1rem' }}>
        <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          {/* Línea de conexión entre los 3 puntos */}
          <line
            x1="50"
            y1={point1Y}
            x2="500"
            y2={point2Y}
            stroke="#00CFCF"
            strokeWidth="3"
          />
          <line
            x1="500"
            y1={point2Y}
            x2="950"
            y2={point3Y}
            stroke="#FFD166"
            strokeWidth="3"
          />

          {/* Puntos (círculos) */}
          <circle cx="50" cy={point1Y} r="8" fill="#00CFCF" />
          <circle cx="500" cy={point2Y} r="8" fill="#009975" />
          <circle cx="950" cy={point3Y} r="8" fill="#FFD166" />
        </svg>

        {/* Etiquetas de los valores en los puntos */}
        <div
          style={{
            position: 'absolute',
            left: '5%',
            top: `${point1YPercent - 5}%`,
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 'var(--text-sm)', color: 'white', fontWeight: 'bold' }}>{levels[0]}</span>
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: `${point2YPercent - 5}%`,
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 'var(--text-sm)', color: 'white', fontWeight: 'bold' }}>{levels[1]}</span>
        </div>
        <div
          style={{
            position: 'absolute',
            left: '95%',
            top: `${point3YPercent - 5}%`,
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 'var(--text-sm)', color: 'white', fontWeight: 'bold' }}>{levels[2]}</span>
        </div>
      </div>

      {/* Etiquetas del eje X (debajo) */}
      <div className="flex justify-between px-4 mt-8">
        <span style={{ fontSize: 'var(--text-base)', color: 'white', fontWeight: 'bold' }}>{label1}</span>
        <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>Progreso</span>
        <span style={{ fontSize: 'var(--text-base)', color: 'white', fontWeight: 'bold' }}>{label2}</span>
      </div>

      {/* Eje Y (etiquetas de niveles) */}
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Rango de valores:</span>
        {Array.from({ length: Math.min(yLabels.length, 5) }).map((_, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: colors[index],
              }}
            />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {yLabels[index] !== undefined ? `Val: ${yLabels[index]}` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
