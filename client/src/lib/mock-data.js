// Mock de proyecto para flujo de invitado
export const project = {
    name: "Aurora Labs",
    id: "COL-AR-00231",
    tramoCode: "T2",
    tramoName: "Validación temprana",
    status: "En avance estructural",
    updatedAt: "2026-04-03",
    nftState: "T2",
    ic: 2.43,
    icMax: 6.0,
    icNarrative: "T2 en tránsito a T3",
    trendLabel: "Tendencia ascendente breve",
    currentPac: "T2-C6",
    approvedPacs: 5,
    totalPacs: 7,
    microActions: 15,
    evidences: 5,
    nextMilestone: "Cierre de T2-C6",
    uncertainty: "Mercado",
    primaryRisk: "Inexistencia de demanda",
    window: "4 meses",
  };
// Incertidumbre 

export const incertidumbreMock = {
  incertidumbreDominante: {
  name: 'Incertidumbre Humana/Identitaria',
  level: 86
  },
};

export const nftColibriMock = {
  id: 'nft-001',
  name: 'Colibrí Genesis',
  type: 'NFT Actor',
  owner: 'Franz Duran',
  wallet: '0xA1B2...C3D4',
  network: 'Polygon',
  tokenId: '123456',
  status: 'Activo',
  description:
    'NFT que representa la identidad digital dentro del ecosistema Colibrí.',
};

export const colibriIndexMock = {
  value: 4.32, // ic_public (escala 0.00 – 6.00)
  trend: 'up', // "up" | "stable" | "down"
  lastUpdated: '2026-03-24T15:30:00Z',
};

export const consistencyMock = {
  level: 'Alta', // "Alta" | "Media" | "Baja"
  score: 0.87, // opcional (0–1)
  lateRate: 0.12, // % de acciones fuera de tiempo
  updatedAt: '2026-03-24T15:30:00Z',
};

export const pacsMock = [
  ...Array.from({ length: 7 }).map((_, i) => ({
    id: `pac-${i + 1}`,
    title: `PAC ${i + 1}`,
    status: 'en progreso',
    microactions: [
      {
        id: `ma-${i + 1}-1`,
        name: 'Definir hipótesis',
        status: 'pendiente',
      },
      {
        id: `ma-${i + 1}-2`,
        name: 'Validar con usuarios',
        status: 'en progreso',
      },
      {
        id: `ma-${i + 1}-3`,
        name: 'Documentar aprendizaje',
        status: 'enviada',
      },
    ],
    evidence: {
      id: `ev-${i + 1}`,
      name: 'Entrega final',
      status: 'pendiente',
    },
  })),
];

export const tramoMock = {
  name: 'Validación Inicial', // nombre simbólico
  progress: 0.58, // 0–1 (58%)
  elapsedDays: 12,
  totalDays: 21, // opcional (execution_window_days)
};

export const actionsManagementMock = {
  current: {
    pacTitle: 'Validación de propuesta de valor',
    microActions: [
      {
        id: 1,
        name: 'Definir hipótesis de cliente',
        status: 'in_progress',
      },
      {
        id: 2,
        name: 'Realizar 5 entrevistas',
        status: 'pending',
      },
      {
        id: 3,
        name: 'Documentar aprendizajes',
        status: 'pending',
      },
    ],
    evidence: {
      name: 'Informe de validación',
      status: 'pending',
    },
  },

  next: {
    pacTitle: 'Primer experimento de mercado',
    microActions: [
      { id: 4, name: 'Definir experimento', status: 'locked' },
      { id: 5, name: 'Ejecutar prueba', status: 'locked' },
      { id: 6, name: 'Analizar resultados', status: 'locked' },
    ],
  },
};

export const radarCompetenciasMock = [
  { category: 'C1 Equipo', value: 4.2 },
  { category: 'C2 Problema', value: 5.1 },
  { category: 'C3 Negocio', value: 3.8 },
  { category: 'C4 Finanzas', value: 2.9 },
  { category: 'C5 Estrategia', value: 4.5 },
  { category: 'C6 Factores Exógenos', value: 3.2 },
  { category: 'C7 Métricas', value: 2.7 },
];

export const entrecompMock = [
  {
    date: '2026-01',
    equipo: 2.5,
    problema: 3.2,
    negocio: 2.8,
  },
  {
    date: '2026-02',
    equipo: 3.4,
    problema: 3.8,
    negocio: 3.1,
  },
  {
    date: '2026-03',
    equipo: 4.1,
    problema: 4.5,
    negocio: 3.9,
  },
];

export const wefSkillsMock = [
  {
    date: '2026-01',
    pensamiento_critico: 2.8,
    creatividad: 3.1,
    liderazgo: 2.6,
  },
  {
    date: '2026-02',
    pensamiento_critico: 3.5,
    creatividad: 3.6,
    liderazgo: 3.2,
  },
  {
    date: '2026-03',
    pensamiento_critico: 4.2,
    creatividad: 4.0,
    liderazgo: 3.8,
  },
];
