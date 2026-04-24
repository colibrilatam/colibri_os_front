'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useProject } from '@/lib/projectContext';

// SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import { pacConfig } from './components/pacConfig';
import { useRef } from 'react';

export default function TrayectoriaSection() {
  const swiperRef = useRef(null);
  const { mockProject } = useProject();

  const isMobile = useIsMobile();

  /* =========================
     🔗 DATA MAPPING REAL
  ========================= */

  const {
    project = {},
    currentState = {},
    pacProgress = [],
    evidence = [],
    microactionInstances = [],
  } = mockProject || {};

  const mapStatus = {
    approved: 'done',
    in_progress: 'current',
    pending: 'pending',
  };

  const tramo = {
    id: currentState.currentTramoCode,
    name: currentState.currentTramoName,
    description: project.shortDescription,
  };

  const pacs = pacProgress.map((p) => {
    const pacEvidence = evidence.find((e) => e.pacId === p.id);

    const microactions = microactionInstances
      .filter((m) => m.pacId === p.id && m.status === 'completed')
      .map((m) => m.title);

    return {
      code: p.pacCode,
      category: p.categoryName,
      area: p.categoryName, // fallback (no existe campo explícito)
      title: p.title,
      status: mapStatus[p.status],

      detail: {
        objective: p.title, // fallback
        evidence: {
          title: pacEvidence?.title || 'Sin evidencia aún',
          description: pacEvidence?.summary || '',
        },
        microactions,
        timeline: {
          start: p.startedAt ? new Date(p.startedAt).toLocaleDateString() : '-',
          end: p.closedAt
            ? new Date(p.closedAt).toLocaleDateString()
            : 'En curso',
        },
      },
    };
  });

  const metrics = {
    currentPac: currentState.currentPacCode,
    totalPacs: pacProgress.length,
    microactions: currentState.microactionsCompletedCount,
    evidences: currentState.validatedEvidenceCount,
  };

  const milestones = pacProgress
    .filter((p) => p.status === 'approved')
    .map((p) => ({
      text: `${p.pacCode} completado`,
      date: new Date(p.closedAt).toLocaleDateString(),
    }));

  const [selectedPac, setSelectedPac] = useState(null);
  const selectedIndex = selectedPac
  ? pacs.findIndex((p) => p.code === selectedPac.code)
  : -1;
  useEffect(() => {
    if (!pacs.length) return;
  
    const current =
      pacs.find((p) => p.status === 'current') ||
      pacs.find((p) => p.status === 'pending') ||
      pacs[0];
  
    setSelectedPac(current);
  }, [pacs]);
  useEffect(() => {
    if (swiperRef.current && selectedIndex >= 0) {
      swiperRef.current.slideTo(selectedIndex);
    }
  }, [selectedIndex]);
  if (!pacs.length || !selectedPac) return null;
  /* ========================= */

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

        <Swiper
          modules={isMobile ? [] : [Navigation]}
          navigation={!isMobile}
          spaceBetween={16}
          slidesPerView={3}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            320: {
              slidesPerView: 1.05,
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
      <div className="grid md:grid-cols-2 gap-6">
        {/* DETALLE PAC */}
        <div className="glass-effect border-glass rounded-2xl p-6">
          <p className="text-overline mb-2">Detalle del PAC seleccionado</p>

          <div className="flex justify-between mb-6">
            {/* <div>
              <h3 className="text-h3">
                {selectedPac.code} · {selectedPac.category}
              </h3>
              <p className="text-helper">{selectedPac.area}</p>
            </div> */}

            {/* <span
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
            </span> */}
          </div>

          <div className="grid gap-4">
            {/* TITULO */}
            <div className="glass-effect border-glass p-4 rounded-xl">
              <p className="text-micro-label mb-2">Título del PAC</p>

              <p className="text-body-lg mb-4">{selectedPac.title}</p>

              <p className="text-micro-label mb-2">Objetivo estructural</p>

              <p className="text-body">{selectedPac.detail.objective}</p>
            </div>
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

            {/* EVIDENCIA */}
            {/* <div className="glass-effect border-glass p-4 rounded-xl">
              <p className="text-micro-label mb-2">Señal probatoria visible</p>

              <p className="text-body">{selectedPac.detail.evidence.title}</p>

              <p className="text-helper mt-1">
                {selectedPac.detail.evidence.description}
              </p>
            </div> */}

            {/* MICROACCIONES */}
            {/* <div className="glass-effect border-glass p-4 rounded-xl">
              <p className="text-micro-label mb-3">Microacciones ejecutadas</p>

              <div className="space-y-2">
                {selectedPac.detail.microactions.map((m, i) => (
                  <div key={i} className="flex gap-2 text-body">
                    <span className="text-[var(--status-success)]">●</span>
                    {m}
                  </div>
                ))}
              </div>
            </div> */}

            {/* DERECHA */}
            <div className="flex flex-col gap-4">
              {/* <div className="glass-effect border-glass p-4 rounded-xl">
                <p className="text-micro-label mb-2">Lectura de diseño</p>

                <p className="text-body--muted">
                  La profundidad de esta capa se concentra en una unidad
                  operativa seleccionada. El timeline organiza la trayectoria;
                  el panel lateral sostiene la verificabilidad.
                </p>
              </div> */}
            </div>
          </div>
        </div>

        {/* HITOS */}
        <div className="glass-effect border-glass rounded-2xl p-6">
          <h4 className="text-micro-label mb-4">Carga operativa del PAC</h4>

          <CargaPac pac={selectedPac} />
        </div>
      </div>
    </div>
  );
}

