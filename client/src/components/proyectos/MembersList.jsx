'use client';

import { useState } from 'react';

export default function MembersList({ miembros, conteoDeSexos }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t-2 border-gray-200 pt-6">
      {/* Resumen de sexos */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-3xl font-bold text-blue-700 mb-1">
            {conteoDeSexos.hombres}
          </div>
          <div className="text-lg font-semibold text-gray-700">Hombres</div>
        </div>
        <div className="bg-pink-50 p-4 rounded-xl border border-pink-200">
          <div className="text-3xl font-bold text-pink-700 mb-1">
            {conteoDeSexos.mujeres}
          </div>
          <div className="text-lg font-semibold text-gray-700">Mujeres</div>
        </div>
      </div>

      {/* Botón colapsable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors p-4 rounded-xl mb-4 active:scale-98 min-h-12"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Ocultar lista de miembros' : 'Ver lista de miembros'}
      >
        <span className="text-xl font-semibold text-gray-800">
          Ver Miembros
        </span>
        <span
          className={`text-3xl text-gray-600 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>

      {/* Lista de miembros expandible */}
      {isExpanded && (
        <div className="space-y-3">
          {miembros.map((miembro, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-l-4 border-blue-400"
            >
              {/* Icono de sexo */}
              <span className="text-3xl flex-shrink-0">
                {miembro.sexo === 'hombre' ? '♂️' : '♀️'}
              </span>

              {/* Nombre */}
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-900">
                  {miembro.nombre}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {miembro.sexo === 'hombre' ? 'Hombre' : 'Mujer'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
