'use client';

import { useState, useContext } from 'react';
import { ProjectContext } from '../layout';
import { useProject } from '@/lib/projectContext';

/* ================= COMPONENT ================= */

export default function EvidenciaSection() {
  const { tramoData, dbProject, mockProject } = useProject();

  const { evidence, evaluations, pacProgress, currentState } = mockProject;

  /* =========================
     🔗 DATA MAPPING REAL
  ========================= */

  const evidences = evidence.map((e) => {
    const pac = pacProgress.find((p) => p.id === e.pacId);
    const evalData = evaluations.find((ev) => ev.evidenceId === e.id);

    return {
      title: e.title,
      status: e.status === 'approved' ? 'approved' : 'review',
      pac: e.pacCode,
      category: pac?.categoryName || '-',
      date: e.validatedAt ? new Date(e.validatedAt).toLocaleDateString() : '-',
      mentor: evalData?.evaluatorUserId || '-',
    };
  });

  const [filter, setFilter] = useState('all');
  const [selectedEvidence, setSelectedEvidence] = useState(evidences[0]?.title);

  const filtered = evidences.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const selected = evidence.find((e) => e.title === selectedEvidence);
  const selectedEval = evaluations.find((ev) => ev.evidenceId === selected?.id);
  const selectedPac = pacProgress.find((p) => p.id === selected?.pacId);

  /* =========================
     📊 SUMMARY
  ========================= */

  const approvedCount = evidence.filter((e) => e.status === 'approved').length;

  const lastEvidence = [...evidence]
    .filter((e) => e.validatedAt)
    .sort((a, b) => new Date(b.validatedAt) - new Date(a.validatedAt))[0];

  /* ========================= */

  return (
    <div className="space-y-6">
      {/* 🔼 FILA SUPERIOR */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* ESTADO */}
        <Card>
          <p className="text-overline">Estado actual de prueba</p>

          <div className="flex items-center gap-4 mt-3">
            <span className="text-value-hero">{approvedCount}</span>

            <span className="text-body--muted">evidencias aprobadas</span>
          </div>

          <div
            className="mt-4 inline-flex px-4 py-2 rounded-full 
            bg-[rgba(0,207,207,0.12)] 
            border border-[rgba(0,207,207,0.3)]
            text-accent-cyan"
          >
            {currentState.trajectoryStatus}
          </div>

          <div className="mt-4">
            <p className="text-body">Última evidencia: {lastEvidence?.title}</p>

            <p className="text-helper mt-1">
              Aprobada:{' '}
              {lastEvidence?.validatedAt
                ? new Date(lastEvidence.validatedAt).toLocaleDateString()
                : '-'}
            </p>
          </div>

          <div className="mt-4 glass-effect border-glass rounded-xl p-4">
            <p className="text-micro-label mb-1">Próximo requisito crítico</p>

            <p className="text-body-lg">{currentState.nextMilestone}</p>

            <p className="text-helper mt-2">
              PAC actual: {currentState.currentPacCode}
            </p>
          </div>
        </Card>

        {/* VALIDACIÓN */}
        <Card>
          <p className="text-overline">Validación asociada</p>

          <div>
            <p className="text-micro-label mb-1">Aprobado por</p>
            <p className="text-body-lg">
              {selectedEval?.evaluatorUserId || '-'}
            </p>
            <p className="text-helper mt-1">Evaluador</p>
          </div>

          <div>
            <p className="text-micro-label mb-1">Resultado</p>
            <p className="text-body">{selectedEval?.decision || '-'}</p>
          </div>

          <div>
            <p className="text-micro-label mb-1">Fecha</p>
            <p className="text-date">
              {selectedEval?.evaluatedAt
                ? new Date(selectedEval.evaluatedAt).toLocaleDateString()
                : '-'}
            </p>
          </div>

          <div className="glass-effect border-glass rounded-xl p-4">
            <p className="text-body">
              {selectedEval?.comment || 'Sin comentario'}
            </p>
          </div>
        </Card>
      </div>

      {/* 🔽 FILA INFERIOR */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* EVIDENCIA */}
        <Card>
          <p className="text-overline mb-1">Evidencia trazable</p>

          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h3 className="text-h3">Base probatoria verificable</h3>

            <div className="flex gap-2 flex-wrap">
              <FilterBtn label="Todas" onClick={() => setFilter('all')} />
              <FilterBtn
                label="Aprobadas"
                onClick={() => setFilter('approved')}
              />
              <FilterBtn
                label="En revisión"
                onClick={() => setFilter('review')}
              />
              <FilterBtn
                label="Observadas"
                onClick={() => setFilter('observed')}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map((e, i) => (
              <EvidenceItem
                key={i}
                e={e}
                onClick={() => setSelectedEvidence(e.title)}
                active={selectedEvidence === e.title}
              />
            ))}
          </div>
        </Card>

        {/* TRAZABILIDAD */}
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-overline">Detalle de trazabilidad</p>

              <h3 className="text-h3 mt-1 max-w-xs">{selected?.title}</h3>
            </div>

            <span className="text-badge px-2 py-1 rounded-full border border-white/20">
              v1
            </span>
          </div>

          <p className="text-body--muted mt-3">{selected?.summary}</p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <MiniBlock label="PAC asociado" value={selected?.pacCode} />
            <MiniBlock
              label="Categoría troncal"
              value={selectedPac?.categoryName}
            />
            <MiniBlock label="Resultado" value={selectedEval?.decision} />
            <MiniBlock label="Score" value="-" />
          </div>

          <div className="mt-4 glass-effect border-glass rounded-xl p-4">
            <p className="text-micro-label mb-2">Evaluación asociada</p>

            <p className="text-body mb-2">{selectedEval?.comment}</p>

            <p className="text-helper">
              {selectedEval?.evaluatorUserId} · Evaluador ·{' '}
              {selectedEval?.evaluatedAt
                ? new Date(selectedEval.evaluatedAt).toLocaleDateString()
                : '-'}
            </p>
          </div>

          <div className="mt-4 glass-effect border-glass rounded-xl p-4">
            <p className="text-micro-label mb-3">Historial de versiones</p>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <div>
                  <p className="text-body">Versión actual</p>
                  <p className="text-helper">
                    {selected?.validatedAt
                      ? new Date(selected.validatedAt).toLocaleDateString()
                      : '-'}
                  </p>
                </div>

                <span className="text-badge px-2 py-1 rounded-full border border-white/20">
                  v1
                </span>
              </div>
            </div>
          </div>

          <button className="mt-4 w-full text-body py-2 rounded-xl border border-[var(--color-turquoise)] text-[var(--color-turquoise)] hover:bg-[rgba(0,207,207,0.1)] transition">
            Abrir documento fuente · Bitácora estructurada
          </button>
        </Card>
      </div>

      {/* 🔽 TERCERA FILA */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <p className="text-overline mb-4">Competencias activadas</p>

          {/* ⚠️ NO EXISTE EN DATA */}
          <p className="text-helper">No disponible en backend</p>
        </Card>

        <Card>
          <p className="text-overline mb-4">Skills activadas</p>

          {/* ⚠️ NO EXISTE EN DATA */}
          <p className="text-helper">No disponible en backend</p>
        </Card>

        <Card>
          <p className="text-overline mb-4">Contexto estructural activado</p>

          <p className="text-helper">No disponible en backend</p>
        </Card>
      </div>
    </div>
  );
}

