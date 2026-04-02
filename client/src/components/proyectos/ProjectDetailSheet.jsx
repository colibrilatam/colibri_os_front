'use client';

import { useState, useEffect } from 'react';
import MembersList from './MembersList';
import ProgressBar from './ProgressBar';

export default function ProjectDetailSheet({ project, isMiProyecto, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Esperar a que termine la animación antes de cerrar completamente
    setTimeout(onClose, 300);
  };

  return (
    <>
      {/* Overlay backdrop - Interactivo para cerrar */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 overflow-y-auto max-h-[90vh] transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '90vh' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
      >
        {/* Barra de arrastre visual */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Contenido principal con padding y botón de cierre */}
        <div className="p-6 pb-8">
          {/* Encabezado con botón de cierre */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              {isMiProyecto && (
                <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-base font-semibold mb-3">
                  ✓ Tu Proyecto
                </div>
              )}
              <h2
                id="sheet-title"
                className="text-3xl font-bold text-gray-900 wrap-break-words pr-4"
              >
                {project.nombre}
              </h2>
            </div>

            {/* Botón de cierre - Grande y accesible */}
            <button
              onClick={handleClose}
              className="shrink-0 w-14 h-14 min-w-12 min-h-12 rounded-full bg-red-100 hover:bg-red-200 text-red-700 font-bold text-2xl transition-colors active:scale-95 flex items-center justify-center"
              aria-label="Cerrar detalles del proyecto"
              title="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* Descripción completa */}
          <div className="mb-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              {project.descripción}
            </p>
          </div>

          {/* Barra de progreso */}
          {project.porcentajeCompletado !== undefined && (
            <ProgressBar porcentaje={project.porcentajeCompletado} />
          )}

          {/* Lista de miembros colapsable */}
          <MembersList
            miembros={project.miembros}
            conteoDeSexos={project.conteoDeSexos}
          />
        </div>

        {/* Espacio adicional al final para evitar que scroll tape contenido */}
        <div className="h-8" />
      </div>
    </>
  );
}
