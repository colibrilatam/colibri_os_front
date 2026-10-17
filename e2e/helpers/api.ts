import {
  type APIRequestContext,
  type APIResponse,
  request as playwrightRequest,
} from '@playwright/test';
import { BACKEND_URL, ACCESS_COOKIE, CSRF_COOKIE } from '../fixtures/auth';
import { E2E_PASSWORD, type E2EUser } from '../fixtures/users';

interface MutateOptions {
  /** Si es false, no envía el header CSRF (para el caso negativo T-16). */
  csrf?: boolean;
  headers?: Record<string, string>;
}

/**
 * Cliente API para Playwright.
 *
 * Mantiene el cookie jar del APIRequestContext: tras `login()`, cada request
 * envía automáticamente `colibri_access_token` y `csrf_token`. En las requests
 * mutantes agrega `X-CSRF-Token` (doble submit) salvo que se pida lo contrario.
 */
export class ApiClient {
  private constructor(
    private readonly ctx: APIRequestContext,
    public readonly csrfToken: string,
    public readonly accessToken?: string,
  ) {}

  static async anonymous(): Promise<ApiClient> {
    const ctx = await playwrightRequest.newContext({ baseURL: BACKEND_URL });
    return new ApiClient(ctx, '');
  }

  static async login(user: E2EUser): Promise<ApiClient> {
    const ctx = await playwrightRequest.newContext({ baseURL: BACKEND_URL });
    const response = await ctx.post('/api/v1/auth/signin', {
      data: { email: user.email, password: E2E_PASSWORD },
      failOnStatusCode: false,
    });

    if (![200, 201].includes(response.status())) {
      throw new Error(`Login API falló para ${user.email}: HTTP ${response.status()}`);
    }

    const state = await ctx.storageState();
    const csrfToken = state.cookies.find((cookie) => cookie.name === CSRF_COOKIE)?.value ?? '';
    const accessToken = state.cookies.find((cookie) => cookie.name === ACCESS_COOKIE)?.value;

    return new ApiClient(ctx, csrfToken, accessToken);
  }

  get(path: string): Promise<APIResponse> {
    return this.ctx.get(path, { failOnStatusCode: false });
  }

  mutate(
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    data?: unknown,
    options: MutateOptions = {},
  ): Promise<APIResponse> {
    const headers: Record<string, string> = { ...(options.headers ?? {}) };
    if (options.csrf !== false && this.csrfToken && !headers['x-csrf-token']) {
      headers['x-csrf-token'] = this.csrfToken;
    }

    return this.ctx.fetch(new URL(path, BACKEND_URL).toString(), {
      method,
      data,
      headers,
      failOnStatusCode: false,
    });
  }

  post(path: string, data?: unknown, options?: MutateOptions): Promise<APIResponse> {
    return this.mutate('POST', path, data, options);
  }

  patch(path: string, data?: unknown, options?: MutateOptions): Promise<APIResponse> {
    return this.mutate('PATCH', path, data, options);
  }

  delete(path: string, options?: MutateOptions): Promise<APIResponse> {
    return this.mutate('DELETE', path, undefined, options);
  }

  async dispose(): Promise<void> {
    await this.ctx.dispose();
  }
}
