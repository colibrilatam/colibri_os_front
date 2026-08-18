import { apiClient } from '@/lib/api';

export const microActionService = {
  createVersion: async (instanceId, { file, executionNotes }) => {
    const body = new FormData();
    body.append('file', file);
    if (executionNotes !== null && executionNotes !== undefined && executionNotes !== '') {
      body.append('executionNotes', executionNotes);
    }
    const response = await apiClient.post(
      `/micro-action-instances/${instanceId}/versions`,
      body,
    );
    return response.data;
  },
}