'use client';

import { useState } from 'react';
import Button from './Button';

export default function NotificationPopup({ message, children, isOpen: initialIsOpen = true, onClose }) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay oscuro */}
      <div className="text-white fixed inset-0 overlay-bg z-40" onClick={handleClose} />

      {/* Popup */}
      <div className=" fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-gradient-to-br from-zinc-700/30 to-zinc-900/30 border border-zinc-600 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 pointer-events-auto relative">
          {/* Botón Cerrar (X) */}
          <button
            onClick={handleClose}
            className="border border-red-900 absolute p-2 border-r-0 border-t-0 rounded-lg top-0 right-0 text-red-800 hover:text-red-500 text-2xl font-bold leading-none cursor-pointer"
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Contenido del popup */}
          <div className="pr-6">
            <p className=" text-white text-center mb-6 text-base leading-relaxed">
              {message}
            </p>
          </div>

          { children && children }

          {/* Botón Aceptar */}
          <div className="flex justify-center">
            <Button content="Aceptar" onClick={handleClose} color="blue" />
          </div>
        </div>
      </div>
    </>
  );
}
