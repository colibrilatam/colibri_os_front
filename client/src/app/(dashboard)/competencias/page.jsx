import RadarCompetencias from './components/RadarCompetencias';
import { radarCompetenciasMock } from '@/lib/mock-data';

export default function CompetenciasPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl text-white font-semibold">
            Competencias
          </h1>
          <p className="text-sm text-zinc-400">
            Análisis del desarrollo del proyecto por categoría
          </p>
        </div>

        {/* Radar */}
        <RadarCompetencias data={radarCompetenciasMock} />

      </div>
    </main>
  );
}