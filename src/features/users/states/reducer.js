import { USERS_LOADED } from './action.js';
export function usersReducer(state = { items: [] }, action = {}) { return action.type === USERS_LOADED ? { ...state, items: action.payload } : state; }
export default usersReducer;