/* ================= UI (SIN CAMBIOS) ================= */

const MiniBlock = ({ label, value }) => (
  <div className="glass-effect border-glass rounded-xl p-3">
    <p className="text-micro-label mb-1">{label}</p>
    <p className="text-body-lg">{value}</p>
  </div>
);

const Card = ({ children }) => (
  <div className="glass-effect border-glass rounded-2xl p-5">{children}</div>
);

const FilterBtn = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="text-badge px-3 py-1 rounded-full border border-glass hover:bg-white/10 transition"
  >
    {label}
  </button>
);

// EvidenceItem y Block SIN CAMBIOS

const EvidenceItem = ({ e, onClick, active }) => {
  const statusMap = {
    approved: {
      label: 'Aprobada',
      class:
        'bg-[rgba(0,153,117,0.15)] text-[var(--status-success)] border-glass-green',
    },
    review: {
      label: 'En revisión',
      class:
        'bg-[rgba(255,209,102,0.15)] text-[var(--status-warning)] border-glass',
    },
    observed: {
      label: 'Observada',
      class:
        'bg-[rgba(255,77,109,0.15)] text-[var(--status-danger)] border-glass-red',
    },
  };

  const status = statusMap[e.status];

  return (
    <div
      onClick={onClick}
      className={`border border-glass rounded-xl p-4 space-y-3 transition cursor-pointer
        ${active ? 'ring-2 ring-[var(--color-turquoise)] bg-white/5' : 'hover:bg-white/5'}
      `}
    >
      <Block label="Evidencia">
        <p className="text-body-lg">{e.title}</p>
      </Block>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Block label="PAC">{e.pac}</Block>
        <Block label="Categoría">{e.category}</Block>

        <Block label="Estado">
          <span
            className={`text-badge px-2 py-1 rounded-full border ${status.class}`}
          >
            {status.label}
          </span>
        </Block>

        <Block label="Fecha">{e.date}</Block>
        <Block label="Mentor">{e.mentor}</Block>

        <Block label="Fuente">
          <button className="text-accent-cyan hover:underline">Ver</button>
        </Block>
      </div>
    </div>
  );
};

