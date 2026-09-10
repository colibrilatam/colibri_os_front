/**
 * Definición centralizada de query keys para TanStack Query.
 *
 * Reglas:
 * - Cada recurso tiene su propio namespace (projects, evidences, etc.).
 * - Las listas usan claves estáticas; los detalles incluyen el ID.
 * - Las relaciones anidadas reflejan la jerarquía (ej. proyecto → evidencias).
 */
export const queryKeys = {
  projects: {
    all: ['projects'],
    detail: (id) => ['projects', { id }],
    tramo: (id) => ['projects', { id }, 'tramo'],
    tramoData: (id) => ['projects', { id }, 'tramoData'],
    nft: (id) => ['projects', { id }, 'nft'],
    evidences: (id) => ['projects', { id }, 'evidences'],
    microActions: (id) => ['projects', { id }, 'microActions'],
    members: (id) => ['projects', { id }, 'members'],
  },

  evidences: {
    all: ['evidences'],
    detail: (id) => ['evidences', { id }],
    versions: (id) => ['evidences', { id }, 'versions'],
    evaluations: (id) => ['evidences', { id }, 'evaluations'],
    byProject: (projectId) => queryKeys.projects.evidences(projectId),
    byMicroAction: (instanceId) => ['microActions', { instanceId }, 'evidences'],
  },

  microActions: {
    all: ['microActions'],
    detail: (id) => ['microActions', { id }],
    versions: (id) => ['microActions', { id }, 'versions'],
    byProject: (projectId) => queryKeys.projects.microActions(projectId),
  },

  evaluations: {
    all: ['evaluations'],
    pending: ['evaluations', 'pending'],
    byEvidence: (evidenceId) => queryKeys.evidences.evaluations(evidenceId),
    byId: (id) => ['evaluations', { id }],
    rubrics: {
      active: ['evaluations', 'rubrics', 'active'],
      detail: (id) => ['evaluations', 'rubrics', { id }],
    },
  },

  users: {
    profile: ['users', 'profile'],
    detail: (id) => ['users', { id }],
  },

  nft: {
    projects: ['nft', 'projects'],
    stats: (userId) => ['nft', 'stats', { userId }],
  },

  tramos: {
    all: ['tramos'],
    detail: (id) => ['tramos', { id }],
    project: (projectId) => ['projects', { projectId }, 'tramos'],
  },
};
