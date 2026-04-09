'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { tramoData } from '@/lib/mock/tramoData';
import ProgressBar from '@/components/ProgressBar';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TramoDashboard() {
  const pacs = tramoData.pacs;

  return (
    <div className="min-h-screen max-w-[1400px] mx-auto overflow-x-hidden">
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
              {tramoData.id} · {tramoData.name}
            </h1>

            <p className="text-body-lg mt-1">{tramoData.strategicQuestion}</p>
          </div>

          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <InfoBox
              label="Incertidumbre dominante"
              value={tramoData.header.uncertainty}
            />
            <InfoBox
              label="Riesgo principal"
              value={tramoData.header.mainRisk}
            />
            <InfoBox label="Ventana" value={tramoData.header.window} />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* AVANCE PAC */}
        <AnimatedCard title="Avance por PAC">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-3">
            <div>
              <h2 className="text-h3">{tramoData.progress.currentPac.code}</h2>

              <p className="text-body--muted">
                PAC actual · {tramoData.progress.currentPac.category} ·{' '}
                {tramoData.progress.currentPac.name}
              </p>
            </div>

            <Block>
              <p className="text-micro-label">PACs cerrados</p>

              <p className="text-value-lg">
                {tramoData.progress.closedPacs} de{' '}
                {tramoData.progress.totalPacs}
              </p>
            </Block>
          </div>

          <ProgressBar
            progreso={tramoData.progress.percentage}
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

              return (
                <motion.div
                  key={p.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`px-3 py-2 rounded-xl border flex flex-col items-center ${statusStyles[p.status]}`}
                >
                  <div className="flex items-center gap-1 text-sm font-medium">
                    {p.code}
                    <span>{statusIcon[p.status]}</span>
                  </div>

                  <span className="text-xs opacity-80">
                    {statusLabel[p.status]}
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
              value={tramoData.density.microactions + ' / 21'}
              sub="Actividad visible"
            />
            <MetricBox
              label="Evidencias"
              value={tramoData.density.evidences + ' / 7'}
              sub="Soporte probatorio"
            />
          </div>

          <Block>
            <p className="text-body">{tramoData.density.message}</p>
          </Block>
        </AnimatedCard>

        {/* CATEGORÍAS */}
        <AnimatedCard title="Categorías activadas">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {tramoData.categories.map((c) => {
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
            {tramoData.signals.map((s, i) => (
              <Signal key={i} ok={s.type === 'success'}>
                {s.text}
              </Signal>
            ))}
          </div>
        </AnimatedCard>

        {/* BLOQUEOS */}
        <AnimatedCard title="Bloqueos">
          {tramoData.blockers.map((b, i) => (
            <Block key={i}>
              <p className="text-body">{b}</p>
            </Block>
          ))}
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
