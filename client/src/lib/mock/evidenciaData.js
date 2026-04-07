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

  traceability: {
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
      { label: 'Primera carga trazable', date: '2026-03-14', version: 'v1.0' },
      { label: 'Borrador inicial', date: '2026-03-10', version: 'v0.8' },
    ],
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
};

export const traceabilityByEvidence = {
  'Entrevistas fundacionales con usuarios tempranos': {
    title: 'Entrevistas fundacionales con usuarios tempranos',
    version: 'v1.2',
    description: 'Registro de entrevistas cualitativas con early adopters.',
    pac: 'T2-C6',
    category: 'C2',
    result: 'Aprobada',
    score: '8.5 / 10',
    evaluation: {
      text: 'Buena profundidad en insights, aunque falta segmentación más clara.',
      author: 'Laura Méndez',
      role: 'Mentor de validación',
      date: '2026-04-02',
    },
    history: [
      { label: 'Versión vigente', date: '2026-04-02', version: 'v1.2' },
      { label: 'Primera versión', date: '2026-03-28', version: 'v1.0' },
    ],
  },

  'Matriz comparativa de señales de mercado': {
    title: 'Matriz comparativa de señales de mercado',
    version: 'v1.0',
    description: 'Comparación de señales entre competidores y usuarios.',
    pac: 'T2-C6',
    category: 'C2',
    result: 'Aprobada',
    score: '7.9 / 10',
    evaluation: {
      text: 'Buen enfoque analítico, falta profundidad en validación externa.',
      author: 'Laura Méndez',
      role: 'Mentor de validación',
      date: '2026-03-29',
    },
    history: [
      { label: 'Versión vigente', date: '2026-03-29', version: 'v1.0' },
    ],
  },

  'Registro de feedback temprano y patrones de rechazo':
    evidenciaData.traceability,

  'Mapa de microacciones de contraste de segmento': {
    title: 'Mapa de microacciones de contraste de segmento',
    version: 'v0.9',
    description: 'Exploración de comportamiento en pruebas rápidas.',
    pac: 'T2-C5',
    category: 'C2',
    result: 'En revisión',
    score: '6.8 / 10',
    evaluation: {
      text: 'Aún falta consistencia en las métricas utilizadas.',
      author: 'Iván Rojas',
      role: 'Mentor de seguimiento',
      date: '2026-03-18',
    },
    history: [
      { label: 'Última iteración', date: '2026-03-18', version: 'v0.9' },
    ],
  },

  'Síntesis de observaciones de mentoría de mercado': {
    title: 'Síntesis de observaciones de mentoría de mercado',
    version: 'v0.7',
    description: 'Resumen de feedback de mentorías previas.',
    pac: 'T2-C4',
    category: 'C7',
    result: 'Observada',
    score: '5.9 / 10',
    evaluation: {
      text: 'Necesita mayor claridad en decisiones tomadas.',
      author: 'Ana Beltrán',
      role: 'Mentor',
      date: '2026-03-12',
    },
    history: [
      { label: 'Versión inicial', date: '2026-03-12', version: 'v0.7' },
    ],
  },
};
