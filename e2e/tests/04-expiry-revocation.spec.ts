import jwt from 'jsonwebtoken';
import { test, expect, request as playwrightRequest } from '@playwright/test';
import { ApiClient } from '../helpers/api';
import { getUserIdByEmail } from '../helpers/db';
import { BACKEND_URL, decodeJwtPayload } from '../fixtures/auth';
import { USERS } from '../fixtures/users';

test.describe('QA-001 · expiración y revocación de sesión', () => {
  test('T-09: token expirado devuelve 401', async () => {
    const api = await ApiClient.login(USERS.entrepreneurA);
    try {
      const payload = decodeJwtPayload(api.accessToken!);
      const now = Math.floor(Date.now() / 1000);

      const expiredToken = jwt.sign(
        { ...payload, iat: now - 7200, exp: now - 3600 },
        process.env.E2E_JWT_SECRET!,
      );

      const replay = await playwrightRequest.newContext({
        baseURL: BACKEND_URL,
        extraHTTPHeaders: { cookie: `colibri_access_token=${expiredToken}` },
      });

      try {
        const response = await replay.get('/api/v1/users/profile', {
          failOnStatusCode: false,
        });
        expect(response.status()).toBe(401);
      } finally {
        await replay.dispose();
      }
    } finally {
      await api.dispose();
    }
  });

  test('T-10: suspender al usuario revoca su sesión (401)', async () => {
    const target = await ApiClient.login(USERS.guest);
    const admin = await ApiClient.login(USERS.admin);

    try {
      const guestId = await getUserIdByEmail(USERS.guest.email);

      const suspend = await admin.patch(`/api/v1/users/${guestId}/status`, {
        status: 'suspended',
        reason: 'QA-001 T-10',
      });
      expect(suspend.status()).toBe(200);

      const after = await target.get('/api/v1/users/profile');
      expect(after.status()).toBe(401);
    } finally {
      await target.dispose();
      await admin.dispose();
    }
  });

  test('T-11: cambiar el rol revoca la sesión previa (401)', async () => {
    const target = await ApiClient.login(USERS.revocation);
    const admin = await ApiClient.login(USERS.admin);

    try {
      const revocationId = await getUserIdByEmail(USERS.revocation.email);

      const changeRole = await admin.patch(`/api/v1/users/${revocationId}/role`, {
        role: 'mentor',
        reason: 'QA-001 T-11',
      });
      expect(changeRole.status()).toBe(200);

      const after = await target.get('/api/v1/users/profile');
      expect(after.status()).toBe(401);
    } finally {
      await target.dispose();
      await admin.dispose();
    }
  });

  test('T-14: reutilizar una sesión cerrada devuelve 401', async () => {
    const api = await ApiClient.login(USERS.revocation);
    const capturedToken = api.accessToken!;

    try {
      const before = await api.get('/api/v1/users/profile');
      expect(before.status()).toBe(200);

      const logout = await api.post('/api/v1/auth/logout', {});
      expect(logout.status()).toBe(200);

      // Replay del token capturado ANTES del logout, en un contexto nuevo.
      const replay = await playwrightRequest.newContext({
        baseURL: BACKEND_URL,
        extraHTTPHeaders: { cookie: `colibri_access_token=${capturedToken}` },
      });

      try {
        const after = await replay.get('/api/v1/users/profile', {
          failOnStatusCode: false,
        });
        expect(after.status()).toBe(401);
      } finally {
        await replay.dispose();
      }
    } finally {
      await api.dispose();
    }
  });

  test('T-20: tras revocar, un login nuevo funciona y el token viejo sigue inválido', async () => {
    const api = await ApiClient.login(USERS.revocation);
    const capturedToken = api.accessToken!;

    try {
      await api.post('/api/v1/auth/logout', {});

      const fresh = await ApiClient.login(USERS.revocation);
      try {
        const freshProfile = await fresh.get('/api/v1/users/profile');
        expect(freshProfile.status()).toBe(200);
      } finally {
        await fresh.dispose();
      }

      const replay = await playwrightRequest.newContext({
        baseURL: BACKEND_URL,
        extraHTTPHeaders: { cookie: `colibri_access_token=${capturedToken}` },
      });
      try {
        const stale = await replay.get('/api/v1/users/profile', {
          failOnStatusCode: false,
        });
        expect(stale.status()).toBe(401);
      } finally {
        await replay.dispose();
      }
    } finally {
      await api.dispose();
    }
  });
});
