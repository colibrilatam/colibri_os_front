import { http, HttpResponse } from 'msw';
import { mockAuthResponse, mockProject, mockPaginatedProjects, mockErrorResponse } from '@colibri/contracts/mocks';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api/v1';

export const authHandlers = [
  http.post(`${API_BASE}/auth/signin`, async ({ request }) => {
    const body = await request.json();
    if (!body?.email || !body?.password) {
      return HttpResponse.json(
        mockErrorResponse({ statusCode: 400, message: 'Email y password requeridos' }),
        { status: 400 }
      );
    }
    return HttpResponse.json(mockAuthResponse());
  }),

  http.post(`${API_BASE}/auth/signup`, async ({ request }) => {
    const body = await request.json();
    if (!body?.email || !body?.password || !body?.fullName) {
      return HttpResponse.json(
        mockErrorResponse({ statusCode: 400, message: 'Campos requeridos faltantes' }),
        { status: 400 }
      );
    }
    return HttpResponse.json(
      mockAuthResponse({ message: 'Usuario registrado con exito' }),
      { status: 201 }
    );
  }),
];

export const projectHandlers = [
  http.get(`${API_BASE}/projects`, () => {
    return HttpResponse.json(mockPaginatedProjects());
  }),

  http.get(`${API_BASE}/projects/:id`, ({ params }) => {
    return HttpResponse.json(mockProject({ id: params.id }));
  }),

  http.post(`${API_BASE}/projects`, async ({ request }) => {
    const body = await request.json();
    if (!body?.projectName) {
      return HttpResponse.json(
        mockErrorResponse({ statusCode: 400, message: 'projectName es requerido' }),
        { status: 400 }
      );
    }
    return HttpResponse.json(mockProject({ projectName: body.projectName }), { status: 201 });
  }),

  http.patch(`${API_BASE}/projects/:id`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json(mockProject({ id: params.id, ...body }));
  }),

  http.delete(`${API_BASE}/projects/:id`, () => {
    return HttpResponse.json({ message: 'Proyecto eliminado' });
  }),
];

export const handlers = [...authHandlers, ...projectHandlers];
