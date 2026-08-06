'use client';

import { useRouter } from 'next/navigation';

export default function EvidenceActions({ evidence }) {
  const router = useRouter();

  return (
    <div className="flex justify-end gap-4">
      <button
        onClick={() =>
          router.push(`/evaluations/evidence/${evidence.id}/review`)
        }
        className="
          bg-primary
          text-white
          px-6
          py-3
          rounded-lg
          hover:opacity-90
        "
      >
        Iniciar evaluación
      </button>
    </div>
  );
}
