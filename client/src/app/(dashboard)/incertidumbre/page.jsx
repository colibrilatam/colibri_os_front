'use client';
import React, { useState } from 'react';
import { incertidumbreMock } from '@/lib/mock-data';
import IncertidumbreDominante from './components/IncertidumbreDominante';
import SeñalesDeCoherencia from './components/SeñalesDeCoherencia';
import TransicionEstructural from './components/TransicionEstructural';

export default function IncertidumbrePage() {
  const [selectedTransicionIndex, setSelectedTransicionIndex] = useState(0);
  // Mock data for Incertidumbre Dominante


  // Mock data for Transición Estructural
  const transicionData = [
    {
      name: 'Madurez del Equipo',
      levels: [0, 25, 50, 75, 100],
      progression: [20, 40, 60]
    },
    {
      name: 'Coherencia Interna',
      levels: [0, 25, 50, 75, 100],
      progression: [30, 50, 70]
    },
    {
      name: 'Capacidad de Ejecución',
      levels: [0, 25, 50, 75, 100],
      progression: [40, 65, 80]
    }
  ];

  // Señales de Coherencia
  const señales = [
    { nombre: 'Roles Definidos', nivel: 3, evidencia: 'https://notion.so/acta-fundacional' },
    { nombre: 'Fricción Documentada', nivel: 1, evidencia: 'https://notion.so/registro-fricciones' },
    { nombre: 'Toma de Decisiones bajo Presión', nivel: 2, evidencia: 'https://notion.so/minutas-reuniones' },
    { nombre: 'Coachability', nivel: 1, evidencia: 'https://notion.so/feedback-sesiones' }
  ];

  return (
    <main className="min-h-screen rounded glass-effect-dark border-glass p-6">
      <div className=" mx-auto space-y-8">
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)' }} className="font-semibold text-white">Reducción de Incertidumbre y Coherencia</h1>
          <p style={{ fontSize: 'var(--text-lg)' }} className="text-zinc-400 mt-2">Volver medible la esperanza. Evolución estructural bajo fricción real.</p>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between gap-6 ">
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
      {/* Incertidumbre Dominante */}
      <IncertidumbreDominante incertidumbreData={incertidumbreMock.incertidumbreDominante} />
      {/* Señales de Coherencia */}
      <SeñalesDeCoherencia señales={señales} />
      </div>
{/* Transición Estructural por PAC */}
      <TransicionEstructural 
        data={transicionData} 
        selectedIndex={selectedTransicionIndex}
        onSelectIndex={setSelectedTransicionIndex}
      />
      

        
      </div>
      </div>
    </main>
  );
}