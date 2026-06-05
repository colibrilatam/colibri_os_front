'use client';
import { useParams } from 'next/navigation';

import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  FileText,
  Globe,
  MessageSquare,
  Star,
  User2,
} from 'lucide-react';

/* ================= MOCK ================= */

const trayectoClaroEvaluation = {
  id: 'eval-1',

  workflowStatus: 'in_review',

  evaluationType: 'human',

  evaluationResult: null,

  score: null,

  isFinal: false,

  createdAt: '2026-05-20T10:00:00Z',

  evidence: {
    id: 'evidence-1',

    description:
      'Video mostrando validación con usuarios reales utilizando la plataforma durante 2 semanas.',

    evidenceType: 'video',

    status: 'submitted',

    validationStatus: 'pending',

    canonicalUri: 'https://www.youtube.com/embed/dQw4w9WgXcQ',

    privacyLevel: 'private',

    isValidForIc: true,

    createdAt: '2026-05-19T12:00:00Z',

    author: {
      id: 'usr-founder',

      fullName: 'Lucas Martinez',

      role: 'entrepreneur',

      avatar: 'https://i.pravatar.cc/300?img=12',

      bio: 'Founder especializado en educación híbrida.',
    },

    project: {
      id: 'project-1',

      projectName: 'TrayectoClaro',

      industry: 'Edtech',

      country: 'Chile',

      projectImageUrl: 'https://picsum.photos/500/300',

      tagline: 'Seguimiento de trayectorias híbridas',
    },

    microAction: {
      id: 'ma-1',

      code: 'MAD_3_2_1',

      title: 'Validar adopción temprana',

      instruction: 'Demostrar evidencia real de uso con usuarios tempranos.',

      status: 'submitted',

      attemptNumber: 1,

      reopenedCount: 0,

      isOnTime: true,
    },
  },

  rubric: {
    id: 'rubric-1',

    name: 'Validación de evidencia temprana',

    version: 'v1.0',

    criteriaJson: [
      {
        id: 'clarity',

        label: 'Claridad',

        description: 'La evidencia es clara y comprensible.',

        maxScore: 5,
      },

      {
        id: 'execution',

        label: 'Ejecución',

        description: 'Demuestra capacidad operativa.',

        maxScore: 5,
      },

      {
        id: 'traction',

        label: 'Tracción',

        description: 'Existe validación con usuarios reales.',

        maxScore: 5,
      },
    ],
  },
};
const agroMindsEvaluation = {
  id: 'eval-2',

  workflowStatus: 'pending_review',

  evaluationType: 'human',

  evaluationResult: null,

  score: null,

  isFinal: false,

  createdAt: '2026-05-22T14:30:00Z',

  evidence: {
    id: 'evidence-2',

    description:
      'Reporte y fotografías de sensores IoT monitoreando humedad del suelo en cultivos de maíz durante pruebas piloto.',

    evidenceType: 'document',

    status: 'submitted',

    validationStatus: 'pending',

    canonicalUri:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',

    privacyLevel: 'private',

    isValidForIc: true,

    createdAt: '2026-05-21T09:00:00Z',

    author: {
      id: 'usr-agro-founder',

      fullName: 'Valentina Rojas',

      role: 'entrepreneur',

      avatar: 'https://i.pravatar.cc/300?img=45',

      bio: 'Ingeniera agrónoma especializada en agricultura de precisión.',
    },

    project: {
      id: 'project-2',

      projectName: 'AgroMinds',

      industry: 'Agtech',

      country: 'Argentina',

      projectImageUrl: 'https://picsum.photos/500/301',

      tagline: 'Optimización agrícola mediante IA y sensores IoT',
    },

    microAction: {
      id: 'ma-2',

      code: 'MAD_4_1_2',

      title: 'Validar eficiencia operativa',

      instruction:
        'Demostrar reducción de desperdicio o mejora operativa en entorno real.',

      status: 'submitted',

      attemptNumber: 2,

      reopenedCount: 1,

      isOnTime: true,
    },
  },

  rubric: {
    id: 'rubric-2',

    name: 'Validación operativa agrícola',

    version: 'v1.2',

    criteriaJson: [
      {
        id: 'impact',

        label: 'Impacto',

        description:
          'La solución demuestra mejora medible en el proceso agrícola.',

        maxScore: 5,
      },

      {
        id: 'data_quality',

        label: 'Calidad de datos',

        description:
          'La evidencia contiene datos claros, consistentes y verificables.',

        maxScore: 5,
      },

      {
        id: 'scalability',

        label: 'Escalabilidad',

        description:
          'La solución tiene potencial de escalar a múltiples productores.',

        maxScore: 5,
      },
    ],
  },
};

