import { afterEach, describe, expect, it, vi } from 'vitest';
import { setupStore } from '../../../test-utils.jsx';
import { getAccessToken, putAccessToken } from '../../../helpers/apiHelper.js';
import { authApi } from '../api/authApi.js';
import { asyncAuthProfile, asyncAuthRegister } from './authSlice.js';

const user = { id: 1, nim: '11S24001', name: 'Mahasiswa Uji', role: 'student' };

describe('authSlice: thunk tambahan', () => {
  afterEach(() => vi.restoreAllMocks());

  it('memulihkan sesi dari profil server', async () => {
    vi.spyOn(authApi, 'profile').mockResolvedValue(user);
    const store = setupStore();

    await store.dispatch(asyncAuthProfile());

    expect(store.getState().auth.user).toEqual(user);
    expect(store.getState().auth.isPreload).toBe(false);
  });

  it('menghapus token ketika profil ditolak server', async () => {
    putAccessToken('token-kedaluwarsa');
    vi.spyOn(authApi, 'profile').mockRejectedValue(new Error('Token tidak valid'));
    const store = setupStore();

    await store.dispatch(asyncAuthProfile());

    expect(getAccessToken()).toBeNull();
    expect(store.getState().auth.user).toBeNull();
  });

  it('menyimpan pengguna setelah registrasi dan pesan bawaan saat gagal', async () => {
    vi.spyOn(authApi, 'register')
      .mockResolvedValueOnce({ token: 'token-baru', user })
      .mockRejectedValueOnce({});
    const store = setupStore();

    await store.dispatch(asyncAuthRegister({ nim: '11S24001', name: 'Uji', password: 'abc12345' }));
    expect(store.getState().auth.user).toEqual(user);
    expect(getAccessToken()).toBe('token-baru');

    await store.dispatch(asyncAuthRegister({ nim: '11S24001', name: 'Uji', password: 'abc12345' }));
    expect(store.getState().auth.error).toBe('Terjadi kesalahan pada server.');
  });
});
