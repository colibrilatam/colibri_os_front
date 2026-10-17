import { test, expect } from '@playwright/test';
import { ApiClient } from '../helpers/api';

test.describe('QA-001 · usuario anónimo', () => {
  test('T-01: ruta protegida sin sesión exige iniciar sesión', async ({ page }) => {
    await page.goto('/proyecto');

    await expect(page.getByText(/Debes iniciar sesión/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
  });

  test('T-02: endpoint protegido sin cookie responde 401', async () => {
    const api = await ApiClient.anonymous();
    try {
      const response = await api.get('/api/v1/projects');
      expect(response.status()).toBe(401);
    } finally {
      await api.dispose();
    }
  });
});
