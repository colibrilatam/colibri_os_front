import { fetcher } from '@/lib/fetcher';

export const evidencesService = {
    submit: (evidenceId) => fetcher(`/evidence/${evidenceId}/submit`, { method: 'POST' }),
    
    createEvaluation: (data) => fetcher('/evaluations', { method: 'POST', body: JSON.stringify(data) }),

    getActiveRubrics: () => fetcher('/evaluations/rubrics/active', { method: 'GET' }),

    closeEvaluation: (data) => fetcher('/evaluations/finalize', { method: 'POST', body: JSON.stringify(data) }),
}