import { test, expect } from '@playwright/test';
import { loginViaUi, readSessionCookies } from '../../fixtures/auth';
import { USERS } from '../../fixtures/users';

/**
 * T-21: atributos de las cookies de sesión y CSRF.
 *  - `colibri_access_token`: HttpOnly, path /, SameSite Lax (NODE_ENV=test),
 *    no accesible desde document.cookie.
 *  - `csrf_token`: legible por JS (necesario para el doble submit).
 */
test.describe('QA-001 · cookies de sesión y CSRF', () => {
  test('T-21: la cookie de sesión es HttpOnly y la de CSRF es legible', async ({
    page,
    context,
  }) => {
    await loginViaUi(page, USERS.entrepreneurA);
    await expect(page).toHaveURL(/\/proyecto/);

    const { access, csrf } = await readSessionCookies(context);

    expect(access).toBeDefined();
    expect(access?.httpOnly).toBe(true);
    expect(access?.path).toBe('/');
    expect(access?.sameSite).toBe('Lax');

    expect(csrf).toBeDefined();
    expect(csrf?.httpOnly).toBe(false);
    expect(csrf?.path).toBe('/');

    const jsCookies = await page.evaluate(() => document.cookie);
    expect(jsCookies).not.toContain('colibri_access_token');
    expect(jsCookies).toContain('csrf_token');
  });
});
