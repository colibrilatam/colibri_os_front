'use client';

import { evidenceData } from "@/lib/mock/homeData";

export default function Evidence() {
  const { global, evidences } = evidenceData;

  return (
    <div className="space-y-6 pb-10">

      <Header global={global} />

      <Summary global={global} />

      <EvidenceList evidences={evidences} />

      <Insight global={global} />

    </div>
  );
}

function Header({ global }) {
  return (
    <div className="glass-effect border-glass rounded-[26px] p-5">

      <div className="text-[var(--text-secondary)] text-xs uppercase">
        Evidencia
      </div>

      <h1 className="mt-2 text-[var(--text-2xl)]">
        Validación del proyecto
      </h1>

      <div className="mt-4 flex items-center gap-6">

        <div className="text-[var(--text-4xl)] font-bold">
          {global.score}
        </div>

        <div className="text-[var(--text-secondary)]">
          Evidencia validada
        </div>

      </div>

    </div>
  );
} 

function Summary({ global }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

      <Metric label="Total" value={global.total} />
      <Metric label="Validadas" value={global.validated} />
      <Metric label="Pendientes" value={global.pending} />
      <Metric label="Rechazadas" value={global.rejected} />

    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="glass-effect border-glass rounded-xl p-4 text-center">
      <div className="text-[var(--text-sm)] text-[var(--text-secondary)]">
        {label}
      </div>
      <div className="text-[var(--text-xl)] font-semibold mt-1">
        {value}
      </div>
    </div>
  );
}

function EvidenceList({ evidences }) {
  return (
    <div className="space-y-4">
      {evidences.map((ev) => (
        <EvidenceCard key={ev.id} data={ev} />
      ))}
    </div>
  );
}


function EvidenceCard({ data }) {
  const statusConfig = {
    validated: "var(--color-emerald)",
    pending: "var(--color-nectar)",
    rejected: "var(--color-magenta)",
  };

  return (
    <div className="glass-effect border-glass rounded-[22px] p-5">

      <div className="flex justify-between items-start">

        <div>
          <div className="text-sm text-[var(--text-secondary)]">
            {data.id} · {data.date}
          </div>

          <h3 className="mt-1 text-[var(--text-lg)]">
            {data.title}
          </h3>
        </div>

        <StatusBadge status={data.status} />
      </div>

      <p className="mt-3 text-[var(--text-base)] text-[var(--text-secondary)]">
        {data.summary}
      </p>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">

        <Pill label="Categoría" value={data.category} />
        <Pill label="PAC" value={data.pac} />
        <Pill label="Mentor" value={data.mentor} />
        <Pill label="Estado" value={data.status} />

      </div>

    </div>
  );
}

function Pill({ label, value }) {
  return (
    <div className="bg-white/5 rounded-lg px-3 py-2">
      <div className="text-xs text-[var(--text-secondary)]">
        {label}
      </div>
      <div className="text-sm">
        {value}
      </div>
    </div>
  );
}

function Insight({ global }) {

  let message = "";

  if (global.validated > global.pending + global.rejected) {
    message = "El proyecto muestra evidencia suficiente para validar hipótesis clave.";
  } else if (global.rejected > 2) {
    message = "Existe evidencia que contradice hipótesis fundamentales.";
  } else {
    message = "El proyecto aún requiere validación adicional.";
  }

  return (
    <div className="glass-effect border-glass rounded-[22px] p-5">

      <h2 className="text-[var(--text-xl)]">
        Lectura institucional
      </h2>

      <p className="mt-3 text-[var(--text-base)] text-[var(--text-secondary)]">
        {message}
      </p>

    </div>
  );
}

function StatusBadge({ status }) {

  const config = {
    validated: {
      label: "Validada",
      color: "var(--color-emerald)",
    },
    pending: {
      label: "Pendiente",
      color: "var(--color-nectar)",
    },
    rejected: {
      label: "Rechazada",
      color: "var(--color-magenta)",
    },
  };

  const s = config[status];

  return (
    <div
      className="px-3 py-1 rounded-full text-sm"
      style={{
        background: `${s.color}20`,
        color: s.color,
      }}
    >
      {s.label}
    </div>
  );
}