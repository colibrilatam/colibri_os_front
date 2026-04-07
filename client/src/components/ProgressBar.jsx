export default function ProgressBar({ 
  progreso = 0, 
  color = "emerald",
  tamaño = "md",
  label = null,
  mostrarPorcentaje = true,
  redondeado = true,
  borde = true,
  className = ""
}) {
  // Asegurar que el progreso esté entre 0 y 100
  const porcentajeReal = Math.min(Math.max(progreso, 0), 100);

  // Función para calcular el gradiente dinámico multicolor
  const getMulticolorGradient = (percent) => {
    if (percent <= 33) {
      return `linear-gradient(90deg, #FFD166 0%, #FFD166 100%)`;
    } else if (percent <= 66) {
      const firstStop = (33 / percent) * 100;
      const fadeStart = Math.max(0, firstStop - 8);
      const fadeEnd = Math.min(100, firstStop + 8);
      return `linear-gradient(90deg, #FFD166 0%, #FFD166 ${fadeStart}%, #00CFCF ${fadeEnd}%, #00CFCF 100%)`;
    } else {
      const firstStop = (33 / percent) * 100;
      const secondStop = (66 / percent) * 100;
      const fadeStart1 = Math.max(0, firstStop - 8);
      const fadeEnd1 = Math.min(100, firstStop + 8);
      const fadeStart2 = Math.max(0, secondStop - 8);
      const fadeEnd2 = Math.min(100, secondStop + 8);
      return `linear-gradient(90deg, #FFD166 0%, #FFD166 ${fadeStart1}%, #00CFCF ${fadeEnd1}%, #00CFCF ${fadeStart2}%, #009975 ${fadeEnd2}%, #009975 100%)`;
    }
  };

  // VARIANTES DE COLORES
  const colorMap = {
    red: "#FF4D6D",
    emerald: "#009975",
    cyan: "#00CFCF",
    multicolor: getMulticolorGradient(porcentajeReal)
  };

  const colorValue = colorMap[color] || colorMap.emerald;

  // Tamaños
  const sizeMap = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  const heightClass = sizeMap[tamaño] || sizeMap.md;

  return (
    <div className={className}>
      {(label || mostrarPorcentaje) && (
        <div className="mb-2 flex items-center justify-between" style={{ 
          fontSize: 'var(--text-sm)', 
          color: 'var(--text-secondary)' 
        }}>
          {label && <span>{label}</span>}
          {mostrarPorcentaje && <span>{Math.round(porcentajeReal)}%</span>}
        </div>
      )}

      <div className={`overflow-hidden ${redondeado ? 'rounded-full' : ''} bg-slate-800 ${borde ? 'border border-slate-700' : ''}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500`}
          style={{
            width: `${porcentajeReal}%`,
            background: color === "multicolor" ? colorValue : colorValue,
          }}
        />
      </div>
    </div>
  );
}
