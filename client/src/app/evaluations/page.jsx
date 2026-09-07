'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import EvaluationHeader from './components/EvaluationHeader';
import MicroActionCard from './components/MicroActionCard';
import MicroActionStatusFilter from './components/MicroActionStatusFilter';
import Pagination from './components/Pagination';

import { useMicroActions } from '@/hooks/queries/useMicroActions';

const LIMIT = 10;

export default function EvaluationsPage() {
  const router = useRouter();

  const [status, setStatus] = useState('submitted');
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({
      page,
      limit: LIMIT,
      ...(status ? { status } : {}),
    }),
    [page, status],
  );

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useMicroActions(params);

  const microActions = response?.data ?? [];
  const pagination = {
    total: response?.total ?? 0,
    page: response?.page ?? page,
    limit: response?.limit ?? LIMIT,
  };

  const loading = isLoading || isFetching;
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  function handleStatusChange(newStatus) {
    setStatus(newStatus);

    // Cuando cambia el filtro,
    // siempre volvemos a la primera página.
    setPage(1);
  }

  function handlePageChange(newPage) {
    if (loading || newPage < 1 || newPage > totalPages) {
      return;
    }

    setPage(newPage);
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-6 p-6">
      {/* Header */}
      <EvaluationHeader total={pagination.total} />

      {/* Filtros */}
      <section className="glass-effect rounded-2xl p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-micro-label">Filtrar microacciones</p>

            <p className="text-helper mt-1">
              Seleccioná el estado que querés revisar.
            </p>
          </div>

          <MicroActionStatusFilter
            value={status}
            onChange={handleStatusChange}
          />
        </div>
      </section>

      {/* Listado */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="empty-state rounded-2xl p-10 text-center">
            <p className="text-body">Cargando microacciones...</p>
          </div>
        ) : microActions.length === 0 ? (
          <div className="empty-state rounded-2xl p-10 text-center">
            <p className="text-body">No hay microacciones para este filtro.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {microActions.map((microAction) => (
              <MicroActionCard
                key={microAction.id}
                microAction={microAction}
                onClick={() =>
                  router.push(
                    `/evaluations/micro-action/${microAction.id}`,
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      <Pagination
        page={pagination.page}
        totalPages={totalPages}
        total={pagination.total}
        limit={pagination.limit}
        loading={loading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
