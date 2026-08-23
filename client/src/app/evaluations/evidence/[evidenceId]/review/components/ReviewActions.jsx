import Toast from '@/app/evaluations/common/Toast';
import { useToast } from '@/lib/hooks/useToast';
import { evaluationsService } from '@/services/evaluations';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function ReviewActions({
  evidence,
  evaluation,
  decision,
  comment,
}) {
  const { toast, showToast, hideToast } = useToast();
  const router = useRouter();

  async function handleSubmit() {
    console.log({
      evidence,
      evaluation,
      decision,
      comment,
    });

    try {
      await evaluationsService.submitHumanReview({
        evaluationId: evaluation.id,
        reviewDecision: decision,
        comment,
      });

      await evaluationsService.finalize({
        evaluationId: evaluation.id,
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
        <Button variant="ghost-hover" onClick={() => router.back()}>
          Cancelar
        </Button>

        <Button
          variant="primary"
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          Finalizar evaluación
        </Button>
      </div>
    </>
  );
}
