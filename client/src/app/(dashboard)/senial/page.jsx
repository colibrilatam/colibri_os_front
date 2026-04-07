import NftAvatar from "@/components/señal/NftAvatar";
import ProgressBar from "@/components/ProgressBar";
import { project } from "@/lib/mock-data";

export default function IdentidadPage() {
  

  const progressPct = (project.approvedPacs / project.totalPacs) * 100;
  const icPct = (project.ic / project.icMax) * 100;

  return (
    <main className="min-h-screen glass-effect border-glass rounded-2xl">
      {/* Header */}
      <div className="p-4">
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-cream)' }}>
          Identidad del Proyecto
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
          Estado, reputación y comportamiento dentro de Colibrí OS
        </p>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mx-auto w-full space-y-6">
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="glass-effect border-glass  rounded-3xl p-6 xl:col-span-5">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--text-secondary)' }}>
                    Identidad reputacional
                  </div>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-cream)' }}>
                    NFT Colibrí dinámico
                  </h2>
                  <p className="mt-1" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    Último tramo alcanzado: {project.nftState}
                  </p>
                </div>
                <span className="rounded-full border border-cyan-800/70 bg-cyan-950/40 px-3 py-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-turquoise)' }}>
                  Estado visual {project.nftState}
                </span>
              </div>

              <div className="relative flex h-[320px] items-center justify-center overflow-hidden rounded-[28px] glass-effect-dark border-glass">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_50%_55%,rgba(16,185,129,0.14),transparent_32%)]" />
                <NftAvatar size="lg" />
              </div>
            </div>

            <div className="space-y-6 xl:col-span-7">
              <div className="glass-effect border-glass rounded-3xl p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-2 text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--text-secondary)' }}>
                      Señal reputacional actual
                    </div>
                    <div className="flex items-end gap-3">
                      <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-cream)' }}>
                        {project.ic.toFixed(2)}
                      </div>
                      <div style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>/ {project.icMax.toFixed(2)}</div>
                    </div>
                    <div className="mt-3" style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
                      {project.icNarrative}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-800/60 bg-emerald-950/50 px-3 py-1.5" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-emerald)' }}>
                      <span>▲</span>
                      <span>{project.trendLabel}</span>
                    </div>
                  </div>

                  <div className="w-full md:max-w-xs">
                    <ProgressBar 
                      progreso={icPct}
                      color="multicolor"
                      tamaño="md"
                      label="Lectura sobre escala completa"
                      mostrarPorcentaje={true}
                    />
                    <div className="mt-4 flex h-12 items-end gap-1">
                      {[22, 28, 31, 31, 31, 40, 52].map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-md border border-slate-600 bg-emerald-700"
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                    <div className="mt-2" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      Microtendencia reciente
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-effect border-glass rounded-3xl p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--text-secondary)' }}>
                      Estado actual del avance
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                      <div className="glass-effect-dark border-glass rounded-2xl p-4">
                        <div className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>
                          PAC actual
                        </div>
                        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', color: 'var(--color-cream)' }}>
                          {project.currentPac}
                        </div>
                      </div>
                      <div className="glass-effect-dark border-glass rounded-2xl p-4">
                        <div className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>
                          PACs aprobados
                        </div>
                        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', color: 'var(--color-cream)' }}>
                          {project.approvedPacs} de {project.totalPacs}
                        </div>
                      </div>
                      <div className="glass-effect-dark border-glass rounded-2xl p-4">
                        <div className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>
                          Microacciones acumuladas
                        </div>
                        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', color: 'var(--color-cream)' }}>
                          {project.microActions} / 21
                        </div>
                      </div>
                      <div className="glass-effect-dark border-glass rounded-2xl p-4">
                        <div className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>
                          Evidencias aprobadas
                        </div>
                        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', color: 'var(--color-cream)' }}>
                          {project.evidences} / 7
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full glass-effect-dark border-glass rounded-2xl p-4 lg:max-w-xs">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>
                      Próximo hito
                    </div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', color: 'var(--color-cream)' }}>
                      {project.nextMilestone}
                    </div>
                    
                    <ProgressBar 
                      progreso={Math.round(progressPct)}
                      color="emerald"
                      tamaño="md"
                      mostrarPorcentaje={true}
                      label="Progreso del tramo"
                    />
                  </div>
                </div>
              </div>

              
            </div>
            <div className="glass-effect border-glass rounded-3xl p-6 xl:col-span-12">
                <div className="mb-3 text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--text-secondary)' }}>
                  Contexto estructural del tramo
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="glass-effect-red border-glass rounded-2xl p-4 flex-1">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>
                      Incertidumbre dominante
                    </div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', color: 'var(--color-cream)', lineHeight: 'var(--leading-normal)' }}>
                      {project.uncertainty}
                    </div>
                    <div className="mt-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                      Contexto metodológico del tramo
                    </div>
                  </div>
                  <div className="glass-effect-red border-glass rounded-2xl p-4 flex-1">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>
                      Riesgo principal del tramo
                    </div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', color: 'var(--color-cream)', lineHeight: 'var(--leading-normal)' }}>
                      {project.primaryRisk}
                    </div>
                    <div className="mt-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                      No expresa score fino del proyecto
                    </div>
                  </div>
                  <div className="glass-effect-dark border-glass rounded-2xl p-4 flex-1">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>
                      Ventana estimada
                    </div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', color: 'var(--color-cream)', lineHeight: 'var(--leading-normal)' }}>
                      {project.window}
                    </div>
                    <div className="mt-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                      Horizonte de trabajo esperado
                    </div>
                  </div>
                </div>
              </div>
          </section>
        </div>
      </div>
    </main>
  );
}


