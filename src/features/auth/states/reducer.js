import { AUTH_LOGIN, AUTH_LOGOUT } from './action.js';
const initialState = { user: null, token: null, isAuthenticated: false };
export function authReducer(state = initialState, action = {}) {
 if (action.type === AUTH_LOGIN) return { ...state, ...action.payload, isAuthenticated: true };
 if (action.type === AUTH_LOGOUT) return initialState;
 return state;
}
export default authReducer;