const Block = ({ label, children }) => (
  <div>
    <p className="text-micro-label mb-1">{label}</p>
    <div className="text-body">{children}</div>
  </div>
);

const Blockkkkk = ({ label, children }) => (
  <div>
    <p className="text-micro-label mb-1">{label}</p>
    <div className="text-body">{children}</div>
  </div>
);

{
  /* <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <p className="text-overline mb-4">Competencias activadas</p>

          {evidenciaData.metrics.competencies.map((c, i) => (
            <ProgressItem key={i} label={c.label} value={c.value} />
          ))}
        </Card>

        <Card>
          <p className="text-overline mb-4">Skills activadas</p>

          {evidenciaData.metrics.skills.map((s, i) => (
            <SkillItem key={i} label={s.label} level={s.level} />
          ))}
        </Card>

        <Card>
          <p className="text-overline mb-4">Contexto estructural activado</p>

          <div className="flex gap-2 mb-4">
            {evidenciaData.metrics.context.tags.map((tag, i) => (
              <Tag key={i}>{tag}</Tag>
            ))}
          </div>

          <div className="glass-effect border-glass rounded-xl p-4">
            <p className="text-body mb-2">
              <span className="text-helper">PAC asociado principal:</span>{' '}
              <span className="text-body-lg">
                {evidenciaData.metrics.context.pac}
              </span>
            </p>

            <p className="text-body--muted">
              Lectura:{' '}
              <span className="text-body">
                {evidenciaData.metrics.context.description}
              </span>
            </p>
          </div>
        </Card>
      </div> */
}
////////////////////////////////////////////////////////////////////////

'use client';

import { useMemo, useState } from 'react';

