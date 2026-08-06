'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { evidencesService } from '@/services/evidences';

import EvidenceHeader from './components/EvidenceHeader';
import EvidenceInformation from './components/EvidenceInformation';
import MicroActionInformation from './components/MicroActionInformation';
import EvidenceVersions from './components/EvidenceVersions';
import EvaluationHistory from './components/EvaluationHistory';
import EvidenceMetadata from './components/EvidenceMetadata';
import EvidenceActions from './components/EvidenceActions';

export default function EvidenceDetailPage() {
  const pathname = usePathname();
  const evidenceId = pathname.split('/').pop();

  const [evidence, setEvidence] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [evidenceData, versionsData] = await Promise.all([
          evidencesService.getById(evidenceId),
          evidencesService.getVersions(evidenceId),
        ]);

        setEvidence(evidenceData);
        setVersions(versionsData);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [evidenceId]);
  console.log(evidence);
  if (loading) {
    return (
      <div className="empty-state rounded-2xl p-12">
        <p className="text-body">Cargando evidencia...</p>
      </div>
    );
  }

  if (!evidence) {
    return <div className="p-6">No se encontró la evidencia.</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <EvidenceHeader evidence={evidence} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* 1. Información de la evidencia */}
          <EvidenceInformation evidence={evidence} />

          {/* 2. Información de la microacción */}
          <MicroActionInformation microAction={evidence.microActionInstance} />

          {/* 3. Historial de versiones */}
          <EvidenceVersions versions={versions} />

          {/* 4. Historial de evaluaciones */}
          <EvaluationHistory evaluations={evidence.evaluations} />
        </div>

        <div className="flex flex-col gap-6">
          <EvidenceMetadata evidence={evidence} />

          <EvidenceActions evidence={evidence} />
        </div>
      </div>
    </div>
  );
}
