'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useProject } from '@/lib/projectContext';

import Evolution from './components/Evolution';
import NotificationPopup from '@/components/NotificationPopup';

// SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

//import { pacConfig } from './components/pacConfig';
import { useUserStore } from '@/lib/store';
import { getPacConfig, defaultEvidence } from './components/pacConfig';

export default function TrayectoriaSection() {
  const { tramoData, dbProject, mockProject } = useProject();

  const [notification, setNotification] = useState(false);

  const setSubioTramo = useUserStore((state) => state.setSubioTramo);

  const rol = useUserStore((state) => state.rol);

  const isMobile = useIsMobile();

  /* =========================
     🔗 DATA MAPPING REAL
  ========================= */

  const { project, currentState, pacProgress, evidence, microactionInstances } =
    mockProject;

  const mapStatus = {
    approved: 'done',
    in_progress: 'current',
    pending: 'pending',
  };

  // Estado local para el progreso dinámico del PAC T3-C7
  // Inicializamos siempre con el estado por defecto (ninguna acción completada)
  // para que coincida en servidor y cliente durante la hidratación.
  const [dynamicProgress, setDynamicProgress] = useState({
    microactionsCompleted: [false, false, false],
    evidenceCompleted: false,
    pacCompleted: false,
  });

  // Cargar el progreso guardado SOLO en el cliente después del montaje
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('aulapuente_t3_c7_progress');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setDynamicProgress(parsed);
        } catch (e) {}
      }
    }
  }, []);

  // Función para actualizar microacción
  const completeMicroaction = (index, file) => {
    setDynamicProgress((prev) => {
      const newMicro = [...prev.microactionsCompleted];
      newMicro[index] = true;
      const allMicroDone = newMicro.every(Boolean);
      const allDone = allMicroDone && prev.evidenceCompleted;
      const newProgress = {
        ...prev,
        microactionsCompleted: newMicro,
        pacCompleted: allDone,
      };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'aulapuente_t3_c7_progress',
          JSON.stringify(newProgress),
        );
      }
      return newProgress;
    });
  };

  // Función para completar evidencia
  const completeEvidence = (file) => {
    setDynamicProgress((prev) => {
      const allMicroDone = prev.microactionsCompleted.every(Boolean);
      const allDone = allMicroDone && true;
      const newProgress = {
        ...prev,
        evidenceCompleted: true,
        pacCompleted: allDone,
      };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'aulapuente_t3_c7_progress',
          JSON.stringify(newProgress),
        );
      }

      return newProgress;
    });
    setSubioTramo(true);
    setNotification(true);
  };

  // Calcular métricas dinámicas
  const completedMicroactionsCount =
    18 + dynamicProgress.microactionsCompleted.filter(Boolean).length;
  const completedEvidencesCount =
    6 + (dynamicProgress.evidenceCompleted ? 1 : 0);
  const currentPacCompletedMicroactions =
    dynamicProgress.microactionsCompleted.filter(Boolean).length;

  // Construir array de PACs con estado actualizado para T3-C7
  const buildPacs = () => {
    const basePacs = pacProgress.map((p) => {
      const pacEvidence = evidence.find((e) => e.pacId === p.id);
      const microactions = microactionInstances
        .filter((m) => m.pacId === p.id && m.status === 'completed')
        .map((m) => m.title);
      return {
        code: p.pacCode,
        category: p.categoryName,
        area: p.categoryName,
        title: p.title,
        status:
          p.pacCode === 'T3-C7' && dynamicProgress.pacCompleted
            ? 'done'
            : mapStatus[p.status],
        detail: {
          objective: p.title,
          evidence: {
            title: pacEvidence?.title || 'Sin evidencia aún',
            description: pacEvidence?.summary || '',
          },
          microactions,
          timeline: {
            start: p.startedAt
              ? new Date(p.startedAt).toLocaleDateString()
              : '-',
            end: p.closedAt
              ? new Date(p.closedAt).toLocaleDateString()
              : 'En curso',
          },
        },
      };
    });
    return basePacs;
  };

  const pacs = buildPacs();

  const metrics = {
    currentPac: currentState.currentPacCode,
    totalPacs: `${currentState.pacsApprovedInCurrentTramo} / 7`,
    microactions: `${currentState.microactionsCompletedCount} / 21`,
    evidences: `${currentState.validatedEvidenceCount} / 7`,
  };

  const milestones = pacProgress
    .filter((p) => p.status === 'approved')
    .map((p) => ({
      text: `${p.pacCode} completado`,
      date: new Date(p.closedAt).toLocaleDateString(),
    }));
  if (dynamicProgress.pacCompleted) {
    milestones.push({
      text: 'T3-C7 completado',
      date: new Date().toLocaleDateString(),
    });
  }

  const [selectedPac, setSelectedPac] = useState(pacs[0]);

  // Actualizar selectedPac si cambia el progreso dinámico y el seleccionado es T3-C7
  useEffect(() => {
    if (selectedPac && selectedPac.code === 'T3-C7') {
      const updatedPacs = buildPacs();
      const updatedLastPac = updatedPacs.find((p) => p.code === 'T3-C7');
      if (updatedLastPac && updatedLastPac.status !== selectedPac.status) {
        setSelectedPac(updatedLastPac);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicProgress]);

  return (
    <div className="space-y-6">
      {/*<button className='bg-red-500 p-10' onClick={() => { setNotification(true); console.log("activar", notification)}}>ACTIVAR</button>*/}
      {notification && (
        <NotificationPopup
          message="¡Felicitaciones! Completaste el Tramo 3. Tu Colibrí ha evolucionado"
          isOpen={notification}
          onClose={() => setNotification(false)}
        >
          <Evolution />
        </NotificationPopup>
      )}

      {/* HEADER */}
      <div className="glass-effect-dark border-glass rounded-2xl p-6">
        <p className="text-overline">Trayectoria operativa del tramo</p>

        <h2 className="text-h2">{currentState.currentTramoCode} · {currentState.currentTramoName}</h2>

        <p className="text-body mt-2 max-w-2xl">{project.shortDescription}</p>

        <div className="flex gap-3 mt-4 flex-wrap">
          <Metric label="PAC actual" value={metrics.currentPac} />
          <Metric label="PACs visibles" value={metrics.totalPacs} />
          <Metric label="Microacciones" value={metrics.microactions} />
          <Metric label="Evidencias" value={metrics.evidences} />
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
          </div>
        </div>

        {/* CARGA OPERATIVA DEL PAC (interactivo para T3-C7) */}
        <div className="glass-effect border-glass rounded-2xl p-6">
          <h4 className="text-micro-label mb-4">Carga operativa del PAC</h4>

          {selectedPac.code === 'T3-C7' ? (
            <DynamicCargaPac
              pac={selectedPac}
              dynamicProgress={dynamicProgress}
              onCompleteMicroaction={completeMicroaction}
              onCompleteEvidence={completeEvidence}
              rol={rol}
            />
          ) : (
            <CargaPac pac={selectedPac} />
          )}
        </div>
      </div>
    </div>
  );
}

/* Componente dinámico para T3-C7 */
const DynamicCargaPac = ({
  pac,
  dynamicProgress,
  onCompleteMicroaction,
  onCompleteEvidence,
  rol,
}) => {
  const isDone = pac.status === 'done';
  const isCurrent = pac.status === 'current';
  const isPending = pac.status === 'pending';

  const config = getPacConfig(pac.code);
  const inputs = config?.inputs || [];
  const evidenceText = config?.evidence || defaultEvidence;

  // Si ya está completado, mostrar solo mensaje final
  if (isDone) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl p-4 border border-glass-green bg-[rgba(0,153,117,0.08)]">
          <p className="text-body text-[var(--status-success)]">
            ✅ PAC completado. ¡Felicidades! Has completado todas las
            microacciones y la evidencia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inputs.map((item, i) => {
        const isCompleted = dynamicProgress.microactionsCompleted[i];
        return (
          <div
            key={i}
            className={`
              rounded-xl border p-4 transition
              ${isCompleted ? 'bg-[rgba(0,153,117,0.08)] border-glass-green' : 'bg-white/5 border-glass-dark'}
            `}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-body-lg">{item.title}</p>
                <p className="text-helper">{item.desc}</p>
              </div>
              <StatusBadge
                status={
                  isCompleted ? 'done' : isCurrent ? 'current' : 'pending'
                }
              />
            </div>

            {!isCompleted && rol !== 'mecenas_semilla' && (
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onCompleteMicroaction(i, e.target.files[0]);
                  }
                }}
                className="
                  w-full text-sm text-white border border-glass rounded-xl p-3
                  bg-white/5 backdrop-blur cursor-pointer
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm
                  file:font-medium file:bg-[rgba(0,207,207,0.15)] file:text-[var(--status-info)]
                  hover:border-[var(--color-turquoise)] hover:bg-[rgba(0,207,207,0.08)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-turquoise)] transition
                "
              />
            )}

            {isCompleted && (
              <div className="mt-3 text-[var(--status-success)] text-body flex items-center gap-2">
                ✔ Microacción completada
              </div>
            )}

            {!isCompleted && isCurrent && (
              <div className="mt-3 text-[var(--status-info)] text-body flex items-center gap-2">
                ⏳ Pendiente de carga
              </div>
            )}
          </div>
        );
      })}

      {/* Bloque de evidencia */}
      <div
        className={`
          mt-4 rounded-xl p-4 border-dashed border text-white
          ${dynamicProgress.evidenceCompleted ? 'border-[var(--status-success)] bg-[rgba(0,153,117,0.05)]' : 'border-[var(--status-warning)] bg-[rgba(255,209,102,0.05)]'}
        `}
      >
        {dynamicProgress.evidenceCompleted ? (
          <p className="text-[var(--status-success)]">✔ {evidenceText.done}</p>
        ) : rol !== 'mecenas_semilla' ? (
          <>
            <p className="mb-2">{evidenceText.current}</p>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onCompleteEvidence(e.target.files[0]);
                }
              }}
              className="
                w-full text-sm text-white border border-glass rounded-xl p-3
                bg-white/5 backdrop-blur cursor-pointer
                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm
                file:font-medium file:bg-[rgba(0,207,207,0.15)] file:text-[var(--status-info)]
                hover:border-[var(--color-turquoise)] hover:bg-[rgba(0,207,207,0.08)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-turquoise)] transition
              "
            />
          </>
        ) : (
          <p>Evidencia pendiente</p>
        )}
      </div>
    </div>
  );
};

/* Componente CargaPac original para PACs no dinámicos */
const CargaPac = ({ pac }) => {
  const isDone = pac.status === 'done';
  const isCurrent = pac.status === 'current';
  const isPending = pac.status === 'pending';

  const config = getPacConfig(pac.code);

  const inputs = config?.inputs || [];
  const evidenceText = config?.evidence || defaultEvidence;

  /* const config = pacConfig[pac.code] || pacConfig[pac.area];
  const inputs = config?.inputs || [];
  const evidenceText = config?.evidence; */

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
          mt-4 rounded-xl p-4 border-dashed border text-white
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
