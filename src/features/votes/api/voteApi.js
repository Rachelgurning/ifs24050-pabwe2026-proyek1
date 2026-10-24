import { fetchApi } from '../../../helpers/apiHelper.js';

/** Integrasi endpoint pemberian suara dan riwayat partisipasi. */
export const voteApi = {
  cast: (electionId, candidateId) =>
    fetchApi(`/elections/${electionId}/votes`, { method: 'POST', body: { candidateId } }),

  history: (signal) => fetchApi('/votes/me', { signal }),
};
