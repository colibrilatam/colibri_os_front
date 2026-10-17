import { test, expect } from '@playwright/test';
import { ApiClient } from '../../helpers/api';
import { USERS } from '../../fixtures/users';

const NON_EXISTENT_UUID = '00000000-0000-0000-0000-000000000000';

/**
 * T-16: CSRF double-submit.
 *
 * Usamos DELETE de un proyecto inexistente como sonda mutante:
 *  - sin header CSRF  -> 403 (rechazado por CsrfGuard)
 *  - header manipulado -> 403
 *  - header válido     -> 404 (CSRF pasa; luego la autorización resuelve 404)
 */
test.describe('QA-001 · CSRF (double-submit cookie)', () => {
  test('T-16: sin X-CSRF-Token devuelve 403', async () => {
    const api = await ApiClient.login(USERS.entrepreneurA);
    try {
      const response = await api.delete(`/api/v1/projects/${NON_EXISTENT_UUID}`, {
        csrf: false,
      });
      expect(response.status()).toBe(403);
    } finally {
      await api.dispose();
    }
  });

  test('T-16: header manipulado devuelve 403', async () => {
    const api = await ApiClient.login(USERS.entrepreneurA);
    try {
      const response = await api.delete(`/api/v1/projects/${NON_EXISTENT_UUID}`, {
        headers: { 'x-csrf-token': 'valor-manipulado' },
      });
      expect(response.status()).toBe(403);
    } finally {
      await api.dispose();
    }
  });

  test('T-16: header válido pasa el guard CSRF (404 del recurso, no 403)', async () => {
    const api = await ApiClient.login(USERS.entrepreneurA);
    try {
      const response = await api.delete(`/api/v1/projects/${NON_EXISTENT_UUID}`);
      expect(response.status()).toBe(404);
    } finally {
      await api.dispose();
    }
  });

  test('T-16: GET no requiere CSRF', async () => {
    const api = await ApiClient.login(USERS.entrepreneurA);
    try {
      const response = await api.get('/api/v1/projects');
      expect(response.status()).toBe(200);
    } finally {
      await api.dispose();
    }
  });
});
