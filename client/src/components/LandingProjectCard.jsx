import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";

function formatProjectDate(dateString) {
  const parsedDate = new Date(dateString);
  return parsedDate.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ProjectCard({ project, index }) {
  const router = useRouter();

  return (
    <article className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-white/[0.07] hover:shadow-[0_16px_40px_rgba(6,182,212,0.08)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
            {project.shortId}
          </div>
<div className="flex flex-row gap-4 items-center">
  <img className="h-14 w-14 rounded-full"
  src={`/${project.id}.png`}
          alt="NFT Avatar"></img>
          <h3 className="truncate text-lg font-semibold leading-tight text-white">
            {project.name || "Proyecto sin nombre"}
          </h3>
          </div>

          <div className="mt-1 text-sm text-slate-400">
            {[project.industry, project.country].filter(Boolean).join(" · ")}
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge value={project.currentTramo} variant="tranche" />
        <Badge value={project.projectStatus} variant="status" />
      </div>

      <div className="mb-3 flex-1 text-sm leading-6 text-slate-300">
        {project.description || "Sin descripción disponible"}
      </div>

      <div className="mb-5 text-xs text-slate-500">
        Responsable:{" "}
        <span className="text-slate-300">
          {project.ownerId || "Sin responsable"}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-4">
        <span className="text-[11px] text-slate-500">
          Actualizado{" "}
          <time dateTime={project.lastUpdate} className="text-slate-400">
            {formatProjectDate(project.lastUpdate)}
          </time>
        </span>

        <button
          onClick={() => router.push(`/dashboard/${project.id}/senial`)}
          className="group/btn border border-cyan-400 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-2 font-bold flex items-center gap-1 text-xs  text-white transition-all duration-150  active:scale-95"
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