const bioSeedEvaluation = {
  id: 'eval-3',

  workflowStatus: 'in_review',

  evaluationType: 'human',

  evaluationResult: null,

  score: null,

  isFinal: false,

  createdAt: '2026-05-23T11:20:00Z',

  evidence: {
    id: 'evidence-3',

    description:
      'Resultados preliminares de laboratorio mostrando mejora en germinación usando biofertilizantes orgánicos.',

    evidenceType: 'spreadsheet',

    status: 'under_review',

    validationStatus: 'pending',

    canonicalUri:
      'https://file-examples.com/storage/fe1d7d/sample-xlsx-file.xlsx',

    privacyLevel: 'private',

    isValidForIc: false,

    createdAt: '2026-05-22T16:45:00Z',

    author: {
      id: 'usr-bio-founder',

      fullName: 'Martín Salgado',

      role: 'entrepreneur',

      avatar: 'https://i.pravatar.cc/300?img=22',

      bio: 'Biotecnólogo enfocado en soluciones sustentables para cultivos.',
    },

    project: {
      id: 'project-3',

      projectName: 'BioSeed',

      industry: 'Biotech',

      country: 'Chile',

      projectImageUrl: 'https://picsum.photos/500/302',

      tagline: 'Biofertilizantes inteligentes para cultivos regenerativos',
    },

    microAction: {
      id: 'ma-3',

      code: 'MAD_2_3_1',

      title: 'Validar resultados científicos',

      instruction:
        'Presentar evidencia cuantitativa verificable obtenida en pruebas controladas.',

      status: 'under_review',

      attemptNumber: 1,

      reopenedCount: 0,

      isOnTime: false,
    },
  },

  rubric: {
    id: 'rubric-3',

    name: 'Evaluación científica experimental',

    version: 'v2.0',

    criteriaJson: [
      {
        id: 'scientific_validity',

        label: 'Validez científica',

        description:
          'La evidencia presenta metodología clara y resultados consistentes.',

        maxScore: 5,
      },

      {
        id: 'innovation',

        label: 'Innovación',

        description: 'La solución aporta diferenciación tecnológica relevante.',

        maxScore: 5,
      },

      {
        id: 'evidence_quality',

        label: 'Calidad de evidencia',

        description:
          'Los datos y documentos respaldan correctamente las conclusiones.',

        maxScore: 5,
      },
    ],
  },
};

/* ================= COMPONENT ================= */

