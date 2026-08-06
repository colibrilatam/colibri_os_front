'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EvaluationHeader from './components/EvaluationHeader';
import EvidenceCard from './components/EvidenceCard';
import { evaluationsService } from '@/services/evaluations';

export default function EvaluationsPage() {
  const router = useRouter();
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await evaluationsService.getPendingReviews();
        setEvidences(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);
  console.log(evidences);

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-6 p-6">
      <EvaluationHeader total={evidences.length} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-4">
          {evidences.map((evidence) => (
            <EvidenceCard
              key={evidence.id}
              evidence={evidence}
              onClick={() =>
                router.push(`/evaluations/evidence/${evidence.evidenceId}`)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
