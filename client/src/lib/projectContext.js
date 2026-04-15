"use client"
import { createContext, useContext } from "react";

export const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);