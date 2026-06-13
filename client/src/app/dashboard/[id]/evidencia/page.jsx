'use client';

import {
  formatRouteCode,
  getEvidenceStatusLabel,
  getEvidenceTypeLabel,
  getMicroActionInstanceStatusLabel,
  getPrivacyLevelLabel,
  getUserRoleLabel,
  getValidationStatusLabel,
} from '@/lib/mappers/evidence-labels';
import { useProject } from '@/lib/projectContext';
import { useState, useMemo, useEffect } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

const parseRouteCode = (code) => {
  if (!code) return null;

  // MAD_3_2_1
  const parts = code.split('_');

  if (parts.length !== 4) return null;

  return {
    tramo: `T${parts[1]}`,
    categoria: `C${parts[2]}`,
    microAction: `MA${parts[3]}`,
  };
};

/* ================= COMPONENT ================= */

export default function EvidenciaSection() {
  const { evidenceData } = useProject();

  const evidences = evidenceData || [];
  //console.log('evidences-----', evidences);
  const [selected, setSelected] = useState(null);
  const [filterIC, setFilterIC] = useState(false);

  const [statusFilter, setStatusFilter] = useState('all');
  const [tramoFilter, setTramoFilter] = useState('all');
  const [categoriaFilter, setCategoriaFilter] = useState('all');

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
      scores.reduce((acc, ev) => acc + ev.score, 0) / (scores.length || 1);

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
      .filter((e) => {
        // IC
        if (filterIC && !e.isValidForIc) {
          return false;
        }

        // STATUS
        if (statusFilter !== 'all') {
          if (statusFilter === 'pending') {
            const pendingStatuses = ['submitted', 'under_review'];

            if (!pendingStatuses.includes(e.status)) {
              return false;
            }
          } else if (e.status !== statusFilter) {
            return false;
          }
        }

        const code = e.microActionInstance?.microActionDefinition?.code;

        const parsed = parseRouteCode(code);

        // TRAMO
        if (tramoFilter !== 'all' && parsed?.tramo !== tramoFilter) {
          return false;
        }

        // CATEGORIA
        if (
          categoriaFilter !== 'all' &&
          parsed?.categoria !== categoriaFilter
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.isValidForIc && !b.isValidForIc) return -1;
        if (!a.isValidForIc && b.isValidForIc) return 1;

        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [evidences, filterIC, statusFilter, tramoFilter, categoriaFilter]);

  useEffect(() => {
    // No hay resultados
    if (filtered.length === 0) {
      setSelected(null);
      return;
    }

    // Si la evidencia seleccionada ya no existe en el filtro
    const stillExists = filtered.some((e) => e.id === selected?.id);

    if (!stillExists) {
      setSelected(filtered[0]);
    }
  }, [filtered, selected]);

  if (!evidences.length) {
    return <div className="p-10 text-slate-400">No hay evidencias</div>;
  }

  return (
    <div className="space-y-6 w-full">
      {/* ================= METRICS ================= */}
      <div
        id="metricas"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
      >
        <Metric label="Evidencias" value={metrics.total} />
        <Metric label="Validadas" value={metrics.validated} />
        <Metric label="Impacto IC" value={metrics.ic} />
        <Metric label="Score" value={metrics.avgScore} />
      </div>

      {/* ================= FILTERS ================= */}
      <div
        className="
  flex flex-wrap items-center gap-4
  p-4 rounded-2xl
  glass-effect border-glass w-full
"
      >
        {/* STATUS */}
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-helper whitespace-nowrap">Estado</p>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Todas', value: 'all' },
              { label: 'Pendientes', value: 'pending' },
              { label: 'Aprobadas', value: 'approved' },
              { label: 'Rechazadas', value: 'rejected' },
              { label: 'Borradores', value: 'draft' },
            ].map((item) => (
              <FilterChip
                key={item.value}
                active={statusFilter === item.value}
                onClick={() => setStatusFilter(item.value)}
              >
                {item.label}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* TRAMO */}
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-helper whitespace-nowrap">Tramo</p>

          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={tramoFilter === 'all'}
              onClick={() => setTramoFilter('all')}
            >
              Todos
            </FilterChip>

            {[1, 2, 3, 4, 5, 6].map((t) => (
              <FilterChip
                key={t}
                active={tramoFilter === `T${t}`}
                onClick={() => setTramoFilter(`T${t}`)}
              >
                {`T${t}`}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* CATEGORIA */}
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-helper whitespace-nowrap">Categoría</p>

          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={categoriaFilter === 'all'}
              onClick={() => setCategoriaFilter('all')}
            >
              Todas
            </FilterChip>

            {[1, 2, 3, 4, 5, 6, 7].map((c) => (
              <FilterChip
                key={c}
                active={categoriaFilter === `C${c}`}
                onClick={() => setCategoriaFilter(`C${c}`)}
              >
                {`C${c}`}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* IC */}
        <div className="pt-2">
          <button
            onClick={() => setFilterIC(!filterIC)}
            className={`px-3 py-1 rounded-full text-xs border transition ${
              filterIC
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                : 'border-slate-700 text-slate-400'
            }`}
          >
            Solo IC válido
          </button>
        </div>
      </div>

      {/* ================= LIST ================= */}
      <div id="lista" className="space-y-4 w-full">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-h3">Evidencias</h2>

          <div
            className="
        px-3 py-1 rounded-full
        bg-cyan-500/10
        border border-cyan-500/20
        text-cyan-300 text-sm
      "
          >
            {filtered.length} evidencias
          </div>
        </div>

        {/* SWIPER */}
        <Swiper
          modules={[Navigation]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={16}
          slidesPerView={1.1}
          breakpoints={{
            640: {
              slidesPerView: 1.5,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="evidence-swiper"
        >
          {filtered.map((e) => (
            <SwiperSlide key={e.id} className="h-auto">
              <div className="h-full">
                <EvidenceCard
                  evidence={e}
                  isActive={selected?.id === e.id}
                  onClick={() => setSelected(e)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {filtered.length === 0 && (
          <div
            className="
      p-10 rounded-2xl
      border border-dashed border-slate-700
      text-center text-slate-400
      glass-effect
    "
          >
            No se encontraron evidencias con los filtros actuales.
          </div>
        )}
      </div>

      {/* ================= DETAIL ================= */}
      {selected && filtered.length > 0 && (
        <div id="detalle" className="w-full">
          <EvidenceDetail evidence={selected} />
        </div>
      )}
    </div>
  );
}

/* ================= CARD ================= */

function EvidenceCard({ evidence, isActive, onClick }) {
  const lastEval = getLastEvaluation(evidence.evaluations);

  return (
    <div
      onClick={onClick}
      className={`
    h-[220px]
    flex flex-col justify-between
    p-4 rounded-xl cursor-pointer transition
    glass-effect border-glass
    ${isActive ? 'border-cyan-400 bg-cyan-400/10' : 'hover:bg-white/5'}
  `}
    >
      <div className="flex justify-between mb-2">
        <TypeBadge type={evidence.evidenceType} />
        <StatusBadge status={evidence.status} />
      </div>

      <p className="text-body mb-2">{evidence.description}</p>

      <div className="flex justify-between text-legend">
        <span>
          {getMicroActionInstanceStatusLabel(
            evidence.microActionInstance?.status,
          )}
        </span>

        {evidence.isValidForIc && (
          <span className="text-accent-emerald">Impacta IC</span>
        )}
      </div>

      {lastEval && (
        <p className="text-xs text-accent-amber mt-1">⭐ {lastEval.score}</p>
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
        <Info
          label="Validación"
          value={getValidationStatusLabel(evidence.validationStatus)}
        />
        <Info
          label="Impacto en IC"
          value={evidence.isValidForIc ? 'Sí' : 'No'}
        />
        <Info label="Fecha" value={formatDate(evidence.createdAt)} />
        <Info label="Versiones" value={evidence.versions?.length || 0} />
        <Info label="Evaluaciones" value={evidence.evaluations?.length || 0} />
        <Info
          label="Privacidad"
          value={getPrivacyLevelLabel(evidence.privacyLevel)}
        />
      </div>

      {/* AUTHOR */}
      <Section title="Autor">
        <p className="text-body">{evidence.author?.fullName}</p>
        <p className="text-legend">{getUserRoleLabel(evidence.author?.role)}</p>
      </Section>

      {/* MICROACTION */}
      <Section title="Microacción">
        <div className="grid grid-cols-2 gap-4">
          <Info
            label="Estado"
            value={getMicroActionInstanceStatusLabel(
              evidence.microActionInstance?.status,
            )}
          />
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
            {formatRouteCode(
              evidence.microActionInstance.microActionDefinition.code,
            )}
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
          <p className="text-value-lg text-accent-amber">⭐ {lastEval.score}</p>
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
const FilterChip = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs border transition
      ${
        active
          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
          : 'border-slate-700 text-slate-400 hover:bg-white/5'
      }
    `}
  >
    {children}
  </button>
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
      {getEvidenceStatusLabel(status)}
    </span>
  );
};

const TypeBadge = ({ type }) => (
  <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
    {getEvidenceTypeLabel(type)}
  </span>
);
