'use client';

import { useState } from 'react';

/* ================= MOCK DATA ================= */

const evidenciaData = {
  summary: {
    total: 5,
    lastEvidence: {
      title: 'Entrevistas fundacionales con usuarios tempranos',
      date: '2026-04-02',
    },
    status: 'Base validada en consolidación',
    nextRequirement: 'Evidencia comparativa de validación de mercado',
    currentPac: 'T2-C6',
  },

  validation: {
    approvedBy: 'Laura Méndez',
    role: 'Mentor de validación',
    result: 'Aprobada con observaciones',
    date: '2026-04-02',
    comment:
      'Evidencia consistente, decisión clara y aprendizaje visible respecto al segmento objetivo.',
  },

  /* 🔥 NUEVO: TRAZABILIDAD POR EVIDENCIA */
  traceabilityMap: {
    'Entrevistas fundacionales con usuarios tempranos': {
      title: 'Entrevistas fundacionales con usuarios tempranos',
      version: 'v1.3',
      description:
        'Entrevistas estructuradas para validar problema y contexto.',
      pac: 'T2-C6',
      category: 'C2',
      result: 'Aprobada',
      score: '8.7 / 10',
      evaluation: {
        text: 'Claridad en problema y patrón de necesidad.',
        author: 'Laura Méndez',
        role: 'Mentor de validación',
        date: '2026-04-02',
      },
      history: [
        { label: 'Versión vigente', date: '2026-04-02', version: 'v1.3' },
        { label: 'Primera iteración', date: '2026-03-28', version: 'v1.0' },
      ],
    },

    'Matriz comparativa de señales de mercado': {
      title: 'Matriz comparativa de señales de mercado',
      version: 'v1.1',
      description: 'Comparación entre alternativas actuales y propuesta.',
      pac: 'T2-C6',
      category: 'C2',
      result: 'Aprobada',
      score: '7.9 / 10',
      evaluation: {
        text: 'Buen contraste competitivo.',
        author: 'Laura Méndez',
        role: 'Mentor de validación',
        date: '2026-03-29',
      },
      history: [
        { label: 'Versión vigente', date: '2026-03-29', version: 'v1.1' },
      ],
    },

    'Registro de feedback temprano y patrones de rechazo': {
      title: 'Registro de feedback temprano y patrones de rechazo',
      version: 'v2.0',
      description:
        'Bitácora de respuestas de usuarios con clasificación de objeciones, aceptación y ambigüedad.',
      pac: 'T2-C5',
      category: 'C7',
      result: 'Aprobada',
      score: '8.1 / 10',
      evaluation: {
        text: 'Buen registro de fricción. La calidad mejora porque diferencia claramente interés de intención de uso.',
        author: 'Iván Rojas',
        role: 'Mentor de seguimiento',
        date: '2026-03-21',
      },
      history: [
        { label: 'Versión vigente', date: '2026-03-21', version: 'v2.0' },
        {
          label: 'Primera carga trazable',
          date: '2026-03-14',
          version: 'v1.0',
        },
        {
          label: 'Borrador de contraste inicial',
          date: '2026-03-10',
          version: 'v0.8',
        },
      ],
    },

    'Mapa de microacciones de contraste de segmento': {
      title: 'Mapa de microacciones de contraste de segmento',
      version: 'v0.9',
      description: 'Registro de interacciones iniciales con segmentos.',
      pac: 'T2-C5',
      category: 'C2',
      result: 'En revisión',
      score: '6.5 / 10',
      evaluation: {
        text: 'Falta claridad en interpretación.',
        author: 'Iván Rojas',
        role: 'Mentor de seguimiento',
        date: '2026-03-18',
      },
      history: [
        { label: 'Versión vigente', date: '2026-03-18', version: 'v0.9' },
      ],
    },

    'Síntesis de observaciones de mentoría de mercado': {
      title: 'Síntesis de observaciones de mentoría de mercado',
      version: 'v1.0',
      description: 'Resumen de feedback de mentoría.',
      pac: 'T2-C4',
      category: 'C7',
      result: 'Observada',
      score: '5.8 / 10',
      evaluation: {
        text: 'Necesita mayor estructuración.',
        author: 'Ana Beltrán',
        role: 'Mentor',
        date: '2026-03-12',
      },
      history: [
        { label: 'Versión vigente', date: '2026-03-12', version: 'v1.0' },
      ],
    },
  },

  evidences: [
    {
      title: 'Entrevistas fundacionales con usuarios tempranos',
      pac: 'T2-C6',
      category: 'C2',
      status: 'approved',
      date: '2026-04-02',
      mentor: 'Laura Méndez',
    },
    {
      title: 'Matriz comparativa de señales de mercado',
      pac: 'T2-C6',
      category: 'C2',
      status: 'approved',
      date: '2026-03-29',
      mentor: 'Laura Méndez',
    },
    {
      title: 'Registro de feedback temprano y patrones de rechazo',
      pac: 'T2-C5',
      category: 'C7',
      status: 'approved',
      date: '2026-03-21',
      mentor: 'Iván Rojas',
    },
    {
      title: 'Mapa de microacciones de contraste de segmento',
      pac: 'T2-C5',
      category: 'C2',
      status: 'review',
      date: '2026-03-18',
      mentor: 'Iván Rojas',
    },
    {
      title: 'Síntesis de observaciones de mentoría de mercado',
      pac: 'T2-C4',
      category: 'C7',
      status: 'observed',
      date: '2026-03-12',
      mentor: 'Ana Beltrán',
    },
  ],
  metrics: {
    competencies: [
      { label: 'Aprendizaje experiencial', value: 82 },
      { label: 'Gestión de incertidumbre', value: 74 },
      { label: 'Coordinación', value: 68 },
      { label: 'Iniciativa', value: 61 },
    ],

    skills: [
      { label: 'Pensamiento crítico', level: 'Alta' },
      { label: 'Colaboración', level: 'Media-alta' },
      { label: 'Confiabilidad', level: 'Media' },
      { label: 'Empatía', level: 'Media' },
    ],

    context: {
      tags: ['C2', 'C7'],
      pac: 'T2-C6',
      description:
        'Evidencia concentrada en validación de mercado y señales tempranas de tracción.',
    },
  },
};

