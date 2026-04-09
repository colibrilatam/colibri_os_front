'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { tramoData } from '@/lib/mock/tramoData';
import { textStyles } from '@/design-system/typography';

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
            <p className={textStyles.labelXs}>Cabecera analítica del tramo</p>
            <h1 className={textStyles.headingLg}>
              {tramoData.id} · {tramoData.name}
            </h1>

            <p className={`${textStyles.bodyLg} mt-1`}>
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
            <div>
              <h2 className={textStyles.headingSm}>
                {tramoData.progress.currentPac.code}
              </h2>

              <p className={textStyles.bodyMuted}>
                PAC actual · {tramoData.progress.currentPac.category} ·{' '}
                {tramoData.progress.currentPac.name}
              </p>
            </div>

            <Block>
              <p className={textStyles.labelXs}>PACs cerrados</p>

              <p className={textStyles.metric}>
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

                  <div className="text-[13px] opacity-70">
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
              value={tramoData.density.microactions + ' / 21'}
              sub="Actividad visible"
            />
            <MetricBox
              label="Evidencias"
              value={tramoData.density.evidences + ' / 7'}
              sub="Soporte probatorio"
            />
          </div>

          <Block>{tramoData.density.message}</Block>
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
                  <span className={`${textStyles.bodyStrong}`}>{c.code}</span>
                  <span className={textStyles.subtle}>·</span>
                  <span className={textStyles.body}>{c.label}</span>

                  {isDone && <span>✔</span>}
                  {isCurrent && <span className={textStyles.meta}>actual</span>}
                  {isNext && <span className={textStyles.meta}>próxima</span>}
                </div>
              );
            })}
          </div>
        </AnimatedCard>

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
    <p className={`${textStyles.labelStrong} mb-4`}>{title}</p>

    {children}
  </motion.div>
);

const InfoBox = ({ label, value }) => (
  <div className="glass-effect border-glass px-4 py-2 rounded-xl">
    <p className={textStyles.labelXs}>{label}</p>
    <p className={textStyles.bodyStrong}>{value}</p>
  </div>
);

const MetricBox = ({ label, value, sub }) => (
  <div className="glass-effect border-glass p-4 rounded-xl text-center">
    <p className={textStyles.labelXs}>{label}</p>
    <p className={textStyles.metric}>{value}</p>
    <p className={textStyles.meta}>{sub}</p>
  </div>
);

const Signal = ({ children, ok }) => {
  const styles = ok
    ? {
        container: 'border-emerald-800/40 bg-emerald-950/40 text-emerald-300',
        icon: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
        symbol: '✓',
      }
    : {
        container: 'border-amber-800/40 bg-amber-950/40 text-amber-300',
        icon: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
        symbol: '⚠',
      };

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${styles.container}`}
    >
      {/* ICONO */}
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${styles.icon}`}
      >
        {styles.symbol}
      </div>

      {/* TEXTO */}
      <p className={textStyles.body}>{children}</p>
    </div>
  );
};

const Block = ({ children }) => (
  <div className="glass-effect border-glass p-3 rounded-xl mb-2">
    {children}
  </div>
);
