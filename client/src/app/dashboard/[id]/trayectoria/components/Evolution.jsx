"use client";
import { useState, useEffect } from "react"
import { useProject } from '@/lib/projectContext';
import { useUserStore } from "@/lib/store";


export default function Evolution() {

    const { dbProject } = useProject();
    const [evolvedState, setEvolvedState ] = useState(false)
    const setIsEvolved = useUserStore((state) => state.setIsEvolved);

    useEffect(() => {
    const timer = setTimeout(() => {
      setEvolvedState(true);
      setIsEvolved(true);
    }, 2000); // espera 2 segundos antes de evolucionar

    return () => clearTimeout(timer);
  }, []);

    return (
        <div className="flex items-center justify-center p-2" >
        <div className="relative w-64 h-64 flex items-center justify-center">
  {/* Imagen original */}
  <img
    className={`rounded-2xl absolute transition-opacity duration-1000 ${evolvedState ? 'opacity-0' : 'opacity-100'}`}
    src={`${dbProject.nftImageUrl}`}
  />
  {/* Imagen evolucionada */}
  <img
    className={` border-4 border-amber-300 absolute rounded-2xl transition-opacity duration-1000 ${evolvedState ? 'opacity-100' : 'opacity-0'}`}
    src="/flujo-evolved.png"
  />
</div>  
</div>
    )
}