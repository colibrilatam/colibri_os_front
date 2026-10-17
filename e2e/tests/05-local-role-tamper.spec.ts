import { test, expect } from '@playwright/test';
import { loginViaUi, readSessionCookies, BACKEND_URL } from '../fixtures/auth';
import { USERS } from '../fixtures/users';
import { dbQuery, getUserIdByEmail } from '../helpers/db';

/**
 * T-12 (prueba negativa N1): modificar el rol local (Zustand/localStorage) NO
 * cambia los permisos reales. El backend sigue denegando la acción admin.
 */
test.describe('QA-001 · manipulación local del rol', () => {
  test('T-12: rol local "admin" no habilita acciones administrativas en el backend', async ({
    page,
    context,
  }) => {
    await loginViaUi(page, USERS.entrepreneurA);
    await expect(page).toHaveURL(/\/proyecto/);

    const session = await readSessionCookies(context);
    const adminId = await getUserIdByEmail(USERS.admin.email);

    // Tamper del estado persistido de Zustand (key `app-state`).
    await page.evaluate(() => {
      const raw = window.localStorage.getItem('app-state');
      const parsed = raw ? JSON.parse(raw) : { state: {}, version: 0 };
      parsed.state = {
        ...(parsed.state ?? {}),
        rol: 'admin',
        user: { ...(parsed.state?.user ?? {}), role: 'admin' },
      };
      window.localStorage.setItem('app-state', JSON.stringify(parsed));
    });

    const storedRole = await page.evaluate(() => {
      const raw = window.localStorage.getItem('app-state');
      return raw ? JSON.parse(raw).state.rol : null;
    });
    expect(storedRole, 'el rol local fue manipulado').toBe('admin');

    // Acción administrativa real usando la cookie de sesión (rol real: entrepreneur).
    const status = await page.evaluate(
      async ({ backendUrl, adminId: targetId, csrf }) => {
        const response = await fetch(`${backendUrl}/api/v1/users/${targetId}/role`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'content-type': 'application/json',
            'x-csrf-token': csrf,
          },
          body: JSON.stringify({ role: 'admin', reason: 'local role tamper attempt' }),
        });
        return response.status;
      },
      { backendUrl: BACKEND_URL, adminId, csrf: session.csrf!.value },
    );

    expect(status, 'el backend debe denegar la escalada').toBe(403);

    const rows = await dbQuery<{ role: string }>('SELECT role FROM users WHERE id = $1', [adminId]);
    expect(rows[0].role, 'el rol en DB no cambia').toBe('admin');
  });
});
