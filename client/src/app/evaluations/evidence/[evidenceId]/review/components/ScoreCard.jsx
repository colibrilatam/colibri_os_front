import { DemoGuard } from '@/components/common/DemoGuard';

export default function ScoreCard({ score, setScore, decision, setDecision }) {
  return (
    <div className="flex flex-col gap-6">
      {/* SEC-002/FE4: radios de decisión ocultos en modo demo.
          La restricción real es el 403 del backend. */}
      <DemoGuard>
        <div>
          <label className="text-helper">Decisión</label>

          <div className="flex gap-6 mt-3">
            <label className="flex items-center gap-3 cursor-pointer text-body text-primary-theme">
              <input
                type="radio"
                value="approved"
                checked={decision === 'approved'}
                onChange={(e) => setDecision(e.target.value)}
              />
              Aprobar
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-body text-primary-theme">
              <input
                type="radio"
                value="needs_revision"
                checked={decision === 'needs_revision'}
                onChange={(e) => setDecision(e.target.value)}
              />
              Requiere revisión
            </label>
          </div>
        </div>
      </DemoGuard>
    </div>
  );
}
