'use client';

const STATUS_OPTIONS = [
  {
    value: '',
    label: 'Todas',
  },
  {
    value: 'pending',
    label: 'Pendientes',
  },
  {
    value: 'submitted',
    label: 'Enviadas',
  },
  {
    value: 'completed',
    label: 'Completadas',
  },
];

export default function MicroActionStatusFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value || 'all'}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`
              ${active ? 'filter-chip-active' : 'filter-chip'}
              rounded-xl
              px-4
              py-2
              text-badge
              transition-all
              duration-200
              cursor-pointer
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
