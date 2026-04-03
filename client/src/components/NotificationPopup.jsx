'use client';

import { useState } from 'react';
import Button from './Button';

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
            className="border border-red-900 absolute p-2 rounded-2xl top-4 right-4 text-red-800 hover:text-red-700 text-2xl font-bold leading-none cursor-pointer"
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
            <Button content="Aceptar" onClick={handleClose} color="blue" />
          </div>
        </div>
      </div>
    </>
  );
}
