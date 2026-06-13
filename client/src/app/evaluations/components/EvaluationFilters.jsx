'use client';

import { Search } from 'lucide-react';

export default function EvaluationFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div
      className="
        rounded-3xl
        border border-slate-800
        glass-effect
        p-4
        flex flex-col xl:flex-row
        gap-4
        xl:items-center
        xl:justify-between
      "
    >
      {/* SEARCH */}

      <div className="relative w-full xl:max-w-md">
        <Search
          size={16}
          className="
            absolute left-4 top-1/2 -translate-y-1/2
            text-slate-500
          "
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar proyecto o evidencia..."
          className="
            w-full
            pl-11 pr-4 py-3
            rounded-2xl
            bg-white/[0.04]
            border border-slate-800
            outline-none
            text-white
            placeholder:text-slate-500
            focus:border-cyan-500/40
          "
        />
      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-2">
        {[
          {
            label: 'Todas',
            value: 'all',
          },

          {
            label: 'Aprobadas',
            value: 'approved',
          },

          {
            label: 'Rechazadas',
            value: 'rejected',
          },

          {
            label: 'Revisión',
            value: 'needs_revision',
          },
        ].map((item) => (
          <FilterChip
            key={item.value}
            active={statusFilter === item.value}
            onClick={() => setStatusFilter(item.value)}
          >
            {item.label}
          </FilterChip>
        ))}
      </div>
    </div>
  );
}

/* ================= UI ================= */

function FilterChip({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm border transition-all duration-200 cursor-pointer
        ${
          active
            ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300'
            : 'border-slate-700 text-slate-400 hover:bg-white/[0.04]'
        }
      `}
    >
      {children}
    </button>
  );
}