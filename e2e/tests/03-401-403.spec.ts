import { test, expect } from '@playwright/test';
import { ApiClient } from '../helpers/api';
import {
  getEvaluationIdByProjectName,
  getProjectIdByName,
  getUserIdByEmail,
} from '../helpers/db';
import { USERS } from '../fixtures/users';

const NON_EXISTENT_UUID = '00000000-0000-0000-0000-000000000000';

test.describe('QA-001 · respuestas 401/403 y aislamiento entre organizaciones', () => {
  test('T-06: evaluador no asignado no puede finalizar una evaluación de otra organización', async () => {
    const api = await ApiClient.login(USERS.evaluator);
    try {
      const evaluationB = await getEvaluationIdByProjectName('E2E Project B');

      const response = await api.post('/api/v1/evaluations/finalize', {
        evaluationId: evaluationB,
        evaluationResult: 'approved',
      });

      expect(response.status()).toBe(403);
    } finally {
      await api.dispose();
    }
  });

  test('T-08: rol incorrecto — no-admin no puede cambiar el rol de un usuario', async () => {
    const api = await ApiClient.login(USERS.evaluator);
    try {
      const adminId = await getUserIdByEmail(USERS.admin.email);

      const response = await api.patch(`/api/v1/users/${adminId}/role`, {
        role: 'admin',
        reason: 'Intento no autorizado QA-001',
      });

      expect(response.status()).toBe(403);
    } finally {
      await api.dispose();
    }
  });

  test('T-13: usuario A no puede leer/modificar/borrar el proyecto B (otra organización)', async () => {
    const api = await ApiClient.login(USERS.entrepreneurA);
    try {
      const projectB = await getProjectIdByName('E2E Project B');

      const read = await api.get(`/api/v1/projects/${projectB}`);
      expect(read.status()).toBe(403);

      const update = await api.patch(`/api/v1/projects/${projectB}`, {
        projectName: 'Nombre modificado sin permiso',
      });
      expect(update.status()).toBe(403);

      const remove = await api.delete(`/api/v1/projects/${projectB}`);
      expect(remove.status()).toBe(403);
    } finally {
      await api.dispose();
    }
  });

  test('T-19: recurso inexistente -> 404; recurso ajeno existente -> 403 (sin filtrar detalles)', async () => {
    const api = await ApiClient.login(USERS.entrepreneurA);
    try {
      const missing = await api.get(`/api/v1/projects/${NON_EXISTENT_UUID}`);
      expect(missing.status()).toBe(404);

      const projectB = await getProjectIdByName('E2E Project B');
      const foreign = await api.get(`/api/v1/projects/${projectB}`);
      expect(foreign.status()).toBe(403);
    } finally {
      await api.dispose();
    }
  });
});
