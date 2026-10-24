import { request } from './apiClient.js';

export const electionService = {
  list: (signal) => request('/elections', { signal }),
  getById: (id, signal) => request(`/elections/${id}`, { signal }),
  getResults: (id, signal) => request(`/elections/${id}/results`, { signal }),

  create: (payload) => request('/elections', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/elections/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/elections/${id}`, { method: 'DELETE' }),

  addCandidate: (electionId, payload) =>
    request(`/elections/${electionId}/candidates`, { method: 'POST', body: payload }),
  updateCandidate: (candidateId, payload) =>
    request(`/candidates/${candidateId}`, { method: 'PUT', body: payload }),
  removeCandidate: (candidateId) => request(`/candidates/${candidateId}`, { method: 'DELETE' }),
};
