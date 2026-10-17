import { test, expect } from '@playwright/test';
import { ApiClient } from '../helpers/api';
import { obtainGoogleExchangeCode } from '../helpers/oauth-fake';
import { readSessionCookies } from '../fixtures/auth';
import { USERS } from '../fixtures/users';

test.describe('QA-001 · Google OAuth (fake provider)', () => {
  test('T-17: el callback redirige solo con code (sin tokens en la URL) y el login completa', async ({
    page,
    context,
  }) => {
    const { code, frontendLocation } = await obtainGoogleExchangeCode({
      email: USERS.googleExisting.email,
    });

    const url = new URL(frontendLocation);
    expect([...url.searchParams.keys()]).toEqual(['code']);
    expect(frontendLocation).not.toMatch(/tempToken|role|jwt|eyJ|access_token|refresh_token/i);

    await page.goto(`/login/google-callback?code=${encodeURIComponent(code)}`);
    await page.waitForURL(/\/proyecto/, { timeout: 20_000 });

    // La URL final no conserva el code.
    expect(new URL(page.url()).searchParams.has('code')).toBe(false);

    const session = await readSessionCookies(context);
    expect(session.access).toBeDefined();
    expect(session.access?.httpOnly).toBe(true);
  });

  test('T-18: el código de intercambio es de un solo uso', async () => {
    const { code } = await obtainGoogleExchangeCode({ email: USERS.googleExisting.email });

    const api = await ApiClient.anonymous();
    try {
      const first = await api.post('/api/v1/auth/google/exchange', { code });
      expect(first.status()).toBe(200);

      const replay = await api.post('/api/v1/auth/google/exchange', { code });
      expect(replay.status()).toBe(401);
    } finally {
      await api.dispose();
    }
  });

  test('T-22: usuario nuevo (PENDING_PROFILE) completa perfil sin persistir el token en storage', async ({
    page,
  }) => {
    const email = `new-google-${Date.now()}@colibri.test`;
    const { code } = await obtainGoogleExchangeCode({ email });

    await page.goto(`/login/google-callback?code=${encodeURIComponent(code)}`);

    await expect(page.getByText(/Completa tu perfil/i)).toBeVisible();

    await page.locator('select#gender').selectOption('male');
    await page.getByRole('button', { name: /Continuar como Emprendedor/i }).click();
    await page.locator('form button[type="submit"]').click();

    await page.waitForURL(/\/proyecto/, { timeout: 20_000 });

    const storage = await page.evaluate(() => ({
      local: JSON.stringify(window.localStorage),
      session: JSON.stringify(window.sessionStorage),
    }));
    expect(storage.local).not.toContain('profileCompletionToken');
    expect(storage.session).not.toContain('profileCompletionToken');
    expect(new URL(page.url()).searchParams.has('code')).toBe(false);
  });
});