export const evidences = [
  {
    id: 'ev-1',
    microActionInstanceId: 'mai-1',
    authorUserId: 'user-1',
    projectId: 'proj-1',

    evidenceType: 'file',
    status: 'approved',
    validationStatus: 'validated',
    isValidForIc: true,
    validationConfidence: 'high',

    privacyLevel: 'public',

    description: 'Informe de entrevistas con 15 usuarios objetivo',
    canonicalUri:
      'https://res.cloudinary.com/demo/raw/upload/v1/evidences/interviews.pdf',

    publicSignalEnabled: true,

    submittedAt: '2024-04-02T10:00:00.000Z',
    approvedAt: '2024-04-03T12:00:00.000Z',
    rejectedAt: null,

    createdAt: '2024-04-01T09:00:00.000Z',
    updatedAt: '2024-04-03T12:00:00.000Z',

    // 🔗 RELACIONES

    author: {
      id: 'user-1',
      fullName: 'Juan Pérez',
      role: 'entrepreneur',
      avatar: 'https://i.pravatar.cc/100?img=1',
    },

    microActionInstance: {
      id: 'mai-1',
      status: 'completed',
      isOnTime: true,
      attemptNumber: 1,

      microActionDefinition: {
        title: 'Validar problema con usuarios reales',
      },
    },

    evaluations: [
      {
        id: 'eval-1',
        score: 9.2,
        evaluationResult: 'approved',
        comment: 'Evidencia sólida y bien documentada',
        evaluatedAt: '2024-04-03T12:00:00.000Z',
      },
    ],

    versions: [
      { id: 'v1', versionNumber: 1 },
      { id: 'v2', versionNumber: 2 },
    ],
  },

  {
    id: 'ev-2',
    microActionInstanceId: 'mai-2',
    authorUserId: 'user-2',
    projectId: 'proj-1',

    evidenceType: 'link',
    status: 'submitted',
    validationStatus: 'under_review',
    isValidForIc: false,
    validationConfidence: 'medium',

    privacyLevel: 'private',

    description: 'Landing page para test de conversión',
    canonicalUri: 'https://mi-startup.com',

    publicSignalEnabled: false,

    submittedAt: '2024-04-05T14:00:00.000Z',
    approvedAt: null,
    rejectedAt: null,

    createdAt: '2024-04-05T13:00:00.000Z',
    updatedAt: '2024-04-05T14:00:00.000Z',

    author: {
      id: 'user-2',
      fullName: 'María González',
      role: 'entrepreneur',
      avatar: 'https://i.pravatar.cc/100?img=5',
    },

    microActionInstance: {
      id: 'mai-2',
      status: 'in_progress',
      isOnTime: true,
      attemptNumber: 1,

      microActionDefinition: {
        title: 'Validar propuesta de valor',
      },
    },

    evaluations: [],

    versions: [{ id: 'v1', versionNumber: 1 }],
  },

  {
    id: 'ev-3',
    microActionInstanceId: 'mai-3',
    authorUserId: 'user-3',
    projectId: 'proj-1',

    evidenceType: 'image',
    status: 'rejected',
    validationStatus: 'rejected',
    isValidForIc: false,
    validationConfidence: 'low',

    privacyLevel: 'restricted',

    description: 'Capturas del prototipo inicial en Figma',
    canonicalUri:
      'https://res.cloudinary.com/demo/image/upload/v1/evidences/prototype.png',

    publicSignalEnabled: false,

    submittedAt: '2024-04-06T10:00:00.000Z',
    approvedAt: null,
    rejectedAt: '2024-04-07T09:00:00.000Z',

    createdAt: '2024-04-06T09:00:00.000Z',
    updatedAt: '2024-04-07T09:00:00.000Z',

    author: {
      id: 'user-3',
      fullName: 'Carlos López',
      role: 'entrepreneur',
      avatar: 'https://i.pravatar.cc/100?img=8',
    },

    microActionInstance: {
      id: 'mai-3',
      status: 'submitted',
      isOnTime: false,
      attemptNumber: 2,

      microActionDefinition: {
        title: 'Diseñar prototipo funcional',
      },
    },

    evaluations: [
      {
        id: 'eval-3',
        score: 4.5,
        evaluationResult: 'rejected',
        comment: 'No cumple con criterios mínimos',
        evaluatedAt: '2024-04-07T09:00:00.000Z',
      },
    ],

    versions: [
      { id: 'v1', versionNumber: 1 },
      { id: 'v2', versionNumber: 2 },
      { id: 'v3', versionNumber: 3 },
    ],
  },

  {
    id: 'ev-4',
    microActionInstanceId: 'mai-4',
    authorUserId: 'user-1',
    projectId: 'proj-1',

    evidenceType: 'video',
    status: 'draft',
    validationStatus: 'pending',
    isValidForIc: false,
    validationConfidence: null,

    privacyLevel: 'private',

    description: 'Demo del producto funcionando (MVP)',
    canonicalUri:
      'https://res.cloudinary.com/demo/video/upload/v1/evidences/demo.mp4',

    publicSignalEnabled: false,

    submittedAt: null,
    approvedAt: null,
    rejectedAt: null,

    createdAt: '2024-04-08T10:00:00.000Z',
    updatedAt: '2024-04-08T10:00:00.000Z',

    author: {
      id: 'user-1',
      fullName: 'Juan Pérez',
      role: 'entrepreneur',
      avatar: 'https://i.pravatar.cc/100?img=1',
    },

    microActionInstance: {
      id: 'mai-4',
      status: 'started',
      isOnTime: true,
      attemptNumber: 1,

      microActionDefinition: {
        title: 'Construir MVP funcional',
      },
    },

    evaluations: [],
    versions: [{ id: 'v1', versionNumber: 1 }],
  },
];

