import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import authReducer, {
  asyncAuthLogin,
  asyncAuthProfile,
  asyncAuthRegister,
  authErrorCleared,
  authLogout,
  selectIsAdmin,
  selectIsAuthenticated,
} from './authSlice.js';
import { getAccessToken, putAccessToken, removeAccessToken } from '../../../helpers/apiHelper.js';
import { authApi } from '../api/authApi.js';

const student = { id: 1, nim: '11S24001', name: 'Mahasiswa Uji', role: 'student' };
const admin = { ...student, id: 2, nim: 'ADMIN', role: 'admin' };

function initialState() {
  return authReducer(undefined, { type: '@@INIT' });
}

describe('authSlice: reducer', () => {
  afterEach(() => removeAccessToken());

  it('menyimpan pengguna setelah login berhasil', () => {
    const state = authReducer(initialState(), {
      type: asyncAuthLogin.fulfilled.type,
      payload: student,
    });

    expect(state.user).toEqual(student);
    expect(state.isAuthLogin).toBe(false);
    expect(selectIsAuthenticated({ auth: state })).toBe(true);
  });

  it('menandai peran admin', () => {
    const state = authReducer(initialState(), {
      type: asyncAuthRegister.fulfilled.type,
      payload: admin,
    });

    expect(selectIsAdmin({ auth: state })).toBe(true);
  });

  it('menyimpan pesan kesalahan login dan dapat dibersihkan', () => {
    const failed = authReducer(initialState(), {
      type: asyncAuthLogin.rejected.type,
      payload: 'NIM atau kata sandi salah.',
    });
    expect(failed.error).toBe('NIM atau kata sandi salah.');

    expect(authReducer(failed, authErrorCleared()).error).toBeNull();
  });

  it('menghapus token dan pengguna ketika logout', () => {
    putAccessToken('token-123');
    const loggedIn = authReducer(initialState(), {
      type: asyncAuthLogin.fulfilled.type,
      payload: student,
    });

    const state = authReducer(loggedIn, authLogout());

    expect(state.user).toBeNull();
    expect(getAccessToken()).toBeNull();
  });

  it('mengakhiri preload ketika pemulihan sesi gagal', () => {
    const state = authReducer(initialState(), { type: asyncAuthProfile.rejected.type });

    expect(state.isPreload).toBe(false);
    expect(state.user).toBeNull();
  });
});

describe('authSlice: async thunk', () => {
  beforeEach(() => removeAccessToken());
  afterEach(() => vi.restoreAllMocks());

  it('menyimpan access token setelah login berhasil', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValue({ token: 'token-abc', user: student });
    const dispatch = vi.fn();

    const result = await asyncAuthLogin({ nim: '11S24001', password: 'Rahasia123' })(
      dispatch,
      () => ({}),
      undefined,
    );

    expect(result.payload).toEqual(student);
    expect(getAccessToken()).toBe('token-abc');
  });

  it('mengembalikan pesan kesalahan ketika kredensial salah', async () => {
    vi.spyOn(authApi, 'login').mockRejectedValue(new Error('NIM atau kata sandi salah.'));
    const dispatch = vi.fn();

    const result = await asyncAuthLogin({ nim: 'x', password: 'y' })(dispatch, () => ({}), undefined);

    expect(result.payload).toBe('NIM atau kata sandi salah.');
    expect(getAccessToken()).toBeNull();
  });
});