/* ================= COMPONENT ================= */

export default function EvidenciaSection() {
  const [filter, setFilter] = useState('all');
  const [selectedEvidence, setSelectedEvidence] = useState(
    evidenciaData.evidences[2].title,
  );

  const filtered = evidenciaData.evidences.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'approved') return e.status === 'approved';
    if (filter === 'review') return e.status === 'review';
    if (filter === 'observed') return e.status === 'observed';
  });

  const trace =
    evidenciaData.traceabilityMap[selectedEvidence] ||
    evidenciaData.traceabilityMap[evidenciaData.evidences[0].title];

  return (
    <div className="space-y-6">
      {/* 🔼 FILA SUPERIOR */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* ESTADO */}
        <Card>
          <p className="label">Estado actual de prueba</p>

          <div className="flex items-center gap-4 mt-3">
            <span className="text-4xl font-bold leading-none">
              {evidenciaData.summary.total}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">
              evidencias aprobadas
            </span>
          </div>

          <div
            className="mt-4 inline-flex px-4 py-2 rounded-full 
            bg-[rgba(0,207,207,0.12)] 
            border border-[rgba(0,207,207,0.3)]
            text-[var(--status-info)] text-sm"
          >
            {evidenciaData.summary.status}
          </div>

          <div className="mt-4">
            <p className="text-sm">
              Última evidencia: {evidenciaData.summary.lastEvidence.title}
            </p>

            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Aprobada: {evidenciaData.summary.lastEvidence.date}
            </p>
          </div>

          <div className="mt-4 glass-effect border-glass rounded-xl p-4">
            <p className="text-[10px] uppercase text-[var(--text-secondary)] mb-1">
              Próximo requisito crítico
            </p>

            <p className="text-sm font-medium">
              {evidenciaData.summary.nextRequirement}
            </p>

            <p className="text-xs text-[var(--text-secondary)] mt-2">
              PAC actual: {evidenciaData.summary.currentPac}
            </p>
          </div>
        </Card>

        {/* VALIDACIÓN */}
        <Card>
          <p className="label">Validación asociada</p>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] mb-1">
              Aprobado por
            </p>

            <p className="text-[15px] font-semibold leading-tight">
              {evidenciaData.validation.approvedBy}
            </p>

            <p className="text-[12px] text-[var(--text-secondary)] mt-1">
              {evidenciaData.validation.role}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] mb-1">
              Resultado
            </p>

            <p className="text-[14px] font-medium">
              {evidenciaData.validation.result}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] mb-1">
              Fecha
            </p>

            <p className="text-[13px]">{evidenciaData.validation.date}</p>
          </div>

          <div className="bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-xl p-4">
            <p className="text-[13px] leading-relaxed text-[var(--text-primary)]">
              {evidenciaData.validation.comment}
            </p>
          </div>
        </Card>
      </div>

      {/* 🔽 FILA INFERIOR */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* EVIDENCIA TRAZABLE (INTACTA) */}
        <Card>
          <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] mb-1">
            Evidencia trazable
          </p>

          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-semibold">
              Base probatoria verificable
            </h3>

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

        {/* DETALLE DE TRAZABILIDAD (INTACTO PERO DINÁMICO) */}
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="label">Detalle de trazabilidad</p>

              <h3 className="text-[16px] font-semibold mt-1 leading-snug max-w-xs">
                {trace.title}
              </h3>
            </div>

            <span className="text-[10px] px-2 py-1 rounded-full border border-white/20 text-[var(--text-secondary)]">
              {trace.version}
            </span>
          </div>

          <p className="text-sm text-[var(--text-secondary)] mt-3">
            {trace.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <MiniBlock label="PAC asociado" value={trace.pac} />
            <MiniBlock label="Categoría troncal" value={trace.category} />
            <MiniBlock label="Resultado" value={trace.result} />
            <MiniBlock label="Score" value={trace.score} />
          </div>

          <div className="mt-4 glass-effect border-glass rounded-xl p-4">
            <p className="text-[10px] uppercase text-[var(--text-secondary)] mb-2">
              Evaluación asociada
            </p>

            <p className="text-sm mb-2">{trace.evaluation.text}</p>

            <p className="text-xs text-[var(--text-secondary)]">
              {trace.evaluation.author} · {trace.evaluation.role} ·{' '}
              {trace.evaluation.date}
            </p>
          </div>

          <div className="mt-4 glass-effect border-glass rounded-xl p-4">
            <p className="text-[10px] uppercase text-[var(--text-secondary)] mb-3">
              Historial de versiones
            </p>

            <div className="flex flex-col gap-2">
              {trace.history.map((h, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2"
                >
                  <div>
                    <p className="text-sm">{h.label}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {h.date}
                    </p>
                  </div>

                  <span className="text-[10px] px-2 py-1 rounded-full border border-white/20 text-[var(--text-secondary)]">
                    {h.version}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-4 w-full text-sm py-2 rounded-xl border border-[var(--color-turquoise)] text-[var(--color-turquoise)] hover:bg-[rgba(0,207,207,0.1)] transition">
            Abrir documento fuente · Bitácora estructurada
          </button>
        </Card>
      </div>
      {/* 🔽 TERCERA FILA */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* COMPETENCIAS */}
        <Card>
          <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] mb-4">
            Competencias activadas
          </p>
          {evidenciaData.metrics.competencies.map((c, i) => (
            <ProgressItem key={i} label={c.label} value={c.value} />
          ))}
        </Card>

        {/* SKILLS */}
        <Card>
          <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] mb-4">
            Skills activadas
          </p>

          {evidenciaData.metrics.skills.map((s, i) => (
            <SkillItem key={i} label={s.label} level={s.level} />
          ))}
        </Card>

        {/* CONTEXTO */}
        <Card>
          <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] mb-4">
            Contexto estructural activado
          </p>

          <div className="flex gap-2 mb-4">
            {evidenciaData.metrics.context.tags.map((tag, i) => (
              <Tag key={i}>{tag}</Tag>
            ))}
          </div>

          <div className="glass-effect border-glass rounded-xl p-4">
            <p className="text-sm mb-2">
              <span className="text-[var(--text-secondary)]">
                PAC asociado principal:
              </span>{' '}
              <span className="font-medium">
                {evidenciaData.metrics.context.pac}
              </span>
            </p>

            <p className="text-sm text-[var(--text-secondary)]">
              Lectura:{' '}
              <span className="text-[var(--text-primary)]">
                {evidenciaData.metrics.context.description}
              </span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ================= UI ================= */

const ProgressItem = ({ label, value }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>

    <div className="w-full h-2 rounded-full bg-white/10 border border-white/10 overflow-hidden">
      <div
        className="h-full bg-white/70 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const SkillItem = ({ label, level }) => (
  <div className="flex justify-between items-center px-4 py-3 rounded-xl border border-white/10 bg-white/5 mb-3">
    <span className="text-sm">{label}</span>
    <span className="text-sm text-[var(--text-secondary)]">{level}</span>
  </div>
);

const Tag = ({ children }) => (
  <span className="px-3 py-1 text-xs rounded-full border border-white/20">
    {children}
  </span>
);

const MiniBlock = ({ label, value }) => (
  <div className="glass-effect border-glass rounded-xl p-3">
    <p className="text-[10px] uppercase text-[var(--text-secondary)] mb-1">
      {label}
    </p>
    <p className="text-sm font-medium">{value}</p>
  </div>
);

const Card = ({ children }) => (
  <div className="glass-effect border-glass rounded-2xl p-5">{children}</div>
);

const FilterBtn = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-1 text-xs rounded-full border border-glass hover:bg-white/10 transition"
  >
    {label}
  </button>
);

