import { request as playwrightRequest } from '@playwright/test';
import { BACKEND_URL } from '../fixtures/auth';

export interface OAuthRedirect {
  code: string;
  frontendLocation: string;
}

/**
 * Driver del fake OAuth provider (backend con E2E_OAUTH_FAKE=true).
 *
 * Recorre el flujo Authorization Code sin llamar a Google:
 *   GET /api/v1/auth/google[?fake_email=...]      -> 302 al callback (state)
 *   GET /api/v1/auth/google/callback?code&state    -> 302 al frontend con ?code
 *
 * Devuelve el `code` de intercambio (aún sin consumir) y la URL final, para
 * poder verificar que no contiene tokens.
 */
export async function obtainGoogleExchangeCode(
  options: { email?: string } = {},
): Promise<OAuthRedirect> {
  const ctx = await playwrightRequest.newContext({
    baseURL: BACKEND_URL,
    maxRedirects: 0,
  });

  try {
    const initiatePath = options.email
      ? `/api/v1/auth/google?fake_email=${encodeURIComponent(options.email)}`
      : '/api/v1/auth/google';

    const initiate = await ctx.get(initiatePath, { failOnStatusCode: false });
    if (initiate.status() !== 302) {
      throw new Error(`Inicio OAuth fake inesperado: HTTP ${initiate.status()}`);
    }

    const callbackLocation = initiate.headers()['location'];
    if (!callbackLocation) throw new Error('El inicio OAuth fake no devolvió Location');

    const callback = await ctx.get(callbackLocation, {
      maxRedirects: 0,
      failOnStatusCode: false,
    });
    if (callback.status() !== 302) {
      throw new Error(`Callback OAuth fake inesperado: HTTP ${callback.status()}`);
    }

    const frontendLocation = callback.headers()['location'];
    if (!frontendLocation) throw new Error('El callback OAuth fake no devolvió Location');

    const code = new URL(frontendLocation).searchParams.get('code');
    if (!code) throw new Error('El callback OAuth fake no incluyó un code');

    return { code, frontendLocation };
  } finally {
    await ctx.dispose();
  }
}
