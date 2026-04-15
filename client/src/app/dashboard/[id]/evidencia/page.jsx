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
