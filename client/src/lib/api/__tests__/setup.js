import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server.js';

process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:3000/api/v1';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
