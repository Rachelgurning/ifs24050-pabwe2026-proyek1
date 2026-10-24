import { fetchApi } from '../../../helpers/apiHelper.js';

/** Integrasi endpoint pemilihan VoteDel. */
export const electionApi = {
  list: (signal) => fetchApi('/elections', { signal }),
  detail: (id, signal) => fetchApi(`/elections/${id}`, { signal }),
  results: (id, signal) => fetchApi(`/elections/${id}/results`, { signal }),

  create: (payload) => fetchApi('/elections', { method: 'POST', body: payload }),
  update: (id, payload) => fetchApi(`/elections/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => fetchApi(`/elections/${id}`, { method: 'DELETE' }),
};
