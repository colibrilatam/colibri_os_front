import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCsrfToken,
  attachCsrfHeader,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
} from '../csrf';

function clearCsrfCookie() {
  document.cookie = `${CSRF_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function setCsrfCookie(value) {
  document.cookie = `${CSRF_COOKIE_NAME}=${value}; path=/`;
}

describe('CSRF double-submit (QA-001)', () => {
  beforeEach(() => {
    clearCsrfCookie();
  });

  it('getCsrfToken devuelve null cuando no hay cookie', () => {
    expect(getCsrfToken()).toBeNull();
  });

  it('getCsrfToken lee el valor de la cookie csrf_token', () => {
    setCsrfCookie('token-abc');
    expect(getCsrfToken()).toBe('token-abc');
  });

  it('añade X-CSRF-Token en POST cuando hay cookie', () => {
    setCsrfCookie('token-abc');
    const config = attachCsrfHeader({ method: 'post', headers: {} });
    expect(config.headers[CSRF_HEADER_NAME]).toBe('token-abc');
  });

  it('añade el header también en PATCH/PUT/DELETE', () => {
    setCsrfCookie('token-abc');
    for (const method of ['patch', 'put', 'delete']) {
      const config = attachCsrfHeader({ method, headers: {} });
      expect(config.headers[CSRF_HEADER_NAME]).toBe('token-abc');
    }
  });

  it('NO añade el header en GET', () => {
    setCsrfCookie('token-abc');
    const config = attachCsrfHeader({ method: 'get', headers: {} });
    expect(config.headers[CSRF_HEADER_NAME]).toBeUndefined();
  });

  it('NO añade el header si no hay cookie', () => {
    const config = attachCsrfHeader({ method: 'post', headers: {} });
    expect(config.headers[CSRF_HEADER_NAME]).toBeUndefined();
  });

  it('usa headers.set cuando está disponible (AxiosHeaders)', () => {
    setCsrfCookie('token-abc');
    const stored = {};
    const config = {
      method: 'post',
      headers: { set: (name, value) => { stored[name] = value; } },
    };
    attachCsrfHeader(config);
    expect(stored[CSRF_HEADER_NAME]).toBe('token-abc');
  });
});
