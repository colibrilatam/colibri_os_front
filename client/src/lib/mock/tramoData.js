export const tramoData = {
    id: "T2",
    name: "Validación temprana",
    strategicQuestion: "¿El mercado realmente quiere esta solución?",
  
    header: {
      uncertainty: "Mercado",
      mainRisk: "Inexistencia de demanda",
      window: "4 meses",
    },
  
    progress: {
      percentage: 71,
      closedPacs: 5,
      totalPacs: 7,
      currentPac: {
        code: "T2-C6",
        name: "Factores exógenos",
        category: "C6",
      },
    },
  
    pacs: [
      { code: "T2-C1", status: "closed" },
      { code: "T2-C2", status: "closed" },
      { code: "T2-C3", status: "closed" },
      { code: "T2-C4", status: "closed" },
      { code: "T2-C5", status: "closed" },
      { code: "T2-C6", status: "current" },
      { code: "T2-C7", status: "pending" },
    ],
  
    density: {
      microactions: 15,
      evidences: 5,
      message: "El tramo muestra avance operativo con respaldo verificable.",
    },
  
    categories: [
      {
        code: "C2",
        label: "Potencial del problema",
        status: "done",
      },
      {
        code: "C3",
        label: "Modelo de negocio",
        status: "done",
      },
      {
        code: "C6",
        label: "Factores exógenos",
        status: "current",
      },
      {
        code: "C7",
        label: "Métricas y tracción",
        status: "next",
      },
    ],
  
    signals: [
      { text: "Hay actividad verificable en el tramo actual", type: "success" },
      { text: "Existe evidencia aprobada en el recorrido", type: "success" },
      { text: "Ya se activaron categorías estructurales", type: "success" },
      { text: "Falta completar el cierre del PAC actual", type: "warning" },
    ],
  
    blockers: [
      "El PAC actual aún no cumple condición de cierre.",
      "Falta al menos una evidencia para consolidar el avance.",
      "La validación del tramo sigue incompleta.",
    ],
  };