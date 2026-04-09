'use client';

import { useState } from 'react';
import { trayectoriaData } from '@/lib/mock/trayectoriaData';
import { motion } from 'framer-motion';

// SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export default function TrayectoriaSection() {
  const { tramo, metrics, pacs, milestones } = trayectoriaData;
  const [selectedPac, setSelectedPac] = useState(pacs[0]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="glass-effect-dark border-glass rounded-2xl p-6">
        <p className="text-overline">Trayectoria operativa del tramo</p>

        <h2 className="text-h2">
          {tramo.id} · {tramo.name}
        </h2>

        <p className="text-body mt-2 max-w-2xl">{tramo.description}</p>

        <div className="flex gap-3 mt-4 flex-wrap">
          <Metric label="PAC actual" value={metrics.currentPac} />
          <Metric label="PACs visibles" value={metrics.totalPacs} />
          <Metric
            label="Microacciones"
            value={metrics.microactions + ' / 21'}
          />
          <Metric label="Evidencias" value={metrics.evidences + ' / 7'} />
        </div>
      </div>

      {/* TIMELINE */}
      <div className="glass-effect border-glass rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
          <div>
            <p className="text-overline mb-1">Secuencia operativa por PAC</p>
            <h3 className="text-h3">Timeline estructural del tramo</h3>
          </div>

          <div className="flex items-center gap-4 text-legend">
            <LegendDot color="success" label="completado" />
            <LegendDot color="info" label="actual" />
            <LegendDot color="neutral" label="pendiente" />
          </div>
        </div>

        {/* SWIPER */}
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={3}
          breakpoints={{
            320: {
              slidesPerView: 1.2, // 👈 1 card + preview
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1400: {
              slidesPerView: 4,
            },
          }}
          className="!overflow-visible"
        >
          {pacs.map((p, i) => (
            <SwiperSlide key={p.code} className="!h-auto">
              <PacCard
                pac={p}
                isSelected={selectedPac.code === p.code}
                onClick={() => setSelectedPac(p)}
                index={i}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* LOWER GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* DETALLE PAC */}
        <div className="md:col-span-2 glass-effect border-glass rounded-2xl p-6">
          <p className="text-overline mb-2">Detalle del PAC seleccionado</p>

          <div className="flex justify-between mb-6">
            <div>
              <h3 className="text-h3">
                {selectedPac.code} · {selectedPac.category}
              </h3>
              <p className="text-helper">{selectedPac.area}</p>
            </div>

            <span
              className={`
    inline-flex items-center justify-center
    w-fit h-fit self-start
    whitespace-nowrap
    text-badge px-3 py-1 rounded-full
    ${
      selectedPac.status === 'done'
        ? 'bg-[rgba(0,153,117,0.2)] text-[var(--status-success)]'
        : selectedPac.status === 'current'
          ? 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]'
          : 'bg-[rgba(255,209,102,0.2)] text-[var(--status-warning)]'
    }
  `}
            >
              {selectedPac.status === 'done'
                ? 'Completado'
                : selectedPac.status === 'current'
                  ? 'En tránsito'
                  : 'Pendiente'}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* TITULO */}
            <div className="glass-effect border-glass p-4 rounded-xl">
              <p className="text-micro-label mb-2">Título del PAC</p>

              <p className="text-body-lg mb-4">{selectedPac.title}</p>

              <p className="text-micro-label mb-2">Objetivo estructural</p>

              <p className="text-body">{selectedPac.detail.objective}</p>
            </div>

            {/* EVIDENCIA */}
            <div className="glass-effect border-glass p-4 rounded-xl">
              <p className="text-micro-label mb-2">Señal probatoria visible</p>

              <p className="text-body">{selectedPac.detail.evidence.title}</p>

              <p className="text-helper mt-1">
                {selectedPac.detail.evidence.description}
              </p>
            </div>

            {/* MICROACCIONES */}
            <div className="glass-effect border-glass p-4 rounded-xl">
              <p className="text-micro-label mb-3">Microacciones ejecutadas</p>

              <div className="space-y-2">
                {selectedPac.detail.microactions.map((m, i) => (
                  <div key={i} className="flex gap-2 text-body">
                    <span className="text-[var(--status-success)]">●</span>
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* DERECHA */}
            <div className="flex flex-col gap-4">
              <div className="glass-effect border-glass p-4 rounded-xl">
                <p className="text-micro-label mb-2">Corte temporal</p>

                <div className="flex justify-between text-body">
                  <span>Inicio</span>
                  <span>{selectedPac.detail.timeline.start}</span>
                </div>

                <div className="flex justify-between text-body">
                  <span>Cierre</span>
                  <span>{selectedPac.detail.timeline.end}</span>
                </div>
              </div>

              <div className="glass-effect border-glass p-4 rounded-xl">
                <p className="text-micro-label mb-2">Lectura de diseño</p>

                <p className="text-body--muted">
                  La profundidad de esta capa se concentra en una unidad
                  operativa seleccionada. El timeline organiza la trayectoria;
                  el panel lateral sostiene la verificabilidad.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* HITOS */}
        <div className="glass-effect border-glass rounded-2xl p-6">
          <h4 className="text-micro-label mb-4">
            Hitos principales del recorrido
          </h4>

          {milestones.map((m, i) => (
            <div key={i} className="flex items-start gap-3 mb-3">
              <div className="w-2 h-2 bg-[var(--status-info)] rounded-full mt-2" />
              <div>
                <p className="text-body">{m.text}</p>
                <p className="text-date">{m.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* COMPONENTES */

const Metric = ({ label, value }) => (
  <div className="glass-effect border-glass px-4 py-2 rounded-xl">
    <p className="text-micro-label">{label}</p>
    <p className="text-value-card">{value}</p>
  </div>
);

const PacCard = ({ pac, isSelected, onClick, index }) => {
  const isDone = pac.status === 'done';
  const isCurrent = pac.status === 'current';
  const isPending = pac.status === 'pending';

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className={`
        h-full p-5 rounded-2xl cursor-pointer
        transition-all duration-300 border backdrop-blur
        flex flex-col justify-between

        ${isDone && 'bg-[rgba(0,153,117,0.10)] border-glass-green'}
        ${isCurrent && 'bg-[rgba(0,207,207,0.10)] border-glass'}
        ${isPending && 'bg-white/5 border-glass-dark'}

        ${
          isSelected
            ? 'ring-2 ring-[var(--color-turquoise)] shadow-[0_10px_30px_rgba(0,207,207,0.25)] scale-[1.02]'
            : 'hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)]'
        }
      `}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-value-card">{pac.code}</p>
            <p className="text-micro-label">{pac.category}</p>
          </div>

          <StatusDot status={pac.status} />
        </div>

        <p className="text-body-lg mb-2">{pac.title}</p>
        <p className="text-helper mb-4">{pac.area}</p>
      </div>

      <p className="text-legend">
        {isDone ? 'Completado' : isCurrent ? 'En tránsito' : 'Pendiente'}
      </p>
    </motion.div>
  );
};

const StatusDot = ({ status }) => {
  if (status === 'done') {
    return <span className="text-[var(--status-success)]">✔</span>;
  }

  if (status === 'current') {
    return (
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--status-info)] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--status-info)]"></span>
      </span>
    );
  }

  return (
    <span className="w-3 h-3 rounded-full border border-[var(--text-secondary)] inline-block" />
  );
};

const LegendDot = ({ color, label }) => {
  const map = {
    success: 'text-[var(--status-success)]',
    info: 'bg-[var(--status-info)]',
    neutral: 'border border-[var(--text-secondary)]',
  };

  return (
    <div className="flex items-center gap-2 text-legend">
      <span
        className={`
          w-4 h-4 flex items-center justify-center rounded-full text-xs
          ${map[color]}
        `}
      >
        {color === 'success' ? '✔' : ''}
      </span>

      {label}
    </div>
  );
};
