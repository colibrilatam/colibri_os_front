import type { BrowserContext, Cookie, Page } from '@playwright/test';
import { E2E_PASSWORD, type E2EUser } from './users';

export const BACKEND_URL = process.env.E2E_BACKEND_URL ?? 'http://localhost:3000';
export const FRONTEND_URL = process.env.E2E_FRONTEND_URL ?? 'http://localhost:3031';

export const ACCESS_COOKIE = 'colibri_access_token';
export const CSRF_COOKIE = 'csrf_token';

export interface SessionCookies {
  access?: Cookie;
  csrf?: Cookie;
  cookieHeader: string;
}

/** Login real por UI (formulario de /login). */
export async function loginViaUi(page: Page, user: E2EUser): Promise<void> {
  await page.goto('/login');
  await page.locator('input[name="email"]').fill(user.email);
  await page.locator('input[name="password"]').fill(E2E_PASSWORD);
  await page.locator('form button[type="submit"]').click();
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 20_000 });
}

/** Lee las cookies de sesión/CSRF del browser context. */
export async function readSessionCookies(context: BrowserContext): Promise<SessionCookies> {
  const cookies = await context.cookies();
  const access = cookies.find((cookie) => cookie.name === ACCESS_COOKIE);
  const csrf = cookies.find((cookie) => cookie.name === CSRF_COOKIE);

  const cookieHeader = [
    access ? `${ACCESS_COOKIE}=${access.value}` : null,
    csrf ? `${CSRF_COOKIE}=${csrf.value}` : null,
  ]
    .filter(Boolean)
    .join('; ');

  return { access, csrf, cookieHeader };
}

/** Inyecta cookies de sesión en un browser context (para tests que no pasan por UI). */
export async function injectSession(context: BrowserContext, session: SessionCookies): Promise<void> {
  const hostname = new URL(FRONTEND_URL).hostname;
  const cookies = [session.access, session.csrf].filter(Boolean) as Cookie[];

  await context.addCookies(
    cookies.map((cookie) => ({
      name: cookie.name,
      value: cookie.value,
      domain: hostname,
      path: '/',
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
    })),
  );
}

/** Decodifica el payload de un JWT (sin verificar firma). Útil para tests de expiración. */
export function decodeJwtPayload(token: string): Record<string, unknown> {
  const [, payload] = token.split('.');
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Record<string, unknown>;
}
