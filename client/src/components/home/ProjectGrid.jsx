import { ProjectCard } from './LandingProjectCard';
import { getProjectImage  } from '@/lib/hooks/createImageMap';

export function ProjectGrid({ projects }) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <svg
            className="h-5 w-5 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </div>

        <p className="text-sm font-medium text-slate-300">Sin resultados</p>

        <p className="mt-1 max-w-xs text-xs text-slate-500">
          No encontramos proyectos que coincidan con los filtros seleccionados.
          Intentá con otros términos.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            image={getProjectImage(project.id)}
          />
        ))}
      </div>
    </div>
  );
}
