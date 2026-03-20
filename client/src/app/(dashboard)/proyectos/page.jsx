'use client';

import { useState } from 'react';
import ProjectCard from '@/components/proyectos/ProjectCard';
import ProjectDetailSheet from '@/components/proyectos/ProjectDetailSheet';

// Datos mock con una estructura clara
const mockUserData = {
  nombre: 'María García',
  nombreDeProyectoCreado: 'Recuperación Postoperatoria',
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

// Mi Proyecto Principal
const mockProyectoPrincipal = {
  id: 'mi-proyecto',
  nombre: 'Recuperación Postoperatoria',
  descripción: 'Programa especializado de recuperación para personas mayores de 65 años tras intervenciones quirúrgicas. Incluye ejercicios terapéuticos, seguimiento médico y apoyo emocional personalizado.',
  porcentajeCompletado: 45,
  miembros: [
    { nombre: 'Dr. Manuel Gómez', sexo: 'hombre' },
    { nombre: 'Enfermera Patricia Núñez', sexo: 'mujer' },
    { nombre: 'Fisioterapeuta David Torres', sexo: 'hombre' },
    { nombre: 'Psicóloga Claudia Herrera', sexo: 'mujer' },
    { nombre: 'Auxiliar de enfermería José Ramírez', sexo: 'hombre' },
  ],
  conteoDeSexos: { hombres: 3, mujeres: 2 },
};

export default function ProyectosPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMiProyecto, setIsMiProyecto] = useState(false);

  const handleProjectClick = (project, esProyectoPrincipal = false) => {
    setSelectedProject(project);
    setIsMiProyecto(esProyectoPrincipal);
  };

  const handleCloseSheet = () => {
    setSelectedProject(null);
    setIsMiProyecto(false);
  };

  const totalProyectosSecundarios = mockUserData.proyectosSecundariosEnLosQueParticipa.length;
  const tieneProyectoPrincipal = mockUserData.nombreDeProyectoCreado !== null;

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* 1. Header del Usuario */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hola, {mockUserData.nombre} 👋
        </h1>
        <div className="flex flex-col gap-3">
          {tieneProyectoPrincipal && (
            <p className="text-xl text-gray-700">
              <span className="font-semibold text-blue-700">Tu proyecto:</span> {mockUserData.nombreDeProyectoCreado}
            </p>
          )}
          <p className="text-xl text-gray-700">
            <span className="font-semibold text-blue-700">Participas en:</span> {totalProyectosSecundarios} proyecto{totalProyectosSecundarios !== 1 ? 's' : ''} más
          </p>
        </div>
      </section>

      {/* 2. Tarjeta "Mi Proyecto" - Solo si existe */}
      {tieneProyectoPrincipal && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu Proyecto</h2>
          <ProjectCard
            project={mockProyectoPrincipal}
            isMiProyecto={true}
            onClick={() => handleProjectClick(mockProyectoPrincipal, true)}
          />
        </section>
      )}

      {/* 3. Listado de Proyectos Secundarios */}
      {totalProyectosSecundarios > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Proyectos secundarios en los que participas
          </h2>
          <div className="flex flex-col gap-4">
            {mockUserData.proyectosSecundariosEnLosQueParticipa.map((proyecto) => (
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
    </div>
  );
}
