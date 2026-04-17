'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FiltersBar } from "@/components/home/FiltersBar";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { useRequest } from "@/hooks/useRequest";
import { projectsService } from "@/services/project";
import Header from "@/components/Header";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTranche, setSelectedTranche] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [projectsError, setProjectsError] = useState("");
  
  // Hook personalizado para manejar la solicitud de proyectos
  const { execute, loading, error } = useRequest(projectsService.getAll); 

  // Cargar proyectos desde el backend al montar el componente
  useEffect(() => {
    async function loadProjects() {
      setIsLoadingProjects(false)
      const { data, error } = await execute();

      if (error) {
        setProjectsError(error);
      } else {
        setProjects(data);
      }
      setIsLoadingProjects(true)
    }

    loadProjects();
  }, []);

  // Calcular estadísticas para la sección Hero
  const heroStats = useMemo(() => {
    const today = new Date().toDateString();

    const activeProjects = projects.filter(
      (project) => project.status === 'active',
    ).length;

    const tramosEnCurso = projects.filter(
      (project) => project.currentTramo?.code,
    ).length;

    const paisesActivos = new Set(
      projects
        .filter((p) => p.status === 'active')
        .map((p) => p.country?.trim())
        .filter(Boolean),
    ).size;

    // Actualizaciones hoy
    const actualizacionesHoy = projects.filter(
      (project) => new Date(project.updatedAt).toDateString() === today,
    ).length;

    return {
      activeProjects,
      tramosEnCurso,
      paisesActivos,
      actualizacionesHoy,
    };
  }, [projects]);

  // Obtener lista de tramos
  const allTranches = useMemo(() => {
    const trancheMap = new Map();

    projects.forEach((project) => {
      if (project.currentTramo?.code && project.currentTramo?.name) {
        trancheMap.set(project.currentTramo.code, {
          value: project.currentTramo.code,
          label: project.currentTramo.code,
          sortOrder: project.currentTramo.sortOrder ?? 999,
        });
      }
    });

    const tranches = Array.from(trancheMap.values()).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );

    const hasProjectsWithoutTranche = projects.some(
      (project) => !project.currentTramo,
    );

    if (hasProjectsWithoutTranche) {
      tranches.push({
        value: 'SIN_TRAMO',
        label: 'Sin tramo',
        sortOrder: 9999,
      });
    }

    return tranches;
  }, [projects]);

  // Obtener lista de estados
  const allStatuses = useMemo(() => {
    return [...new Set(projects.map((project) => project.status))];
  }, [projects]);

  const allCountries = useMemo(() => {
    return Array.from(
      new Set(projects.map((p) => p.country?.trim()).filter(Boolean)),
    );
  }, [projects]);

  const allIndustries = useMemo(() => {
    return [
      'Todas',
      ...Array.from(
        new Set(projects.map((p) => p.industry?.trim()).filter(Boolean)),
      ),
    ];
  }, [projects]);

  // Filtrar proyectos según búsqueda y filtros seleccionados
  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return projects.filter((project) => {
      const projectTranche = project.currentTramo?.code || 'SIN_TRAMO';

      const matchesSearch =
        !normalizedSearch ||
        project.projectName?.toLowerCase().includes(normalizedSearch) ||
        project.shortDescription?.toLowerCase().includes(normalizedSearch) ||
        project.tagline?.toLowerCase().includes(normalizedSearch) ||
        project.country?.toLowerCase().includes(normalizedSearch) ||
        project.industry?.toLowerCase().includes(normalizedSearch) ||
        project.owner?.fullName?.toLowerCase().includes(normalizedSearch);

      const matchesTranche =
        !selectedTranche || projectTranche === selectedTranche;

      const matchesStatus =
        !selectedStatus || project.status === selectedStatus;

      const matchesCountry =
        !selectedCountry ||
        selectedCountry === 'Todos' ||
        project.country === selectedCountry;

      const matchesIndustry =
        !selectedIndustry ||
        selectedIndustry === 'Todas' ||
        project.industry === selectedIndustry;

      return (
        matchesSearch &&
        matchesTranche &&
        matchesStatus &&
        matchesCountry &&
        matchesIndustry
      );
    });
  }, [
    projects,
    search,
    selectedTranche,
    selectedStatus,
    selectedCountry,
    selectedIndustry,
  ]);

  // Funciones para manejar toggles de filtros
  function toggleTranche(tranche) {
    setSelectedTranche((prev) => (prev === tranche ? null : tranche));
  }

  // Funciones para manejar toggles de filtros
  function toggleStatus(status) {
    setSelectedStatus((prev) => (prev === status ? null : status));
  }

  return (
    <main className="min-h-screen  backdrop-blur-xl">
      <Header isHome={true} />
      {/**
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
       */}

      <div className="mx-auto max-w-7xl">
        <HeroSection stats={heroStats} />

        <div className="mx-6 mb-2 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

        {loading ? (
          <div className="px-6 py-10 text-sm text-slate-400">
            Cargando proyectos...
          </div>
        ) : projectsError ? (
          <div className="px-6 py-10 text-sm text-red-400">{projectsError}</div>
        ) : (
          <>
            <FiltersBar
              search={search}
              onSearchChange={setSearch}
              selectedTranche={selectedTranche}
              onTrancheToggle={toggleTranche}
              selectedStatus={selectedStatus}
              onStatusToggle={toggleStatus}
              resultCount={filteredProjects.length}
              allTranches={allTranches}
              allStatuses={allStatuses}
              allIndustries={allIndustries}
              allCountries={allCountries}
              selectedCountry={selectedCountry}
              selectedIndustry={selectedIndustry}
              onCountryChange={setSelectedCountry}
              onIndustryChange={setSelectedIndustry}
            />
            <ProjectGrid projects={filteredProjects} />
          </>
        )}
      </div>
      {/* <pre>{JSON.stringify(projects, null, 2)}</pre> */}
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
