"use client";
import { useRequest } from "@/hooks/useRequest";
import { projectsService } from "@/services/project";
import { useProject } from '@/lib/projectContext';
import { useEffect, useState, useMemo } from "react";
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useUserStore } from '@/lib/store';
import Evolution from "./components/Evolution";

// SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Loading from "./loading";

import UploadModal from "./UploadModal";
import NotificationPopup from "@/components/NotificationPopup";
import ProgressBar from "@/components/ProgressBar";

export default function NewTrayectoria() {
  // contexto para obtener el id del proyecto
  const { tramoData, dbProject } = useProject();

  const { execute: getMicroActions } = useRequest(projectsService.microActionInstance);
  const { execute: getEvidences } = useRequest(projectsService.evidences);
  const { execute: updatePacStatus } = useRequest(projectsService.updatePacStatus);
  const { execute: getProjectInfo } = useRequest(projectsService.getById);
  const { execute: getTramoInfo } = useRequest(projectsService.currentTramo);

  // Estados
  const [microActionData, setMicroActionData] = useState(null);
  const [projectInfo, setProjectInfo] = useState(null);
  const [tramoInfo, setTramoInfo] = useState(null);
  const [evidencesData, setEvidencesData] = useState(null);
  const [isPacCompleted, setIsPacCompleted] = useState(false);
  const [pacs, setPacs] = useState(null);
  const [selectedPac, setSelectedPac] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inProgressPac, setInProgressPac] = useState(null);
  const [inProgressPacActions, setInProgressPacActions] = useState({
    microactions: null,
    evidences: null
  });
  // Métricas
  const [selectedPacMetrics, setSelectedPacMetrics] = useState({
    microactions: null,
    evidences: null
  });
  const [metrics, setMetrics] = useState({
    currentPac: null,
    totalPacs: null,
    microactions: null,
    evidences: null,
  });
  // Estados del modal de carga
  const [uploadModal, setUploadModal] = useState({
    isOpen: false,
    type: null, // 'microaction' | 'evidence'
    data: null,
  });

  // Obtener el tramo actual
  const currentTramo = useMemo(() => tramoData.code, [tramoData]);

  // Obtener información de PACs
  const getPacsInfo = async () => {
    // Obtener información del backend y setear estados
    const { data: projectInfoResponse } = await getProjectInfo(dbProject.id);
    setProjectInfo(projectInfoResponse);
    const { data: tramoDataResponse } = await getTramoInfo(projectInfoResponse.currentTramoId);
    setTramoInfo(tramoDataResponse);

    // Filtrar los PACs que pertenecen al tramo actual usando el código del tramo
    const tramoPacs = projectInfoResponse.projectPacs.filter(p => p.pac.code.startsWith(`PAC_${tramoDataResponse.code[1]}`));

    // Ordenarlos según el sortOrder definido en cada PAC
    const sortedPacs = [...tramoPacs].sort((a, b) =>a.pac.sortOrder - b.pac.sortOrder)

 
    // Setear el estado con los PACs ordenados
    setPacs(sortedPacs);

    // Obtener el PAC en progreso o el último PAC del tramo
    const firstPac = sortedPacs.find(p => p.status === "in_progress") || [...sortedPacs].reverse()[0];


    // Calcular y guardar en estado métricas
    const currentPac = `C${firstPac.pac.code[6]}`;
    const totalPacs = sortedPacs.filter(pac => pac.status === "completed").length;
    setMetrics(prev => ({
      ...prev,
      currentPac: currentPac,
      totalPacs: totalPacs
    }))

    // Guardar el PAC en progreso
    setInProgressPac(firstPac);

    // Setear el PAC en progreso como el seleccionado para la timeline
    setSelectedPac(firstPac);
    return { tramoDataResponse: tramoDataResponse, firstPac: firstPac, sortedPacs: sortedPacs };
  }
  // Obtener información de microacciones
  const getMAInfo = async (tramoInfoParam = tramoInfo, inProgressPacParam = inProgressPac) => {
    const { data: microActionsResponse } = await getMicroActions(dbProject.id);
    //  Obtener las instancias de microacciones del tramo actual
    const currentTramoMicroActions = microActionsResponse.filter(m => m.microActionDefinition.code.startsWith(`MAD_${tramoInfoParam.code[1]}`));

    // Ordenar por código MAD
    const orderedMicroActions = currentTramoMicroActions.sort((a, b) => {
      // Aseguramos que existan las propiedades antes de romper el string
      const codeA = a?.microActionDefinition?.code || '';
      const codeB = b?.microActionDefinition?.code || '';
      const partsA = codeA.split('_');
      const partsB = codeB.split('_');

      // Extraemos el segundo y tercer número (usando la posición del índice: 0, 1, 2, 3)
      // Convertimos a número entero con parseInt (base 10)
      const a2 = parseInt(partsA[2], 10) || 0;
      const b2 = parseInt(partsB[2], 10) || 0;

      // Primera condición: ordenar por el segundo número
      if (a2 !== b2) {
        return a2 - b2;
      }


      // Segunda condición (desempate): ordenar por el tercer número
      const a3 = parseInt(partsA[3], 10) || 0;
      const b3 = parseInt(partsB[3], 10) || 0;

      return a3 - b3;
    });
    // FIN del ordenamiento de MAD

    // Obtener y guardar las microacciones del PAC en progreso
    const inProgressPacMicroActions = orderedMicroActions.filter(m => m.microActionDefinition.code.startsWith(`MAD_${inProgressPacParam.pac.code[4]}_${inProgressPacParam.pac.code[6]}`));
    setInProgressPacActions(prev=> ({
      ...prev,
      microactions: inProgressPacMicroActions
    }));

    setMicroActionData(orderedMicroActions);
    // Setear métricas
    setMetrics(prev => ({
      ...prev,
      microactions: `${currentTramoMicroActions.filter(m => m.microActionDefinition.code.startsWith(`MAD_${tramoInfoParam.code[1]}`) && (m.status === 'completed' || m.status === 'validated' || m.status === 'closed')).length} / 21`,
    }))
    // Métricas del pac actual
    const completedSelectedPacMicroactions = orderedMicroActions.filter(m => m.microActionDefinition.code.startsWith(`MAD_${inProgressPacParam.pac.code[4]}_${inProgressPacParam.pac.code[6]}`) && (m.status === 'completed' || m.status === 'validated' || m.status === 'closed')).length;
    setSelectedPacMetrics( prev => ({
      ...prev,
      microactions: completedSelectedPacMicroactions,
    }))
    return { inProgressPacMicroActions, orderedMicroActions }
  }

  // Obtener información de evidencias
  const getEvidenceInfo = async (microActionDataParam = microActionData, inProgressPacActionsParam = inProgressPacActions.microactions) => {
    const { data: evidencesResponse } = await getEvidences(dbProject.id);

    //  Filtrar evidencias usando los IDs de las microacciones del tramo actual
    const filteredEvidences = evidencesResponse.filter(evidence =>
      microActionDataParam.some(ma => ma.id === evidence.microActionInstanceId)
    );
  

    setEvidencesData(filteredEvidences.reverse());

    // Guardar la evidencia del PAC actual
    const inProgressPacEvidence = filteredEvidences.find(e => e.microActionInstanceId === inProgressPacActionsParam[0].id)
    setInProgressPacActions(prev => ({
      ...prev,
      evidences: inProgressPacEvidence
    }))

    // Setear métricas
    setMetrics(prev => ({
      ...prev,
      evidences: `${filteredEvidences.filter((e) => e.status === 'approved').length} / 7`,
    }))
    setSelectedPacMetrics(prev => ({
  ...prev,
  evidences: `${inProgressPacEvidence.status === 'approved' ? 1 : 0} / 1`
}))
    return { inProgressPacEvidence }
  }

    // Función para verificar si el PAC actual está completado
  const checkCurrentPac = async (pacsParam = pacs, inProgressPacMicroActions = inProgressPacActions.microactions, inProgressEvidence = inProgressPacActions.evidences ) => {

    const currentPacId = pacsParam.find(p => p.status === "in_progress" || p.status === "pending")
    if(!currentPacId) return;

    if (inProgressPacMicroActions.every((ma) =>
      ma.status === 'completed' ||
      ma.status === 'validated' ||
      ma.status === 'closed'
    ) && inProgressEvidence.status === 'approved') {

      
      const { data: updatePacResponse, error: updatePacError } = await updatePacStatus(currentPacId.id, { status: 'completed' });


      if (updatePacError) {
        console.log(updatePacError)
      };
      setIsPacCompleted(true);
      getPacsInfo();
      

      //}
    }

  }

  const initialize = async () => {
  setLoading(true);
  const { tramoDataResponse, firstPac, sortedPacs } = await getPacsInfo(); // await para esperar el return
  const {inProgressPacMicroActions, orderedMicroActions} = await getMAInfo(tramoDataResponse, firstPac);
  const { inProgressPacEvidence } = await getEvidenceInfo(orderedMicroActions, inProgressPacMicroActions);
  checkCurrentPac(sortedPacs, inProgressPacMicroActions, inProgressPacEvidence);
  setLoading(false);
}

  // Al montar el componente se ejecuta la función para obtener los datos
  useEffect(() => {
    initialize();
  }, []);

  



  const convertDate = (date) => {
    // 1. Convertimos el string en un objeto de fecha real de JavaScript
    const newDate = new Date(date);

    // 2. Le damos formato usando el idioma local del usuario
    const formatedDate = new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(newDate);
    return formatedDate;
  }


  const isMobile = useIsMobile();

  const rol = useUserStore((state) => state.rol);

  const newStatus = {
    pending: 'started',
    started: 'submitted',
    submitted: 'validated',
    validated: 'completed',
    completed: 'closed',
  }

 

  const getMicroActionsForPac = (pacCode) => {
    return microActionData.filter(ma => ma.microActionDefinition.code.startsWith(`MAD_${pacCode[4]}_${pacCode[6]}`))
      .sort((a, b) => a.microActionDefinition.code[8] - b.microActionDefinition.code[8]);
  }

  const openUploadModal = (type, data) => {
    setUploadModal({
      isOpen: true,
      type,
      data,
    });
  };

  const closeUploadModal = () => {
    setUploadModal({
      isOpen: false,
      type: null,
      data: null,
    });
  };

  const handleCompletedPac = () => {
    const { evidenceData } = getEvidenceInfo();
    checkCurrentPac(undefined, undefined, evidenceData);
  }


  return (
    <div className="relative space-y-6">
      {/* Si el tramo está completo mostrar una notificación indicándolo, cambiar nombre al estado mal puesto */}
      {isPacCompleted && (
        <NotificationPopup onClocse={() => setIsPacCompleted(false)}>
          <div className="text-white flex flex-col gap-2 text-center">
            <h1>¡Felicidades!</h1>
            <h3>Has completado el tramo {tramoData.code}</h3>
            <Evolution />
            <p className="text-(--text-secondary) mt-4">Ya estamos preparando el siguiente tramo para ti.</p>
          </div>
        </NotificationPopup>
      )}

      {/* Modal de carga/actualización */}
      <UploadModal
        isOpen={uploadModal.isOpen}
        onClose={closeUploadModal}
        type={uploadModal.type}
        data={uploadModal.data}
        
        microactionRefresh={() => getMAInfo()}
        checkPacStatus={() => handleCompletedPac()}
      />
      {loading && <Loading></Loading>}
      {/* HEADER */}
      <div id="cabecera" className="glass-effect-dark border-glass rounded-2xl p-6">
        <p className="text-overline">Trayectoria operativa del tramo</p>
        <h2 className="text-h2">{tramoData?.code} · {tramoData?.name}</h2>
        <p className="text-body mt-2 max-w-2xl">{currentTramo?.description}</p>
        <div className="flex gap-3 mt-4 flex-wrap">
          <Metric label="PAC actual" value={metrics.currentPac} />
          <Metric label="PACs cerrados" value={metrics.totalPacs} />
          <Metric label="Microacciones" value={metrics.microactions} />
          <Metric label="Evidencias" value={metrics.evidences} />
        </div>
      </div>

      {/* TIMELINE */}
      <div id="timeline" className="overflow-hidden glass-effect border-glass rounded-2xl p-6">
        <div className=" flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
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
        {selectedPac && (
          <Swiper
            modules={isMobile ? [] : [Navigation]}
            initialSlide={pacs.findIndex(p => p.id === selectedPac.id)}
            navigation={!isMobile}
            spaceBetween={16}
            slidesPerView={3}
            breakpoints={{
              320: { slidesPerView: 1.05 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1400: { slidesPerView: 4 },
            }}
            className="!overflow-visible"
          >
            {pacs && pacs.length > 0 && pacs.map((p, i) => (
              <SwiperSlide key={p.code} className="!h-auto">
                <PacCard
                  pac={p}
                  isSelected={selectedPac.id === p.id}
                  onClick={() => setSelectedPac(p)}
                  index={i}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>


      {/* LOWER GRID */}
      {selectedPac && microActionData && microActionData.length > 0 && (
        <div className="grid cols-1 md:grid-cols-2 gap-6">
          {/* DETALLE PAC */}
          <div id="detalle" className="glass-effect border-glass rounded-2xl p-6">
            <p className="text-overline mb-2">Detalle del PAC seleccionado</p>
            <div className="grid gap-4">
              {/* TITULO */}
              <div className="glass-effect border-glass p-4 rounded-xl">
                <p className="text-micro-label mb-1">Título del PAC</p>

                <p className="text-body-lg mb-4">{selectedPac.pac.title}</p>

                <p className="text-micro-label mb-1">Objetivo estructural</p>

                <p className="text-body-lg mb-4">{selectedPac.pac.objectiveLine}</p>

                <p className="text-micro-label mb-1">Regla para cierre del PAC</p>

                <p className="text-body-lg mb-4">{selectedPac.pac.closureRule}</p>

                <div className="flex flex-row gap-4 items-center">
                  <p className="text-lg text-(--text-primary) mb-2">Peso del PAC en Índice Colibrí: </p>

                  <p className="text-body-lg mb-4 p-1 glass-effect-green border-glass rounded-lg">{selectedPac.pac.icWeight}</p>
                </div>

                <p className="text-micro-label mb-1">Progreso del PAC</p>

                <ProgressBar color='cyan' progreso={selectedPac.progress} />

                {/* METRICAS DEL PAC SELECCIONADO */}
                {selectedPacMetrics.microactions !== null && metrics.evidences !== null ? (
                  <div className="flex flex-row gap-8 text-center mt-4">
                    <div className="glass-effect border-glass p-2 rounded-2xl flex flex-col items-center gap-2 justify-center content-center text-center">
                      <p className="text-micro-label mb-1 text-center">Micro acciones</p>
                      <div className="glass-effect-dark border-glass p-4 rounded-xl text-white">{selectedPacMetrics.microactions} / 3</div>
                    </div>
                    <div className="glass-effect border-glass p-2 rounded-2xl flex flex-col items-center gap-2 text-center justify-center content-center">
                      <p className="text-micro-label mb-1 text-center">Evidencias</p>
                      <div className="glass-effect-dark border-glass p-4 rounded-xl text-white">{selectedPacMetrics.evidences}</div>
                    </div>
                  </div>
                ) :
                  <div>Error al calcular métricas del PAC</div>}


              </div>
              <div className="glass-effect border-glass p-4 rounded-xl">
                <p className="text-micro-label mb-2">Corte temporal</p>

                <div className="flex justify-between text-body">
                  <span>Inicio</span>
                  <span>{convertDate(selectedPac.pac.createdAt)}</span>
                </div>

                <div className="flex justify-between text-body">
                  <span>Última actualización</span>
                  <span>{convertDate(selectedPac.pac.updatedAt)}</span>
                </div>

                <div className="flex justify-between text-body">
                  <span>Cierre</span>
                  <span>{selectedPac.status !== 'completed' ? '-' : convertDate(selectedPac.pac.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARGA OPERATIVA DEL PAC - usando datos reales */}
                { inProgressPacActions &&  inProgressPacActions.microactions && 
          <div id="carga" className="glass-effect border-glass rounded-2xl p-6">
            <h4 className="text-micro-label mb-4">Carga operativa del PAC</h4>
            <RealCargaPac
              onUploadMicroaction={(ma) => openUploadModal('microaction', ma)}
              onUploadEvidence={(ev) => openUploadModal('evidence', ev)}
              microActionCompleted={selectedPacMetrics.microactions === 3}
              pac={selectedPac}
              microActions={inProgressPacActions.microactions}
              evidencesData={inProgressPacActions.evidences}
              rol={rol}
            />
          </div>
}
        </div>
      )}

    </div>
  )
}

// Componente que muestra las microacciones reales del PAC
const RealCargaPac = ({ pac, microActions, evidencesData, rol, onUploadMicroaction, onUploadEvidence, microActionCompleted }) => {
  if (!microActions.length) {
    return (
      <div className="rounded-xl p-4 border border-glass-dark bg-white/5">
        <p className="text-helper">No hay microacciones definidas para este PAC.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Microacciones */}
      {microActions.map((ma) => {
        const isCompleted = ma.status === 'completed' || ma.status === 'validated' || ma.status === 'closed';
        const isCurrent = ma.status === 'started' || ma.status === 'submitted' || ma.status === 'in_progress';
        const isPending = ma.status === 'pending' || ma.status === 'reopened';
        const instruction = ma.microActionDefinition?.instruction || 'Sin descripción';

        return (
          <div
            key={ma.id}
            className={`
                rounded-xl border p-4 transition
                ${isCompleted ? 'bg-[rgba(0,153,117,0.08)] border-glass-green'
                : isPending ? 'bg-yellow-500/10 border-glass-dark'
                  : 'bg-[rgba(0,207,207,0.08)] border-glass'}
              `}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-body-lg">{instruction}</p>
                <p className="text-helper">{ma.microActionDefinition?.microActionType}</p>
              </div>
              <StatusBadge status={ma.status} />
            </div>

            {/* Botón de carga - para no completadas */}
            {!isCompleted && rol === 'entrepreneur' && (
              <button
                onClick={() => onUploadMicroaction(ma)}
                className=" cursor-pointer text-white text-lg glass-effect-green border-glass font-bold p-3 rounded-full
                    hover:bg-[rgba(0,207,207,0.25)] transition"
              >
                Cargar o actualizar
              </button>
            )}

            {/* Estado: Completada */}
            {isCompleted && (
              <div className="mt-3 text-[var(--status-success)] text-body flex items-center gap-2">
                ✔ Microacción completada
              </div>
            )}

            {/* Estado: En tránsito */}
            {isCurrent && (
              <div className="mt-3 text-[var(--status-info)] text-body flex items-center gap-2">
                ⏳ Pendiente de carga / en revisión
              </div>
            )}

            {/* Estado: Pendiente */}
            {isPending && (
              <div className="mt-3 text-[var(--status-warning)] text-body flex items-center gap-2">
                ⚠️ Pendiente de inicio
              </div>
            )}
          </div>
        );
      })}

      {/* Evidencia del PAC */}
      {evidencesData && (
        <div
          className={`
              mt-6 rounded-xl p-4 border-dashed border text-white
              ${evidencesData.status === "approved" ? 'border-[var(--status-success)] bg-[rgba(0,153,117,0.05)]' : ''}
              ${evidencesData.status === "draft" ? 'border-[var(--status-info)] bg-[rgba(0,207,207,0.05)]' : ''}
              ${evidencesData.status === "pending" ? 'border-[var(--status-warning)] bg-[rgba(255,209,102,0.05)]' : ''}
            `}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-row w-full justify-between items-start">
              <div>
                <p className="text-body-lg font-medium">{evidencesData.description}</p>
                <p className="text-helper text-[var(--text-tertiary)]">Evidencia del PAC</p>
              </div>
              <StatusBadge status={evidencesData.status} />
            </div>

            {/* Botón de carga - para evidencias no aprobadas */}
            {evidencesData.status !== "approved" && rol === 'entrepreneur' && microActionCompleted && (
              <button
                onClick={() => onUploadEvidence(evidencesData)}
                className="cursor-pointer text-white text-base glass-effect-green border-glass font-bold py-2 px-4 rounded-lg
                    hover:bg-[rgba(0,207,207,0.25)] transition w-fit"
              >
                Cargar o actualizar
              </button>
            )
            }
            {evidencesData.status !== "approved" && rol === 'entrepreneur' && !microActionCompleted && (
              <div className="text-yellow-600/80 text-lg">Completa todas las micro acciones del PAC para poder subir la evidencia</div>
            )}

            {/* Estado: Aprobada */}
            {evidencesData.status === "approved" && (
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="text-[var(--status-success)] text-body flex items-center gap-2">
                  ✔ Evidencia aprobada
                </div>
                <a href="/evidencia.pdf" download className="glass-effect-green p-2 px-6 border-glass  text-lg rounded-full">Descargar evidencia</a>
              </div>
            )}

            {/* Estado: Pendiente de revisión */}
            {evidencesData.status !== "approved" && (
              <div className="text-[var(--status-info)] text-body flex items-center gap-2">
                ⏳ Pendiente de revisión
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Componentes auxiliares
const StatusBadge = ({ status }) => {
  const map = {
    done: 'bg-[rgba(0,153,117,0.2)] text-[var(--status-success)]',
    validated: 'bg-[rgba(0,153,117,0.2)] text-[var(--status-success)]',
    approved: 'bg-[rgba(0,153,117,0.2)] text-[var(--status-success)]',
    completed: 'bg-[rgba(0,153,117,0.2)] text-[var(--status-success)]',
    closed: 'bg-[rgba(0,153,117,0.2)] text-[var(--status-success)]',

    current: 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]',
    in_progress: 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]',
    submitted: 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]',
    started: 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]',

    pending: 'bg-[rgba(255,209,102,0.2)] text-[var(--status-warning)]',
    reopened: 'bg-[rgba(255,209,102,0.2)] text-[var(--status-warning)]',

    draft: 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]',
  };
  const label = {
    done: 'Completado',
    current: 'En tránsito',
    pending: 'Pendiente',
    approved: 'Aprobada',
    draft: 'Borrador',
    started: 'Iniciado',
    in_progress: 'En progreso',
    submitted: 'Enviado',
    validated: 'Validado',
    completed: 'Completado',
    closed: 'Cerrado',
    reopened: 'Reabierto'
  };
  return (
    <span className={`inline-flex items-center justify-center w-fit h-fit self-start whitespace-nowrap text-badge px-3 py-1 rounded-full ${map[status]}`}>
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

const PacCard = ({ pac, isSelected, onClick, index }) => (
  <motion.div
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -6 }}
    className={`
        h-full p-5 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur
        flex flex-col justify-between
        ${pac.status === 'completed' && 'bg-[rgba(0,153,117,0.10)] border-glass-green'}
        ${pac.status === 'in_progress' && 'bg-[rgba(0,207,207,0.10)] border-glass'}
        ${pac.status === 'pending' && 'bg-white/5 border-glass-dark'}
        ${isSelected ? 'ring-2 ring-[var(--color-turquoise)] shadow-[0_10px_30px_rgba(0,207,207,0.25)] scale-[1.02]' : 'hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)]'}
      `}
  >
    <div>
      <div className="flex justify-between items-start ">
        <div>
          <p className="text-value-card">{`T${pac.pac.code[4]}-C${pac.pac.code[6]}`}</p>
          <p className="text-body-lg">{pac.pac.title}</p>
        </div>
        <StatusDot status={pac.status} />
      </div>
    </div>
    <p className="text-legend">
      {pac.status === 'completed' ? 'Completado' : pac.status === 'in_progress' ? 'En tránsito' : 'Pendiente'}
    </p>
  </motion.div>
);

const StatusDot = ({ status }) => {
  if (status === 'completed') return <span className="text-[var(--status-success)]">✔</span>;
  if (status === 'in_progress') return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--status-info)] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--status-info)]"></span>
    </span>
  );
  return <span className="w-3 h-3 rounded-full border border-[var(--text-secondary)] inline-block" />;
};

const LegendDot = ({ color, label }) => {
  const map = {
    success: 'text-[var(--status-success)]',
    info: 'bg-[var(--status-info)]',
    neutral: 'border border-[var(--text-secondary)]',
  };
  return (
    <div className="flex items-center gap-2 text-legend">
      <span className={`w-4 h-4 flex items-center justify-center rounded-full text-xs ${map[color]}`}>
        {color === 'success' ? '✔' : ''}
      </span>
      {label}
    </div>
  );
};