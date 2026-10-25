import PropTypes from 'prop-types';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import authReducer from './features/auth/states/authSlice.js';
import electionReducer from './features/elections/states/electionSlice.js';
import voteReducer from './features/votes/states/voteSlice.js';

/** Membuat store terisolasi untuk setiap skenario pengujian. */
export function setupStore(preloadedState) {
  return configureStore({
    reducer: { auth: authReducer, elections: electionReducer, votes: voteReducer },
    preloadedState,
  });
}

/** Merender komponen lengkap dengan Redux store dan router in-memory. */
export function renderWithProviders(
  ui,
  { preloadedState, store = setupStore(preloadedState), route = '/', ...options } = {},
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  Wrapper.propTypes = { children: PropTypes.node };

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}

export * from '@testing-library/react';

/** State auth siap pakai untuk skenario pengguna tamu, mahasiswa, atau admin. */
export function authState(user = null) {
  return { user, isPreload: false, isAuthLogin: false, isAuthRegister: false, error: null };
}

export const studentUser = { id: 1, nim: '11S24001', name: 'Mahasiswa Uji', role: 'student' };
export const adminUser = { id: 9, nim: 'admin01', name: 'Admin Uji', role: 'admin' };

export const candidatesFixture = [
  { id: 11, number: 1, name: 'Kandidat Satu', vision: 'Visi satu', mission: 'Misi satu' },
  { id: 12, number: 2, name: 'Kandidat Dua', vision: '', mission: '' },
];

export function electionFixture(overrides = {}) {
  return {
    id: 1,
    title: 'Pemilihan Ketua BEM',
    description: 'Periode 2026/2027',
    startAt: '2026-10-01T01:00:00.000Z',
    endAt: '2026-10-31T01:00:00.000Z',
    status: 'active',
    candidateCount: 2,
    totalVotes: 0,
    hasVoted: false,
    candidates: candidatesFixture,
    ...overrides,
  };
}
