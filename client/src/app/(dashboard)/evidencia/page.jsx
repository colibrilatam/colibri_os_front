"use client";

import { useState } from "react";

/* ============================================================
   DATA MOCK
   ============================================================ */

const categories = [
  { id: "C1", name: "Equipo", value: 65, target: 80 },
  { id: "C2", name: "Problema", value: 70, target: 85 },
  { id: "C3", name: "Modelo", value: 55, target: 75 },
  { id: "C4", name: "Financiamiento", value: 40, target: 70 },
  { id: "C5", name: "Timing", value: 60, target: 80 },
  { id: "C6", name: "Exógenos", value: 50, target: 70 },
  { id: "C7", name: "Métricas", value: 45, target: 75 },
];

const skills = [
  { name: "Customer Discovery", value: 70, trend: [40, 50, 60, 70] },
  { name: "Experimentación", value: 60, trend: [30, 45, 55, 60] },
  { name: "Análisis sistémico", value: 50, trend: [20, 30, 40, 50] },
  { name: "Coordinación", value: 75, trend: [50, 60, 70, 75] },
];

const evidences = [
  {
    id: "E-01",
    label: "Entrevistas usuarios",
    category: "C2",
    pac: "T2-C1",
    date: "2026-02-10",
    status: "validated",
    comment: "Insights consistentes",
  },
  {
    id: "E-02",
    label: "Landing test",
    category: "C3",
    pac: "T2-C6",
    date: "2026-03-01",
    status: "in_review",
    comment: "CTR moderado",
  },
];

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */
export default function Capa4Colibri() {
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  return (
    <div className="min-h-screen p-6 flex flex-col gap-8">

      <h1 className="text-2xl font-bold">
        Competencias, Skills y Evidencia
      </h1>

      <CategorySection />
      <SkillsSection />
      <EvidenceSection evidences={evidences} setSelectedEvidence={setSelectedEvidence} />

      {selectedEvidence && (
        <EvidenceModal
          evidence={selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
        />
      )}
    </div>
  );
}

/* ============================================================
   A. CATEGORÍAS (BULLET CHART)
   ============================================================ */
function CategorySection() {
  return (
    <div className="glass-effect border-glass rounded-2xl p-6">

      <h2 className="text-[var(--text-xl)] font-semibold mb-6">
        Categorías troncales (C1–C7)
      </h2>

      <div className="flex flex-col gap-5">
        {categories.map((c) => (
          <div key={c.id}>

            <div className="flex justify-between text-[var(--text-sm)] mb-1">
              <span>{c.name}</span>
              <span>{c.value}%</span>
            </div>

            <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">

              {/* Rango esperado */}
              <div
                className="absolute h-3 rounded-full opacity-20"
                style={{
                  width: `${c.target}%`,
                  background: "#FFD166",
                }}
              />

              {/* Valor actual (gradiente progresivo) */}
              <div
                className="absolute h-3 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${c.value}%`,
                  background:
                    "linear-gradient(90deg, #ff8c00 0%, #FFD166 40%, #78D9B4 70%, #009975 100%)",
                }}
              />

              {/* marcador target */}
              <div
                className="absolute top-[-4px] w-[2px] h-5 bg-white"
                style={{ left: `${c.target}%` }}
              />

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   B. SKILLS
   ============================================================ */
function SkillsSection() {
  return (
    <div className="glass-effect border-glass rounded-2xl p-6">

      <h2 className="text-[var(--text-xl)] font-semibold mb-6">
        Competencias
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {skills.map((s, i) => (
          <div key={i} className="flex flex-col gap-2">

            <div className="flex justify-between text-[var(--text-sm)]">
              <span>{s.name}</span>
              <span>{s.value}%</span>
            </div>

            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${s.value}%`,
                  background:
                    "linear-gradient(90deg, #ff8c00 0%, #FFD166 40%, #78D9B4 70%, #009975 100%)",
                }}
              />
            </div>

            {/* Sparkline */}
            <div className="flex gap-1 mt-1">
              {s.trend.map((t, i) => (
                <div
                  key={i}
                  className="w-2"
                  style={{
                    height: `${t / 2}px`,
                    background: "var(--color-turquoise)",
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

/* ============================================================
   C. EVIDENCIA
   ============================================================ */
function EvidenceSection({ evidences, setSelectedEvidence }) {
  return (
    <div className="glass-effect border-glass rounded-2xl p-6">

      <h2 className="text-[var(--text-xl)] font-semibold mb-4">
        Evidencia trazable
      </h2>

      <div className="flex flex-col gap-3">

        {evidences.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedEvidence(e)}
            className="flex justify-between items-center p-4 rounded-xl bg-black/20 hover:bg-black/30 transition"
          >

            <div className="flex flex-col text-left">
              <span className="font-medium">{e.label}</span>
              <span className="text-[var(--text-sm)] text-[var(--text-secondary)]">
                {e.category} • {e.pac} • {e.date}
              </span>
            </div>

            <span
              className="text-[var(--text-sm)] px-3 py-1 rounded-lg"
              style={{
                background: getStatusBg(e.status),
                color: getStatusColor(e.status),
              }}
            >
              {e.status}
            </span>

          </button>
        ))}

      </div>
    </div>
  );
}

/* ============================================================
   MODAL
   ============================================================ */
function EvidenceModal({ evidence, onClose }) {
  return (
    <div className="overlay-bg fixed inset-0 flex items-center justify-center z-50">

      <div className="glass-effect border-glass rounded-2xl p-6 max-w-lg w-full">

        <h3 className="text-lg font-semibold mb-2">
          {evidence.label}
        </h3>

        <p className="text-[var(--text-sm)] text-[var(--text-secondary)]">
          {evidence.category} • {evidence.pac}
        </p>

        <p className="mt-4">{evidence.comment}</p>

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 rounded-xl bg-[var(--color-emerald)]"
        >
          Cerrar
        </button>

      </div>

    </div>
  );
}

/* ============================================================
   HELPERS
   ============================================================ */
function getStatusColor(s) {
  if (s === "validated") return "var(--color-emerald)";
  if (s === "in_review") return "var(--color-nectar)";
  return "var(--color-magenta)";
}

function getStatusBg(s) {
  if (s === "validated") return "rgba(0,153,117,0.2)";
  if (s === "in_review") return "rgba(255,209,102,0.2)";
  return "rgba(255,77,109,0.2)";
}