function formatDate(date) {
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}

export default function EvidenciaSection() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [onlyIC, setOnlyIC] = useState(false);

  const [selected, setSelected] = useState(evidences?.[0] || null);

  // =========================
  // FILTROS
  // =========================
  const filtered = useMemo(() => {
    return evidences.filter((e) => {
      const matchSearch =
        !search || e.description?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = filterStatus === 'all' || e.status === filterStatus;

      const matchType = filterType === 'all' || e.evidenceType === filterType;

      const matchIC = !onlyIC || e.isValidForIc;

      return matchSearch && matchStatus && matchType && matchIC;
    });
  }, [evidences, search, filterStatus, filterType, onlyIC]);

  // =========================
  // METRICAS
  // =========================
  const metrics = useMemo(() => {
    return {
      total: evidences.length,
      approved: evidences.filter((e) => e.status === 'approved').length,
      pending: evidences.filter((e) => e.status !== 'approved').length,
      ic: evidences.filter((e) => e.isValidForIc).length,
    };
  }, [evidences]);

  if (!evidences.length) {
    return (
      <div className="p-10 text-center text-slate-400">
        No hay evidencias todavía
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* =========================
          SIDEBAR LISTA
      ========================= */}
      <div className="lg:col-span-1 space-y-4">
        {/* BUSCADOR */}
        <input
          placeholder="Buscar evidencia..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
        />

        {/* FILTROS */}
        <div className="flex flex-wrap gap-2 text-xs">
          <FilterButton
            label="Todos"
            active={filterStatus === 'all'}
            onClick={() => setFilterStatus('all')}
          />
          <FilterButton
            label="Aprobados"
            active={filterStatus === 'approved'}
            onClick={() => setFilterStatus('approved')}
          />
          <FilterButton
            label="Draft"
            active={filterStatus === 'draft'}
            onClick={() => setFilterStatus('draft')}
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <FilterButton
            label="File"
            active={filterType === 'file'}
            onClick={() => setFilterType('file')}
          />
          <FilterButton
            label="Link"
            active={filterType === 'link'}
            onClick={() => setFilterType('link')}
          />
          <FilterButton
            label="Image"
            active={filterType === 'image'}
            onClick={() => setFilterType('image')}
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={onlyIC}
            onChange={() => setOnlyIC(!onlyIC)}
          />
          Solo IC válido
        </label>

        {/* METRICAS */}
        <div className="grid grid-cols-2 gap-2">
          <Metric label="Total" value={metrics.total} />
          <Metric label="Aprobadas" value={metrics.approved} />
          <Metric label="Pendientes" value={metrics.pending} />
          <Metric label="IC" value={metrics.ic} />
        </div>

        {/* LISTA */}
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

      {/* =========================
          DETALLE
      ========================= */}
      <div className="lg:col-span-2">
        {selected && <EvidenceDetail evidence={selected} />}
      </div>
    </div>
  );
}

