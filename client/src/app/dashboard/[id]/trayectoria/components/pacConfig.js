// ===============================
// PAC CONFIG ESCALABLE
// ===============================

export const pacConfig = {
  categories: {
    C1: {
      name: 'Equipo Emprendedor',
      base: {
        inputs: [
          {
            title: 'Definición de roles',
            desc: 'Roles, dedicación y responsabilidades del equipo.',
          },
          {
            title: 'Dinámica de trabajo',
            desc: 'Cómo se organizan y toman decisiones.',
          },
          {
            title: 'Acuerdos clave',
            desc: 'Reglas básicas de funcionamiento.',
          },
        ],
        evidence: {
          done: '✔ Equipo estructurado y validado.',
          current: '⏳ Definiendo estructura del equipo.',
          pending: '⚠️ Definí roles, dinámica y acuerdos.',
        },
      },
      tramos: {
        T1: {
          evidence: {
            done: '✔ Equipo fundacional definido.',
          },
        },
        T3: {
          inputs: [
            {
              title: 'Roles estratégicos',
              desc: 'Definición de liderazgo y ownership.',
            },
          ],
        },
      },
    },

    C2: {
      name: 'Problema',
      base: {
        inputs: [
          {
            title: 'Observación de problemas',
            desc: 'Detectar problemas reales en el contexto.',
          },
          {
            title: 'Entrevistas',
            desc: 'Validar con usuarios reales.',
          },
          {
            title: 'Síntesis',
            desc: 'Definir problema principal.',
          },
        ],
        evidence: {
          done: '✔ Problema validado.',
          current: '⏳ Validando problema.',
          pending: '⚠️ Observá, entrevistá y sintetizá.',
        },
      },
      tramos: {},
    },

    C3: {
      name: 'Propuesta de Valor',
      base: {
        inputs: [
          {
            title: 'Propuesta inicial',
            desc: 'Definir solución al problema.',
          },
          {
            title: 'Feedback',
            desc: 'Validar con usuarios.',
          },
          {
            title: 'Iteración',
            desc: 'Ajustar propuesta.',
          },
        ],
        evidence: {
          done: '✔ Propuesta validada.',
          current: '⏳ Iterando propuesta.',
          pending: '⚠️ Creá, validá y ajustá tu propuesta.',
        },
      },
      tramos: {},
    },

    C4: {
      name: 'Recursos y Finanzas',
      base: {
        inputs: [
          {
            title: 'Recursos disponibles',
            desc: 'Listado de recursos actuales.',
          },
          {
            title: 'Herramientas',
            desc: 'Inventario de herramientas.',
          },
          {
            title: 'Uso estratégico',
            desc: 'Cómo se utilizan los recursos.',
          },
        ],
        evidence: {
          done: '✔ Recursos organizados.',
          current: '⏳ Organizando recursos.',
          pending: '⚠️ Identificá y organizá tus recursos.',
        },
      },
      tramos: {},
    },

    C5: {
      name: 'Historia y Propósito',
      base: {
        inputs: [
          {
            title: 'Historia',
            desc: 'Narrativa del proyecto.',
          },
          {
            title: 'Aprendizajes',
            desc: 'Reflexión sobre experiencias.',
          },
          {
            title: 'Propósito',
            desc: 'Conexión con misión.',
          },
        ],
        evidence: {
          done: '✔ Historia conectada con misión.',
          current: '⏳ Construyendo narrativa.',
          pending: '⚠️ Definí tu historia y propósito.',
        },
      },
      tramos: {},
    },

    C6: {
      name: 'Contexto y Estrategia',
      base: {
        inputs: [
          {
            title: 'Oportunidades',
            desc: 'Identificación de oportunidades.',
          },
          {
            title: 'Obstáculos',
            desc: 'Análisis de riesgos.',
          },
          {
            title: 'Acción',
            desc: 'Ejecución de acciones.',
          },
        ],
        evidence: {
          done: '✔ Contexto analizado.',
          current: '⏳ Analizando contexto.',
          pending: '⚠️ Detectá oportunidades y obstáculos.',
        },
      },
      tramos: {},
    },

    C7: {
      name: 'Ejecución y Tracción',
      base: {
        inputs: [
          {
            title: 'Plan de acción',
            desc: 'Definir tareas y objetivos.',
          },
          {
            title: 'Seguimiento',
            desc: 'Registrar avances.',
          },
          {
            title: 'Difusión',
            desc: 'Compartir resultados.',
          },
        ],
        evidence: {
          done: '✔ Ejecución completada.',
          current: '⏳ Ejecutando acciones.',
          pending: '⚠️ Completá las acciones.',
        },
      },
      tramos: {
        T3: {
          evidence: {
            done: '✔ “Mis Primeras Gotas” completado.',
          },
        },
      },
    },
  },
};

// ===============================
// FUNCION PRINCIPAL
// ===============================

export function getPacConfig(pacCode) {
  if (!pacCode) return null;

  const [tramo, category] = pacCode.split('-'); // T1-C4

  const categoryConfig = pacConfig.categories[category];

  if (!categoryConfig) {
    console.warn('Categoría no encontrada:', category);
    return null;
  }

  const base = categoryConfig.base || {};
  const tramoOverride = categoryConfig.tramos?.[tramo] || {};

  return {
    ...base,
    ...tramoOverride,
    inputs: tramoOverride.inputs || base.inputs || [],
    evidence: {
      ...base.evidence,
      ...tramoOverride.evidence,
    },
  };
}

// ===============================
// FALLBACK GLOBAL (opcional)
// ===============================

export const defaultEvidence = {
  done: '✔ Evidencia completada',
  current: '⏳ En proceso',
  pending: '⚠️ Pendiente',
};