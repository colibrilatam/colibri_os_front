"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationPopup from "@/components/NotificationPopup";
import { useRequest } from "@/hooks/useRequest";
import { projectsService } from "@/services/project";
import { evidencesService } from "@/services/evidences";
import { useTranslation } from '@/hooks/useTranslation';
import { uploadToCloudinary } from "@/lib/api/cloudinary";
import { evaluationsService } from "@/services/evaluations";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

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
    const { execute: submitMicroAction } = useRequest(projectsService.submitMicroAction);
    const { execute: requestUpload } = useRequest(projectsService.requestUploadSignature);
    const { execute: confirmUpload } = useRequest(projectsService.confirmUpload);
    const { execute: createEvidence } = useRequest(evidencesService.createEvidence);
    const { execute: submitEvidence } = useRequest(evidencesService.submit);
    const { execute: createEvaluation } = useRequest(evaluationsService.create);
    const { execute: getActiveRubrics } = useRequest(evaluationsService.getActiveRubrics);

  const [formData, setFormData] = useState({
    file: null,
    executionNotes: '',
    status: data?.status ? newStatusMap[data.status] : null,
    fileName: null,
  });

  const { t } = useTranslation('trayectoria');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if(!data) return null

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setError(t('errorInvalidFileType') || 'Solo se aceptan archivos PDF o imágenes (JPG, PNG, WebP)');
        e.target.value = "";
        return;
      }

      setFormData(prev => ({
        ...prev,
        file,
        fileName: file.name,
      }));
      setError(null);
    }
  };

  const handleexecutionNotesChange = (e) => {
    setFormData(prev => ({
      ...prev,
      executionNotes: e.target.value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.file) {
      setError(t('errorAttachFile') || 'Debés adjuntar un archivo (PDF o imagen)');
      return false;
    }

    if (type === 'microaction' && !formData.executionNotes.trim()) {
      setError(t('errorCompleteNotes') || 'Completá las notas de ejecución');
      return false;
    }

    return true;
  };

  const handleSubmit = async (ma) => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    const STATES = ['pending', 'started','in_progress', 'submitted'];

    try {
        if(type === 'microaction') {
          // PASO 1 - Crear evidence DRAFT vinculada a la MAI
          const { data: evidenceData, error: createError } = await createEvidence({
            microActionInstanceId: ma.id,
            evidenceType: 'file',
          });
          if (createError) {
            setError(createError.message || createError || 'Error al crear la evidencia.');
            return;
          }

          // PASO 2 - Solicitar firma de upload
          const { data: signatureData, error: sigError } = await requestUpload({
            evidenceId: evidenceData.id,
            mimeType: formData.file.type,
            evidenceType: 'file',
          });
          if (sigError) {
            setError(sigError.message || sigError || 'Error al solicitar firma de carga.');
            return;
          }

          // PASO 3 - Subir archivo a Cloudinary
          const cloudinaryData = await uploadToCloudinary(formData.file, signatureData);

          // PASO 4 - Confirmar upload
          const { error: confirmError } = await confirmUpload({
            evidenceId: evidenceData.id,
            cloudinaryPublicId: cloudinaryData.public_id,
            changeSummary: 'Archivo adjuntado como evidencia de la microacción.',
            isMaterialChange: true,
          });
          if (confirmError) {
            setError(confirmError.message || confirmError || 'Error al confirmar la carga.');
            return;
          }

          // PASO 5 - Enviar evidence a revisión
          const { error: submitEvError } = await submitEvidence(evidenceData.id);
          if (submitEvError) {
            setError(submitEvError.message || submitEvError || 'Error al enviar la evidencia.');
            return;
          }

          // PASO 6 - Crear evaluación de evidencia
          const { data: rubricsData, error: rubricsError } = await getActiveRubrics();
          if (!rubricsError && rubricsData?.length > 0) {
            await createEvaluation({
              evidenceId: evidenceData.id,
              rubricId: rubricsData[0].id,
              evaluationType: 'hybrid',
              evaluationSourceWeight: 0.5,
            });
          }

          // PASO 7 - Avanzar estados de la MAI si es necesario
          const currentIndex = STATES.indexOf(ma.status);
          const stepsNeeded = STATES.length - 1 - currentIndex;
          for (let i = 0; i < stepsNeeded; i++) {
            const { error: updateError } = await updateMicroAction(ma.id, {
              executionNotes: formData.executionNotes,
              status: STATES[currentIndex + i + 1],
            });
            if (updateError) {
              setError(updateError.message || updateError || t('errorSendTryAgain'));
              return;
            }
          }

          // PASO 8 - Enviar MAI a evaluación
          const { error: submitMaError } = await submitMicroAction(ma.id);
          if (submitMaError) {
            setError(submitMaError.message || submitMaError || t('errorSendTryAgain'));
            return;
          }

          microactionRefresh();
        }

        if(type === 'evidence'){
          // PASO 1 - Solicitar firma al backend
            const requestUploadBody = {
  evidenceId: data.id,
  mimeType: formData.file.type,
  evidenceType: "file"
}
        const { data: requestSignatureResponse, error: requestUploadError } = await requestUpload(requestUploadBody);
        if(requestUploadError){
          setError(requestUploadError.message || requestUploadError || 'Error al enviar. Intenta nuevamente.');
          return;
        }

        // PASO 2 - Subir archivo a Cloudinary con firma
        const cloudinaryData = await uploadToCloudinary(formData.file, requestSignatureResponse);

        // PASO 3 - Confirmar subida al backend
        const { data: confirmUploadResponse, error: confirmUploadError } = await confirmUpload({
          evidenceId: data.id,
          cloudinaryPublicId: cloudinaryData.public_id,
          changeSummary: "Corrección de formato solicitada por el evaluador.",
          isMaterialChange: false
        })
        if(confirmUploadError){
          setError(confirmUploadError.message || confirmUploadError || 'Error al enviar. Intenta nuevamente.');
          return;
        }

        // PASO 4 - Enviar evidencia a revisión
        const { data: submitEvidenceResponse, error: submitEvidenceError } = await submitEvidence(data.id);
        if(submitEvidenceError){
          setError(submitEvidenceError.message || submitEvidenceError || 'Error al enviar. Intenta nuevamente.');
          return;
        };

        // PASO 5 - Crear evaluación de evidencia
        const { data: activeRubricsResponse, error: activeRubricsError } = await getActiveRubrics();
        if(!activeRubricsError && activeRubricsResponse?.length > 0){
          await createEvaluation({
            evidenceId: data.id,
            rubricId: activeRubricsResponse[0].id,
            evaluationType: "hybrid",
            evaluationSourceWeight: 0.5
          });
        }

        checkPacStatus();
}

      setFormData({
        file: null,
        executionNotes: '',
        fileName: null,
      });
      onClose();

    } catch (err) {
      setError(err.message || t('errorSendTryAgain'));
    } finally {
      setLoading(false);
    }
  };

  const isMicroaction = type === 'microaction';
  const title = isMicroaction ? t('uploadTitleMicro') : t('uploadTitleEvidence');

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

            {/* Instrucción y notas - solo para microacciones */}
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

            {/* File Input - siempre visible */}
            <div className="space-y-2">
              <label className="text-body-lg font-medium">
                {t('uploadFileLabel') || 'Archivo adjunto'}
              </label>
              <p className="text-(--text-tertiary)">
                {t('uploadPdfOrImage') || 'PDF o imágenes (JPG, PNG, WebP)'}
              </p>
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp"
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
                  {t('uploadFileSelected') || 'Archivo seleccionado:'} {formData.fileName}
                </p>
              )}
            </div>

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
