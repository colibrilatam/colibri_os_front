"use client";
import NewTrayectoria from "./NewPage";
import OldTrayectoria from "./OldPage";
import { useProject } from '@/lib/projectContext';
import mockProjectsData from '@/lib/mock/projectsData.json';

export default function TrayectoriaSection() {

  const { tramoData, dbProject, mockProject } = useProject();

  const mockProjectMatch = mockProjectsData.find(
      (p) =>
        p.project.name?.toLowerCase().trim() ===
        dbProject.projectName?.toLowerCase().trim() && p.projectName !== "FlujoClave",
    );


  if(mockProjectMatch) return <OldTrayectoria />
  else return <NewTrayectoria />
};
