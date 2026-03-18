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
    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
      <p className="text-sm text-gray-600">Tipo de usuario actual:</p>
      <p className="text-lg font-semibold text-blue-900">{rol}</p>
      <p className="text-sm text-gray-600 mt-2">{mensajesPorRol[rol]}</p>
    </div>
  );
}
