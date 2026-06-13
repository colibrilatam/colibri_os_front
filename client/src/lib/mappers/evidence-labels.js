/* =========================================================
   EVIDENCE STATUS
   ========================================================= */

export const evidenceStatusLabels = {
  draft: 'Borrador',
  submitted: 'Enviada',
  under_review: 'En revisión',
  approved: 'Aprobada',
  rejected: 'Rechazada',
};

export const getEvidenceStatusLabel = (status) => {
  const normalized = status?.toLowerCase().trim();
  return evidenceStatusLabels[normalized] || status;
};

/* =========================================================
   VALIDATION STATUS
   ========================================================= */

export const validationStatusLabels = {
  pending: 'Pendiente',
  ai_reviewed: 'Revisada por IA',
  human_reviewed: 'Revisada por humano',
  validated: 'Validada',
  rejected: 'Rechazada',
};

export const getValidationStatusLabel = (status) => {
  const normalized = status?.toLowerCase().trim();
  return validationStatusLabels[normalized] || status;
};

/* =========================================================
   VALIDATION CONFIDENCE
   ========================================================= */

export const validationConfidenceLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export const getValidationConfidenceLabel = (confidence) => {
  const normalized = confidence?.toLowerCase().trim();
  return validationConfidenceLabels[normalized] || confidence;
};

/* =========================================================
   PRIVACY LEVEL
   ========================================================= */

export const privacyLevelLabels = {
  public: 'Pública',
  private: 'Privada',
  restricted: 'Restringida',
};

export const getPrivacyLevelLabel = (level) => {
  const normalized = level?.toLowerCase().trim();
  return privacyLevelLabels[normalized] || level;
};

/* =========================================================
   EVIDENCE TYPE
   ========================================================= */

export const evidenceTypeLabels = {
  text: 'Texto',
  file: 'Archivo',
  link: 'Enlace',
  image: 'Imagen',
  video: 'Video',
};

export const getEvidenceTypeLabel = (type) => {
  const normalized = type?.toLowerCase().trim();
  return evidenceTypeLabels[normalized] || type;
};

/* =========================================================
   USER ROLE
   ========================================================= */

export const userRoleLabels = {
  entrepreneur: 'Emprendedor',
  mentor: 'Mentor',
  evaluator: 'Evaluador',
  mecenas_semilla: 'Mecenas Semilla',
  mecenas_fundacional: 'Mecenas Fundacional',
  mecenas_cambio: 'Mecenas de Cambio',
  admin: 'Administrador',
  guest: 'Invitado',
};

export const getUserRoleLabel = (role) => {
  const normalized = role?.toLowerCase().trim();
  return userRoleLabels[normalized] || role;
};

/* =========================================================
   MICRO ACTION INSTANCE STATUS
   ========================================================= */

export const microActionInstanceStatusLabels = {
  started: 'Iniciada',
  in_progress: 'En progreso',
  submitted: 'Enviada',
  validated: 'Validada',
  completed: 'Completada',
  closed: 'Cerrada',
  reopened: 'Reabierta',
};

export const getMicroActionInstanceStatusLabel = (status) => {
  const normalized = status?.toLowerCase().trim();
  return microActionInstanceStatusLabels[normalized] || status;
};


/* =========================================================
   FORMAT MICRO ACTION CODE
   ========================================================= */
export const formatRouteCode = (code) => {
  if (!code) return '-';

  const parts = code.split('_');

  const prefix = parts[0];

  // MAD_3_2_1
  if (prefix === 'MAD' && parts.length === 4) {
    const [, tramo, categoria, microAction] = parts;

    return `T${tramo}-C${categoria}-MA${microAction}`;
  }

  // PAC_3_2
  if (prefix === 'PAC' && parts.length >= 3) {
    const [, tramo, categoria] = parts;

    return `T${tramo}-C${categoria}`;
  }

  return code;
};