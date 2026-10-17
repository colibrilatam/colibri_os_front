import { test, expect } from '@playwright/test';
import { ApiClient } from '../helpers/api';
import { loginViaUi, readSessionCookies } from '../fixtures/auth';
import { USERS } from '../fixtures/users';

test.describe('QA-001 · login y cobertura por rol', () => {
  test('T-03: login real por UI (usuario) setea cookie HttpOnly y redirige', async ({
    page,
    context,
  }) => {
    await loginViaUi(page, USERS.entrepreneurA);

    await expect(page).toHaveURL(/\/proyecto/);

    const session = await readSessionCookies(context);
    expect(session.access, 'cookie de sesión').toBeDefined();
    expect(session.access?.httpOnly).toBe(true);
    expect(session.access?.path).toBe('/');
    expect(session.csrf, 'cookie CSRF').toBeDefined();
    expect(session.csrf?.httpOnly).toBe(false);

    const jsCookies = await page.evaluate(() => document.cookie);
    expect(jsCookies).not.toContain('colibri_access_token');
    expect(jsCookies).toContain('csrf_token');
  });

  test('T-04: usuario accede a su propio proyecto', async () => {
    const api = await ApiClient.login(USERS.entrepreneurA);
    try {
      const response = await api.get('/api/v1/projects');
      expect(response.status()).toBe(200);

      const projects = (await response.json()) as Array<{ projectName: string }>;
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.some((project) => project.projectName === 'E2E Project A')).toBe(true);
    } finally {
      await api.dispose();
    }
  });

  test('T-05: evaluador ve sus evaluaciones asignadas', async () => {
    const api = await ApiClient.login(USERS.evaluator);
    try {
      const response = await api.get('/api/v1/evaluations/pending-reviews');
      expect(response.status()).toBe(200);

      const pending = (await response.json()) as unknown[];
      expect(Array.isArray(pending)).toBe(true);
      expect(pending.length).toBeGreaterThan(0);
    } finally {
      await api.dispose();
    }
  });

  test('T-07: administrador accede a administración de usuarios', async () => {
    const api = await ApiClient.login(USERS.admin);
    try {
      const usersResponse = await api.get('/api/v1/users');
      expect(usersResponse.status()).toBe(200);

      const users = (await usersResponse.json()) as Array<{ email: string }>;
      expect(users.some((user) => user.email === USERS.admin.email)).toBe(true);

      const profileResponse = await api.get('/api/v1/users/profile');
      const profile = (await profileResponse.json()) as { permissions?: string[] };
      expect(profile.permissions).toContain('admin:access');
    } finally {
      await api.dispose();
    }
  });

  test('T-15: logout por UI limpia la cookie de sesión', async ({ page, context }) => {
    await loginViaUi(page, USERS.revocation);
    await expect(page).toHaveURL(/\/(proyecto|evaluations)/);

    const before = await readSessionCookies(context);
    expect(before.access).toBeDefined();

    await page.getByRole('button', { name: /salir|logout/i }).click();
    await page.waitForURL(/\/login/);

    await expect
      .poll(async () => (await readSessionCookies(context)).access)
      .toBeUndefined();
  });
});
