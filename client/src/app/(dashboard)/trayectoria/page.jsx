'use client';

import { useState } from 'react';
import { trayectoriaData } from '@/lib/mock/trayectoriaData';

export default function TrayectoriaSection() {
  const { tramo, metrics, pacs, milestones } = trayectoriaData;

  const [selectedPac, setSelectedPac] = useState(pacs[0]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="glass-effect-dark border-glass rounded-2xl p-6">
        <p className="text-[var(--text-xs)] text-[var(--text-secondary)] uppercase">
          Trayectoria operativa del tramo
        </p>

        <h2 className="text-[var(--text-2xl)] font-bold">
          {tramo.id} · {tramo.name}
        </h2>

        <p className="text-[var(--text-sm)] text-[var(--text-secondary)] mt-2 max-w-2xl">
          {tramo.description}
        </p>

        <div className="flex gap-3 mt-4 flex-wrap">
          <Metric label="PAC actual" value={metrics.currentPac} />
          
          <Metric label="PACs visibles" value={metrics.totalPacs} />
          <Metric label="Microacciones" value={metrics.microactions} />
          <Metric label="Evidencias" value={metrics.evidences} />
        </div>
      </div>

      {/* TIMELINE PRO */}
      <div className="glass-effect border-glass rounded-2xl p-6">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[var(--text-xs)] text-[var(--text-secondary)] uppercase mb-1">
              Secuencia operativa por PAC
            </p>

            <h3 className="text-[var(--text-lg)] font-semibold">
              Timeline estructural del tramo
            </h3>
          </div>

          {/* LEYENDA */}
          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
            <LegendDot color="success" label="completado" />
            <LegendDot color="info" label="actual" />
            <LegendDot color="neutral" label="pendiente" />
          </div>
        </div>

        {/* SCROLL */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {pacs.map((p, i) => (
            <PacCard
              key={p.code}
              pac={p}
              isSelected={selectedPac.code === p.code}
              onClick={() => setSelectedPac(p)}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* LOWER GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* HITOS */}
        <div className="glass-effect border-glass rounded-2xl p-6">
          <h4 className="text-[var(--text-sm)] uppercase text-[var(--text-secondary)] mb-4">
            Hitos principales del recorrido
          </h4>

          {milestones.map((m, i) => (
            <div key={i} className="flex items-start gap-3 mb-3">
              <div className="w-2 h-2 bg-[var(--status-info)] rounded-full mt-2" />
              <div>
                <p className="text-sm">{m.text}</p>
                <p className="text-xs text-[var(--text-secondary)]">{m.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DETALLE PAC */}
        <div className="md:col-span-2 glass-effect border-glass rounded-2xl p-6">
          <p className="text-[var(--text-xs)] text-[var(--text-secondary)] uppercase mb-2">
            Detalle del PAC seleccionado
          </p>

          <div className="flex justify-between mb-6">
            <div>
              <h3 className="text-[var(--text-xl)] font-bold">
                {selectedPac.code} · {selectedPac.category}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {selectedPac.area}
              </p>
            </div>

            {/* STATUS DINÁMICO */}
            <span
              className={`text-xs px-3 py-1 rounded-full
              ${
                selectedPac.status === 'done'
                  ? 'bg-[rgba(0,153,117,0.2)] text-[var(--status-success)]'
                  : selectedPac.status === 'current'
                    ? 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]'
                    : 'bg-[rgba(255,209,102,0.2)] text-[var(--status-warning)]'
              }`}
            >
              {selectedPac.status === 'done'
                ? 'Completado'
                : selectedPac.status === 'current'
                  ? 'En tránsito'
                  : 'Pendiente'}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* TITULO + OBJETIVO */}
            <div className="glass-effect border-glass p-4 rounded-xl">
              <p className="text-[var(--text-xs)] text-[var(--text-secondary)] mb-2 uppercase">
                Título del PAC
              </p>

              <p className="text-[var(--text-sm)] font-semibold mb-4">
                {selectedPac.title}
              </p>

              <p className="text-[var(--text-xs)] text-[var(--text-secondary)] mb-2 uppercase">
                Objetivo estructural
              </p>

              <p className="text-[var(--text-sm)]">
                {selectedPac.detail.objective}
              </p>
            </div>

            {/* EVIDENCIA */}
            <div className="glass-effect border-glass p-4 rounded-xl">
              <p className="text-[var(--text-xs)] text-[var(--text-secondary)] mb-2 uppercase">
                Señal probatoria visible
              </p>

              <p className="text-sm">{selectedPac.detail.evidence.title}</p>

              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {selectedPac.detail.evidence.description}
              </p>
            </div>

            {/* MICROACCIONES */}
            <div className="glass-effect border-glass p-4 rounded-xl">
              <p className="text-[var(--text-xs)] text-[var(--text-secondary)] mb-3 uppercase">
                Microacciones ejecutadas
              </p>

              <div className="space-y-2">
                {selectedPac.detail.microactions.map((m, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-[var(--status-success)]">●</span>
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* DERECHA */}
            <div className="flex flex-col gap-4">
              <div className="glass-effect border-glass p-4 rounded-xl">
                <p className="text-[var(--text-xs)] text-[var(--text-secondary)] mb-2 uppercase">
                  Corte temporal
                </p>

                <div className="flex justify-between text-sm">
                  <span>Inicio</span>
                  <span>{selectedPac.detail.timeline.start}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Cierre</span>
                  <span>{selectedPac.detail.timeline.end}</span>
                </div>
              </div>

              <div className="glass-effect border-glass p-4 rounded-xl">
                <p className="text-[var(--text-xs)] text-[var(--text-secondary)] mb-2 uppercase">
                  Lectura de diseño
                </p>

                <p className="text-sm text-[var(--text-secondary)]">
                  La profundidad de esta capa se concentra en una unidad
                  operativa seleccionada. El timeline organiza la trayectoria;
                  el panel lateral sostiene la verificabilidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTES */

const Metric = ({ label, value }) => (
  <div className="glass-effect border-glass px-4 py-2 rounded-xl">
    <p className="text-[var(--text-xs)] text-[var(--text-secondary)]">
      {label}
    </p>
    <p className="text-[var(--text-sm)]">{value}</p>
  </div>
);

import { motion } from 'framer-motion';

const PacCard = ({ pac, isSelected, onClick, index }) => {
  const isDone = pac.status === 'done';
  const isCurrent = pac.status === 'current';
  const isPending = pac.status === 'pending';

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        min-w-[240px] p-5 rounded-xl cursor-pointer
        transition-all duration-300 backdrop-blur border
        ${isDone && 'bg-[rgba(0,153,117,0.12)] border-glass-green'}
        ${isCurrent && 'bg-[rgba(0,207,207,0.12)] border-glass'}
        ${isPending && 'bg-white/5 border-glass-dark'}
        ${
          isSelected &&
          'ring-2 ring-[var(--color-turquoise)] shadow-[0_0_20px_rgba(0,207,207,0.15)]'
        }
      `}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm font-semibold">{pac.code}</p>
          <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wide">
            {pac.category}
          </p>
        </div>

        <StatusDot status={pac.status} />
      </div>

      {/* BODY */}
      <p className="text-sm font-medium leading-snug mb-2">{pac.title}</p>

      <p className="text-xs text-[var(--text-secondary)] mb-4">{pac.area}</p>

      {/* FOOTER */}
      <p className="text-[10px] opacity-70">
        {isDone ? 'Completado' : isCurrent ? 'En tránsito' : 'Pendiente'}
      </p>
    </motion.div>
  );
};

const StatusDot = ({ status }) => {
  if (status === 'done') {
    return <span className="text-[var(--status-success)] text-sm">✔</span>;
  }

  if (status === 'current') {
    return (
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--status-info)] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--status-info)]"></span>
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span className="w-3 h-3 rounded-full border border-[var(--text-secondary)] inline-block" />
    );
  }

  return null;
};

const LegendDot = ({ color, label }) => {
  const map = {
    success: 'bg-[var(--status-success)]',
    info: 'bg-[var(--status-info)]',
    neutral: 'border border-[var(--text-secondary)]',
  };

  return (
    <div className="flex items-center gap-1">
      <span className={`w-2 h-2 rounded-full ${map[color]}`} />
      {label}
    </div>
  );
};