function EvidenceCard({ evidence, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition ${
        isActive
          ? 'border-cyan-500 bg-cyan-500/10'
          : 'border-white/10 bg-white/5 hover:bg-white/10'
      }`}
    >
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{evidence.evidenceType.toUpperCase()}</span>
        <span>{evidence.status}</span>
      </div>

      <p className="text-sm text-white line-clamp-2">{evidence.description}</p>

      <div className="mt-2 text-xs text-slate-400">
        {new Date(evidence.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

function EvidenceDetail({ evidence }) {
  const evaluation = evidence.evaluations?.[0];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
      {/* HEADER */}
      <div>
        <div className="flex gap-2 mb-2 text-xs">
          <Badge>{evidence.evidenceType}</Badge>
          <Badge>{evidence.status}</Badge>
          <Badge>{evidence.privacyLevel}</Badge>
        </div>

        <h2 className="text-xl font-semibold text-white">
          {evidence.description}
        </h2>
      </div>

      {/* CONTEXTO */}
      <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
        <div>
          <p className="text-slate-500 text-xs">Microacción</p>
          <p>{evidence.microActionInstance?.microActionDefinition?.title}</p>
        </div>

        <div>
          <p className="text-slate-500 text-xs">Autor</p>
          <p>{evidence.author?.fullName}</p>
        </div>

        <div>
          <p className="text-slate-500 text-xs">Fecha</p>
          <p>{formatDate(evidence.createdAt)}</p>
        </div>

        <div>
          <p className="text-slate-500 text-xs">IC</p>
          <p>{evidence.isValidForIc ? '✔ Válido' : 'No válido'}</p>
        </div>
      </div>

      {/* EVALUACION */}
      {evaluation && (
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-white mb-2">Evaluación</h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-500 text-xs">Score</p>
              <p>{evaluation.score}</p>
            </div>

            <div>
              <p className="text-slate-500 text-xs">Resultado</p>
              <p>{evaluation.evaluationResult}</p>
            </div>
          </div>

          {evaluation.comment && (
            <p className="mt-2 text-slate-300 text-sm">{evaluation.comment}</p>
          )}
        </div>
      )}

      {/* ACCIONES */}
      <div className="flex gap-3">
        <a
          href={evidence.canonicalUri}
          target="_blank"
          className="px-4 py-2 rounded-xl bg-cyan-500 text-white text-sm"
        >
          Ver evidencia
        </a>
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="px-2 py-0.5 text-xs rounded-md bg-white/10 border border-white/10">
      {children}
    </span>
  );
}

function Metric({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-lg text-white font-semibold">{value}</p>
    </div>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-xs ${
        active
          ? 'bg-cyan-500 text-white border-cyan-500'
          : 'border-white/10 text-slate-400'
      }`}
    >
      {label}
    </button>
  );
}



///////////////////////////////////////////////////////////////////////////

'use client';

import { useProject } from '@/lib/projectContext';
import { useState } from 'react';

/* =========================
   UI HELPERS
========================= */

const statusColor = {
  draft: 'bg-slate-700 text-slate-300',
  submitted: 'bg-blue-900/40 text-blue-300',
  under_review: 'bg-yellow-900/40 text-yellow-300',
  approved: 'bg-emerald-900/40 text-emerald-300',
  rejected: 'bg-red-900/40 text-red-300',
};

