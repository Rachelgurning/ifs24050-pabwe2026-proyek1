import { fetchApi } from '../../../helpers/apiHelper.js';

/** Integrasi endpoint autentikasi VoteDel. */
export const authApi = {
  login: ({ nim, password }) => fetchApi('/auth/login', { method: 'POST', body: { nim, password } }),

  register: ({ nim, name, password }) =>
    fetchApi('/auth/register', { method: 'POST', body: { nim, name, password } }),

  profile: (signal) => fetchApi('/auth/me', { signal }),
};
