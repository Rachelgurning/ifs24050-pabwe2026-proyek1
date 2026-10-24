import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/states/authSlice.js';
import electionReducer from './features/elections/states/electionSlice.js';
import voteReducer from './features/votes/states/voteSlice.js';

/** Single store terpusat yang memadukan seluruh slice reducer fitur VoteDel. */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    elections: electionReducer,
    votes: voteReducer,
  },
});

export default store;
