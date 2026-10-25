import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { setUnauthorizedHandler } from '../services/apiClient.js';
import { authService } from '../services/authService.js';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { USER_ROLES } from '../utils/constants.js';
import { tokenStorage } from '../utils/tokenStorage.js';
import { AuthContext } from './authContext.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(() => Boolean(tokenStorage.get()));

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  const startSession = useCallback(({ token, user: nextUser }) => {
    tokenStorage.set(token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const login = useCallback(
    async (credentials) => startSession(await authService.login(credentials)),
    [startSession],
  );

  const register = useCallback(
    async (payload) => startSession(await authService.register(payload)),
    [startSession],
  );

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    if (!tokenStorage.get()) return undefined;

    const controller = new AbortController();
    authService
      .me(controller.signal)
      .then(setUser)
      .catch((error) => {
        if (error.name !== 'AbortError') tokenStorage.clear();
      })
      .finally(() => {
        if (!controller.signal.aborted) setInitializing(false);
      });

    return () => controller.abort();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === USER_ROLES.ADMIN,
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  );

  // Anak komponen baru dirender setelah sesi dipulihkan, sehingga halaman tidak memuat data dua kali.
  return (
    <AuthContext.Provider value={value}>
      {initializing ? <LoadingState label="Memuat sesi…" /> : children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
