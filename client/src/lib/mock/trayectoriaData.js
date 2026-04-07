export const trayectoriaData = {
    tramo: {
      id: "T2",
      name: "Validación temprana",
      description:
        "Esta capa muestra unidades de trabajo verificables recorridas por el proyecto dentro del tramo actual.",
    },
  
    metrics: {
      currentPac: "T2-C6",
      totalPacs: 7,
      microactions: 15,
      evidences: 5,
    },
  
    pacs: [
      {
        code: "T2-C1",
        category: "C1",
        title: "Alineación del equipo base",
        area: "Equipo emprendedor",
        status: "done",
        detail: {
          objective: "Alinear visión, roles y compromiso del equipo fundador.",
          evidence: {
            title: "Equipo validado",
            description: "Roles definidos y acuerdo de trabajo formalizado.",
          },
          timeline: { start: "2026-01-01", end: "2026-01-05" },
          microactions: [
            "Definición de roles",
            "Kickoff estratégico",
            "Alineación de expectativas",
          ],
        },
      },
  
      {
        code: "T2-C2",
        category: "C2",
        title: "Contraste inicial del problema",
        area: "Potencial del problema",
        status: "done",
        detail: {
          objective: "Validar que el problema identificado es relevante.",
          evidence: {
            title: "Problema validado",
            description: "Usuarios confirman la existencia del problema.",
          },
          timeline: { start: "2026-01-06", end: "2026-01-10" },
          microactions: [
            "Entrevistas a usuarios",
            "Identificación de pains",
            "Síntesis de hallazgos",
          ],
        },
      },
  
      {
        code: "T2-C3",
        category: "C3",
        title: "Ajuste preliminar de propuesta de valor",
        area: "Modelo de negocio",
        status: "done",
        detail: {
          objective: "Ajustar la propuesta de valor al problema validado.",
          evidence: {
            title: "Propuesta validada",
            description: "Usuarios comprenden y valoran la solución.",
          },
          timeline: { start: "2026-01-11", end: "2026-01-18" },
          microactions: [
            "Definición de propuesta",
            "Test de concepto",
            "Iteración inicial",
          ],
        },
      },
  
      {
        code: "T2-C4",
        category: "C4",
        title: "Estimación inicial de viabilidad financiera",
        area: "Finanzas",
        status: "done",
        detail: {
          objective:
            "Comprobar si la estructura inicial de costos y esfuerzo requerido es compatible con la etapa actual.",
          evidence: {
            title: "Evidencia aprobada #04",
            description:
              "Justificación básica del esfuerzo y recursos requeridos para avanzar.",
          },
          timeline: { start: "2026-02-12", end: "2026-02-20" },
          microactions: [
            "Levantamiento de costos críticos",
            "Mapa de necesidades operativas mínimas",
            "Revisión de tensión entre alcance y recursos",
          ],
        },
      },
  
      {
        code: "T2-C5",
        category: "C5",
        title: "Lectura del momento estratégico",
        area: "Timing y estrategia",
        status: "done",
        detail: {
          objective: "Evaluar si el contexto es adecuado para avanzar.",
          evidence: {
            title: "Contexto validado",
            description: "Condiciones externas favorables identificadas.",
          },
          timeline: { start: "2026-02-21", end: "2026-02-25" },
          microactions: [
            "Análisis de mercado",
            "Evaluación de timing",
            "Identificación de riesgos externos",
          ],
        },
      },
  
      {
        code: "T2-C6",
        category: "C6",
        title: "Validación de señales críticas del entorno",
        area: "Factores exógenos",
        status: "current",
        detail: {
          objective:
            "Validar señales externas que impactan la viabilidad del proyecto.",
          evidence: {
            title: "Evidencia aprobada #05",
            description:
              "Se identifican señales consistentes en el entorno.",
          },
          timeline: { start: "2026-03-01", end: "2026-03-10" },
          microactions: [
            "Análisis de entorno",
            "Validación de tendencias",
            "Cruce de variables externas",
          ],
        },
      },
  
      {
        code: "T2-C7",
        category: "C7",
        title: "Lectura inicial de tracción verificable",
        area: "Métricas y tracción",
        status: "pending",
        detail: {
          objective: "Medir señales iniciales de tracción real.",
          evidence: {
            title: "Sin evidencia aún",
            description: "Pendiente de validación en usuarios reales.",
          },
          timeline: { start: "-", end: "-" },
          microactions: [
            "Definir métricas",
            "Primeros tests",
            "Medición de adopción",
          ],
        },
      },
    ],
  
    milestones: [
      { text: "Cierre de T2-C3", date: "2026-02-11" },
      { text: "Evidencia aprobada #05", date: "2026-03-02" },
      { text: "Apertura de T2-C6", date: "2026-03-03" },
    ],
  };