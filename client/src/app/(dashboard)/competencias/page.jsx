import RadarCompetencias from './components/RadarCompetencias';
import MultivariateLineChart from './components/MultivariateLineChart';

import {
  radarCompetenciasMock,
  entrecompMock,
  wefSkillsMock,
} from '@/lib/mock-data';

export default function CompetenciasPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl text-white font-semibold">Competencias</h1>
          <p className="text-sm text-zinc-400">
            Evolución y análisis del desarrollo del proyecto
          </p>
        </div>

        {/* 🟢 Radar (estado actual) */}
        <RadarCompetencias data={radarCompetenciasMock} />

        {/* 🔵 EntreComp */}
        <MultivariateLineChart
          data={entrecompMock}
          title="EntreComp Plus"
          description="Evolución de competencias emprendedoras"
          lines={[{ key: 'equipo' }, { key: 'problema' }, { key: 'negocio' }]}
        />

        {/* 🟣 WEF Skills */}
        <MultivariateLineChart
          data={wefSkillsMock}
          title="WEF Skills"
          description="Evolución de habilidades clave"
          lines={[
            { key: 'pensamiento_critico' },
            { key: 'creatividad' },
            { key: 'liderazgo' },
          ]}
        />
      </div>
    </main>
  );
}
