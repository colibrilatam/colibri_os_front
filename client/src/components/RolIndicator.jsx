'use client';

import { useUserStore } from '@/lib/store';

export default function RolIndicator() {
  const rol = useUserStore((state) => state.rol);

  const mensajesPorRol = {
    CEO: 'Vista completa de gestión y reportes',
    Colaborador: 'Vista de proyectos y tareas asignadas',
    Mecenas: 'Vista de impacto y resultados',
    Visitante: 'Vista pública limitada',
  };

  return (
    <div className="glass-effect border-glass p-4 mb-4">
      <p className="text-base text-zinc-300">Tipo de usuario actual:</p>
      <p className="text-xl font-semibold text-white mt-1">{rol}</p>
      <p className="text-base text-zinc-400 mt-2">{mensajesPorRol[rol]}</p>
    </div>
  );
}
