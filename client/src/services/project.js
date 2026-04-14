import { fetcher } from '@/lib/fetcher';

export const projectsService = {
  getAll: () =>
    fetcher('/projects'),

  getById: (id) =>
    fetcher(`/projects/${id}`),
  // cache , { next: { revalidate: 30 } }

  create: (data) =>
    fetcher('/projects', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    fetcher(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    fetcher(`/projects/${id}`, { method: 'DELETE' }),
};