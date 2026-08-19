"use client";
import { useRequest } from "@/hooks/useRequest";
import { projectsService } from "@/services/project";
import { useProject } from '@/lib/projectContext';
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTranslation } from '@/hooks/useTranslation';
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
import { useUserStore } from "@/lib/store";
import { useLocalizedField, getLocalizedValue } from '@/hooks/useLocalizedField';

// Helper: obtener microacciones de un PAC por su código
const getMicroActionsForPacCode = (microActionsData, pacCode) => {
  if (!microActionsData || !pacCode) return [];
  return microActionsData
    .filter(ma => ma.microActionDefinition.code.startsWith(`MAD_${pacCode[4]}_${pacCode[6]}`))
    .sort((a, b) => a.microActionDefinition.code[8] - b.microActionDefinition.code[8]);
};

// Helper: calcular microacciones y evidencias para un PAC específico
const computeActionsForPac = (pacOrCode, microActionsData, evidencesData) => {
  const pacCode = typeof pacOrCode === 'string' ? pacOrCode : pacOrCode?.pac?.code;
  if (!pacCode || !microActionsData) return { microactions: [], evidences: null };

  //console.log(evidencesData)
  const pacMicroActions = getMicroActionsForPacCode(microActionsData, pacCode);
  const pacMicroActionIds = pacMicroActions.map(ma => ma.id);
  const pacEvidence = evidencesData?.find(e => pacMicroActionIds.includes(e.microActionInstanceId)) || null;
  //console.log(pacEvidence)
  return { microactions: pacMicroActions, evidences: pacEvidence };
};

// Helper: categorizar el estado de una evidencia para unificar su manejo visual
const getEvidenceCategory = (status) => {
  if (!status) return 'pending';
  if (['approved', 'completed'].includes(status)) return 'done';
  if (['submitted', 'active'].includes(status)) return 'review';
  if (status === 'rejected') return 'rejected';
  return 'pending'; // draft, pending, u otros
};

// Helper: formatear fecha a DD/MM/YYYY
const convertDate = (date) => {
  if (!date) return '-';
  const newDate = new Date(date);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(newDate);
};

