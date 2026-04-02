import EstadoTramo from './components/EstadoTramo';
import Microacciones from './components/Microacciones';
import ActionsManagement from './components/ActionsManagement';

import { tramoMock, pacsMock, actionsManagementMock } from '@/lib/mock-data';

export default function RutaDeVueloPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl text-white font-semibold">Ruta de Vuelo</h1>
          <p className="text-lg text-zinc-400">
            Progreso, ejecución y próximos pasos del proyecto
          </p>
        </div>

        {/* 🟣 ESTADO GLOBAL */}
        <EstadoTramo tramo={tramoMock} />

        {/* 🔵 ACCIÓN ACTUAL (LO MÁS IMPORTANTE) */}
        <ActionsManagement data={actionsManagementMock} />

        {/* 🧠 MAPA COMPLETO */}
        <div>
          <h2 className="text-lg text-white font-semibold mb-4">Mapa del tramo</h2>

          <Microacciones pacs={pacsMock} />
        </div>
      </div>
    </main>
  );
}
