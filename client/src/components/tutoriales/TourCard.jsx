"use client";
import { useOnborda } from "onborda";

export default function TourCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}) {
  const { closeOnborda } = useOnborda();

  return (
    <div className="z-49 relative bg-white rounded-xl shadow-xl p-5 xl:w-lg w-full ">
      {/* Flecha indicadora */}
      <span className="text-white">{arrow}</span>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{step.icon}</span>
        <h3 className="font-semibold text-gray-900 text-base">{step.title}</h3>
      </div>

      {/* Contenido */}
      <p className="text-gray-600 text-sm mb-4">{step.content}</p>

      {/* Progreso */}
      <div className="flex flex-col gap-2 items-center justify-between">
        <span className="text-xs text-gray-500">
          {currentStep + 1} de {totalSteps}
        </span>

        <div className="flex gap-2">
          <button
            onClick={closeOnborda}
            className="text-xs border border-gray-400 rounded-lg text-slate-500 hover:text-gray-600 px-2 py-1"
          >
            Saltar
          </button>

          {currentStep !== 0 && (
            <button
              onClick={prevStep}
              className="text-xs border border-gray-400 rounded-lg px-3 py-1 hover:bg-gray-50 text-slate-500"
            >
              Anterior
            </button>
          )}

          {currentStep + 1 < totalSteps ? (
            <button
              onClick={nextStep}
              className="text-xs bg-blue-600 text-white rounded-lg px-3 py-1 hover:bg-blue-700"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={closeOnborda}
              className="text-xs bg-green-600 text-white rounded-lg px-3 py-1 hover:bg-green-700"
            >
              ¡Listo! 🎉
            </button>
          )}
        </div>
      </div>
    </div>
  );
}