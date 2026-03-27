'use client';

import { useState } from 'react';
import ProjectCard from '@/components/proyectos/ProjectCard';
import ProjectDetailSheet from '@/components/proyectos/ProjectDetailSheet';
import CreateProjectSheet from '@/components/proyectos/CreateProjectSheet';

// Datos mock con una estructura clara
const mockUserData = {
  nombre: 'María García',
  nombreDeProyectoCreado: null,
  proyectosSecundariosEnLosQueParticipa: [
    {
      id: 'proyecto-1',
      nombre: 'Memoria Activa',
      descripción: 'Programa de estimulación cognitiva y ejercicios de memoria para mantener la agilidad mental en la tercera edad.',
      porcentajeCompletado: 65,
      miembros: [
        { nombre: 'Carlos López', sexo: 'hombre' },
        { nombre: 'Beatriz Rodríguez', sexo: 'mujer' },
        { nombre: 'Fernando Martínez', sexo: 'hombre' },
        { nombre: 'Gabriela Sánchez', sexo: 'mujer' },
      ],
      conteoDeSexos: { hombres: 2, mujeres: 2 },
    },
    {
      id: 'proyecto-2',
      nombre: 'Bienestar Integral',
      descripción: 'Iniciativa comunitaria enfocada en la salud física, mental y emocional de adultos mayores activos.',
      porcentajeCompletado: 82,
      miembros: [
        { nombre: 'Jorge Pérez', sexo: 'hombre' },
        { nombre: 'Rosario Silva', sexo: 'mujer' },
        { nombre: 'Ricardo Fernández', sexo: 'hombre' },
      ],
      conteoDeSexos: { hombres: 2, mujeres: 1 },
    },
  ],
};

// Mi Proyecto Principal - COMENTADO
// const mockProyectoPrincipal = {
//   id: 'mi-proyecto',
//   nombre: 'Recuperación Postoperatoria',
//   descripción: 'Programa especializado de recuperación para personas mayores de 65 años tras intervenciones quirúrgicas. Incluye ejercicios terapéuticos, seguimiento médico y apoyo emocional personalizado.',
//   porcentajeCompletado: 45,
//   miembros: [
//     { nombre: 'Dr. Manuel Gómez', sexo: 'hombre' },
//     { nombre: 'Enfermera Patricia Núñez', sexo: 'mujer' },
//     { nombre: 'Fisioterapeuta David Torres', sexo: 'hombre' },
//     { nombre: 'Psicóloga Claudia Herrera', sexo: 'mujer' },
//     { nombre: 'Auxiliar de enfermería José Ramírez', sexo: 'hombre' },
//   ],
//   conteoDeSexos: { hombres: 3, mujeres: 2 },
// };

export default function ProyectosPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMiProyecto, setIsMiProyecto] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [miProyecto, setMiProyecto] = useState(null);
  const [userData, setUserData] = useState(mockUserData);

  const handleProjectClick = (project, esProyectoPrincipal = false) => {
    setSelectedProject(project);
    setIsMiProyecto(esProyectoPrincipal);
  };

  const handleCloseSheet = () => {
    setSelectedProject(null);
    setIsMiProyecto(false);
  };

  const handleOpenCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  const handleCreateProject = (nuevoProyecto) => {
    setMiProyecto(nuevoProyecto);
    setUserData((prev) => ({
      ...prev,
      nombreDeProyectoCreado: nuevoProyecto.nombre,
    }));
  };

  const totalProyectosSecundarios = userData.proyectosSecundariosEnLosQueParticipa.length;
  const tieneProyectoPrincipal = miProyecto || userData.nombreDeProyectoCreado !== null;

  return (
    <main className="min-h-screen bg-zinc-950 p-6">
    <div className="flex flex-col gap-6 pb-8" style={{"color": "var(--text-primary)"}}>
      {/* 1. Header del Usuario */}
      <section className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-600">
        <h1 className="text-3xl font-bold  mb-2">
          Hola, {userData.nombre} 👋
        </h1>
        <div className="flex flex-col gap-3">
          {tieneProyectoPrincipal && (
            <p className="text-xl">
              <span className="font-semibold text-blue-700">Tu proyecto:</span> {miProyecto?.nombre || userData.nombreDeProyectoCreado}
            </p>
          )}
          <p className="text-xl text-gray-300">
            <span className="font-semibold text-blue-500">Participas en:</span> {totalProyectosSecundarios} proyecto{totalProyectosSecundarios !== 1 ? 's' : ''} más
          </p>
        </div>
      </section>

      {/* 2. Tarjeta "Mi Proyecto" - Solo si existe */}
      {tieneProyectoPrincipal ? (
        <section>
          <h2 className="text-2xl font-bold  mb-4">Tu Proyecto</h2>
          <ProjectCard
            project={miProyecto}
            isMiProyecto={true}
            onClick={() => handleProjectClick(miProyecto, true)}
          />
        </section>
      ) : (
        <section >
          <h2 className="text-2xl font-bold  mb-4">Tu Proyecto</h2>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-2xl font-bold  mb-3">
              Todavía no creaste ningún proyecto
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-md">
              ¡Es el momento perfecto! Crea tu primer proyecto y comparte tu iniciativa con otros adultos mayores.
            </p>
            <button
              onClick={handleOpenCreateForm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-8 py-4 rounded-xl transition-colors active:scale-95 min-h-14 min-w-48"
            >
              + Crear Proyecto
            </button>
          </div>
        </section>
      )}

      {/* 3. Listado de Proyectos Secundarios */}
      {totalProyectosSecundarios > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">
            Otros Proyectos
          </h2>
          <div className="flex flex-col gap-4">
            {userData.proyectosSecundariosEnLosQueParticipa.map((proyecto) => (
              <ProjectCard
                key={proyecto.id}
                project={proyecto}
                isMiProyecto={false}
                onClick={() => handleProjectClick(proyecto, false)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Bottom Sheet - Detalle del Proyecto */}
      {selectedProject && (
        <ProjectDetailSheet
          project={selectedProject}
          isMiProyecto={isMiProyecto}
          onClose={handleCloseSheet}
        />
      )}

      {/* Bottom Sheet - Crear Proyecto */}
      {showCreateForm && (
        <CreateProjectSheet
          onClose={handleCloseCreateForm}
          onCreate={handleCreateProject}
        />
      )}
    </div>
    </main>
    
  );
}
