import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logoAvatar from '../../../public/logos/logo-avatar.jpg';

function formatProjectDate(dateString) {
  const parsedDate = new Date(dateString);
  return parsedDate.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// FUNCION QUE VERIFICA AUTENTTICACION DE USUARIO Y REDIRIGE A LOGIN O A RLAB

export function ProjectCard({ project, ic }) {
  const projectTrancheLabel = project.projectTranche || 'Sin tramo';
  const router = useRouter();

  function getICColor(value) {
    const n = parseFloat(value);
  
    if (n >= 4) return 'text-green-400 border-green-400/30 bg-green-500/10';
    if (n >= 2.5) return 'text-cyan-300 border-cyan-400/30 bg-cyan-500/10';
    if (n >= 1.5) return 'text-yellow-300 border-yellow-400/30 bg-yellow-500/10';
  
    return 'text-red-300 border-red-400/30 bg-red-500/10';
  }

  return (
    <article className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-white/[0.07] hover:shadow-[0_16px_40px_rgba(6,182,212,0.08)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
            {project.id.slice(0, 8).toUpperCase()}
          </div>

          <div className="flex items-center gap-2">
            <Image
              src={project.projectImageUrl || logoAvatar}
              alt={project.projectName}
              width={100}
              height={100}
              className="h-8 w-8 rounded-full object-cover shrink-0"
            />

            <h3 className="truncate text-lg font-semibold leading-tight text-white">
              {project.projectName || 'Proyecto sin nombre'}
            </h3>

            <div className="absolute top-4 right-5 z-10">
              <div
                className={`text-xs font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm ${getICColor(ic)}`}
              >
                {ic}
              </div>
            </div>
          </div>

          <div className="mt-1 text-sm text-slate-400">
            {[project.industry, project.country].filter(Boolean).join(' · ')}
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge value={projectTrancheLabel} variant="tranche" />
        <Badge value={project.status} variant="status" />
      </div>

      <div className="mb-3 flex-1 text-sm leading-6 text-slate-300">
        {project.shortDescription ||
          project.tagline ||
          'Sin descripción disponible'}
      </div>

      <div className="mb-5 text-xs text-slate-500">
        Responsable:{' '}
        <span className="text-slate-300">
          {project.owner?.fullName || 'Sin responsable'}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-4">
        <span className="text-[11px] text-slate-500">
          Actualizado{' '}
          <time dateTime={project.updatedAt} className="text-slate-400">
            {formatProjectDate(project.updatedAt)}
          </time>
        </span>
        {/** CAMBIAR LOGICA DEPENDIENDO DE AUTENTICACIÖN */}
        <button
          onClick={() => router.push(`/dashboard/${project.id}/senial`)}
          className="bg-linear-to-r from-cyan-500 to-blue-500  border border-cyan-700 rounded-2xl p-2 group/btn flex items-center gap-1 text-xs font-bold text-white transition-all duration-150 hover:text-cyan-200 cursor-pointer active:scale-95"
        >
          Ver en R-Lab
          <svg
            className="h-3 w-3 translate-x-0 transition-transform duration-150 group-hover/btn:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
