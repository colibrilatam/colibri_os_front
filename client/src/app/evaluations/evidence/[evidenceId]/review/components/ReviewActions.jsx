import Toast from '@/app/evaluations/common/Toast';
import { useToast } from '@/lib/hooks/useToast';
import { evaluationsService } from '@/services/evaluations';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ReviewActions({
  evidence,
  evaluation,
  score,
  decision,
  comment,
}) {
  const { toast, showToast, hideToast } = useToast();
  const router = useRouter();

  async function handleSubmit() {
    console.log({
      evidence,
      evaluation,
      score,
      decision,
      comment,
    });

    try {
      // 1. Registrar revisión humana

      await evaluationsService.submitHumanReview({
        evaluationId: evaluation.id,
        reviewDecision: decision,
        humanScore: Number(score),
        comment,
      });

      // 2. Finalizar evaluación

      await evaluationsService.finalize({
        evaluationId: evaluation.id,
        evaluationResult: decision,
        score: Number(score),
        comment,
      });
      showToast('success', 'Evaluación finalizada correctamente.');

      setTimeout(() => {
        router.push('/evaluations');
      }, 1500);
    } catch (error) {
      showToast('error', 'No se pudo finalizar la evaluación.');
      console.error(error);
    }
  }

  const isFormValid = decision.trim() !== '' && comment.trim() !== '';

  return (
    <>
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={hideToast}
      />
      <div className="flex justify-end gap-4">
        <button
          onClick={() => router.back()}
          className="
border-theme
glass-effect
rounded-xl
px-5
py-3
cursor-pointer
hover:glass-effect-secondary
transition
"
        >
          Cancelar
        </button>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="
btn-primary
rounded-xl
px-6
py-3
cursor-pointer
disabled:opacity-40
"
        >
          Finalizar evaluación
        </button>
      </div>
    </>
  );
}
