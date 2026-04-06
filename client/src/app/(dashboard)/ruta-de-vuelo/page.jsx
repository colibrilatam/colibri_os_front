"use client";

import { useState } from "react";

/* ============================================================
   DATA MOCK (alineado con tu modelo)
   ============================================================ */
const project = {
  name: "Aurora Labs",
  ic: 2.43,
  icMax: 6.0,
};

const pacs = [
  {
    id: "T2-C1",
    title: "Alineación del equipo base",
    objective: "Confirmar roles y coordinación del equipo.",
    status: "completed",
    friction: "Desalineación inicial del equipo",
    decision: "Definir estructura operativa",
    evidence: "Roles validados",
    competency: "Coordinación",
    progress: 30,
  },
  {
    id: "T2-C6",
    title: "Validación del entorno",
    objective: "Analizar variables externas.",
    status: "current",
    friction: "Incertidumbre regulatoria",
    decision: "Mapeo de señales externas",
    evidence: "Evidencia parcial",
    competency: "Análisis sistémico",
    progress: 65,
  },
  {
    id: "T2-C7",
    title: "Lectura de tracción",
    objective: "Medir señales reales.",
    status: "pending",
    friction: "Falta de datos",
    decision: "Definir métricas base",
    evidence: "Pendiente",
    competency: "Data literacy",
    progress: 90,
  },
];

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */
export default function Capa3Colibri() {
  const [selectedPacId, setSelectedPacId] = useState(pacs[1].id);

  const selectedPac = pacs.find((p) => p.id === selectedPacId);

  const icPct = (project.ic / project.icMax) * 100;

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-[var(--text-sm)] text-[var(--text-secondary)]">
          Trayectoria longitudinal por PAC
        </p>
      </div>

      {/* IC */}
      <div className="glass-effect border-glass p-5 rounded-2xl">
        <div className="text-[var(--text-sm)] text-[var(--text-secondary)]">
          Índice Colibrí
        </div>

        <div className="text-[var(--text-xl)] font-semibold">
          {project.ic} / {project.icMax}
        </div>

        <div className="h-2 bg-gray-700 mt-3 rounded-full">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${icPct}%`,
              background: "linear-gradient(90deg, orange, gold, var(--color-emerald))",
            }}
          />
        </div>
      </div>

      {/* TIMELINE PACs */}
      <div className="glass-effect border-glass rounded-2xl p-6 overflow-x-auto">
        <div className="flex gap-10 min-w-[700px]">

          {pacs.map((pac, i) => (
            <button
              key={pac.id}
              onClick={() => setSelectedPacId(pac.id)}
              className="flex flex-col items-center gap-3 min-w-[180px]"
            >
              {/* Nodo */}
              <div
                className={`w-5 h-5 rounded-full ${
                  selectedPacId === pac.id ? "scale-125" : ""
                } transition-all`}
                style={{
                  background: getStatusColor(pac.status),
                }}
              />

              {/* Línea */}
              {i < pacs.length - 1 && (
                <div className="w-full h-[2px]"
                  style={{
                    background: "linear-gradient(90deg, orange, gold, var(--color-emerald))",
                    opacity: 0.5,
                  }}
                />
              )}

              {/* Label */}
              <div className="text-center">
                <div className="text-[var(--text-md)] font-semibold">
                  {pac.id}
                </div>
                <div className="text-[var(--text-sm)] text-[var(--text-secondary)]">
                  {pac.title}
                </div>
              </div>
            </button>
          ))}

        </div>
      </div>

      {/* DETALLE PAC */}
      <div className="glass-effect-dark border-glass rounded-2xl p-6 flex flex-col gap-4">

        <h2 className="text-[var(--text-lg)] font-semibold">
          {selectedPac.title}
        </h2>

        <p className="text-[var(--text-base)] text-[var(--text-secondary)]">
          {selectedPac.objective}
        </p>

        {/* BARRA PROGRESIVA */}
        <div className="w-full h-2 bg-gray-700 rounded-full">
          <div
            className="h-2 rounded-full"
            style={{
              width: `${selectedPac.progress}%`,
              background: getProgressColor(selectedPac.progress),
            }}
          />
        </div>

        {/* INFO */}
        <div className="grid md:grid-cols-2 gap-4 text-[var(--text-sm)]">

          <Info label="Fricción" value={selectedPac.friction} />
          <Info label="Decisión" value={selectedPac.decision} />
          <Info label="Evidencia" value={selectedPac.evidence} />
          <Info label="Competencia" value={selectedPac.competency} />

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   COMPONENTES AUXILIARES
   ============================================================ */
function Info({ label, value }) {
  return (
    <div>
      <span className="text-[var(--text-secondary)]">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

/* ============================================================
   COLORES
   ============================================================ */
function getStatusColor(status) {
  if (status === "completed") return "var(--color-emerald)";
  if (status === "current") return "var(--color-nectar)";
  return "var(--color-magenta)";
}

function getProgressColor(progress) {
  if (progress < 33) return "orange";
  if (progress < 66) return "gold";
  return "var(--color-emerald)";
}

/* import EstadoTramo from './components/EstadoTramo';
import Microacciones from './components/Microacciones';
import ActionsManagement from './components/ActionsManagement';

import { tramoMock, pacsMock, actionsManagementMock } from '@/lib/mock-data';

export default function RutaDeVueloPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        //HEADER
        <div>
          <h1 className="text-3xl text-white font-semibold">Ruta de Vuelo</h1>
          <p className="text-lg text-zinc-400">
            Progreso, ejecución y próximos pasos del proyecto
          </p>
        </div>

        // 🟣 ESTADO GLOBAL 
        <EstadoTramo tramo={tramoMock} />

        // 🔵 ACCIÓN ACTUAL (LO MÁS IMPORTANTE) 
        <ActionsManagement data={actionsManagementMock} />

        // 🧠 MAPA COMPLETO 
        <div>
          <h2 className="text-lg text-white font-semibold mb-4">Mapa del tramo</h2>

          <Microacciones pacs={pacsMock} />
        </div>
      </div>
    </main>
  );
}
 */