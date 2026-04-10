// lib/getProjectById.js
import dataProjects from '@/lib/mock/proyectos ficticios/dataProjects.json';

export function getProjectById(id) {
  const index = parseInt(id) - 1;
  return dataProjects.projectsData[index] || null;
}