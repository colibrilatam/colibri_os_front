'use client';

import { useState } from 'react';

export default function NotificationPopup({ message, isOpen: initialIsOpen = true, onClose }) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay oscuro */}
      <div className="fixed inset-0 overlay-bg z-40" onClick={handleClose} />

      {/* Popup */}
      <div className=" fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 pointer-events-auto relative">
          {/* Botón Cerrar (X) */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Contenido del popup */}
          <div className="pr-6">
            <p className=" text-center mb-6 text-base leading-relaxed">
              {message}
            </p>
          </div>

          {/* Botón Aceptar */}
          <div className="flex justify-center">
            <button
              onClick={handleClose}
              className=" bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
