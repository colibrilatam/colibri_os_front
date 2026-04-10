// lib/getProjectById.js
import dataProjects from '@/lib/mock/proyectos ficticios/dataProjects.json';

export function getProjectById(id) {
  const selected = dataProjects.projectsData.find(p => p.project.id === id);
  return selected || null;
}