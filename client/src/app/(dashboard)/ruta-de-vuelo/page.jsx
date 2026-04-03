"use client";

import { useState } from "react";
import { flightData } from "@/lib/mock/homeData";

export default function Flight() {
  return (
    <div className="space-y-6 pb-10">

      <Header />

      <div className="space-y-5">
        {flightData.map((pac, index) => (
          <FlightCard
            key={pac.id}
            pac={pac}
            isLast={index === flightData.length - 1}
          />
        ))}
      </div>

    </div>
  );
}

/* HEADER */

function Header() {
  return (
    <div className="glass-effect border-glass rounded-[26px] p-6">
      <div className="text-[var(--text-secondary)] text-sm uppercase">
        Vuelo del Proyecto
      </div>

      <h1 className="mt-2 text-[var(--text-2xl)]">
        Secuencia verificable de transformación
      </h1>

      <p className="mt-3 text-[var(--text-base)] text-[var(--text-secondary)]">
        Navega cada decisión, evidencia y aprendizaje del proyecto.
      </p>
    </div>
  );
}

/* CARD */

function FlightCard({ pac, isLast }) {
  const [open, setOpen] = useState(pac.defaultOpen || false);

  return (
    <div className="relative">

      {/* LINE */}
      {!isLast && (
        <div className="absolute left-4 top-16 bottom-0 w-px bg-[var(--color-nectar)]/40" />
      )}

      <div className="glass-effect border-glass rounded-[22px] p-5 pl-12">

        {/* DOT */}
        <div className="absolute left-2 top-6 h-4 w-4 rounded-full bg-[var(--color-nectar)]" />

        {/* HEADER CLICKABLE */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left"
        >

          <div className="flex justify-between items-center gap-3">

            <div>
              <div className="text-[var(--text-secondary)] text-sm">
                {pac.id} · {pac.fecha}
              </div>

              <div className="text-[var(--text-lg)] font-semibold mt-1">
                {pac.title}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge estado={pac.estado} />

              <span
                className={`transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>

          </div>

        </button>

        {/* SCORE */}
        <div className="mt-3 text-[var(--text-secondary)] text-sm">
          Score:{" "}
          <span className="text-[var(--text-primary)]">
            {pac.score}/100
          </span>
        </div>

        {/* CONTENT (ANIMADO) */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            open ? "max-h-[1000px] opacity-100 mt-5" : "max-h-0 opacity-0"
          }`}
        >

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Narrative label="Fricción" value={pac.narrativa.friccion} />
            <Narrative label="Decisión" value={pac.narrativa.decision} />
            <Narrative label="Acción" value={pac.narrativa.accion} />
            <Narrative label="Evidencia" value={pac.narrativa.evidencia} />
            <Narrative label="Resultado" value={pac.narrativa.resultado} />
            <Narrative label="Insight" value={pac.narrativa.insight} />

          </div>

        </div>

      </div>
    </div>
  );
}

/* COMPONENTES */

function Narrative({ label, value }) {
  return (
    <div className="glass-effect border-glass rounded-xl p-4">

      <div className="text-[var(--text-secondary)] text-sm uppercase">
        {label}
      </div>

      <div className="mt-2 text-[var(--text-base)]">
        {value}
      </div>

    </div>
  );
}

function StatusBadge({ estado }) {
  const config = {
    validado: {
      bg: "var(--status-success-bg)",
      color: "var(--status-success)",
      label: "Validado",
    },
    revision: {
      bg: "var(--status-warning-bg)",
      color: "var(--status-warning)",
      label: "En revisión",
    },
    pendiente: {
      bg: "rgba(255,255,255,0.05)",
      color: "var(--text-secondary)",
      label: "Pendiente",
    },
  };

  const s = config[estado];

  return (
    <span
      className="px-3 py-1 rounded-full text-sm border"
      style={{
        background: s.bg,
        color: s.color,
        borderColor: "rgba(255,255,255,0.1)",
      }}
    >
      {s.label}
    </span>
  );
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