const validationColor = {
  pending: 'text-slate-400',
  ai_reviewed: 'text-cyan-400',
  human_reviewed: 'text-purple-400',
  validated: 'text-emerald-400',
  rejected: 'text-red-400',
};

const confidenceColor = {
  low: 'text-red-400',
  medium: 'text-yellow-400',
  high: 'text-emerald-400',
};

export const evidencess = [
  {
    id: 'ev-uuid-0001',
    microActionInstanceId: 'mai-uuid-0001',
    authorUserId: 'user-uuid-001',
    projectId: 'proj-uuid-0001',

    evidenceType: 'file',
    status: 'submitted',
    validationStatus: 'under_review',
    isValidForIc: false,
    validationConfidence: 'medium',

    privacyLevel: 'private',

    description: 'Documento con hallazgos de entrevistas a usuarios.',
    canonicalUri:
      'https://res.cloudinary.com/colibri/raw/upload/v1/evidences/entrevistas.pdf',

    publicSignalEnabled: false,

    submittedAt: '2024-04-02T10:00:00.000Z',
    approvedAt: null,
    rejectedAt: null,

    createdAt: '2024-04-01T10:00:00.000Z',
    updatedAt: '2024-04-02T10:00:00.000Z',
  },

  {
    id: 'ev-uuid-0002',
    microActionInstanceId: 'mai-uuid-0002',
    authorUserId: 'user-uuid-002',
    projectId: 'proj-uuid-0001',

    evidenceType: 'link',
    status: 'approved',
    validationStatus: 'validated',
    isValidForIc: true,
    validationConfidence: 'high',

    privacyLevel: 'public',

    description: 'Landing page publicada para validación de mercado.',
    canonicalUri: 'https://miproyecto.com',

    publicSignalEnabled: true,

    submittedAt: '2024-04-03T09:00:00.000Z',
    approvedAt: '2024-04-04T15:30:00.000Z',
    rejectedAt: null,

    createdAt: '2024-04-03T08:00:00.000Z',
    updatedAt: '2024-04-04T15:30:00.000Z',
  },

  {
    id: 'ev-uuid-0003',
    microActionInstanceId: 'mai-uuid-0003',
    authorUserId: 'user-uuid-001',
    projectId: 'proj-uuid-0001',

    evidenceType: 'image',
    status: 'rejected',
    validationStatus: 'rejected',
    isValidForIc: false,
    validationConfidence: 'low',

    privacyLevel: 'restricted',

    description: 'Capturas del prototipo inicial.',
    canonicalUri:
      'https://res.cloudinary.com/colibri/image/upload/v1/evidences/prototipo.png',

    publicSignalEnabled: false,

    submittedAt: '2024-04-05T12:00:00.000Z',
    approvedAt: null,
    rejectedAt: '2024-04-06T10:00:00.000Z',

    createdAt: '2024-04-05T11:30:00.000Z',
    updatedAt: '2024-04-06T10:00:00.000Z',
  },

  {
    id: 'ev-uuid-0004',
    microActionInstanceId: 'mai-uuid-0004',
    authorUserId: 'user-uuid-003',
    projectId: 'proj-uuid-0001',

    evidenceType: 'video',
    status: 'draft',
    validationStatus: 'pending',
    isValidForIc: false,
    validationConfidence: null,

    privacyLevel: 'private',

    description: 'Video demo del producto funcionando.',
    canonicalUri:
      'https://res.cloudinary.com/colibri/video/upload/v1/evidences/demo.mp4',

    publicSignalEnabled: false,

    submittedAt: null,
    approvedAt: null,
    rejectedAt: null,

    createdAt: '2024-04-07T14:00:00.000Z',
    updatedAt: '2024-04-07T14:00:00.000Z',
  },
];

