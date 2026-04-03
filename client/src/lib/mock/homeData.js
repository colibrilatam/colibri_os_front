export const homeData = {
  project: {
    name: 'Semilla Aurora',
    tramo: 'T2',
    estado: 'Elegible inversión',
    consistencia: 'Alta',
    ultimaEvolucion: '02 Abr',
  },

  ic: {
    value: 78,
    change: '+8 pts',
    trend: [31, 34, 36, 40, 43, 47, 51, 57, 59, 63, 67, 72],
  },

  incertidumbre: {
    dominante: 'Mercado',
    riesgos: [
      { label: 'Humano', value: 20 },
      { label: 'Mercado', value: 60 },
      { label: 'Técnico', value: 35 },
    ],
  },

  señales: {
    avance: '61%',
    pacs: '2/4',
    estado: 'Sólido',
  },

  contexto: {
    ultimaEvidencia: '03 Abr',
    proximoHito: '10 Abr',
    mentor: 'PAC-01',
  },

  insight:
    'El proyecto muestra ejecución consistente, pero mantiene riesgo en validación de demanda.',
};

export const flightData = [
  {
    id: 'T1-C1',
    title: 'Alineación fundacional',
    fecha: '12 Mar',
    estado: 'validado',
    score: 82,
    defaultOpen: true,

    narrativa: {
      friccion: 'Desalineación en roles del equipo',
      decision: 'Definir responsabilidades explícitas',
      accion: 'Implementación de matriz de roles',
      evidencia: 'Documento validado por mentor',
      resultado: 'Mejor coordinación operativa',
      insight: 'El equipo responde bien a estructuras claras',
    },
  },
  {
    id: 'T1-C2',
    title: 'Definición de problema',
    fecha: '21 Mar',
    estado: 'validado',
    score: 76,

    narrativa: {
      friccion: 'Problema poco claro',
      decision: 'Validar con usuarios reales',
      accion: '10 entrevistas realizadas',
      evidencia: 'Notas + validación mentor',
      resultado: 'Problema redefinido',
      insight: 'Mayor claridad en propuesta de valor',
    },
  },
  {
    id: 'T1-C3',
    title: 'Narrativa de valor',
    fecha: '02 Abr',
    estado: 'revision',
    score: 64,

    narrativa: {
      friccion: 'Mensaje confuso',
      decision: 'Reformular propuesta',
      accion: 'Nueva narrativa testeo',
      evidencia: 'Feedback mixto',
      resultado: 'Aún inconsistente',
      insight: 'Riesgo en comunicación',
    },
  },
];

export const uncertaintyData = {
    global: {
      indice: 58,
      tendencia: -12,
      prediccion: 46,
      decisionScore: "medio",
    },
  
    radar: [
      { label: "Equipo", value: 78 },
      { label: "Problema", value: 71 },
      { label: "Modelo", value: 63 },
      { label: "Finanzas", value: 48 },
      { label: "Timing", value: 67 },
      { label: "Tracción", value: 39 },
    ],
  
    trend: [72, 69, 66, 63, 61, 58],
  
    risks: [
      { title: "Riesgo humano", value: 24 },
      { title: "Irrelevancia", value: 42 },
      { title: "Narrativa", value: 57 },
      { title: "Dependencias", value: 48 },
    ],
  };

  export const evidenceData = {
    global: {
      total: 12,
      validated: 7,
      pending: 3,
      rejected: 2,
      score: 68,
    },
  
    evidences: [
      {
        id: "EV-01",
        title: "Entrevistas con usuarios",
        category: "Problema",
        pac: "T1-C2",
        date: "02 Abr",
        status: "validated",
        mentor: "Mentor PAC",
        summary: "Se validó dolor real en segmento objetivo.",
      },
      {
        id: "EV-02",
        title: "Landing con test de conversión",
        category: "Modelo",
        pac: "T1-C3",
        date: "28 Mar",
        status: "pending",
        mentor: "Coach",
        summary: "Conversión del 12%, aún no concluyente.",
      },
      {
        id: "EV-03",
        title: "Prototipo funcional",
        category: "Producto",
        pac: "T1-C4",
        date: "20 Mar",
        status: "rejected",
        mentor: "Mentor Técnico",
        summary: "No cumple requerimientos de uso.",
      },
    ],
  };

  export const reputationData = {
    global: {
      score: 72,
      tendencia: +8,
      nivel: "Bueno",
    },
  
    breakdown: [
      { label: "Equipo", value: 78 },
      { label: "Problema", value: 71 },
      { label: "Modelo", value: 63 },
      { label: "Finanzas", value: 55 },
      { label: "Timing", value: 68 },
      { label: "Evidencia", value: 74 },
      { label: "Incertidumbre", value: 60 },
    ],
  
    trend: [38, 45, 50, 58, 62, 66, 70, 72],
  
    factors: [
      {
        type: "positivo",
        text: "Alta validación de problema en usuarios reales",
      },
      {
        type: "positivo",
        text: "Evolución consistente del equipo",
      },
      {
        type: "negativo",
        text: "Modelo financiero aún no consolidado",
      },
    ],
  };