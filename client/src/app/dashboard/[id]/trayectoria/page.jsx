"use client";
import NewTrayectoria from "./NewPage";
import OldTrayectoria from "./OldPage";
import { useProject } from '@/lib/projectContext';

export default function TrayectoriaSection() {

  const { tramoData, dbProject, mockProject } = useProject();

  if(dbProject.projectName !== "FlujoClave") return <OldTrayectoria />
  else return <NewTrayectoria />
};
