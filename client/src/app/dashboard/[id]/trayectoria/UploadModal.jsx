"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationPopup from "@/components/NotificationPopup";
import { useRequest } from "@/hooks/useRequest";
import { projectsService } from "@/services/project";
import {evidencesService} from "@/services/evidences";
import { useTranslation } from '@/hooks/useTranslation';

export default function UploadModal({
  isOpen,
  onClose,
  type, // 'microaction' | 'evidence'
  data, // microaction o evidence object
  microactionRefresh,
  checkPacStatus,
  newStatusMap = {
    pending: 'started',
    started: 'submitted',
    submitted: 'validated',
    validated: 'completed',
    completed: 'closed',
  }
}) {  

    const { execute: updateMicroAction } = useRequest(projectsService.updateMicroAction);
    const { execute: requestUpload } = useRequest(projectsService.requestUploadSignature);
    const { execute: confirmUpload } = useRequest(projectsService.confirmUpload);
    const { execute: submitEvidence } = useRequest(evidencesService.submit);
    const { execute: createEvaluation } = useRequest(evidencesService.createEvaluation);
    const { execute: getActiveRubrics } = useRequest(evidencesService.getActiveRubrics);
    const { execute: closeEvaluation } = useRequest(evidencesService.closeEvaluation);

  const [formData, setFormData] = useState({
    file: null,
    executionNotes: '',
    status: data?.status ? newStatusMap[data.status] : null,
    fileName: null,
  });

  const { t } = useTranslation('trayectoria');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ success, setSuccess ] = useState(null);

  if(!data) return null

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que el archivo sea estrictamente un PDF
    if (file.type !== "application/pdf") {
      setError(t('errorNotPdf'));
      // Limpiamos el input por si acaso
      e.target.value = ""; 
      return;
    }

      setFormData(prev => ({
        ...prev,
        file,
        fileName: file.name,
      }));
      setError(null); // Limpiar error cuando selecciona archivo
    }
  };

  const handleexecutionNotesChange = (e) => {
    setFormData(prev => ({
      ...prev,
      executionNotes: e.target.value,
    }));
    setError(null); // Limpiar error cuando escribe notas
  };

  const validateForm = () => {
    if (!formData.file && type !== 'microaction') {
      setError(t('errorAttachFile'));
      return false;
    }

    if (type === 'microaction' && !formData.executionNotes.trim()) {
      setError(t('errorCompleteNotes'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (ma) => {
    //console.log(ma)
    if (!validateForm()) {
      return;
    }
    

    setLoading(true);
    setError(null);

    const STATES = ['pending', 'started','in_progress', 'submitted'];

    try {
      
        if(type === 'microaction') {
          const currentIndex = STATES.indexOf(ma.status);
          const stepsNeeded = STATES.length - 1 - currentIndex;

          for (let i = 0; i < stepsNeeded; i++) {
    const body = {
                executionNotes: formData.executionNotes,
                status: STATES[currentIndex + i + 1],
            }
          const { data: responseData, error } = await updateMicroAction(ma.id, body);
          if(error){
            console.log(error)
            setError(error.message || error || t('errorSendTryAgain'));
            return;
          }
  }
            
          microactionRefresh();
          setSuccess('Actualización enviada correctamente.')

        };

        if(type === 'evidence'){
          // PASO 1 - Solicitar firma al backend
            const requestUploadBody = {
  evidenceId: data.id,
  mimeType: "application/pdf",
  evidenceType: "file"
}
        const { data: requestSignatureResponse, error: requestUploadError } = await requestUpload(requestUploadBody);
        if(requestUploadError){
          console.log(requestUploadError)
          setError(requestUploadError.message || requestUploadError || 'Error al enviar. Intenta nuevamente.');
          return;
        }

        // PASO 2 - Subir archivo a Cloudinary con firma
        const CloudinaryformData = new FormData();
        CloudinaryformData.append("file", formData.file); // File object o blob
        CloudinaryformData.append("signature", requestSignatureResponse.signature);
        CloudinaryformData.append("timestamp", requestSignatureResponse.timestamp);
        CloudinaryformData.append("api_key", requestSignatureResponse.apiKey);
        CloudinaryformData.append("folder", requestSignatureResponse.folder);
        CloudinaryformData.append("public_id", requestSignatureResponse.publicId);

        const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${requestSignatureResponse.cloudName}/raw/upload`, {
          method: "POST",
          body: CloudinaryformData,
        });

        const cloudinaryData = await cloudinaryResponse.json();

        // PASO 3 - Confirmar subida al backend
        const { data: confirmUploadResponse, error: confirmUploadError } = await confirmUpload({
          evidenceId: data.id,
          cloudinaryPublicId: cloudinaryData.public_id,
          storageUri: cloudinaryData.url,
          mimeType: "pdf",
          changeSummary: "Corrección de formato solicitada por el evaluador.",
          isMaterialChange: false
        })
        if(confirmUploadError){
          console.log(confirmUploadError)
          setError(confirmUploadError.message || confirmUploadError || 'Error al enviar. Intenta nuevamente.');
          return;
        }

        // PASO 4 - Enviar evidencia a revisión
        const { data: submitEvidenceResponse, error: submitEvidenceError } = await submitEvidence(data.id);
        if(submitEvidenceError){
          console.log(submitEvidenceError)
          setError(submitEvidenceError.message || submitEvidenceError || 'Error al enviar. Intenta nuevamente.');
          return;
        };


        // PASO 5 - Crear evaluación de evidencia
        // Primero se obtienen todas las rúbricas activas
        const { data: activeRubricsResponse, error: activeRubricsError } = await getActiveRubrics();
        if(activeRubricsError){
          console.log(activeRubricsError)
          setError(activeRubricsError.message || activeRubricsError || 'Error al enviar. Intenta nuevamente.');
          return;
        }
        
        // Luego se crea la evaluación con la primer rúbrica
        const { data: createEvaluationResponse, error: createEvaluationError } = await createEvaluation({
          evidenceId: data.id,
          rubricId: activeRubricsResponse[0].id,
          rubricVersion: "v1.0",
          evaluationType: "hybrid",
          evaluationSourceWeight: 0.5
        })
        // PASO 6 - Solo en DEMO: Cerrar evaluación y aprobar evidencia
        
        
        const { data: closeEvaluationResponse, error: closeEvaluationError } = await closeEvaluation({
          
  evaluationId: createEvaluationResponse.id,
  evaluationResult: "approved",
  score: 99,
  dimensionScoresJson: {
    consistency: 82,
    collaboration: 77,
    sustainability: 81
  },
  comment: "Evidencia aprobada. Excelente trabajo de investigación."

        })
        if(closeEvaluationError){
          console.log(closeEvaluationError)
          setError(closeEvaluationError.message || closeEvaluationError || 'Error al enviar. Intenta nuevamente.');
          return;
        }

     
        checkPacStatus();
        setSuccess('Evidencia aprobada.')
        
}
      // Solo limpiamos el formulario si la petición fue exitosa
      setFormData({
        file: null,
        executionNotes: '',
        fileName: null,
      });
      onClose();
    
    } catch (err) {
      // El error se muestra en la UI y el modal permanece abierto
      setError(err.message || t('errorSendTryAgain'));
    } finally {
      setLoading(false);
    }
  };

  const isMicroaction = type === 'microaction';
  const title = isMicroaction ? t('uploadTitleMicro') : t('uploadTitleEvidence');
  const nextStatus = isMicroaction && data?.status ? newStatusMap[data.status] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <NotificationPopup onClose={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="text-white glass-effect border-glass rounded-2xl p-6 max-w-md w-full space-y-4"
          >
            {/* Header 
            <div>
              <h3 className="text-h3 mb-2">{title}</h3>
              {nextStatus && (
                <p className="text-helper text-[var(--text-tertiary)]">
                  Próximo estado: <span className="font-medium">{nextStatus}</span>
                </p>
              )}
            </div>*/}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-body"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message 
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-300 text-body"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>*/}
            {}

            {/* executionNotes Input - Solo para microacciones */}
            {isMicroaction && (
              <div className="space-y-2">
                <div>
                  <div className="text-[var(--text-tertiary)]">{t('labelInstruction')}</div>
                  <p>{data.microActionDefinition.instruction}</p>
                  <div className="text-[var(--text-tertiary)]">{data.microActionDefinition.microActionType}</div>
                </div>
                <label className="text-body-lg font-medium">{t('uploadNotesLabel')}</label>
                <textarea
                  value={formData.executionNotes}
                  onChange={handleexecutionNotesChange}
                  placeholder={t('uploadNotesPlaceholder')}
                  className="w-full text-white bg-zinc-800 border border-glass rounded-xl p-3 h-24 resize-none focus:outline-none focus:border-[var(--color-turquoise)] transition"
                  disabled={loading}
                />
              </div>
            )}

            {/* File Input */}
            {!isMicroaction && (
                
            
            <div className="space-y-2">
              <label className="text-body-lg font-medium">
                {t('uploadFileLabel')}
              </label>
              <p className="text-(--text-tertiary)">{t('uploadOnlyPdf')}</p>
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="w-full text-sm text-white border border-glass rounded-xl p-3
                    bg-white/5 backdrop-blur transition
                    file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm
                    file:font-medium file:bg-[rgba(0,207,207,0.15)] file:text-[var(--status-info)]
                    file:cursor-pointer hover:file:bg-[rgba(0,207,207,0.25)]
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {formData.fileName && (
                <p className="text-helper text-[var(--status-success)]">
                  {t('uploadFileSelected')} {formData.fileName}
                </p>
              )}
            </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg border border-glass text-white
                  hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('btnCancel')}
              </button>
              <button
                onClick={() => handleSubmit(data)}

                disabled={loading}
                className="flex-1 px-4 py-3 rounded-lg font-bold bg-[rgba(0,207,207,0.2)] 
                  border border-[var(--color-turquoise)] text-[var(--color-turquoise)]
                  hover:bg-[rgba(0,207,207,0.35)] transition
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-transparent border-t-[var(--color-turquoise)] rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    {t('btnSending')}
                  </>
                ) : (
                  t('btnSend')
                )}
              </button>
            </div>
          </motion.div>
        </NotificationPopup>
      )}
    </AnimatePresence>
  );
}
