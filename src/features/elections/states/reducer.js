import { ELECTIONS_LOADED, VOTE_SUBMITTED } from './action.js';
export function electionsReducer(state = { items: [], lastVote: null }, action = {}) { if (action.type === ELECTIONS_LOADED) return { ...state, items: action.payload }; if (action.type === VOTE_SUBMITTED) return { ...state, lastVote: action.payload }; return state; }
export default electionsReducer;
