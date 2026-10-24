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