/* COMPONENTES (SIN CAMBIOS) */
const CargaPac = ({ pac }) => {
  const isDone = pac.status === 'done';
  const isCurrent = pac.status === 'current';
  const isPending = pac.status === 'pending';

  const config = pacConfig[pac.code] || pacConfig[pac.area];

  const inputs = config?.inputs || [];
  const evidenceText = config?.evidence;

  return (
    <div className="space-y-4">
      {inputs.map((item, i) => (
        <div
          key={i}
          className={`
            rounded-xl border p-4 transition
            ${isDone && 'bg-[rgba(0,153,117,0.08)] border-glass-green'}
            ${isCurrent && 'bg-[rgba(0,207,207,0.08)] border-glass'}
            ${isPending && 'bg-white/5 border-glass-dark'}
          `}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-body-lg">{item.title}</p>
              <p className="text-helper">{item.desc}</p>
            </div>

            <StatusBadge status={pac.status} />
          </div>

          {/* INPUT */}
          {!isDone && (
            <input
              type="file"
              className="
              w-full
              text-sm text-white
              border border-glass
              rounded-xl
              p-3
              bg-white/5 backdrop-blur
              cursor-pointer
          
              file:mr-4
              file:py-2
              file:px-4
              file:rounded-lg
              file:border-0
              file:text-sm
              file:font-medium
              file:bg-[rgba(0,207,207,0.15)]
              file:text-[var(--status-info)]
          
              hover:border-[var(--color-turquoise)]
              hover:bg-[rgba(0,207,207,0.08)]
          
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--color-turquoise)]
              transition
            "
            />
          )}

          {/* ESTADOS */}
          {isDone && (
            <div className="mt-3 text-[var(--status-success)] text-body flex items-center gap-2">
              ✔ Documento validado
            </div>
          )}

          {isCurrent && (
            <div className="mt-3 text-[var(--status-info)] text-body flex items-center gap-2">
              ⏳ Archivo en revisión / proceso
            </div>
          )}

          {isPending && (
            <div className="mt-3 text-[var(--status-warning)] text-body flex items-center gap-2">
              ⚠️ Pendiente de carga
            </div>
          )}
        </div>
      ))}

      {/* BLOQUE FINAL (tipo tus imágenes) */}
      <div
        className={`
          mt-4 rounded-xl p-4 border-dashed border
          ${isDone && 'border-[var(--status-success)] bg-[rgba(0,153,117,0.05)]'}
          ${isCurrent && 'border-[var(--status-info)] bg-[rgba(0,207,207,0.05)]'}
          ${isPending && 'border-[var(--status-warning)] bg-[rgba(255,209,102,0.05)]'}
        `}
      >
        {isDone && <p>{evidenceText.done}</p>}
        {isCurrent && <p>{evidenceText.current}</p>}
        {isPending && <p>{evidenceText.pending}</p>}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    done: 'bg-[rgba(0,153,117,0.2)] text-[var(--status-success)]',
    current: 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]',
    pending: 'bg-[rgba(255,209,102,0.2)] text-[var(--status-warning)]',
  };

  const label = {
    done: 'Completado',
    current: 'En tránsito',
    pending: 'Pendiente',
  };

  return (
    <span
      className={`inline-flex items-center justify-center
    w-fit h-fit self-start
    whitespace-nowrap
    text-badge px-3 py-1 rounded-full ${map[status]}`}
    >
      {label[status]}
    </span>
  );
};

const Metric = ({ label, value }) => (
  <div className="glass-effect border-glass px-4 py-2 rounded-xl">
    <p className="text-micro-label">{label}</p>
    <p className="text-value-card">{value}</p>
  </div>
);

// resto igual...

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
            {/* <p className="text-micro-label">{pac.category}</p> */}
            <p className="text-body-lg mb-2">{pac.category}</p>
          </div>

          <StatusDot status={pac.status} />
        </div>

        {/* <p className="text-body-lg mb-2">{pac.title}</p>
        <p className="text-helper mb-4">{pac.area}</p> */}
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
