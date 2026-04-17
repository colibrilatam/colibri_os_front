'use client';
import NftAvatar from '@/components/señal/NftAvatar';
import ProgressBar from '@/components/ProgressBar';

// contexto
import { useProject } from '@/lib/projectContext';



export default function IdentidadPage() {

  // contexto
  const { 
    microActionInstanceData , 
    tramoData, 
    dbProject, 
    mockProject, 
    projectNftData, 
    evidenceData } = useProject();
 
 
 
  const { project, currentState, reputationSnapshot, pacProgress } = mockProject;

  // información de tramo actual

  // Progreso del tramo tomando como referencia el IC actual respecto al IC máximo del proyecto
  const PacProgress = Math.round((reputationSnapshot.icPublic % 1) * 100);
  //console.log(reputationSnapshot.icPublic,"PacProgress:", PacProgress)

  return (
    <main className="h-fit glass-effect border-glass rounded-2xl">
      {/*<TourButton tourName="dashboard-tour" /> */}
      {/* Header */}
      <div className="w-full glass-effect border-glass rounded-2xl p-4 lg:p-6">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-h3 mb-3">Estado actual del Proyecto</h1>

          <p className="text-body leading-relaxed">
            <span className="text-accent-cyan font-medium">{dbProject.projectName}</span>{' '}
            transita actualmente{' '}
            { tramoData.code === "T4" ? <span className="text-accent-emerald font-medium">T4</span> : (
              <>
            <span className="text-accent-emerald font-medium">
              {tramoData.code}
            </span>{' '}
            hacia{' '}
            <span className="text-accent-emerald font-medium">
              {`T${
                parseInt(tramoData.code?.replace('T', ''), 10) +
                1
              }` || 'Tn+1'}
            </span>
            </>
            )}
            , con una señal reputacional de{' '}
            <span className="text-accent-cyan font-medium">
              {reputationSnapshot.icPublic.toFixed(2)} / 6.00
            </span>
            , mientras reduce el Riesgo{' '}
            <span className="text-accent-amber font-medium">
              {project.primaryRisk || '[Riesgo]'}
            </span>{' '}
            y las siguientes incertidumbres:{' '}
            <span className="text-accent-amber font-medium">
              {project.uncertainty || '[Riesgo]'}
            </span>
            {/* {project.secondaryUncertainty && (
              <>*/}
            ,{' '}
            <span className="text-accent-amber font-medium">
              {project.secondaryUncertainty || '[Riesgo]'}
            </span>
            {/* </>
            )}
            {project.thirdUncertainty && (
              <>*/}{' '}
            y{' '}
            <span className="text-accent-amber font-medium">
              {project.thirdUncertainty || '[Riesgo]'}
            </span>
            {/*  </>
            )}*/}{' '}
            mientras avanza con señales verificables propias del tramo.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-1 lg:p-4">
        <div className="mx-auto w-full space-y-6">
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div
              id="nft"
              className="glass-effect border-glass  rounded-3xl p-6 xl:col-span-5"
            >
              <div className="mb-5 flex flex-col items-center justify-between ">
                <div
                  className="mb-2 text-xs uppercase tracking-[0.22em]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Identidad reputacional
                </div>
                <h2
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--text-primary)',
                  }}
                >
                  NFT Colibrí dinámico
                </h2>
                <span
                  className="m-2 rounded-full border border-cyan-800/70 bg-cyan-950/40 px-3 py-1"
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-turquoise)',
                  }}
                >
                  Estado visual {tramoData.code}
                </span>
              </div>

              <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[28px] glass-effect-dark border-glass p-6">
  {/* BACKGROUND */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_50%_55%,rgba(16,185,129,0.14),transparent_32%)]" />

  {/* CONTENIDO */}
  <div className="z-10 flex flex-col items-center gap-6">
    
    {/* NFT */}
    <div className="flex items-center justify-center">
      <NftAvatar size="lg" />
    </div>

    {/* TEXTO */}
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="text-sm text-[var(--text-secondary)]">
        <span className="text-[var(--text-primary)] font-medium">
          {tramoData.code} ·{' '}
          {tramoData.name || 'Nombre del tramo'}
        </span>
      </div>

      <div className="text-xs text-[var(--text-tertiary)] p-2 border-gray-500 border bg-gray-400/20  rounded-full"  >
        <span className="text-(var(--text-secondary))">
          {projectNftData.nftHash}
        </span>
      </div>
    </div>

  </div>
