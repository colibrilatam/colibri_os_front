



'use client';

import { useState, useMemo } from 'react';

/* ================= MOCK REALISTA ================= */

const MOCK_EVIDENCES = [
  // 🟡 DRAFT
  {
    id: 'ev-draft-1',
    evidenceType: 'file',
    status: 'draft',
    validationStatus: 'pending',
    isValidForIc: false,
    privacyLevel: 'private',
    publicSignalEnabled: false,

    description: 'Borrador de entrevistas iniciales',
    canonicalUri: '#',

    createdAt: '2024-04-01T10:00:00Z',
    submittedAt: null,
    approvedAt: null,
    rejectedAt: null,

    microActionInstance: {
      id: 'mai-1',
      status: 'in_progress',
      isOnTime: null,
      attemptNumber: 1,
      reopenedCount: 0,
      completedAt: null,
      microActionDefinition: {
        code: 'T1-C1-M1',
        instruction: 'Entrevistar usuarios',
        expectedEvidenceType: 'file',
        isRequired: true,
      },
    },

    author: {
      id: 'user-1',
      fullName: 'Juan Pérez',
      role: 'entrepreneur',
      avatar: '/avatar.jpg',
    },

    evaluations: [],
    versions: [
      {
        id: 'ver-1',
        versionNumber: 1,
        storageUri: '#',
        isMaterialChange: false,
        createdAt: '2024-04-01T10:00:00Z',
      },
    ],
  },

  // 🔵 SUBMITTED
  {
    id: 'ev-submitted-1',
    evidenceType: 'file',
    status: 'submitted',
    validationStatus: 'pending',
    isValidForIc: false,
    privacyLevel: 'private',
    publicSignalEnabled: false,

    description: 'Entrevistas enviadas para revisión',
    canonicalUri: '#',

    createdAt: '2024-04-02T09:00:00Z',
    submittedAt: '2024-04-02T10:00:00Z',
    approvedAt: null,
    rejectedAt: null,

    microActionInstance: {
      id: 'mai-2',
      status: 'submitted',
      isOnTime: true,
      attemptNumber: 1,
      reopenedCount: 0,
      completedAt: '2024-04-02T09:30:00Z',
      microActionDefinition: {
        code: 'T1-C1-M2',
        instruction: 'Documentar insights',
        expectedEvidenceType: 'file',
        isRequired: true,
      },
    },

    author: {
      id: 'user-2',
      fullName: 'María López',
      role: 'entrepreneur',
      avatar: '/avatar2.jpg',
    },

    evaluations: [],
    versions: [
      {
        id: 'ver-2',
        versionNumber: 1,
        storageUri: '#',
        isMaterialChange: false,
        createdAt: '2024-04-02T09:00:00Z',
      },
    ],
  },

  // 🟣 UNDER REVIEW
  {
    id: 'ev-review-1',
    evidenceType: 'file',
    status: 'under_review',
    validationStatus: 'ai_reviewed',
    isValidForIc: false,
    privacyLevel: 'restricted',
    publicSignalEnabled: false,

    description: 'Análisis de entrevistas en revisión',
    canonicalUri: '#',

    createdAt: '2024-04-03T08:00:00Z',
    submittedAt: '2024-04-03T09:00:00Z',
    approvedAt: null,
    rejectedAt: null,

    microActionInstance: {
      id: 'mai-3',
      status: 'submitted',
      isOnTime: true,
      attemptNumber: 1,
      reopenedCount: 0,
      completedAt: '2024-04-03T08:30:00Z',
      microActionDefinition: {
        code: 'T1-C1-M3',
        instruction: 'Analizar resultados',
        expectedEvidenceType: 'file',
        isRequired: true,
      },
    },

    author: {
      id: 'user-3',
      fullName: 'Carlos Gómez',
      role: 'entrepreneur',
      avatar: '/avatar3.jpg',
    },

    evaluations: [
      {
        id: 'eval-1',
        evaluationType: 'ai',
        evaluationResult: 'approved',
        score: 4.2,
        isFinal: false,
        comment: 'Buen análisis preliminar',
        evaluatedAt: '2024-04-03T10:00:00Z',
      },
    ],

    versions: [
      {
        id: 'ver-3',
        versionNumber: 1,
        storageUri: '#',
        isMaterialChange: false,
        createdAt: '2024-04-03T08:00:00Z',
      },
    ],
  },

  // 🟢 APPROVED
  {
    id: 'ev-approved-1',
    evidenceType: 'file',
    status: 'approved',
    validationStatus: 'validated',
    isValidForIc: true,
    privacyLevel: 'public',
    publicSignalEnabled: true,

    description: 'Validación completa del problema',
    canonicalUri: '#',

    createdAt: '2024-04-01T10:00:00Z',
    submittedAt: '2024-04-01T12:00:00Z',
    approvedAt: '2024-04-02T15:00:00Z',
    rejectedAt: null,

    microActionInstance: {
      id: 'mai-4',
      status: 'completed',
      isOnTime: true,
      attemptNumber: 1,
      reopenedCount: 0,
      completedAt: '2024-04-01T11:00:00Z',
      microActionDefinition: {
        code: 'T1-C2-M1',
        instruction: 'Validar problema',
        expectedEvidenceType: 'file',
        isRequired: true,
      },
    },

    author: {
      id: 'user-1',
      fullName: 'Juan Pérez',
      role: 'entrepreneur',
      avatar: '/avatar.jpg',
    },

    evaluations: [
      {
        id: 'eval-2',
        evaluationType: 'hybrid',
        evaluationResult: 'approved',
        score: 4.8,
        isFinal: true,
        comment: 'Excelente evidencia',
        evaluatedAt: '2024-04-02T15:00:00Z',
      },
    ],

    versions: [
      {
        id: 'ver-4',
        versionNumber: 1,
        storageUri: '#',
        isMaterialChange: false,
        createdAt: '2024-04-01T10:00:00Z',
      },
      {
        id: 'ver-5',
        versionNumber: 2,
        storageUri: '#',
        isMaterialChange: true,
        changeSummary: 'Se agregaron más entrevistas',
        createdAt: '2024-04-01T11:30:00Z',
      },
    ],
  },

  // 🔴 REJECTED
  {
    id: 'ev-rejected-1',
    evidenceType: 'file',
    status: 'rejected',
    validationStatus: 'rejected',
    isValidForIc: false,
    privacyLevel: 'private',
    publicSignalEnabled: false,

    description: 'Documento incompleto',
    canonicalUri: '#',

    createdAt: '2024-04-05T10:00:00Z',
    submittedAt: '2024-04-05T11:00:00Z',
    approvedAt: null,
    rejectedAt: '2024-04-05T14:00:00Z',

    microActionInstance: {
      id: 'mai-5',
      status: 'reopened',
      isOnTime: false,
      attemptNumber: 2,
      reopenedCount: 1,
      completedAt: '2024-04-05T10:30:00Z',
      microActionDefinition: {
        code: 'T1-C2-M2',
        instruction: 'Documentar hipótesis',
        expectedEvidenceType: 'file',
        isRequired: true,
      },
    },

    author: {
      id: 'user-4',
      fullName: 'Ana Torres',
      role: 'entrepreneur',
      avatar: '/avatar4.jpg',
    },

    evaluations: [
      {
        id: 'eval-3',
        evaluationType: 'human',
        evaluationResult: 'rejected',
        score: 2.1,
        isFinal: true,
        comment: 'Falta evidencia suficiente',
        evaluatedAt: '2024-04-05T14:00:00Z',
      },
    ],

    versions: [
      {
        id: 'ver-6',
        versionNumber: 1,
        storageUri: '#',
        isMaterialChange: false,
        createdAt: '2024-04-05T10:00:00Z',
      },
    ],
  },
];