export default function NewTrayectoria() {
  const { t } = useTranslation('trayectoria');
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
  // Microacciones y evidencias del PAC seleccionado en la timeline
  const [selectedPacActions, setSelectedPacActions] = useState({
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
  const [ MADetail, setMADetail ] = useState(false);
  const [ selectedMADetail, setSelectedMADetail ] = useState(null);
  const [ versionDetailVersions, setVersionDetailVersions ] = useState(null);

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
    const completedSelectedPacMicroactions = orderedMicroActions.filter(m => m.microActionDefinition.code.startsWith(`MAD_${inProgressPacParam.pac.code[4]}_${inProgressPacParam.pac.code[6]}`) && (m.status === 'completed' || m.status === 'validated' || m.status === 'closed' || m.status === 'submitted')).length;
    setSelectedPacMetrics( prev => ({
      ...prev,
      microactions: completedSelectedPacMicroactions,
    }))
    return { inProgressPacMicroActions, orderedMicroActions }
  }

  // Obtener información de evidencias
  const getEvidenceInfo = async (microActionDataParam = microActionData, inProgressPacParam = inProgressPac) => {
    const { data: evidencesResponse } = await getEvidences(dbProject.id);


    //  Filtrar evidencias usando los IDs de las microacciones del tramo actual
    const filteredEvidences = evidencesResponse.filter(evidence =>
      microActionDataParam.some(ma => ma.id === evidence.microActionInstanceId)
    );

    setEvidencesData(filteredEvidences.reverse());

    // Calcular la evidencia del PAC en progreso usando la misma lógica unificada
    const { evidences: inProgressPacEvidence } = computeActionsForPac(
      inProgressPacParam,
      microActionDataParam,
      filteredEvidences
    );
    setInProgressPacActions(prev => ({
      ...prev,
      evidences: inProgressPacEvidence
    }));

    // Setear métricas del tramo
    setMetrics(prev => ({
      ...prev,
      evidences: `${filteredEvidences.filter((e) => getEvidenceCategory(e.status) === 'done').length} / 7`,
    }));

    return { inProgressPacEvidence };
  }

    // Función para verificar si el PAC actual está completado
  const checkCurrentPac = async (pacsParam = pacs, inProgressPacMicroActions = inProgressPacActions.microactions, inProgressEvidence = inProgressPacActions.evidences) => {

    const currentPacId = pacsParam.find(p => p.status === "in_progress" || p.status === "pending")
    if (!currentPacId) return;

    if (/*inProgressPacMicroActions?.every((ma) =>
      ma.status === 'completed' ||
      ma.status === 'validated' ||
      ma.status === 'closed'
    ) && */getEvidenceCategory(inProgressEvidence?.status) === 'done') {

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
    try {
      const { tramoDataResponse, firstPac, sortedPacs } = await getPacsInfo();
      const {inProgressPacMicroActions, orderedMicroActions} = await getMAInfo(tramoDataResponse, firstPac);
      const { inProgressPacEvidence } = await getEvidenceInfo(orderedMicroActions, firstPac);
      checkCurrentPac(sortedPacs, inProgressPacMicroActions, inProgressPacEvidence);
    } catch (err) {
      console.error('Error initializing trayectoria:', err);
    } finally {
      setLoading(false);
    }
  }

  // Al montar el componente se ejecuta la función para obtener los datos
  useEffect(() => {
    initialize();
  }, []);




  const isMobile = useIsMobile();

  const rol = useUserStore((state) => state.rol);

  const newStatus = {
    pending: 'started',
    started: 'submitted',
    submitted: 'validated',
    validated: 'completed',
    completed: 'closed',
  }
  //console.log(selectedPac, inProgressPac)

 

  // Actualizar microacciones y evidencias mostradas cuando cambia el PAC seleccionado
  useEffect(() => {
    if (!selectedPac || !microActionData) return;

    const { microactions, evidences } = computeActionsForPac(selectedPac, microActionData, evidencesData);
    setSelectedPacActions({ microactions, evidences });

    setSelectedPacMetrics({
      microactions: microactions.filter(m =>
        m.status === 'completed' || m.status === 'validated' || m.status === 'closed' || m.status === 'submitted'
      ).length,
      evidences: getEvidenceCategory(evidences?.status) === 'done' ? '1 / 1' : '0 / 1'
    });
  }, [selectedPac, microActionData, evidencesData]);

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

  const handleCompletedPac = async () => {
    const { inProgressPacEvidence } = await getEvidenceInfo();
    checkCurrentPac(undefined, undefined, inProgressPacEvidence);
  }

  // Campos localizados para PACs y tramos
  const selectedPacTitle = useLocalizedField(selectedPac?.pac, 'title');
  const selectedPacObjective = useLocalizedField(selectedPac?.pac, 'objectiveLine');
  const tramoNameLocalized = useLocalizedField(tramoData, 'name');

  return (
    <div className="relative space-y-6">
      {/* Si el tramo está completo mostrar una notificación indicándolo, cambiar nombre al estado mal puesto */}
      {isPacCompleted && (
        <NotificationPopup onClocse={() => setIsPacCompleted(false)}>
          <div className="text-(--text-primary) flex flex-col gap-2 text-center">
            <h1>{t('congratulations')}</h1>
            <h3>{t('completedTramo')} {tramoData.code}</h3>
            <Evolution />
            <p className="text-[var(--text-secondary)] mt-4">{t('preparingNext')}</p>
          </div>
        </NotificationPopup>
      )}
      {MADetail && selectedMADetail && (
        <NotificationPopup onClose={() => setMADetail(false)}>
          <div className="text-(--text-primary) glass-effect border-glass p-4 rounded-2xl text-lg  flex flex-col gap-4">
            <h3>{t('detailMicroaction')}</h3>
            <div>
              <div className="text-[var(--text-tertiary)]">{t('labelInstruction')}</div>
              <div style={{ color: 'var(--text-primary)' }}>{selectedMADetail.microActionDefinition.instruction}</div>
            </div>
            <div>
              <div className="text-[var(--text-tertiary)]">{t('labelExecutionNotes')}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{selectedMADetail.executionNotes}</div>
            </div>
            <div>
              <div className="text-[var(--text-tertiary)]">{t('labelSentDate')}</div>
              <div style={{ color: 'var(--text-primary)' }}>{convertDate(selectedMADetail.submittedAt)}</div>
            </div>
            <div>
              <div className="text-[var(--text-tertiary)]">{t('labelValidationDate')}</div>
              <div style={{ color: 'var(--text-primary)' }}>{convertDate(selectedMADetail.validatedAt)}</div>
            </div>
          </div>
        </NotificationPopup>
      )}

      {/* Modal de carga/actualización */}
      <UploadModal
        isOpen={uploadModal.isOpen}
        onClose={closeUploadModal}
        type={uploadModal.type}
        data={uploadModal.data}
        projectId={dbProject.id}
        
        microactionRefresh={() => getMAInfo()}
        checkPacStatus={() => handleCompletedPac()}
      />
      {loading && <Loading></Loading>}
      {/* HEADER */}
      <div id="cabecera" className="glass-effect border-glass rounded-2xl p-6">
        <p className="text-overline" style={{ color: 'var(--text-tertiary)' }}>{t('operationalPath')}</p>
        <h2 className="text-h2" style={{ color: 'var(--text-primary)' }}>{tramoData?.code} · {tramoNameLocalized}</h2>
        <p className="text-body mt-2 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>{currentTramo?.description}</p>
        <div className="flex gap-3 mt-4 flex-wrap">
          <Metric label={t('metricCurrentPac')} value={metrics.currentPac} />
          <Metric label={t('metricClosedPacs')} value={metrics.totalPacs} />
          <Metric label={t('metricMicroactions')} value={metrics.microactions} />
        </div>
      </div>

      {/* TIMELINE */}
      <div id="timeline" className="overflow-hidden glass-effect border-glass rounded-2xl p-6">
        <div className=" flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
          <div>
            <p className="text-overline mb-1" style={{ color: 'var(--text-tertiary)' }}>{t('operativeSequence')}</p>
            <h3 className="text-h3" style={{ color: 'var(--text-primary)' }}>{t('structuralTimeline')}</h3>
          </div>
          <div className="flex items-center gap-4 text-legend">
            <LegendDot color="success" label={t('legendCompleted')} />
            <LegendDot color="info" label={t('legendCurrent')} />
            <LegendDot color="neutral" label={t('legendPending')} />
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
            <p className="text-overline mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('detailSelectedPac')}</p>
            <div className="grid gap-4">
              {/* TITULO */}
              <div className="glass-effect border-glass p-4 rounded-xl">
                <p className="text-micro-label mb-1" style={{ color: 'var(--text-tertiary)' }}>{t('pacTitle')}</p>

                <p className="text-body-lg mb-4 text-(--text-primary)">{selectedPacTitle}</p>

                <p className="text-micro-label mb-1" style={{ color: 'var(--text-tertiary)' }}>{t('pacObjective')}</p>

                <p className="text-body-lg mb-4 text-(--text-primary)">{selectedPacObjective}</p>

                <p className="text-micro-label mb-1" style={{ color: 'var(--text-tertiary)' }}>{t('pacClosureRule')}</p>

                <p className="text-body-lg mb-4 text-(--text-primary)">{selectedPac.pac.closureRule}</p>

                <div className="flex flex-row gap-4 items-center">
                  <p className="text-lg text-(--text-primary) mb-2">{t('pacWeight')}</p>

                  <p className=" mb-4 p-1 glass-effect-green border-glass rounded-lg text-(--status-success)">{selectedPac.pac.icWeight}</p>
                </div>

                {/* METRICAS DEL PAC SELECCIONADO */}
                {selectedPacMetrics.microactions !== null && metrics.evidences !== null ? (
                  <div className="flex flex-row gap-8 text-center mt-4">
                    <div className="glass-effect border-glass p-2 rounded-2xl flex flex-col items-center gap-2 justify-center content-center text-center">
                      <p className="text-micro-label mb-1 text-center" style={{ color: 'var(--text-tertiary)' }}>{t('pacMicroactions')}</p>
                      <div className="glass-effect-dark border-glass p-4 rounded-xl" style={{ color: 'var(--text-primary)' }}>{selectedPacMetrics.microactions} / 3</div>
                    </div>
                    <div className="glass-effect border-glass p-2 rounded-2xl flex flex-col items-center gap-2 text-center justify-center content-center">
                      <p className="text-micro-label mb-1 text-center" style={{ color: 'var(--text-tertiary)' }}>{t('pacEvidences')}</p>
                      <div className="glass-effect-dark border-glass p-4 rounded-xl" style={{ color: 'var(--text-primary)' }}>{selectedPacMetrics.evidences}</div>
                    </div>
                  </div>
                ) :
                  <div className="text-(--text-secondary)">{t('pacMetricsError')}</div>}


              </div>
              <div className="glass-effect border-glass p-4 rounded-xl">
                <p className="text-micro-label mb-2" style={{ color: 'var(--text-tertiary)' }}>{t('temporalCut')}</p>

                <div className="flex justify-between text-body text-(--text-secondary)">
                  <span>{t('labelStart')}</span>
                  <span>{convertDate(selectedPac.pac.createdAt)}</span>
                </div>

                <div className="flex justify-between text-body text-(--text-secondary)">
                  <span>{t('labelLastUpdate')}</span>
                  <span>{convertDate(selectedPac.pac.updatedAt)}</span>
                </div>

                <div className="flex justify-between text-body text-(--text-secondary)">
                  <span>{t('labelClose')}</span>
                  <span>{selectedPac.status !== 'completed' ? '-' : convertDate(selectedPac.pac.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARGA OPERATIVA DEL PAC - usando datos reales */}
                { selectedPacActions?.microactions &&
          <div id="carga" className="glass-effect border-glass rounded-2xl p-6">
            <h4 className="text-micro-label mb-4" style={{ color: 'var(--text-tertiary)' }}>{t('operationalLoad')}</h4>
            <RealCargaPac
              onUploadMicroaction={(ma) => openUploadModal('microaction', ma)}
              onUploadEvidence={(ev) => openUploadModal('evidence', ev)}
              microActionCompleted={selectedPacMetrics.microactions === 3}
              pac={selectedPac}
              microActions={selectedPacActions.microactions}
              evidencesData={selectedPacActions.evidences}
              rol={rol}
              openDetail={(ma) => {setSelectedMADetail(ma); setMADetail(true);}}
              isInProgressPac={selectedPac.id === inProgressPac.id}
              onOpenVersionDetails={(versions) => setVersionDetailVersions(versions)}
            />
          </div>
}
        </div>
      )}

      {versionDetailVersions && (
        <VersionDetailsPopup
          versions={versionDetailVersions}
          onClose={() => setVersionDetailVersions(null)}
        />
      )}
    </div>
  )
}

// Componente que muestra el listado desplegable de versiones de una microacción
const MicroActionVersionList = ({ versions, onOpenDetails }) => {
  const { t } = useTranslation('trayectoria');
  const [open, setOpen] = useState(false);

  return (
    <div className="my-3">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="border border-glass py-0.5 px-2 rounded-2xl cursor-pointer flex items-center gap-2 text-(--text-secondary) hover:text-white transition text-body"
        >
          <span>{t('versionsTitle')}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="inline-block"
          >
            ▾
          </motion.span>
        </button>
        <button
          type="button"
          onClick={() => onOpenDetails?.(versions)}
          className="border border-glass py-0.5 px-2 rounded-2xl cursor-pointer flex items-center gap-2 text-(--text-secondary) hover:text-white transition text-body"
        >
          {t('versionDetailsTitle')}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="versions"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {versions && versions.length ? (
              <div className="mt-2">
                <ul className="space-y-2">
                  {versions.map((v) => (
                    <li
                      key={v.id}
                      className="flex flex-row items-center justify-between gap-3 rounded-lg border border-glass-dark bg-white/5 px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-[3ch] text-body text-(--text-primary) font-semibold">
                          {`v${v.versionNumber}`}
                        </span>
                        <VersionStatusPill changeType={v.changeType} />
                      </div>
                      <div className="max-w-[260px]">
                        <CopyableLink url={v.canonicalUri} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-2 text-helper text-(--text-tertiary)">
                {t('noVersions')}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente reutilizable para mostrar una URL copiable
const CopyableLink = ({ url }) => {
  const { t } = useTranslation('trayectoria');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op: clipboard no disponible
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-(--text-secondary) bg-white/5 px-2 py-1 min-w-0 w-full">
      <button
        type="button"
        onClick={handleCopy}
        title={t('copyLink')}
        className="cursor-pointer shrink-0 flex items-center justify-center w-8 h-8 rounded-md text-(--text-secondary) hover:text-white hover:bg-cyan-600/30 transition"
      >
        {copied ? (
          <span className="text-(--status-success)">✓</span>
        ) : (
          <span className="text-(--text-secondary) text-lg">⧉</span>
        )}
      </button>
      <span className="truncate text-helper text-(--text-tertiary)" title={url}>
        {url}
      </span>
    </div>
  );
};

// Pill de estado de una versión (changeType)
const VersionStatusPill = ({ changeType }) => {
  const { t } = useTranslation('trayectoria');

  const labels = {
    rejected: t('versionRejected'),
    completed: t('versionCompleted'),
    submitted: t('versionSubmitted'),
  };

  const colors = {
    rejected: 'text-(--status-danger) bg-[rgba(255,77,109,0.2)]',
    completed: 'text-(--status-success) bg-[rgba(0,153,117,0.2)]',
    submitted: 'text-(--status-info) bg-[rgba(0,207,207,0.2)]',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-md font-semibold whitespace-nowrap ${colors[changeType] || 'text-(--text-secondary)'}`}>
      {labels[changeType] || changeType}
    </span>
  );
};

// Popup con el detalle desplegable de las versiones de una microacción
const VersionDetailsPopup = ({ versions, onClose }) => {
  const { t } = useTranslation('trayectoria');
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <NotificationPopup onClose={onClose} message={t('versionDetailsTitle')}>
      <div className="max-h-[80vh] overflow-y-auto pr-2 space-y-2">
        {versions?.length ? (
          versions.map((v) => {
            const isExpanded = expandedId === v.id;
            return (
              <div
                key={v.id}
                className="rounded-lg border border-glass-dark bg-white/5 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(v.id)}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left cursor-pointer hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block text-(--text-secondary)"
                    >
                      ▾
                    </motion.span>
                    <span className="text-body text-(--text-primary) font-semibold">
                      {`v${v.versionNumber}`}
                    </span>
                    <VersionStatusPill changeType={v.changeType} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key={`detail-${v.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 flex flex-col gap-2">
                        <CopyableLink url={v.canonicalUri} />
                        <div>
                          <p className="text-micro-label text-(--text-tertiary)">
                            {t('versionNotes')}
                          </p>
                          <p className="text-body text-(--text-primary)">
                            {v.changeSummary || '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-micro-label text-(--text-tertiary)">
                            {t('labelSentDate')}
                          </p>
                          <p className="text-body text-(--text-primary)">
                            {convertDate(v.createdAt)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <p className="text-helper text-(--text-tertiary)">{t('noVersions')}</p>
        )}
      </div>
    </NotificationPopup>
  );
};

// Componente que muestra las microacciones reales del PAC
const RealCargaPac = ({ openDetail, pac, microActions, evidencesData, rol, onUploadMicroaction, onUploadEvidence, microActionCompleted, isInProgressPac, onOpenVersionDetails }) => {
  const { t } = useTranslation('trayectoria');
  const language = useUserStore((state) => state.language);
  
  
  if (!microActions.length) {
    return (
      <div className="rounded-xl p-4 border border-glass-dark bg-white/5">
        <p className="text-helper text-(--text-tertiary)">{t('noMicroactions')}</p>
      </div>
    );
  }
  console.log(microActions)

  return (
    <div className="space-y-4">
      {/* Microacciones */}
      {microActions.map((ma) => {
        const isCompleted = ma.status === 'completed' || ma.status === 'validated' || ma.status === 'closed';
        const isCurrent =  ma.status === 'submitted' || ma.status === 'in_progress';
        const isPending = ma.status === 'started' || ma.status === 'pending' || ma.status === 'reopened';
        const instruction = getLocalizedValue(ma.microActionDefinition, 'instruction', language) || t('noDescription');

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
                <p className="text-body-lg text-(--text-primary)">{instruction}</p>
                <p className="text-helper text-(--text-tertiary)">{ma.microActionDefinition?.microActionType}</p>
              </div>
              <StatusBadge status={ma.status} />
            </div>

            <MicroActionVersionList versions={ma.versions} onOpenDetails={onOpenVersionDetails} />

            {/* Botón de carga - para no completadas */}
            {isPending && rol === 'entrepreneur' && isInProgressPac && !ma.versions?.some(v => v.changeType === 'submitted' || v.changeType === 'completed') && (
              <button
                onClick={() => onUploadMicroaction(ma)}
                className="cursor-pointer text-(--text-primary) text-lg glass-effect-green border-glass font-bold p-3 rounded-full
                    hover:bg-[rgba(0,207,207,0.25)] transition"
              >
                {t('btnUpload')}
              </button>
            )}

            {/* Estado: Completada */}
            {isCompleted && (
              <div className="flex flex-row justify-between">
                <div className="mt-3 text-[var(--status-success)] text-body flex items-center gap-2">
                  {t('microactionCompleted')}
                </div>
                <div onClick={() => openDetail(ma)} className="px-2 items-center justify-center flex text-[var(--text-secondary)] hover:text-white hover:bg-cyan-600-30 text-lg rounded-full bg-cyan-600/30 hover:border-cyan-300 border-cyan-500 border cursor-pointer">
                  {t('btnDetails')}
                </div>
              </div>
            )}

            {/* Estado: En tránsito */}
            {isCurrent && (
              <div className="mt-3 text-[var(--status-info)] text-body flex items-center gap-2">
                {t('statusReview')}
              </div>
            )}

            {/* Estado: Pendiente */}
            {isPending && (
              <div className="mt-3 text-[var(--status-warning)] text-body flex items-center gap-2">
                {t('statusPendingLoad')}
              </div>
            )}
          </div>
        );
      })}

      {/* Evidencia del PAC 
      {evidencesData && (
        <EvidenceCard
          evidence={evidencesData}
          rol={rol}
          microActionCompleted={microActionCompleted}
          onUpload={() => onUploadEvidence(evidencesData)}
        />
      )}
        */}
    </div>
  );
};

// Componente unificado para mostrar la evidencia del PAC
const EvidenceCard = ({ evidence, rol, microActionCompleted, onUpload }) => {
  const { t } = useTranslation('trayectoria');
  const category = getEvidenceCategory(evidence?.status);

  const styleMap = {
    done: 'border-[var(--status-success)] bg-[rgba(0,153,117,0.05)]',
    review: 'border-[var(--status-info)] bg-[rgba(0,207,207,0.05)]',
    pending: 'border-[var(--status-warning)] bg-[rgba(255,209,102,0.05)]',
    rejected: 'border-[var(--status-warning)] bg-[rgba(255,209,102,0.05)]',
  };

  const messageMap = {
    done: t('evidenceApproved'),
    review: t('statusReview'),
    pending: t('statusPending'),
    rejected: t('statusRejected'),
  };

  const needsUpload = category === 'pending' || category === 'rejected';
  const canUpload = needsUpload && rol === 'entrepreneur' && microActionCompleted;
  const waitingMicroactions = needsUpload && rol === 'entrepreneur' && !microActionCompleted;

  return (
    <div className={`mt-6 rounded-xl p-4 border-dashed border text-(--text-primary) ${styleMap[category]}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row w-full justify-between items-start">
          <div>
            <p className="text-body-lg font-medium text-(--text-primary)">{evidence?.description}</p>
            <p className="text-helper text-[var(--text-tertiary)]">{t('evidenceLabel')}</p>
          </div>
          <StatusBadge status={evidence?.status} />
        </div>

        {/* Botón de carga - para evidencias pendientes o rechazadas */}
        {canUpload && (
          <button
            onClick={onUpload}
            className="cursor-pointer text-(--text-primary) text-base glass-effect-green border-glass font-bold py-2 px-4 rounded-lg
                hover:bg-[rgba(0,207,207,0.25)] transition w-fit"
          >
            {t('btnUpload')}
          </button>
        )}
        {waitingMicroactions && (
          <div className="text-(--text-secondary) text-lg">{t('completeMicroactionsFirst')}</div>
        )}

        {/* Mensaje según estado */}
        <div className={`
            text-body flex items-center gap-2
            ${category === 'done' ? 'text-[var(--status-success)]' : ''}
            ${category === 'review' ? 'text-[var(--status-info)]' : ''}
            ${category === 'pending' || category === 'rejected' ? 'text-[var(--status-warning)]' : ''}
          `}
        >
          {messageMap[category]}
        </div>

        {/* Botón de descarga solo para evidencias aprobadas/completadas */}
        {category === 'done' && (
          <a
            href={evidence?.canonicalUri || "/evidencia.pdf"}
            download
            className="glass-effect-green p-2 px-6 border-glass text-lg rounded-full text-(--text-primary) w-fit"
          >
            {t('btnDownloadEvidence')}
          </a>
        )}
      </div>
    </div>
  );
};

// Componentes auxiliares
const StatusBadge = ({ status }) => {
  const { t } = useTranslation('trayectoria');
  const map = {
    done: 'bg-[rgba(0,153,117,0.2)] text-[var(--status-success)]',
    validated: 'bg-[rgba(0,153,117,0.2)] text-[var(--status-success)]',
    approved: 'bg-[rgba(0,153,117,0.2)] text-[var(--status-success)]',
    completed: 'bg-[rgba(0,153,117,0.2)] text-[var(--status-success)]',
    closed: 'bg-[rgba(0,153,117,0.2)] text-[var(--status-success)]',

    current: 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]',
    in_progress: 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]',
    submitted: 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]',
    active: 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]',
    started: 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]',
    draft: 'bg-[rgba(0,207,207,0.2)] text-[var(--status-info)]',

    pending: 'bg-[rgba(255,209,102,0.2)] text-[var(--status-warning)]',
    reopened: 'bg-[rgba(255,209,102,0.2)] text-[var(--status-warning)]',
    rejected: 'bg-[rgba(255,209,102,0.2)] text-[var(--status-warning)]',
  };
  const label = {
    done: t('statusCompleted'),
    current: t('statusInTransit'),
    pending: t('statusPendingLabel'),
    approved: t('statusApproved'),
    draft: t('statusDraft'),
    started: t('statusStarted'),
    in_progress: t('statusInProgress'),
    submitted: t('statusSubmitted'),
    active: t('statusActive'),
    validated: t('statusValidated'),
    completed: t('statusCompleted'),
    closed: t('statusClosed'),
    reopened: t('statusReopened'),
    rejected: t('statusRejected')
  };
  return (
    <span className={`inline-flex items-center justify-center w-fit h-fit self-start whitespace-nowrap text-badge px-3 py-1 rounded-full ${map[status]}`}>
      {label[status]}
    </span>
  );
};

const Metric = ({ label, value }) => (
  <div className="glass-effect border-glass px-4 py-2 rounded-xl">
    <p className="text-micro-label" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
    <p className="text-value-card" style={{ color: 'var(--text-primary)' }}>{value}</p>
  </div>
);

const PacCard = ({ pac, isSelected, onClick, index }) => {
  const { t } = useTranslation('trayectoria');
  const pacTitle = useLocalizedField(pac.pac, 'title');
  
  return (
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
          <p className="text-value-card text-(--text-primary)">{`T${pac.pac.code[4]}-C${pac.pac.code[6]}`}</p>
          <p className="mb-4 text-(--text-secondary)">{pacTitle}</p>
        </div>
        <StatusDot status={pac.status} />
      </div>
    </div>
    <p className="text-legend text-(--text-tertiary)">
      {pac.status === 'completed' ? t('statusCompleted') : pac.status === 'in_progress' ? t('statusInTransit') : t('statusPendingLabel')}
    </p>
  </motion.div>
  );
};

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
    <div className="flex items-center gap-2 text-legend text-(--text-tertiary)">
      <span className={`w-4 h-4 flex items-center justify-center rounded-full text-xs ${map[color]}`}>
        {color === 'success' ? '✔' : ''}
      </span>
      {label}
    </div>
  );
};