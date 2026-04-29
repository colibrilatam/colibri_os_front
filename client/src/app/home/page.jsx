'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { FiltersBar } from '@/components/home/FiltersBar';
import { ProjectGrid } from '@/components/home/ProjectGrid';
import { useRequest } from '@/hooks/useRequest';
import { projectsService } from '@/services/project';
import Header from '@/components/Header';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [tramos, setTramos] = useState([]);

  const [search, setSearch] = useState('');
  const [selectedTranche, setSelectedTranche] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [projectsError, setProjectsError] = useState('');

  // Hook personalizado para manejar la solicitud de proyectos
  const { execute, loading, error } = useRequest(projectsService.getAll);
  const { execute: getAllTramosData } = useRequest(
    projectsService.getAllTramos,
  );

  //console.log('TRAMO-----', tramos);
  // Cargar proyectos desde el backend al montar el componente
  useEffect(() => {
    async function loadProjects() {
      setIsLoadingProjects(false);
      const { data, error } = await execute();
      const { data: allTramos } = await getAllTramosData();
      if (error) {
        setProjectsError(error);
      } else {
        setProjects(data);
        setTramos(allTramos);
      }
      setIsLoadingProjects(true);
    }

    loadProjects();
  }, []);
  //console.log(projects);

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
      const tramoMatch = tramos?.find((t) => t.id === project.currentTramoId);

      if (tramoMatch?.code) {
        trancheMap.set(tramoMatch.code, {
          value: tramoMatch.code,
          label: tramoMatch.code,
          sortOrder: tramoMatch.sortOrder ?? 999,
        });
      }
    });

    const tranches = [ {value: "Todos", label: "Todos"} , ...Array.from(trancheMap.values()).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    )];

    const hasProjectsWithoutTranche = projects.some((project) => {
      const tramoMatch = tramos?.find((t) => t.id === project.currentTramoId);
      return !tramoMatch;
    });

    if (hasProjectsWithoutTranche) {
      tranches.push({
        value: 'SIN_TRAMO',
        label: 'Sin tramo',
        sortOrder: 9999,
      });
    }

    return tranches;
  }, [projects, tramos]);

  // Obtener lista de estados
  const allStatuses = useMemo(() => {
    return ['Todos',...new Set(projects.map((project) => project.status))];
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
  
    // 1️⃣ Primero enriquecer proyectos
    const enrichedProjects = projects.map((project) => {
      const tramoMatch = tramos?.find(
        (t) => String(t.id) === String(project.currentTramoId)
      );
  
      const projectTranche = tramoMatch
        ? tramoMatch.code
        : 'SIN_TRAMO';
  
      return {
        ...project,
        projectTranche,
      };
    });
  
    // 2️⃣ Después filtrar
    return enrichedProjects.filter((project) => {
      const matchesSearch =
        !normalizedSearch ||
        project.projectName?.toLowerCase().includes(normalizedSearch) ||
        project.shortDescription?.toLowerCase().includes(normalizedSearch) ||
        project.tagline?.toLowerCase().includes(normalizedSearch) ||
        project.country?.toLowerCase().includes(normalizedSearch) ||
        project.industry?.toLowerCase().includes(normalizedSearch) ||
        project.owner?.fullName?.toLowerCase().includes(normalizedSearch);
  
      const matchesTranche =
        !selectedTranche ||
        selectedTranche === 'Todos' ||
        project.projectTranche === selectedTranche;
  
      const matchesStatus =
        !selectedStatus || 
        selectedStatus === 'Todos' ||
        project.status === selectedStatus;
  
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
    tramos,
    search,
    selectedTranche,
    selectedStatus,
    selectedCountry,
    selectedIndustry,
  ]);
  console.log('filteredProjects------', filteredProjects);

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
