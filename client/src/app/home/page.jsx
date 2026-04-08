"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FiltersBar } from "@/components/FiltersBar";
import { ProjectGrid } from "@/components/ProjectGrid";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTranches, setSelectedTranches] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        setIsLoadingProjects(true);
        setProjectsError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/projects`
        );

        if (!response.ok) {
          throw new Error("No se pudieron obtener los proyectos");
        }

        const backendProjects = await response.json();
        setProjects(backendProjects);
      } catch (error) {
        setProjectsError(
          error.message || "Ocurrió un error al cargar los proyectos"
        );
      } finally {
        setIsLoadingProjects(false);
      }
    }

    loadProjects();
  }, []);

  const heroStats = useMemo(() => {
    const today = new Date().toDateString();

    const activeProjects = projects.length;

    const tramosEnCurso = projects.filter(
      (project) => project.currentTramoId !== null
    ).length;

    const paisesActivos = new Set(
      projects
        .map((project) => project.country?.trim())
        .filter(Boolean)
    ).size;

    const actualizacionesHoy = projects.filter(
      (project) => new Date(project.updatedAt).toDateString() === today
    ).length;

    return {
      activeProjects,
      tramosEnCurso,
      paisesActivos,
      actualizacionesHoy,
    };
  }, [projects]);

  const allTranches = useMemo(() => {
    return [
      ...new Set(
        projects.map((project) => project.currentTramoId || "Sin tramo")
      ),
    ];
  }, [projects]);

  const allStatuses = useMemo(() => {
    return [...new Set(projects.map((project) => project.status))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return projects.filter((project) => {
      const projectTranche = project.currentTramoId || "Sin tramo";

      const matchesSearch =
        !normalizedSearch ||
        project.projectName?.toLowerCase().includes(normalizedSearch) ||
        project.shortDescription?.toLowerCase().includes(normalizedSearch) ||
        project.tagline?.toLowerCase().includes(normalizedSearch) ||
        project.country?.toLowerCase().includes(normalizedSearch) ||
        project.industry?.toLowerCase().includes(normalizedSearch) ||
        project.owner?.fullName?.toLowerCase().includes(normalizedSearch);

      const matchesTranche =
        selectedTranches.length === 0 ||
        selectedTranches.includes(projectTranche);

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(project.status);

      return matchesSearch && matchesTranche && matchesStatus;
    });
  }, [projects, search, selectedTranches, selectedStatuses]);

  function toggleTranche(tranche) {
    setSelectedTranches((previousTranches) =>
      previousTranches.includes(tranche)
        ? previousTranches.filter(
          (existingTranche) => existingTranche !== tranche
        )
        : [...previousTranches, tranche]
    );
  }

  function toggleStatus(status) {
    setSelectedStatuses((previousStatuses) =>
      previousStatuses.includes(status)
        ? previousStatuses.filter(
          (existingStatus) => existingStatus !== status
        )
        : [...previousStatuses, status]
    );
  }

  return (
    <main className="min-h-screen bg-[#080d1a]/75 backdrop-blur-sm">
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#080d1a]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">
              Colibrí
            </span>
          </div>

          <div className="flex items-center">
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs text-slate-300 hover:bg-white/10 transition-all duration-150"
            >
              Acceder
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl">
        <HeroSection stats={heroStats} />

        <div className="mx-6 mb-2 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

        {isLoadingProjects ? (
          <div className="px-6 py-10 text-sm text-slate-400">
            Cargando proyectos...
          </div>
        ) : projectsError ? (
          <div className="px-6 py-10 text-sm text-red-400">
            {projectsError}
          </div>
        ) : (
          <>
            <FiltersBar
              search={search}
              onSearchChange={setSearch}
              selectedTranches={selectedTranches}
              onTrancheToggle={toggleTranche}
              selectedStatuses={selectedStatuses}
              onStatusToggle={toggleStatus}
              resultCount={filteredProjects.length}
              allTranches={allTranches}
              allStatuses={allStatuses}
            />

            <ProjectGrid projects={filteredProjects} />
          </>
        )}
      </div>

      <footer className="border-t border-white/8 px-6 py-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <p className="text-xs text-slate-600">
            © 2025 Colibrí · Portafolio de proyectos
          </p>
          <p className="text-xs text-slate-600">v1.0</p>
        </div>
      </footer>
    </main>
  );
}