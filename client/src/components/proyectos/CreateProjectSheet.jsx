'use client';

import { useState, useEffect } from 'react';

export default function CreateProjectSheet({ onClose, onCreate }) {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripción: '',
  });
  const [errors, setErrors] = useState({});

  // Trigger animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del proyecto es requerido';
    }

    if (!formData.descripción.trim()) {
      newErrors.descripción = 'La descripción es requerida';
    } else if (formData.descripción.trim().length < 20) {
      newErrors.descripción = 'La descripción debe tener al menos 20 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Crear proyecto con datos del formulario
    const nuevoProyecto = {
      id: 'mi-proyecto',
      nombre: formData.nombre,
      descripción: formData.descripción,
      porcentajeCompletado: 0,
      miembros: [],
      conteoDeSexos: { hombres: 0, mujeres: 0 },
    };

    onCreate(nuevoProyecto);
    handleClose();
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
          <div className="flex items-start justify-between gap-4 mb-8">
            <div className="flex-1">
              <h2
                id="sheet-title"
                className="text-3xl font-bold text-gray-900 wrap-break-words pr-4"
              >
                Crear Tu Proyecto
              </h2>
              <p className="text-lg text-gray-600 mt-2">
                Comparte tu iniciativa con otros adultos mayores
              </p>
            </div>

            {/* Botón de cierre - Grande y accesible */}
            <button
              onClick={handleClose}
              className="shrink-0 w-14 h-14 min-w-12 min-h-12 rounded-full bg-red-100 hover:bg-red-200 text-red-700 font-bold text-2xl transition-colors active:scale-95 flex items-center justify-center"
              aria-label="Cerrar"
              title="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo: Nombre del Proyecto */}
            <div>
              <label
                htmlFor="nombre"
                className="block text-xl font-semibold text-gray-900 mb-3"
              >
                Nombre del Proyecto
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Mi primer proyecto de bienestar"
                className={`w-full px-4 py-4 text-lg border-2 rounded-xl transition-colors focus:outline-none ${
                  errors.nombre
                    ? 'border-red-500 bg-red-50 focus:border-red-600'
                    : 'border-gray-200 bg-white focus:border-blue-500'
                }`}
                minLength={3}
                maxLength={100}
              />
              {errors.nombre && (
                <p className="text-lg text-red-600 mt-2 font-semibold">
                  ⚠️ {errors.nombre}
                </p>
              )}
            </div>

            {/* Campo: Descripción */}
            <div>
              <label
                htmlFor="descripción"
                className="block text-xl font-semibold text-gray-900 mb-3"
              >
                Descripción del Proyecto
              </label>
              <textarea
                id="descripción"
                name="descripción"
                value={formData.descripción}
                onChange={handleInputChange}
                placeholder="Cuéntanos qué es tu proyecto y qué objetivo tiene..."
                className={`w-full px-4 py-4 text-lg border-2 rounded-xl transition-colors focus:outline-none resize-none ${
                  errors.descripción
                    ? 'border-red-500 bg-red-50 focus:border-red-600'
                    : 'border-gray-200 bg-white focus:border-blue-500'
                }`}
                rows={5}
                minLength={20}
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-base text-gray-600">
                  Mínimo 20 caracteres
                </p>
                <p className="text-base text-gray-600">
                  {formData.descripción.length}/500
                </p>
              </div>
              {errors.descripción && (
                <p className="text-lg text-red-600 mt-2 font-semibold">
                  ⚠️ {errors.descripción}
                </p>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-4 rounded-xl transition-colors active:scale-98 min-h-14"
              >
                ✓ Crear Proyecto
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold text-xl py-4 rounded-xl transition-colors active:scale-98 min-h-14"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Espacio adicional al final */}
        <div className="h-8" />
      </div>
    </>
  );
}
