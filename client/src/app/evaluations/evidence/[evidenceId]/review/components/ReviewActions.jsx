import { useRouter } from 'next/navigation';

export default function ReviewActions({
  evidence,
  evaluation,
  score,
  decision,
  comment,
}) {
  const router = useRouter();

  async function handleSubmit() {
    console.log({
      evidence,
      evaluation,
      score,
      decision,
      comment,
    });

    /* try {
      // 1. Registrar revisión humana

      await evaluationsService.submitHumanReview({
        evaluationId: evaluation.id,
        reviewDecision: decision,
        humanScore: Number(score),
        comment,
      });

      // 2. Finalizar evaluación

      await evaluationsService.finalizeEvaluation({
        evaluationId: evaluation.id,
        evaluationResult: decision,
        score: Number(score),
        comment,
      });

      //router.push('/evaluations');
    } catch (error) {
      console.error(error);
    } */
  }

  return (
    <div className="flex justify-end gap-4">
      <button
        onClick={() => router.back()}
        className="
          border
          rounded-lg
          px-5
          py-2
        "
      >
        Cancelar
      </button>

      <button
        onClick={handleSubmit}
        disabled={!decision}
        className="
          bg-primary
          text-white
          rounded-lg
          px-6
          py-2
          disabled:opacity-50
        "
      >
        Finalizar evaluación
      </button>
    </div>
  );
}
