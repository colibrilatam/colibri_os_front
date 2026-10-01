import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:3000/api/v1';

let retryCounter = 0;

export function resetRetryCounter() {
  retryCounter = 0;
}

function mockUser(overrides = {}) {
  return {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    fullName: 'Test User',
    role: 'entrepreneur',
    status: 'active',
    provider: 'local',
    linkedinId: null,
    googleId: null,
    cryptoWallet: null,
    credentialsWallet: null,
    adnHash: null,
    bio: null,
    avatar: null,
    gender: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export const handlers = [
  http.get(`${API_BASE}/test/success`, () => {
    return HttpResponse.json({ data: 'ok' });
  }),

  http.get(`${API_BASE}/test/unauthorized`, () => {
    return HttpResponse.json(
      { statusCode: 401, message: 'Unauthorized' },
      { status: 401 }
    );
  }),

  http.get(`${API_BASE}/test/not-found`, () => {
    return HttpResponse.json(
      { statusCode: 404, message: 'Resource not found' },
      { status: 404 }
    );
  }),

  http.get(`${API_BASE}/test/validation`, () => {
    return HttpResponse.json(
      {
        statusCode: 422,
        message: ['email must be an email', 'password is too short'],
        error: 'Validation failed',
      },
      { status: 422 }
    );
  }),

  http.get(`${API_BASE}/test/server-error`, () => {
    return HttpResponse.json(
      { statusCode: 500, message: 'Internal server error' },
      { status: 500 }
    );
  }),

  http.get(`${API_BASE}/test/slow`, async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return HttpResponse.json({ data: 'slow' });
  }),

  http.get(`${API_BASE}/test/retry-then-success`, () => {
    retryCounter++;
    if (retryCounter < 2) {
      return HttpResponse.error();
    }
    return HttpResponse.json({ data: 'recovered', attempt: retryCounter });
  }),

  http.get(`${API_BASE}/test/retry-always-fails`, () => {
    retryCounter++;
    return HttpResponse.error();
  }),

  http.get(`${API_BASE}/test/no-retry-on-4xx`, () => {
    retryCounter++;
    return HttpResponse.json(
      { statusCode: 400, message: 'Bad request' },
      { status: 400 }
    );
  }),

  http.get(`${API_BASE}/users/profile`, () => {
    return HttpResponse.json(mockUser());
  }),

  http.get(`${API_BASE}/users/:id`, ({ params }) => {
    return HttpResponse.json(mockUser({ id: params.id }));
  }),
];

export const server = setupServer(...handlers);
