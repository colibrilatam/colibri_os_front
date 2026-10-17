/**
 * Usuarios sembrados por `colibri_os_back/src/database/seeds/seed-e2e.ts`.
 * Las credenciales se leen del entorno (.env.e2e) para no hardcodear secretos.
 */

export interface E2EUser {
  key: string;
  email: string;
  role: string;
  label: string;
}

export const E2E_PASSWORD = process.env.E2E_PASSWORD ?? 'E2e@Passw0rd!';

export const USERS: Record<string, E2EUser> = {
  admin: {
    key: 'admin',
    email: process.env.E2E_ADMIN_EMAIL ?? 'admin@e2e.colibri',
    role: 'admin',
    label: 'Administrador',
  },
  entrepreneurA: {
    key: 'entrepreneurA',
    email: process.env.E2E_ENTREPRENEUR_A_EMAIL ?? 'entrepreneur-a@e2e.colibri',
    role: 'entrepreneur',
    label: 'Emprendedor A (owner proyecto A)',
  },
  entrepreneurB: {
    key: 'entrepreneurB',
    email: process.env.E2E_ENTREPRENEUR_B_EMAIL ?? 'entrepreneur-b@e2e.colibri',
    role: 'entrepreneur',
    label: 'Emprendedor B (owner proyecto B)',
  },
  evaluator: {
    key: 'evaluator',
    email: process.env.E2E_EVALUATOR_EMAIL ?? 'evaluator@e2e.colibri',
    role: 'evaluator',
    label: 'Evaluador (asignado a A)',
  },
  mentor: {
    key: 'mentor',
    email: process.env.E2E_MENTOR_EMAIL ?? 'mentor@e2e.colibri',
    role: 'mentor',
    label: 'Mentor (miembro de A)',
  },
  guest: {
    key: 'guest',
    email: process.env.E2E_GUEST_EMAIL ?? 'guest@e2e.colibri',
    role: 'guest',
    label: 'Invitado',
  },
  revocation: {
    key: 'revocation',
    email: process.env.E2E_REVOCATION_EMAIL ?? 'revocation@e2e.colibri',
    role: 'entrepreneur',
    label: 'Usuario dedicado a revocación de sesión',
  },
  googleExisting: {
    key: 'googleExisting',
    email: process.env.E2E_GOOGLE_EXISTING_EMAIL ?? 'google-existing@colibri.test',
    role: 'entrepreneur',
    label: 'Usuario Google existente (ACTIVE)',
  },
};