function Badge({ children, className }) {
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

export default function EvidenciaSection() {
  const {
    microActionInstanceData,
    tramoData,
    dbProject,
    mockProject,
    projectNftData,
    evidenceData,
  } = useProject();
  const [selected, setSelected] = useState(evidences[0]);

  if (!evidences.length) {
    return (
      <div className="p-6 text-slate-400">No hay evidencias cargadas.</div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* LISTA */}
      <div className="space-y-3">
        {evidences.map((ev) => (
          <div
            key={ev.id}
            onClick={() => setSelected(ev)}
            className={`
              cursor-pointer rounded-xl border p-4 transition
              ${
                selected?.id === ev.id
                  ? 'border-cyan-500 bg-cyan-500/5'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }
            `}
          >
            <div className="flex justify-between mb-2">
              <p className="text-sm text-white font-medium">
                {ev.evidenceType}
              </p>

              <Badge className={statusColor[ev.status]}>{ev.status}</Badge>
            </div>

            <div className="flex justify-between text-xs">
              <span className={validationColor[ev.validationStatus]}>
                {ev.validationStatus}
              </span>

              {ev.isValidForIc && (
                <span className="text-emerald-400">✔ IC</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* DETALLE */}
      <div className="lg:col-span-2 space-y-6">
        {/* HEADER */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Evidencia
              </p>
              <h2 className="text-xl text-white font-semibold">
                {selected.evidenceType}
              </h2>
            </div>

            <div className="flex gap-2">
              <Badge className={statusColor[selected.status]}>
                {selected.status}
              </Badge>

              <Badge className="bg-slate-800 text-slate-300">
                {selected.privacyLevel}
              </Badge>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-300">
            {selected.description || 'Sin descripción'}
          </p>
        </div>

        {/* VALIDACIÓN */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-slate-400 uppercase mb-3">Validación</p>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Estado</p>
              <p className={validationColor[selected.validationStatus]}>
                {selected.validationStatus}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Confianza</p>
              <p className={confidenceColor[selected.validationConfidence]}>
                {selected.validationConfidence || '-'}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Validado por</p>
              <p className="text-white">
                {selected.validatedBy?.fullName || '—'}
              </p>
            </div>
          </div>

          {selected.validationNotes && (
            <div className="mt-4 text-sm text-slate-300">
              <p className="text-slate-400 mb-1">Notas</p>
              {selected.validationNotes}
            </div>
          )}
        </div>

        {/* ARCHIVO */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-slate-400 uppercase mb-3">Archivo</p>

          {selected.canonicalUri ? (
            <a
              href={selected.canonicalUri}
              target="_blank"
              className="text-cyan-400 hover:underline"
            >
              Ver evidencia
            </a>
          ) : (
            <p className="text-slate-500 text-sm">No disponible</p>
          )}

          {selected.contentHash && (
            <p className="mt-2 text-xs text-slate-500 break-all">
              Hash: {selected.contentHash}
            </p>
          )}
        </div>

        {/* VERSIONES */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-slate-400 uppercase mb-3">Versiones</p>

          <div className="space-y-3">
            {selected.versions?.map((v) => (
              <div
                key={v.id}
                className="border border-white/10 rounded-lg p-3 text-sm"
              >
                <div className="flex justify-between">
                  <span className="text-white">v{v.versionNumber}</span>
                  <span className="text-slate-400">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {v.changeSummary && (
                  <p className="text-slate-300 mt-1">{v.changeSummary}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* METADATA */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-slate-400 uppercase mb-3">Metadata</p>

          <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
            <div>
              <p className="text-slate-500">Creado</p>
              {new Date(selected.createdAt).toLocaleDateString()}
            </div>

            <div>
              <p className="text-slate-500">Enviado</p>
              {selected.submittedAt
                ? new Date(selected.submittedAt).toLocaleDateString()
                : '-'}
            </div>

            <div>
              <p className="text-slate-500">Aprobado</p>
              {selected.approvedAt
                ? new Date(selected.approvedAt).toLocaleDateString()
                : '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}