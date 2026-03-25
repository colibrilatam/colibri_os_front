import EstadoTramo from './components/EstadoTramo';
import Microacciones from './components/Microacciones';

import { tramoMock, pacsMock } from '@/lib/mock-data';

export default function RutaDeVueloPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl text-white font-semibold">Ruta de Vuelo</h1>
        <p className="text-sm text-zinc-400">
          Progreso del tramo y ejecución de PACs
        </p>
      </div>

      {/* 🟣 Estado del tramo */}
      <div className="mb-8">
        <EstadoTramo tramo={tramoMock} />
      </div>

      {/* 🔵 PACs y microacciones */}
      <Microacciones pacs={pacsMock} />
    </main>
  );
}