const EvidenceItem = ({ e, onClick, active }) => {
  const statusMap = {
    approved: {
      label: 'Aprobada',
      class: 'bg-green-500/10 text-green-400 border-green-500/20',
    },
    review: {
      label: 'En revisión',
      class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    },
    observed: {
      label: 'Observada',
      class: 'bg-red-500/10 text-red-400 border-red-500/20',
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
      {/* EVIDENCIA */}
      <Block label="Evidencia">
        <p className="font-medium">{e.title}</p>
      </Block>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Block label="PAC">{e.pac}</Block>

        <Block label="Categoría">{e.category}</Block>

        <Block label="Estado">
          <span
            className={`text-xs px-2 py-1 rounded-full border ${status.class}`}
          >
            {status.label}
          </span>
        </Block>

        <Block label="Fecha">{e.date}</Block>

        <Block label="Mentor">{e.mentor}</Block>

        <Block label="Fuente">
          <button className="text-[var(--color-turquoise)] text-sm hover:underline">
            Ver
          </button>
        </Block>
      </div>
    </div>
  );
};

const Block = ({ label, children }) => (
  <div>
    <p className="text-[10px] uppercase text-[var(--text-secondary)] mb-1">
      {label}
    </p>
    <div className="text-sm">{children}</div>
  </div>
);
