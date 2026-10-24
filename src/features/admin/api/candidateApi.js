import { fetchApi } from '../../../helpers/apiHelper.js';

/** Integrasi endpoint kandidat (khusus administrator). */
export const candidateApi = {
  add: (electionId, payload) =>
    fetchApi(`/elections/${electionId}/candidates`, { method: 'POST', body: payload }),
  update: (candidateId, payload) =>
    fetchApi(`/candidates/${candidateId}`, { method: 'PUT', body: payload }),
  remove: (candidateId) => fetchApi(`/candidates/${candidateId}`, { method: 'DELETE' }),
};
