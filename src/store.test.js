import { describe, expect, it } from 'vitest';
import { store } from './store.js';
import { authLogout } from './features/auth/states/authSlice.js';

describe('store', () => {
  it('memadukan slice auth, elections, dan votes', () => {
    expect(Object.keys(store.getState()).sort()).toEqual(['auth', 'elections', 'votes']);
  });

  it('menyediakan state awal yang konsisten', () => {
    const { auth, elections, votes } = store.getState();

    expect(auth.user).toBeNull();
    expect(elections.elections).toEqual([]);
    expect(votes.history).toEqual([]);
  });

  it('memproses action dari slice yang terdaftar', () => {
    store.dispatch(authLogout());

    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.isPreload).toBe(false);
  });
});
