import {
  CalendarDays,
  Clock3,
  RotateCcw,
  UserRound,
  Target,
  Timer,
  FileText,
} from 'lucide-react';

export default function MicroActionOverview({ microAction }) {
  const actor = microAction.actor;
  const definition = microAction.microActionDefinition;

  return (
    <section className="glass-effect rounded-2xl p-6 md:p-8">
      <div className="mb-6">
        <p className="text-overline">Información de la microacción</p>

        <h2 className="text-h2 mt-2">Datos principales</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={<UserRound size={22} />}
          label="Actor"
          value={actor?.fullName || actor?.name || actor?.email || '-'}
        />

        <InfoCard
          icon={<Target size={22} />}
          label="Definición"
          value={
            definition?.instruction_es || definition?.instruction_en || '-'
          }
        />

        <InfoCard
          icon={<CalendarDays size={22} />}
          label="Inicio"
          value={formatDateTime(microAction.startedAt)}
        />

        <InfoCard
          icon={<Clock3 size={22} />}
          label="Última actualización"
          value={formatDateTime(microAction.updatedAt)}
        />

        <InfoCard
          icon={<Timer size={22} />}
          label="Ventana de ejecución"
          value={
            microAction.executionWindowDaysSnapshot !== null &&
            microAction.executionWindowDaysSnapshot !== undefined
              ? `${microAction.executionWindowDaysSnapshot} días`
              : '-'
          }
        />

        <InfoCard
          icon={<RotateCcw size={22} />}
          label="Intento"
          value={microAction.attemptNumber ?? '-'}
        />

        <InfoCard
          icon={<RotateCcw size={22} />}
          label="Reaperturas"
          value={microAction.reopenedCount ?? 0}
        />

        <InfoCard
          icon={<FileText size={22} />}
          label="Cumplimiento"
          value={formatOnTime(microAction.isOnTime)}
        />
      </div>

      {microAction.executionNotes && (
        <div className="border-theme-top mt-7 pt-6">
          <p className="text-micro-label mb-2">Notas de ejecución</p>

          <div className="surface-secondary rounded-xl p-5">
            <p className="text-body">{microAction.executionNotes}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div
      className="
        surface-secondary
        border-theme
        rounded-xl
        p-5
        transition-all
        duration-200
        hover:glass-effect-secondary
      "
    >
      <div className="flex items-start gap-4">
        <div className="text-accent-cyan mt-1">{icon}</div>

        <div className="min-w-0">
          <p className="text-micro-label">{label}</p>

          <p className="text-data--label mt-1 break-words">{value}</p>
        </div>
      </div>
    </div>
  );
}

function formatDateTime(date) {
  if (!date) return '-';

  return new Date(date).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatOnTime(value) {
  if (value === true) return 'A tiempo';
  if (value === false) return 'Fuera de tiempo';

  return 'Sin determinar';
}
