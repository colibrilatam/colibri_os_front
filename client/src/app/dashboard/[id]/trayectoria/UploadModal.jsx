"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationPopup from "@/components/NotificationPopup";
import { useRequest } from "@/hooks/useRequest";
import { projectsService } from "@/services/project";

export default function UploadModal({
  isOpen,
  onClose,
  type, // 'microaction' | 'evidence'
  data, // microaction o evidence object
  onSubmit, // callback que retorna la promesa del backend
  newStatusMap = {
    pending: 'started',
    started: 'submitted',
    submitted: 'validated',
    validated: 'completed',
    completed: 'closed',
  }
}) {
    if(!data) return null
    //console.log(data)

    const { execute: updateMicroAction } = useRequest(projectsService.updateMicroAction);
    const { execute: requestUpload } = useRequest(projectsService.requestUploadSignature);

  const [formData, setFormData] = useState({
    file: null,
    executionNotes: '',
    status: newStatusMap[data.status],
    fileName: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ success, setSuccess ] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
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
      setError('Por favor, adjunta un archivo antes de enviar.');
      return false;
    }

    if (type === 'microaction' && !formData.executionNotes.trim()) {
      setError('Por favor, completa las notas de ejecución antes de enviar.');
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

    try {
      
        if(type === 'microaction') {
            const body = {
                executionNotes: formData.executionNotes,
                status: formData.status
            }
          const { data: responseData, error } = await updateMicroAction(ma.id, body);
          if(error){
            console.log(error)
            setError(error.message || error || 'Error al enviar. Intenta nuevamente.');
            return;
          }
          setSuccess('Actualización enviada correctamente.')

        };

        if(type === 'evidence'){
            const body = {
  evidenceId: data.id,
  mimeType: "application/pdf",
  evidenceType: "file"
}
        const { data: responseData, error } = await requestUpload(body);
        if(error){
          console.log(error)
          setError(error.message || error || 'Error al enviar. Intenta nuevamente.');
          return;
        }
        console.log(responseData)
        setSuccess('Actualización enviada correctamente.')
        
}
        onSubmit();
      // Solo limpiamos el formulario si la petición fue exitosa
      setFormData({
        file: null,
        executionNotes: '',
        fileName: null,
      });
      onClose();
    
    } catch (err) {
      // El error se muestra en la UI y el modal permanece abierto
      setError(err.message || 'Error al enviar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const isMicroaction = type === 'microaction';
  const title = isMicroaction ? 'Cargar o actualizar microacción' : 'Cargar o actualizar evidencia';
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
            {/* Header */}
            <div>
              <h3 className="text-h3 mb-2">{title}</h3>
              {nextStatus && (
                <p className="text-helper text-[var(--text-tertiary)]">
                  Próximo estado: <span className="font-medium">{nextStatus}</span>
                </p>
              )}
            </div>

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

            {/* Success Message */}
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
            </AnimatePresence>

            {/* executionNotes Input - Solo para microacciones */}
            {isMicroaction && (
              <div className="space-y-2">
                <label className="text-body-lg font-medium">Notas de ejecución *</label>
                <textarea
                  value={formData.executionNotes}
                  onChange={handleexecutionNotesChange}
                  placeholder="Describe el progreso y cualquier observación relevante..."
                  className="w-full text-white bg-zinc-800 border border-glass rounded-xl p-3 h-24 resize-none focus:outline-none focus:border-[var(--color-turquoise)] transition"
                  disabled={loading}
                />
              </div>
            )}

            {/* File Input */}
            {!isMicroaction && (
                
            
            <div className="space-y-2">
              <label className="text-body-lg font-medium">
                Archivo {isMicroaction ? 'de evidencia' : ''} *
              </label>
              <div className="relative">
                <input
                  type="file"
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
                  ✓ Archivo seleccionado: {formData.fileName}
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
                Cancelar
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
                    Enviando...
                  </>
                ) : (
                  'Enviar'
                )}
              </button>
            </div>
          </motion.div>
        </NotificationPopup>
      )}
    </AnimatePresence>
  );
}