/* ================= HELPERS ================= */

const formatDate = (date) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

const getLastEvaluation = (evaluations = []) => {
  if (!evaluations.length) return null;
  return evaluations[evaluations.length - 1];
};

/* ================= COMPONENT ================= */

export default function EvidenciaSection({ evidences = MOCK_EVIDENCES }) {
  const [selected, setSelected] = useState(evidences[0] || null);
  const [filterIC, setFilterIC] = useState(false);

  /* ================= METRICS ================= */

  const metrics = useMemo(() => {
    const total = evidences.length;

    const validated = evidences.filter(
      (e) => e.validationStatus === 'validated',
    ).length;

    const ic = evidences.filter((e) => e.isValidForIc).length;

    const scores = evidences
      .map((e) => getLastEvaluation(e.evaluations))
      .filter((ev) => ev?.score);

    const avgScore =
      scores.reduce((acc, ev) => acc + ev.score, 0) /
      (scores.length || 1);

    return {
      total,
      validated,
      ic,
      avgScore: avgScore.toFixed(2),
    };
  }, [evidences]);

  /* ================= FILTER + SORT ================= */

  const filtered = useMemo(() => {
    return evidences
      .filter((e) => !filterIC || e.isValidForIc)
      .sort((a, b) => {
        if (a.isValidForIc && !b.isValidForIc) return -1;
        if (!a.isValidForIc && b.isValidForIc) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [evidences, filterIC]);

  if (!evidences.length) {
    return <div className="p-10 text-slate-400">No hay evidencias</div>;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* ================= LEFT ================= */}
      <div className="space-y-6">
        {/* METRICS */}
        <div className="grid grid-cols-2 gap-4">
          <Metric label="Evidencias" value={metrics.total} />
          <Metric label="Validadas" value={metrics.validated} />
          <Metric label="Impacto IC" value={metrics.ic} />
          <Metric label="Score" value={metrics.avgScore} />
        </div>

        {/* FILTER */}
        <div className="flex justify-between items-center">
          <p className="text-helper">Filtros</p>

          <button
            onClick={() => setFilterIC(!filterIC)}
            className={`px-3 py-1 rounded-full text-xs border ${
              filterIC
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                : 'border-slate-700 text-slate-400'
            }`}
          >
            Solo IC válido
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {filtered.map((e) => (
            <EvidenceCard
              key={e.id}
              evidence={e}
              isActive={selected?.id === e.id}
              onClick={() => setSelected(e)}
            />
          ))}
        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="lg:col-span-2">
        {selected && <EvidenceDetail evidence={selected} />}
      </div>
    </div>
  );
}

/* ================= CARD ================= */

function EvidenceCard({ evidence, isActive, onClick }) {
  const lastEval = getLastEvaluation(evidence.evaluations);

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition glass-effect border-glass
        ${isActive ? 'border-cyan-400 bg-cyan-400/10' : 'hover:bg-white/5'}
      `}
    >
      <div className="flex justify-between mb-2">
        <TypeBadge type={evidence.evidenceType} />
        <StatusBadge status={evidence.status} />
      </div>

      <p className="text-body mb-2">{evidence.description}</p>

      <div className="flex justify-between text-legend">
        <span>{evidence.microActionInstance?.status}</span>

        {evidence.isValidForIc && (
          <span className="text-accent-emerald">Impacta IC</span>
        )}
      </div>

      {lastEval && (
        <p className="text-xs text-accent-amber mt-1">
          ⭐ {lastEval.score}
        </p>
      )}

      <div className="flex justify-between mt-2 text-legend">
        <span>{evidence.evaluations?.length || 0} eval</span>
        <span>{evidence.versions?.length || 0} ver</span>
      </div>
    </div>
  );
}

/* ================= DETAIL ================= */

function EvidenceDetail({ evidence }) {
  const lastEval = getLastEvaluation(evidence.evaluations);

  return (
    <div className="p-6 rounded-2xl glass-effect border-glass space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-h3">Evidencia</h2>

        <div className="flex gap-2">
          <TypeBadge type={evidence.evidenceType} />
          <StatusBadge status={evidence.status} />
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="text-body">{evidence.description}</p>

      {/* META */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Info label="Validación" value={evidence.validationStatus} />
        <Info
          label="Impacto en IC"
          value={evidence.isValidForIc ? 'Sí' : 'No'}
        />
        <Info label="Fecha" value={formatDate(evidence.createdAt)} />
        <Info label="Versiones" value={evidence.versions?.length || 0} />
        <Info label="Evaluaciones" value={evidence.evaluations?.length || 0} />
        <Info label="Privacidad" value={evidence.privacyLevel} />
      </div>

      {/* AUTHOR */}
      <Section title="Autor">
        <p className="text-body">{evidence.author?.fullName}</p>
        <p className="text-legend">{evidence.author?.role}</p>
      </Section>

      {/* MICROACTION */}
      <Section title="Microacción">
        <div className="grid grid-cols-2 gap-4">
          <Info label="Estado" value={evidence.microActionInstance?.status} />
          <Info
            label="En tiempo"
            value={
              evidence.microActionInstance?.isOnTime === null
                ? '-'
                : evidence.microActionInstance?.isOnTime
                ? 'Sí'
                : 'No'
            }
          />
          <Info
            label="Intentos"
            value={evidence.microActionInstance?.attemptNumber}
          />
          <Info
            label="Reabierta"
            value={evidence.microActionInstance?.reopenedCount}
          />
        </div>
      </Section>

      {/* DEFINITION */}
      {evidence.microActionInstance?.microActionDefinition && (
        <Section title="Microacción Definición">
          <p className="text-white">
            {evidence.microActionInstance.microActionDefinition.code}
          </p>
          <p className="text-body--muted">
            {evidence.microActionInstance.microActionDefinition.instruction}
          </p>
        </Section>
      )}

      {/* TIMELINE */}
      <Section title="Timeline">
        <div className="text-legend space-y-1">
          <p>Creado: {formatDate(evidence.createdAt)}</p>
          <p>Enviado: {formatDate(evidence.submittedAt)}</p>
          <p>Aprobado: {formatDate(evidence.approvedAt)}</p>
          <p>Rechazado: {formatDate(evidence.rejectedAt)}</p>
        </div>
      </Section>

      {/* EVALUATION */}
      {lastEval && (
        <Section title="Evaluación">
          <p className="text-value-lg text-accent-amber">
            ⭐ {lastEval.score}
          </p>
          <p className="text-body--muted">{lastEval.comment}</p>
        </Section>
      )}

      {/* VERSIONS */}
      {evidence.versions?.length > 0 && (
        <Section title="Historial">
          {evidence.versions.map((v) => (
            <div key={v.id} className="flex justify-between text-legend">
              <span>v{v.versionNumber}</span>
              <span>{formatDate(v.createdAt)}</span>
            </div>
          ))}
        </Section>
      )}

      {/* LINK */}
      <a
        href={evidence.canonicalUri}
        target="_blank"
        className="text-accent-cyan"
      >
        Ver archivo →
      </a>
    </div>
  );
}

/* ================= UI ================= */

const Section = ({ title, children }) => (
  <div className="border-t border-slate-800 pt-4">
    <h3 className="text-micro-label mb-2">{title}</h3>
    {children}
  </div>
);

const Metric = ({ label, value }) => (
  <div className="p-4 rounded-xl border border-slate-800 bg-white/5">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-lg text-white font-semibold">{value}</p>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-slate-500 text-xs">{label}</p>
    <p className="text-white">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    approved: 'bg-emerald-500/20 text-emerald-400',
    submitted: 'bg-yellow-500/20 text-yellow-400',
    draft: 'bg-slate-500/20 text-slate-400',
    rejected: 'bg-red-500/20 text-red-400',
    under_review: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <span className={`text-xs px-2 py-1 rounded ${map[status]}`}>
      {status}
    </span>
  );
};

const TypeBadge = ({ type }) => (
  <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
    {type}
  </span>
);
