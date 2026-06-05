'use client';

import { useMemo, useState } from 'react';

import EvaluationCard from './components/EvaluationCard';
import EvaluationMetrics from './components/EvaluationMetrics';
import EvaluationFilters from './components/EvaluationFilters';

/* ================= MOCK ================= */

const mockEvaluations = [
  {
    id: 'eval-1',
    evidenceId: 'ev-1',
    evaluationResult: 'approved',
    score: 91,
    createdAt: '2026-06-12T10:00:00.000Z',
    evaluatedAt: '2026-06-12T12:00:00.000Z',

    evidence: {
      id: 'ev-1',
      title: 'Landing validada con entrevistas',
      description: 'Se validó el MVP con 24 entrevistas y 7 usuarios activos.',

      evidenceType: 'document',
      status: 'submitted',
      isValidForIc: true,

      project: {
        id: 'project-1',
        projectName: 'TrayectoClaro',
        country: 'Chile',
        industry: 'Edtech',
      },

      author: {
        id: 'user-1',
        fullName: 'Lucas Martinez',
      },
    },

    rubric: {
      id: 'rubric-1',
      name: 'Validación temprana',
      version: 'v1',
    },

    humanReview: {
      reviewDecision: 'approved',
    },
  },

  {
    id: 'eval-2',
    evidenceId: 'ev-2',
    evaluationResult: 'needs_revision',
    score: 62,
    createdAt: '2026-06-10T10:00:00.000Z',
    evaluatedAt: null,

    evidence: {
      id: 'ev-2',
      title: 'Métricas de retención',
      description: 'Los usuarios presentan baja retención durante la semana 2.',

      evidenceType: 'metrics',
      status: 'under_review',
      isValidForIc: false,

      project: {
        id: 'project-2',
        projectName: 'AgroMinds',
        country: 'Argentina',
        industry: 'Agtech',
      },

      author: {
        id: 'user-2',
        fullName: 'Camila Torres',
      },
    },

    rubric: {
      id: 'rubric-2',
      name: 'Retención',
      version: 'v2',
    },

    humanReview: null,
  },

  {
    id: 'eval-3',
    evidenceId: 'ev-3',
    evaluationResult: 'rejected',
    score: 34,
    createdAt: '2026-06-08T10:00:00.000Z',
    evaluatedAt: '2026-06-08T14:00:00.000Z',

    evidence: {
      id: 'ev-3',
      title: 'Pitch Deck',
      description:
        'Deck enviado sin validaciones ni datos de mercado comprobables.',

      evidenceType: 'presentation',
      status: 'submitted',
      isValidForIc: false,

      project: {
        id: 'project-3',
        projectName: 'BioSeed',
        country: 'Perú',
        industry: 'Biotech',
      },

      author: {
        id: 'user-3',
        fullName: 'Sofía Ramirez',
      },
    },

    rubric: {
      id: 'rubric-3',
      name: 'Pitch',
      version: 'v1',
    },

    humanReview: {
      reviewDecision: 'rejected',
    },
  },
];

/* ================= COMPONENT ================= */

export default function EvaluationsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return mockEvaluations.filter((evaluation) => {
      const matchesSearch =
        evaluation.evidence.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        evaluation.evidence.project.projectName
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : evaluation.evaluationResult === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

 return (
  <div className="h-[calc(100vh-6rem)] px-6 py-6 flex flex-col gap-6">
    {/* HEADER */}

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <p className="text-overline">Evaluaciones</p>
        <h1 className="text-h2">Queue de revisión</h1>
      </div>

      <div className="text-helper">
        {filtered.length} evaluaciones encontradas
      </div>
    </div>

    {/* METRICS */}

    <EvaluationMetrics evaluations={mockEvaluations} />

    {/* FILTERS */}

    <EvaluationFilters
      search={search}
      setSearch={setSearch}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
    />

    {/* LISTA SCROLLEABLE */}

    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
  <div className="flex flex-col gap-4">
    {filtered.map((evaluation) => (
      <EvaluationCard
        key={evaluation.id}
        evaluation={evaluation}
      />
    ))}
  </div>
</div>
  </div>
);
}
