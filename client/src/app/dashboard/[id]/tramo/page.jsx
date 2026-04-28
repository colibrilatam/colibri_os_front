'use client';

import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProgressBar from '@/components/ProgressBar';
import { useIsMobile } from '@/hooks/useIsMobile';
import tramosMockData from '@/lib/mock/tramos-incertidumbre-riesgos.json'

import { useProject } from '@/lib/projectContext';
import { getUncertaintyLabel } from '@/lib/mappers/uncertainty';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TramoDashboard() {
  const isMobile = useIsMobile();

  // contexto
  const { tramoData, dbProject, mockProject } = useProject();
  const { project, currentState, pacProgress } = mockProject;
 /*console.log('tramoData---', tramoData);
  /* =========================
     🔗 DATA MAPPING REAL
  ========================= */

  const currentTramoMockData = tramosMockData.find(t => t.tranchCode === currentState.currentTramoCode);

  const tramo = {
    code: currentState.currentTramoCode,
    name: currentState.currentTramoName,
  };

  const pacs = pacProgress;

  const currentPacCode = currentState.currentPacCode;

  const currentPac = pacs.find((p) => p.pacCode === currentPacCode);

  const totalPacs = pacs.length;

  const closedPacs = currentState.pacsApprovedInCurrentTramo;

  const percentage = Math.round((closedPacs / totalPacs) * 100);

  const totalMicro = pacs.reduce((acc, p) => acc + p.requiredMicroactions, 0);

  const completedMicro = currentState.microactionsCompletedCount;

  const totalEvidence = pacs.reduce((acc, p) => acc + p.requiredEvidence, 0);

  const validatedEvidence = currentState.validatedEvidenceCount;

  const categories = pacs.map((p) => {
    let status = 'next';

    if (p.status === 'approved') status = 'done';
    else if (p.pacCode === currentPacCode) status = 'current';

    return {
      code: p.categoryCode,
      label: p.categoryName,
      status,
    };
  });

  const signals = [
    {
      type: 'success',
      text: `${closedPacs} PACs cerrados con evidencia validada`,
    },
    ...(currentPac?.status !== 'approved'
      ? [
          {
            type: 'warning',
            text: `PAC actual ${currentPacCode} aún requiere evidencia`,
          },
        ]
      : []),
  ];

  const blockers = pacs
    .filter((p) => p.status === 'in_progress' && !p.closureRuleSatisfied)
    .map(
      (p) =>
        `Bloqueo en ${p.pacCode}: faltan ${
          p.requiredMicroactions - p.completedMicroactions
        } microacciones o ${
          p.requiredEvidence - p.validatedEvidence
        } evidencias`,
    );

  const mapStatus = {
    approved: 'closed',
    in_progress: 'current',
    pending: 'pending',
  };

  const ventana =
    currentState.trajectoryStatus === 'in_progress'
      ? 'Tramo en ejecución'
      : 'Sin actividad';

  /* ========================= */

  return (
    <div className="min-h-screen mx-auto overflow-x-hidden">
      {/* HEADER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="glass-effect-dark border-glass rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-overline">Cabecera analítica del tramo</p>

            <h1 className="text-h1">
              {tramo.code} · {tramo.name}
            </h1>

            <p className="text-body-lg text-(--text-secondary) mt-1">{currentTramoMockData.tranchShortDesc}</p>
          </div>

          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <InfoBox  label="Incertidumbre dominante" value={currentTramoMockData.incertidumbre} />
            {/* <InfoBox label="Ventana" value={ventana} /> */}
          </div>
        </div>
      </motion.div>

      <div className='w-full  glass-effect rounded-2xl border-glass p-2 lg:p-4 mb-1 lg:mb-6 text-(--text-primary) gap-4 flex flex-col'>
        <div className=" rounded-2xl p-1 lg:p-4">
          <h3 className='text-(--text-tertiary) font-bold'>{currentTramoMockData.incertidumbre}</h3>
          <div className='text-(--text-primary) text-lg my-4' >{currentTramoMockData.incertidumbreDescCorta}</div>
          <div className=' max-w-3xl text-(--text-secondary) text-lg leading-relaxed'>{currentTramoMockData.incertidumbreDescLarga}</div>
        </div>
        <div className="glass-effect rounded-2xl border-glass p-1 lg:p-4">
          <h3 className="m-4 ">Riesgos</h3>
          <div className='flex flex-col lg:flex-row gap-2 justify-between'>
            
            {currentTramoMockData.riesgosPrincipales.map((r, i) => (
              <div className="flex flex-col items-center border-glass glass-effect rounded-2xl p-4" key={i}>

                <div key={i} className='w-fit justify-center flex items-center gap-2 glass-effect-red border-glass px-3 py-2 rounded-xl'>
                  <span className='text-center text-red-400 text-lg'>⚠</span>
                  <p className="text-center  text-red-400/80 text-lg font-bold">{r.nombre}</p>
                </div>

                <div className='text-start w-full my-4 text-(--text-primary) text-lg'>{r.descripcionCorta}</div>
                <div className='text-start w-full text-(--text-secondary) text-lg leading-relaxed'>{r.descripcionLarga}</div>

              </div>
            ))}

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* AVANCE PAC */}
        <AnimatedCard title="Avance por PAC">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-3">
            <div>
              <h2 className="text-h3">{currentPacCode}</h2>

              <p className="text-body--muted">
                PAC actual · {currentPac?.categoryName} · {currentPac?.title}
              </p>
            </div>

            <Block>
              <p className="text-micro-label">PACs cerrados</p>

              <p className="text-value-lg">
                {closedPacs} de {totalPacs}
              </p>
            </Block>
          </div>

          <ProgressBar
            progreso={percentage}
            color="multicolor"
            tamaño="md"
            label="Progreso estructural del tramo"
            mostrarPorcentaje={true}
            className="mb-4"
          />

          <div className="flex flex-wrap gap-2">
            {pacs.map((p, i) => {
              const statusStyles = {
                closed:
                  'bg-[rgba(0,153,117,0.15)] border-glass-green text-accent-emerald',
                current:
                  'bg-[rgba(0,207,207,0.15)] border-glass text-accent-cyan',
                pending: 'bg-white/5 border-glass-dark text-body--muted',
              };

              const statusLabel = {
                closed: 'cerrado',
                current: 'actual',
                pending: 'pendiente',
              };

              const statusIcon = {
                closed: '✓',
                current: '•',
                pending: '○',
              };

              const uiStatus = mapStatus[p.status];

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`px-3 py-2 rounded-xl border flex flex-col items-center ${statusStyles[uiStatus]}`}
                >
                  <div className="flex items-center gap-1 text-sm font-medium">
                    {p.pacCode}
                    <span>{statusIcon[uiStatus]}</span>
                  </div>

                  <span className="text-xs opacity-80">
                    {statusLabel[uiStatus]}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </AnimatedCard>

        {/* DENSIDAD */}
        <AnimatedCard title="Densidad de avance">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
            <MetricBox
              label="Microacciones"
              value={`${completedMicro} / ${totalMicro}`}
              sub="Actividad visible"
            />
            <MetricBox
              label="Evidencias"
              value={`${validatedEvidence} / ${totalEvidence}`}
              sub="Soporte probatorio"
            />
          </div>

          <Block>
            <p className="text-body">{currentState.nextMilestone}</p>
          </Block>
        </AnimatedCard>

        {/* CATEGORÍAS */}
        <AnimatedCard title="Categorías activadas">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((c) => {
              const isDone = c.status === 'done';
              const isCurrent = c.status === 'current';
              const isNext = c.status === 'next';

              return (
                <div
                  key={c.code}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 border text-sm sm:text-base
                    ${
                      isDone
                        ? 'bg-[rgba(0,153,117,0.15)] border-glass-green text-accent-emerald'
                        : isCurrent
                          ? 'bg-[rgba(0,207,207,0.15)] border-glass text-accent-cyan'
                          : 'bg-[rgba(255,209,102,0.15)] border-glass text-accent-amber'
                    }
                  `}
                >
                  <span>{c.code}</span>
                  <span className="text-helper">·</span>
                  <span>{c.label}</span>

                  {isDone && <span>✔</span>}
                  {isCurrent && <span className="text-legend">actual</span>}
                  {isNext && <span className="text-legend">próxima</span>}
                </div>
              );
            })}
          </div>
        </AnimatedCard>

        {/* SEÑALES */}
        <AnimatedCard title="Señales de avance">
          <div className="space-y-3">
            {signals.map((s, i) => (
              <Signal key={i} ok={s.type === 'success'}>
                {s.text}
              </Signal>
            ))}
          </div>
        </AnimatedCard>

        {/* BLOQUEOS */}
        <AnimatedCard title="Bloqueos">
          {blockers.length === 0 ? (
            <Block>
              <p className="text-body">Sin bloqueos activos</p>
            </Block>
          ) : (
            blockers.map((b, i) => (
              <Block key={i}>
                <p className="text-body">{b}</p>
              </Block>
            ))
          )}
        </AnimatedCard>
      </div>
    </div>
  );
}

/* COMPONENTES */

const AnimatedCard = ({ title, children }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="show"
    className="glass-effect border-glass rounded-2xl p-4 sm:p-6"
  >
    <p className="text-overline mb-4">{title}</p>
    {children}
  </motion.div>
);

const InfoBox = ({ label, value }) => (
  <div className="glass-effect border-glass px-3 py-2 sm:px-4 sm:py-2 rounded-xl">
    <p className="text-micro-label">{label}</p>
    <p className="text-body-lg">{value}</p>
  </div>
);

const MetricBox = ({ label, value, sub }) => (
  <div className="glass-effect border-glass p-3 sm:p-4 rounded-xl text-center">
    <p className="text-micro-label">{label}</p>
    <p className="text-value-lg">{value}</p>
    <p className="text-legend">{sub}</p>
  </div>
);

const Signal = ({ children, ok }) => {
  const styles = ok
    ? {
        container:
          'bg-[rgba(0,153,117,0.15)] border-glass-green text-accent-emerald',
        icon: 'bg-[rgba(0,153,117,0.2)] text-accent-emerald',
        symbol: '✓',
      }
    : {
        container: 'bg-[rgba(255,209,102,0.15)] border-glass text-accent-amber',
        icon: 'bg-[rgba(255,209,102,0.2)] text-accent-amber',
        symbol: '⚠',
      };

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-3 py-2 sm:px-4 sm:py-3 ${styles.container}`}
    >
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${styles.icon}`}
      >
        {styles.symbol}
      </div>

      <p className="text-body">{children}</p>
    </div>
  );
};

const Block = ({ children }) => (
  <div className="glass-effect border-glass p-3 sm:p-4 rounded-xl mb-2">
    {children}
  </div>
);