</div>
            </div>

            <div className="space-y-6 xl:col-span-7">
              <div
                id="ic"
                className="glass-effect border-glass rounded-3xl p-6"
              >
                <div className="flex flex-col content-center items-center gap-6 md:flex-row  md:justify-between">
                  <div className='w-full'>
                    <div
                      className="mb-2 text-xs uppercase tracking-[0.22em]"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Señal reputacional actual
                    </div>
                    <div className="flex items-end gap-3">
                      <div
                        style={{
                          fontSize: 'var(--text-4xl)',
                          fontWeight: 'var(--font-semibold)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {reputationSnapshot.icPublic}
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--text-lg)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        / {6.0}
                      </div>
                    </div>
                    <div
                      className="mt-3"
                      style={{
                        fontSize: 'var(--text-lg)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      { tramoData.code === "T4" ? <span className="text-accent-emerald font-medium">T4</span> : (
              <>
            <span className="text-accent-emerald font-medium">
              {tramoData.code}
            </span>{' '}
            en tránsito hacia{' '}
            <span className="text-accent-emerald font-medium">
              {`T${
                parseInt(tramoData.code?.replace('T', ''), 10) +
                1
              }` || 'Tn+1'}
            </span>
            </>
            )}
                    </div>
                  </div>

                  <div className=" w-full h-full">
                    <ProgressBar
                      progreso={PacProgress}
                      color="multicolor"
                      tamaño="lg"
                      label="Lectura sobre escala completa"
                      mostrarPorcentaje={true}
                    />
                   
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Estado actual del avance */}
                <div className="glass-effect border-glass rounded-3xl p-6 lg:col-span-3">
                  <div
                    className="mb-2 text-xs uppercase tracking-[0.22em]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Estado actual del avance
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                    <div className="glass-effect-dark border-glass rounded-2xl p-4">
                      <div
                        className="mb-2 text-xs uppercase tracking-[0.18em]"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        PAC actual
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-medium)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {currentState.currentPacCode}
                      </div>
                    </div>

                    <div className="glass-effect-dark border-glass rounded-2xl p-4">
                      <div
                        className="mb-2 text-xs uppercase tracking-[0.18em]"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        PACs aprobados
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-medium)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {currentState.pacsApprovedInCurrentTramo} de 7
                      </div>
                    </div>

                    {microActionInstanceData && (

                    <div className="glass-effect-dark border-glass rounded-2xl p-4">
                      <div
                        className="mb-2 text-xs uppercase tracking-[0.18em]"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        Microacciones acumuladas
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-medium)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {currentState.microactionsCompletedCount} / 21
                      </div>
                    </div>
                    )}

                        {evidenceData &&(
                    <div className="glass-effect-dark border-glass rounded-2xl p-4">
                      <div
                        className="mb-2 text-xs uppercase tracking-[0.18em]"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        Evidencias aprobadas
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-medium)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {currentState.validatedEvidenceCount} / 7
                      </div>
                    </div>
                    )}
                  </div>
                </div>

                {/* INCERTIDUMBRE DOMINANTE */}
                <div className="glass-effect border-glass rounded-3xl p-6 lg:col-span-2">
                  <div>
                    <div
                      className="mb-3 text-xs uppercase tracking-[0.22em]"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Incertidumbre dominante
                    </div>

                    <div className="mb-4 rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-center text-sm font-medium text-white">
                      {project.uncertainty || 'No definida'}
                    </div>

                    <div
                      className="mb-2 text-xs uppercase tracking-[0.18em]"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      Riesgos asociados
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-center text-sm text-white">
                        {project.primaryRisk || 'Riesgo 1'}
                      </div>

                      {/* {project.secondaryRisk && ( */}
                      <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-center text-sm text-white">
                        {project.secondaryRisk || 'Riesgo 2'}
                      </div>
                      {/* )} */}

                      {/* {project.thirdRisk && ( */}
                      <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-center text-sm text-white">
                        {project.thirdRisk || 'Riesgo 3'}
                      </div>
                      {/* )} */}
                    </div>
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
