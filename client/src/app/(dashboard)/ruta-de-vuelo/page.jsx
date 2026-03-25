import Microacciones from './components/Microacciones';
import { pacsMock } from '@/lib/mock-data';

export default function RutaDeVueloPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-6">
      
      <div className="mb-8">
        <h1 className="text-2xl text-white font-semibold">
          Ruta de Vuelo
        </h1>
        <p className="text-sm text-zinc-400">
          Seguimiento de PACs, microacciones y evidencias
        </p>
      </div>

      <Microacciones pacs={pacsMock} />

    </main>
  );
}