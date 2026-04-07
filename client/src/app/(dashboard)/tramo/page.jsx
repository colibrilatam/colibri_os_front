'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { tramoData } from '@/lib/mock/tramoData';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TramoDashboard() {
  const pacs = tramoData.pacs;

  return (
    <div className="p-6 min-h-screen">
      {/* HEADER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="glass-effect-dark border-glass rounded-2xl p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[var(--text-xs)] text-[var(--text-secondary)] uppercase">
              Cabecera analítica del tramo
            </p>
            <h1 className="text-[var(--text-2xl)] font-bold">
              {tramoData.id} · {tramoData.name}
            </h1>
            <p className="text-[var(--text-sm)] text-[var(--text-secondary)] mt-1">
              {tramoData.strategicQuestion}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* AVANCE PAC */}
        <AnimatedCard title="Avance por PAC">
          <div className="flex justify-between items-center mb-3">
            <Block>
              <h2 className="text-[var(--text-lg)] font-semibold">
                {tramoData.progress.currentPac.code}
              </h2>
              <p className="text-[var(--text-sm)] text-[var(--text-secondary)]">
                PAC actual · {tramoData.progress.currentPac.category} ·{' '}
                {tramoData.progress.currentPac.name}
              </p>
            </Block>

            <Block>
              <p className="text-[var(--text-xs)] text-[var(--text-secondary)]">
                PACs cerrados
              </p>
              <p className="text-[var(--text-lg)] font-semibold">
                {tramoData.progress.closedPacs} de{' '}
                {tramoData.progress.totalPacs}
              </p>
            </Block>
          </div>

          <div className="w-full bg-white/5 rounded-full h-2 mb-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tramoData.progress.percentage}%` }}
              transition={{ duration: 1 }}
              className="gradient-bar h-2 rounded-full"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {pacs.map((p, i) => {
              const isClosed = p.status === 'closed';
              const isCurrent = p.status === 'current';
              const isPending = p.status === 'pending';

              return (
                <motion.div
                  key={p.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`px-4 py-3 rounded-xl text-xs border flex flex-col items-center gap-1 min-w-[80px] ${
                    isClosed
                      ? 'bg-[rgba(0,153,117,0.15)] border-glass-green text-[var(--status-success)]'
                      : isCurrent
                        ? 'bg-[rgba(0,207,207,0.15)] border-glass text-[var(--status-info)]'
                        : 'bg-white/5 border-glass-dark text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{p.code}</span>
                    {isClosed && <span>✔</span>}
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-[var(--status-info)]" />
                    )}
                    {isPending && (
                      <span className="w-3 h-3 rounded-full border border-[var(--text-secondary)]" />
                    )}
                  </div>

                  <div className="text-[10px] opacity-70">
                    {isClosed ? 'cerrado' : isCurrent ? 'actual' : 'pendiente'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatedCard>

        {/* DENSIDAD */}
        <AnimatedCard title="Densidad de avance">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <MetricBox
              label="Microacciones"
              value={tramoData.density.microactions}
              sub="Actividad visible"
            />
            <MetricBox
              label="Evidencias"
              value={tramoData.density.evidences}
              sub="Soporte probatorio"
            />
          </div>

          <Block className="text-[var(--text-sm)] text-[var(--text-secondary)]">
            {tramoData.density.message}
          </Block>
        </AnimatedCard>

        {/* CATEGORÍAS */}
        <AnimatedCard title="Categorías activadas">
          <div className="flex flex-wrap gap-3">
            {tramoData.categories.map((c, i) => {
              const isDone = c.status === 'done';
              const isCurrent = c.status === 'current';
              const isNext = c.status === 'next';

              return (
                <div
                  key={c.code}
                  className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 border ${
                    isDone
                      ? 'bg-[rgba(0,153,117,0.15)] border-glass-green text-[var(--status-success)]'
                      : isCurrent
                        ? 'bg-[rgba(0,207,207,0.15)] border-glass text-[var(--status-info)]'
                        : 'bg-[rgba(255,209,102,0.15)] border-glass text-[var(--status-warning)]'
                  }`}
                >
                  <span className="font-medium">{c.code}</span>
                  <span>·</span>
                  <span>{c.label}</span>

                  {isDone && <span>✔</span>}
                  {isCurrent && (
                    <span className="text-xs opacity-80">actual</span>
                  )}
                  {isNext && (
                    <span className="text-xs opacity-80">próxima</span>
                  )}
                </div>
              );
            })}
          </div>
        </AnimatedCard>

        {/* SEÑALES */}
        <AnimatedCard title="Señales de avance">
          {tramoData.signals.map((s, i) => (
            <Block key={i} ok={s.type === 'success'}>
              {s.text}
            </Block>
          ))}
        </AnimatedCard>

        {/* BLOQUEOS */}
        <AnimatedCard title="Bloqueos">
          {tramoData.blockers.map((b, i) => (
            <Block key={i}>{b}</Block>
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
    className="glass-effect border-glass rounded-2xl p-6"
  >
    <h3 className="text-[var(--text-sm)] uppercase text-[var(--text-secondary)] mb-4">
      {title}
    </h3>
    {children}
  </motion.div>
);

const InfoBox = ({ label, value }) => (
  <div className="glass-effect border-glass px-4 py-2 rounded-xl">
    <p className="text-[var(--text-xs)] text-[var(--text-secondary)]">
      {label}
    </p>
    <p className="text-[var(--text-sm)]">{value}</p>
  </div>
);

const MetricBox = ({ label, value, sub }) => (
  <div className="glass-effect border-glass p-4 rounded-xl text-center">
    <p className="text-[var(--text-xs)] text-[var(--text-secondary)]">
      {label}
    </p>
    <p className="text-[var(--text-2xl)] font-bold">{value}</p>
    <p className="text-[10px] text-[var(--text-secondary)]">{sub}</p>
  </div>
);

const Signal = ({ children, ok }) => (
  <div className="flex justify-between items-center py-2 text-[var(--text-sm)]">
    <span>{children}</span>
    <span
      className={
        ok ? 'text-[var(--status-success)]' : 'text-[var(--status-warning)]'
      }
    >
      {ok ? '✔' : '⚠'}
    </span>
  </div>
);

const Block = ({ children }) => (
  <div className="glass-effect border-glass p-3 rounded-xl text-[var(--text-sm)] mb-2">
    {children}
  </div>
);
