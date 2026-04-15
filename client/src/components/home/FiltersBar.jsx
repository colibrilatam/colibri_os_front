'use client';

const trancheChipStyles = {
  T1: 'data-[active=true]:border-blue-400/60 data-[active=true]:bg-blue-500/20 data-[active=true]:text-blue-300 data-[active=true]:shadow-[0_0_0_1px_rgba(96,165,250,0.15)]',
  T2: 'data-[active=true]:border-cyan-400/60 data-[active=true]:bg-cyan-500/20 data-[active=true]:text-cyan-300 data-[active=true]:shadow-[0_0_0_1px_rgba(34,211,238,0.15)]',
  T3: 'data-[active=true]:border-teal-400/60 data-[active=true]:bg-teal-500/20 data-[active=true]:text-teal-300 data-[active=true]:shadow-[0_0_0_1px_rgba(45,212,191,0.15)]',
  T4: 'data-[active=true]:border-indigo-400/60 data-[active=true]:bg-indigo-500/20 data-[active=true]:text-indigo-300 data-[active=true]:shadow-[0_0_0_1px_rgba(129,140,248,0.15)]',
  SIN_TRAMO:
    'data-[active=true]:border-slate-400/60 data-[active=true]:bg-slate-500/20 data-[active=true]:text-slate-300 data-[active=true]:shadow-[0_0_0_1px_rgba(148,163,184,0.12)]',
};

const statusChipStyles = {
  active:
    'data-[active=true]:border-amber-400/60 data-[active=true]:bg-amber-500/20 data-[active=true]:text-amber-300 data-[active=true]:shadow-[0_0_0_1px_rgba(251,191,36,0.14)]',
  inactive:
    'data-[active=true]:border-slate-400/60 data-[active=true]:bg-slate-500/20 data-[active=true]:text-slate-300 data-[active=true]:shadow-[0_0_0_1px_rgba(148,163,184,0.12)]',
  closed:
    'data-[active=true]:border-red-400/60 data-[active=true]:bg-red-500/20 data-[active=true]:text-red-300 data-[active=true]:shadow-[0_0_0_1px_rgba(248,113,113,0.14)]',
  suspended:
    'data-[active=true]:border-violet-400/60 data-[active=true]:bg-violet-500/20 data-[active=true]:text-violet-300 data-[active=true]:shadow-[0_0_0_1px_rgba(167,139,250,0.14)]',
};

const baseChipClasses =
  'inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-400 transition-all duration-150 hover:border-white/20 hover:bg-white/[0.07] hover:text-slate-200 cursor-pointer select-none';

function getStatusLabel(statusValue) {
  const statusLabelMap = {
    active: 'Activo',
    inactive: 'Inactivo',
    closed: 'Cerrado',
    suspended: 'Suspendido',
  };

  return statusLabelMap[statusValue] || statusValue;
}

export function FiltersBar({
  search,
  onSearchChange,
  selectedTranche,
  onTrancheToggle,
  selectedStatus,
  onStatusToggle,
  resultCount,
  allTranches,
  allStatuses,
  allIndustries,
  allCountries,
  selectedCountry,
  selectedIndustry,
  onCountryChange,
  onIndustryChange,
}) {
  return (
    <section className="px-6 py-5">
      <div className="rounded-2xl border border-white/8 bg-white/3 p-4 backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-xl">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Buscar proyecto por nombre, descripción, industria o responsable…"
                className="w-full rounded-xl border border-white/10 bg-white/4 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 shadow-inner shadow-black/10 transition-all duration-150 focus:border-cyan-500/50 focus:bg-white/6 focus:outline-none focus:ring-2 focus:ring-cyan-500/10"
              />
            </div>

            <div className="shrink-0 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-xs text-slate-400">
              Mostrando{' '}
              <span className="font-semibold text-slate-200">
                {resultCount}
              </span>{' '}
              {resultCount === 1 ? 'proyecto' : 'proyectos'}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {/* INDUSTRIA */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 mr-2">INDUSTRIA:</span>

              {allIndustries.map((industry) => {
                const isActive = selectedIndustry === industry;

                return (
                  <button
                    key={industry}
                    onClick={() => onIndustryChange(isActive ? null : industry)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all
            ${
              isActive
                ? 'bg-orange-500 text-white'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
                  >
                    {industry}
                  </button>
                );
              })}
            </div>

            {/* PAÍS */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 mr-2">PAÍS:</span>
              <button
                onClick={() => onCountryChange(null)}
                className={`px-3 py-1.5 rounded-full text-xs ${
                  !selectedCountry
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                Todos
              </button>

              {allCountries.map((country) => {
                const isActive = selectedCountry === country;

                return (
                  <button
                    key={country}
                    onClick={() => onCountryChange(isActive ? null : country)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all
            ${
              isActive
                ? 'bg-cyan-500 text-white'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
                  >
                    {country}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                Tramo
              </span>

              {allTranches.map((tranche) => (
                <button
                  key={tranche.value}
                  type="button"
                  data-active={selectedTranche === tranche.value}
                  onClick={() => onTrancheToggle(tranche.value)}
                  className={`${baseChipClasses} ${
                    trancheChipStyles[tranche.value] || ''
                  }`}
                >
                  {tranche.label}
                </button>
              ))}
            </div>

            <div className="hidden h-8 w-px bg-white/10 xl:block" />

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                Estado
              </span>

              {allStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  data-active={selectedStatus === status}
                  onClick={() => onStatusToggle(status)}
                  className={`${baseChipClasses} ${
                    statusChipStyles[status] || ''
                  }`}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
