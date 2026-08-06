export default function ScoreCard({ score, setScore, decision, setDecision }) {
  return (
    <div className="flex flex-col gap-6">
      {/* <div>
        <label className="text-helper">Puntaje</label>

        <input
          type="number"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="
mt-2
w-full
glass-effect-secondary
border-theme
rounded-xl
px-4
py-3
text-primary-theme
outline-none
focus:border-cyan-400
"
        />
      </div> */}

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

          {/* <label className="flex items-center gap-3 cursor-pointer text-body">
            <input
              type="radio"
              value="rejected"
              checked={decision === 'rejected'}
              onChange={(e) => setDecision(e.target.value)}
            />
            Rechazar
          </label> */}
        </div>
      </div>
    </div>
  );
}
