export const evidenciaData = {
    summary: {
      total: 5,
      lastEvidence: {
        title: 'Entrevistas fundacionales con usuarios tempranos',
        date: '2026-04-02',
      },
      status: 'Base validada en consolidación',
      nextRequirement: 'Evidencia comparativa de validación de mercado',
      currentPac: 'T2-C6',
    },
  
    validation: {
      approvedBy: 'Laura Méndez',
      role: 'Mentor de validación',
      result: 'Aprobada con observaciones',
      date: '2026-04-02',
      comment:
        'Evidencia consistente, decisión clara y aprendizaje visible respecto al segmento objetivo.',
    },
  
    /* 🔥 NUEVO: TRAZABILIDAD POR EVIDENCIA */
    traceabilityMap: {
      'Entrevistas fundacionales con usuarios tempranos': {
        title: 'Entrevistas fundacionales con usuarios tempranos',
        version: 'v1.3',
        description:
          'Entrevistas estructuradas para validar problema y contexto.',
        pac: 'T2-C6',
        category: 'C2',
        result: 'Aprobada',
        score: '8.7 / 10',
        evaluation: {
          text: 'Claridad en problema y patrón de necesidad.',
          author: 'Laura Méndez',
          role: 'Mentor de validación',
          date: '2026-04-02',
        },
        history: [
          { label: 'Versión vigente', date: '2026-04-02', version: 'v1.3' },
          { label: 'Primera iteración', date: '2026-03-28', version: 'v1.0' },
        ],
      },
  
      'Matriz comparativa de señales de mercado': {
        title: 'Matriz comparativa de señales de mercado',
        version: 'v1.1',
        description: 'Comparación entre alternativas actuales y propuesta.',
        pac: 'T2-C6',
        category: 'C2',
        result: 'Aprobada',
        score: '7.9 / 10',
        evaluation: {
          text: 'Buen contraste competitivo.',
          author: 'Laura Méndez',
          role: 'Mentor de validación',
          date: '2026-03-29',
        },
        history: [
          { label: 'Versión vigente', date: '2026-03-29', version: 'v1.1' },
        ],
      },
  
      'Registro de feedback temprano y patrones de rechazo': {
        title: 'Registro de feedback temprano y patrones de rechazo',
        version: 'v2.0',
        description:
          'Bitácora de respuestas de usuarios con clasificación de objeciones, aceptación y ambigüedad.',
        pac: 'T2-C5',
        category: 'C7',
        result: 'Aprobada',
        score: '8.1 / 10',
        evaluation: {
          text: 'Buen registro de fricción. La calidad mejora porque diferencia claramente interés de intención de uso.',
          author: 'Iván Rojas',
          role: 'Mentor de seguimiento',
          date: '2026-03-21',
        },
        history: [
          { label: 'Versión vigente', date: '2026-03-21', version: 'v2.0' },
          {
            label: 'Primera carga trazable',
            date: '2026-03-14',
            version: 'v1.0',
          },
          {
            label: 'Borrador de contraste inicial',
            date: '2026-03-10',
            version: 'v0.8',
          },
        ],
      },
  
      'Mapa de microacciones de contraste de segmento': {
        title: 'Mapa de microacciones de contraste de segmento',
        version: 'v0.9',
        description: 'Registro de interacciones iniciales con segmentos.',
        pac: 'T2-C5',
        category: 'C2',
        result: 'En revisión',
        score: '6.5 / 10',
        evaluation: {
          text: 'Falta claridad en interpretación.',
          author: 'Iván Rojas',
          role: 'Mentor de seguimiento',
          date: '2026-03-18',
        },
        history: [
          { label: 'Versión vigente', date: '2026-03-18', version: 'v0.9' },
        ],
      },
  
      'Síntesis de observaciones de mentoría de mercado': {
        title: 'Síntesis de observaciones de mentoría de mercado',
        version: 'v1.0',
        description: 'Resumen de feedback de mentoría.',
        pac: 'T2-C4',
        category: 'C7',
        result: 'Observada',
        score: '5.8 / 10',
        evaluation: {
          text: 'Necesita mayor estructuración.',
          author: 'Ana Beltrán',
          role: 'Mentor',
          date: '2026-03-12',
        },
        history: [
          { label: 'Versión vigente', date: '2026-03-12', version: 'v1.0' },
        ],
      },
    },
  
    evidences: [
      {
        title: 'Entrevistas fundacionales con usuarios tempranos',
        pac: 'T2-C6',
        category: 'C2',
        status: 'approved',
        date: '2026-04-02',
        mentor: 'Laura Méndez',
      },
      {
        title: 'Matriz comparativa de señales de mercado',
        pac: 'T2-C6',
        category: 'C2',
        status: 'approved',
        date: '2026-03-29',
        mentor: 'Laura Méndez',
      },
      {
        title: 'Registro de feedback temprano y patrones de rechazo',
        pac: 'T2-C5',
        category: 'C7',
        status: 'approved',
        date: '2026-03-21',
        mentor: 'Iván Rojas',
      },
      {
        title: 'Mapa de microacciones de contraste de segmento',
        pac: 'T2-C5',
        category: 'C2',
        status: 'review',
        date: '2026-03-18',
        mentor: 'Iván Rojas',
      },
      {
        title: 'Síntesis de observaciones de mentoría de mercado',
        pac: 'T2-C4',
        category: 'C7',
        status: 'observed',
        date: '2026-03-12',
        mentor: 'Ana Beltrán',
      },
    ],
    metrics: {
      competencies: [
        { label: 'Aprendizaje experiencial', value: 82 },
        { label: 'Gestión de incertidumbre', value: 74 },
        { label: 'Coordinación', value: 68 },
        { label: 'Iniciativa', value: 61 },
      ],
  
      skills: [
        { label: 'Pensamiento crítico', level: 'Alta' },
        { label: 'Colaboración', level: 'Media-alta' },
        { label: 'Confiabilidad', level: 'Media' },
        { label: 'Empatía', level: 'Media' },
      ],
  
      context: {
        tags: ['C2', 'C7'],
        pac: 'T2-C6',
        description:
          'Evidencia concentrada en validación de mercado y señales tempranas de tracción.',
      },
    },
  };
