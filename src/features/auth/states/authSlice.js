import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi.js';
import { getAccessToken, putAccessToken, removeAccessToken } from '../../../helpers/apiHelper.js';

export const AUTH_ACTION_TYPE = Object.freeze({
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  PROFILE: 'auth/profile',
  LOGOUT: 'auth/logout',
});

const initialState = {
  user: null,
  // Sesi dipulihkan lebih dulu bila token masih tersimpan di localStorage.
  isPreload: Boolean(getAccessToken()),
  isAuthLogin: false,
  isAuthRegister: false,
  error: null,
};

function toMessage(error) {
  return error?.message ?? 'Terjadi kesalahan pada server.';
}

export const asyncAuthLogin = createAsyncThunk(
  AUTH_ACTION_TYPE.LOGIN,
  async (credentials, { rejectWithValue }) => {
    try {
      const { token, user } = await authApi.login(credentials);
      putAccessToken(token);
      return user;
    } catch (error) {
      return rejectWithValue(toMessage(error));
    }
  },
);

export const asyncAuthRegister = createAsyncThunk(
  AUTH_ACTION_TYPE.REGISTER,
  async (payload, { rejectWithValue }) => {
    try {
      const { token, user } = await authApi.register(payload);
      putAccessToken(token);
      return user;
    } catch (error) {
      return rejectWithValue(toMessage(error));
    }
  },
);

export const asyncAuthProfile = createAsyncThunk(
  AUTH_ACTION_TYPE.PROFILE,
  async (_arg, { rejectWithValue }) => {
    try {
      return await authApi.profile();
    } catch (error) {
      removeAccessToken();
      return rejectWithValue(toMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLogout(state) {
      removeAccessToken();
      state.user = null;
      state.isPreload = false;
      state.error = null;
    },
    authErrorCleared(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncAuthLogin.pending, (state) => {
        state.isAuthLogin = true;
        state.error = null;
      })
      .addCase(asyncAuthLogin.fulfilled, (state, action) => {
        state.isAuthLogin = false;
        state.user = action.payload;
      })
      .addCase(asyncAuthLogin.rejected, (state, action) => {
        state.isAuthLogin = false;
        state.error = action.payload;
      })
      .addCase(asyncAuthRegister.pending, (state) => {
        state.isAuthRegister = true;
        state.error = null;
      })
      .addCase(asyncAuthRegister.fulfilled, (state, action) => {
        state.isAuthRegister = false;
        state.user = action.payload;
      })
      .addCase(asyncAuthRegister.rejected, (state, action) => {
        state.isAuthRegister = false;
        state.error = action.payload;
      })
      .addCase(asyncAuthProfile.pending, (state) => {
        state.isPreload = true;
      })
      .addCase(asyncAuthProfile.fulfilled, (state, action) => {
        state.isPreload = false;
        state.user = action.payload;
      })
      .addCase(asyncAuthProfile.rejected, (state) => {
        state.isPreload = false;
        state.user = null;
      });
  },
});

export const { authLogout, authErrorCleared } = authSlice.actions;

export const selectAuthUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsPreload = (state) => state.auth.isPreload;

export default authSlice.reducer;