export default function EvaluationWorkspace() {
  const params = useParams();
  const evaluationId = params.evaluationId;
  //console.log('PROJECT ID:', projectId);
  //console.log('EVALUATION ID:', evaluationId);
  const evaluation =
    evaluationId === 'eval-1'
      ? trayectoClaroEvaluation
      : evaluationId === 'eval-2'
        ? agroMindsEvaluation
        : bioSeedEvaluation;

  const [reviewDecision, setReviewDecision] = useState('');

  const [comment, setComment] = useState('');

  const [dimensionScores, setDimensionScores] = useState({
    clarity: 0,
    execution: 0,
    traction: 0,
  });

  const totalScore = useMemo(() => {
    const values = Object.values(dimensionScores);

    const total = values.reduce((acc, val) => acc + val, 0);

    return ((total / 15) * 100).toFixed(0);
  }, [dimensionScores]);

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* ================= HEADER ================= */}

      <div className="glass-effect border-glass rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-overline">Evaluation Workspace</p>

            <h1 className="text-h2 mt-2">
              {evaluation.evidence.project.projectName}
            </h1>

            <p className="text-body--muted mt-1">
              {evaluation.evidence.microAction.code} ·{' '}
              {evaluation.evidence.microAction.title}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="cyan">{evaluation.workflowStatus}</Badge>

            {evaluation.evidence.isValidForIc && (
              <Badge variant="emerald">Impacta IC</Badge>
            )}
          </div>
        </div>
      </div>

      {/* ================= MAIN ================= */}

      <div className="grid xl:grid-cols-[320px_1fr_420px] gap-6">
        {/* ================= LEFT ================= */}

        <div className="space-y-6">
          {/* PROJECT */}

          <div className="glass-effect border-glass rounded-3xl p-5">
            <img
              src={evaluation.evidence.project.projectImageUrl}
              alt="project"
              className="w-full h-44 object-cover rounded-2xl"
            />

            <div className="mt-4 space-y-2">
              <h2 className="text-value-card">
                {evaluation.evidence.project.projectName}
              </h2>

              <p className="text-body--muted">
                {evaluation.evidence.project.tagline}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge>{evaluation.evidence.project.industry}</Badge>

                <Badge variant="amber">
                  {evaluation.evidence.project.country}
                </Badge>
              </div>
            </div>
          </div>

          {/* FOUNDER */}

          <div className="glass-effect border-glass rounded-3xl p-5">
            <p className="text-overline mb-4">Founder</p>

            <div className="flex items-start gap-4">
              <img
                src={evaluation.evidence.author.avatar}
                alt="author"
                className="w-16 h-16 rounded-2xl object-cover"
              />

              <div>
                <p className="text-value-card">
                  {evaluation.evidence.author.fullName}
                </p>

                <p className="text-helper mt-1">Emprendedor</p>

                <p className="text-body--muted mt-3">
                  {evaluation.evidence.author.bio}
                </p>
              </div>
            </div>
          </div>

          {/* MICROACTION */}

          <div className="glass-effect border-glass rounded-3xl p-5">
            <p className="text-overline mb-4">Microacción</p>

            <div className="space-y-4">
              <Info
                label="Código"
                value={evaluation.evidence.microAction.code}
              />

              <Info
                label="Estado"
                value={evaluation.evidence.microAction.status}
              />

              <Info
                label="Intento"
                value={evaluation.evidence.microAction.attemptNumber}
              />

              <Info
                label="En tiempo"
                value={evaluation.evidence.microAction.isOnTime ? 'Sí' : 'No'}
              />
            </div>
          </div>
        </div>

        {/* ================= CENTER ================= */}

        <div className="space-y-6">
          {/* EVIDENCE */}

          <div className="glass-effect border-glass rounded-3xl p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-overline">Evidencia</p>

                <h2 className="text-h3 mt-2">Validación temprana</h2>
              </div>

              <Badge variant="cyan">video</Badge>
            </div>

            <p className="text-body mt-6">{evaluation.evidence.description}</p>

            {/* VIDEO */}

            <div className="mt-6 rounded-2xl overflow-hidden border border-slate-800">
              <iframe
                src={evaluation.evidence.canonicalUri}
                className="w-full aspect-video"
                allowFullScreen
              />
            </div>
          </div>

          {/* TIMELINE */}

          <div className="glass-effect border-glass rounded-3xl p-6">
            <p className="text-overline mb-5">Timeline</p>

            <div className="space-y-5">
              <TimelineItem
                icon={<FileText size={16} />}
                title="Evidencia enviada"
                date="19/05/2026"
              />

              <TimelineItem
                icon={<Clock3 size={16} />}
                title="Evaluación iniciada"
                date="20/05/2026"
              />

              <TimelineItem
                icon={<User2 size={16} />}
                title="Asignada a evaluador"
                date="20/05/2026"
              />
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}

        <div className="space-y-6">
          {/* RUBRIC */}

          <div className="glass-effect border-glass rounded-3xl p-6 sticky top-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-overline">Rúbrica</p>

                <h2 className="text-h3 mt-2">{evaluation.rubric.name}</h2>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500">Score</p>

                <p className="text-3xl font-bold text-cyan-300">{totalScore}</p>
              </div>
            </div>

            {/* CRITERIA */}

            <div className="space-y-8 mt-8">
              {evaluation.rubric.criteriaJson.map((criterion) => (
                <div key={criterion.id}>
                  <div className="mb-3">
                    <p className="text-body font-medium">{criterion.label}</p>

                    <p className="text-helper mt-1">{criterion.description}</p>
                  </div>

                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => {
                      const active = dimensionScores[criterion.id] === score;

                      return (
                        <button
                          key={score}
                          onClick={() =>
                            setDimensionScores((prev) => ({
                              ...prev,

                              [criterion.id]: score,
                            }))
                          }
                          className={`
                            w-11 h-11 rounded-xl border transition-all
                            ${
                              active
                                ? 'bg-cyan-500 text-black border-cyan-300 scale-105'
                                : 'border-slate-700 text-slate-400 hover:border-cyan-500'
                            }
                          `}
                        >
                          {score}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* DECISION */}

            <div className="border-t border-slate-800 mt-8 pt-8">
              <p className="text-overline mb-4">Decisión</p>

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: 'Aprobar',

                    value: 'approved',
                  },

                  {
                    label: 'Revisión',

                    value: 'needs_revision',
                  },

                  {
                    label: 'Rechazar',

                    value: 'rejected',
                  },
                ].map((item) => {
                  const active = reviewDecision === item.value;

                  return (
                    <button
                      key={item.value}
                      onClick={() => setReviewDecision(item.value)}
                      className={`
                        p-3 rounded-xl border text-xs transition-all
                        ${
                          active
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'border-slate-700 text-slate-400'
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COMMENT */}

            <div className="mt-6">
              <p className="text-overline mb-3">Comentario</p>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                placeholder="Escribe feedback para el founder..."
                className="
                  w-full rounded-2xl bg-black/30
                  border border-slate-800
                  p-4 text-sm outline-none
                  focus:border-cyan-500
                "
              />
            </div>

            {/* ACTIONS */}

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                className="
                  h-12 rounded-2xl
                  border border-slate-700
                  hover:border-slate-500
                  transition-all
                "
              >
                Guardar Draft
              </button>

              <button
                className="
                  h-12 rounded-2xl
                  bg-cyan-500 text-black font-semibold
                  hover:bg-cyan-400
                  transition-all
                "
              >
                Finalizar
              </button>
            </div>

            {/* AI BLOCK */}

            <div className="mt-8 border-t border-slate-800 pt-6">
              <div className="rounded-2xl border border-dashed border-slate-700 p-4">
                <p className="text-overline">AI Review</p>

                <p className="text-helper mt-2">Próximamente disponible.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= UI ================= */

function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-slate-500/10 text-slate-300 border-slate-500/20',

    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',

    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',

    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs border
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-micro-label">{label}</p>

      <p className="text-body mt-1">{value}</p>
    </div>
  );
}

function TimelineItem({ icon, title, date }) {
  return (
    <div className="flex gap-4">
      <div
        className="
          w-10 h-10 rounded-xl
          bg-cyan-500/10 text-cyan-300
          flex items-center justify-center
          shrink-0
        "
      >
        {icon}
      </div>

      <div>
        <p className="text-body">{title}</p>

        <p className="text-helper mt-1">{date}</p>
      </div>
    </div>
  );
}
