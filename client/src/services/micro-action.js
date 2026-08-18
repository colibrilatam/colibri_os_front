import { apiClient } from '@/lib/api';

export const microActionService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/micro-action-instances/all', {
      params,
    });

    return response.data;
  },

  createVersion: async (instanceId, { file, executionNotes }) => {
    const body = new FormData();
    body.append('file', file);

    if (
      executionNotes !== null &&
      executionNotes !== undefined &&
      executionNotes !== ''
    ) {
      body.append('executionNotes', executionNotes);
    }

    const response = await apiClient.post(
      `/micro-action-instances/${instanceId}/versions`,
      body,
    );

    return response.data;
  },
};
