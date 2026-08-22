'use client';

import { useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useEvidence } from '@/hooks/queries/useEvidence';
import { useEvidenceEvaluations } from '@/hooks/queries/useEvidenceEvaluations';
import { useActiveRubrics } from '@/hooks/queries/useActiveRubrics';

import ReviewHeader from './components/ReviewHeader';
import RubricCard from './components/RubricCard';
import ScoreCard from './components/ScoreCard';
import ReviewComment from './components/ReviewComment';
import ReviewActions from './components/ReviewActions';

export default function ReviewPage() {
  const router = useRouter();

  const pathname = usePathname();
  const evidenceId = pathname.split('/')[3];

  const { data: evidence, isLoading: evidenceLoading } = useEvidence(evidenceId);
  const { data: evaluations = [], isLoading: evaluationsLoading } =
    useEvidenceEvaluations(evidenceId);
  const { data: rubrics = [], isLoading: rubricsLoading } = useActiveRubrics();

  const evaluation = useMemo(
    () => evaluations.find((e) => !e.isFinal),
    [evaluations],
  );

  const rubric = useMemo(() => {
    if (!rubrics.length) return null;
    return (
      rubrics.find((r) => r.id === evidence?.evaluations?.[0]?.rubricId) ||
      rubrics[0]
    );
  }, [rubrics, evidence]);

  const [score, setScore] = useState(10);
  const [decision, setDecision] = useState('');
  const [comment, setComment] = useState('');

  if (evidenceLoading || evaluationsLoading || rubricsLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!evidence) {
    return <div className="p-6">No se encontró la evidencia.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 p-6">
      {/* RESUMEN */}
      <ReviewHeader evidence={evidence} />

      {/* RÚBRICA */}
      <RubricCard rubric={rubric} />

      {/* EVALUACIÓN */}
      <div className="glass-effect rounded-2xl p-6 flex flex-col gap-6">
        <h2 className="text-h3 text-primary-theme">Evaluación</h2>

        <ScoreCard
          score={score}
          setScore={setScore}
          decision={decision}
          setDecision={setDecision}
        />

        <ReviewComment comment={comment} setComment={setComment} />
      </div>

      {/* ACCIONES */}
      <ReviewActions
        evidence={evidence}
        evaluation={evaluation}
        score={score}
        decision={decision}
        comment={comment}
        onCancel={() => router.back()}
      />
    </div>
  );
}
