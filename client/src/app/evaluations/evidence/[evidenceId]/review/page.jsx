'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { evidencesService } from '@/services/evidences';
import { evaluationsService } from '@/services/evaluations';

import ReviewHeader from './components/ReviewHeader';
import RubricCard from './components/RubricCard';
import ScoreCard from './components/ScoreCard';
import ReviewComment from './components/ReviewComment';
import ReviewActions from './components/ReviewActions';

export default function ReviewPage() {
  const router = useRouter();

  const pathname = usePathname();
  const evidenceId = pathname.split('/')[3];

  const [evidence, setEvidence] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  const [rubric, setRubric] = useState(null);
  //console.log(evidence);
  //console.log(evaluation);
  //console.log(rubric);

  const [score, setScore] = useState(10);
  const [decision, setDecision] = useState('');
  const [comment, setComment] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const evidenceData = await evidencesService.getById(evidenceId);
        setEvidence(evidenceData);

        const evaluations = await evaluationsService.getByEvidence(
          evidenceData.id,
        );
        setEvaluation(evaluations.find((e) => !e.isFinal));

        const rubrics = await evaluationsService.getActiveRubrics();
        const currentRubric =
          rubrics.find(
            (r) => r.id === evidenceData.evaluations?.[0]?.rubricId,
          ) || rubrics[0];

        setRubric(currentRubric);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [evidenceId]);

  if (loading) {
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
