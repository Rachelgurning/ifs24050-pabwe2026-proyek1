import { request } from './apiClient.js';

export const authService = {
  login: ({ nim, password }) => request('/auth/login', { method: 'POST', body: { nim, password } }),

  register: ({ nim, name, password }) =>
    request('/auth/register', { method: 'POST', body: { nim, name, password } }),

  me: (signal) => request('/auth/me', { signal }),
};
