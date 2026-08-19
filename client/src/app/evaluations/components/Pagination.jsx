'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  loading = false,
  onPageChange,
}) {
  if (total === 0 || totalPages <= 1) {
    return null;
  }

  const firstItem = (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);

  return (
    <div className="border-theme-top pt-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Información */}
        <div className="text-data">
          Mostrando{' '}
          <span className="text-data--label">
            {firstItem}-{lastItem}
          </span>{' '}
          de <span className="text-data--label">{total}</span> microacciones
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || loading}
            aria-label="Página anterior"
            className="
              filter-chip
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              cursor-pointer
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ChevronLeft size={22} />
          </button>

          <div className="filter-chip-active flex h-11 min-w-11 items-center justify-center rounded-xl px-3">
            <span className="text-badge">{page}</span>
          </div>

          <span className="text-data px-1">de {totalPages}</span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || loading}
            aria-label="Página siguiente"
            className="
              filter-chip
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              cursor-pointer
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
