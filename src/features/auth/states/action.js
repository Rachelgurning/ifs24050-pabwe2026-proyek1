export const AUTH_LOGIN = 'auth/login';
export const AUTH_LOGOUT = 'auth/logout';
export const authLogin = (user, token) => ({ type: AUTH_LOGIN, payload: { user, token } });
export const authLogout = () => ({ type: AUTH_LOGOUT });
