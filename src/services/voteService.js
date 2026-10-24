import { request } from './apiClient.js';

export const voteService = {
  cast: (electionId, candidateId) =>
    request(`/elections/${electionId}/votes`, { method: 'POST', body: { candidateId } }),

  history: (signal) => request('/votes/me', { signal }),
};
