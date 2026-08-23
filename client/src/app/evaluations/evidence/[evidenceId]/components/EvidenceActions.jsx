'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function EvidenceActions({ evidence }) {
  const router = useRouter();

  return (
    <div className="flex justify-end gap-4">
      <Button
        variant="primary"
        onClick={() =>
          router.push(`/evaluations/evidence/${evidence.id}/review`)
        }
      >
        Iniciar evaluación
      </Button>
    </div>
  );
}
