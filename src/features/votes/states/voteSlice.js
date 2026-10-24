import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { voteApi } from '../api/voteApi.js';

export const VOTE_ACTION_TYPE = Object.freeze({
  CAST: 'votes/cast',
  HISTORY: 'votes/history',
});

const initialState = {
  history: [],
  isHistory: false,
  isVoting: false,
  isVoted: false,
  error: null,
};

const toMessage = (error) => error?.message ?? 'Terjadi kesalahan pada server.';

export const asyncCastVote = createAsyncThunk(
  VOTE_ACTION_TYPE.CAST,
  async ({ electionId, candidateId }, { rejectWithValue }) => {
    try {
      return await voteApi.cast(electionId, candidateId);
    } catch (error) {
      return rejectWithValue(toMessage(error));
    }
  },
);

export const asyncFetchVoteHistory = createAsyncThunk(
  VOTE_ACTION_TYPE.HISTORY,
  async (_arg, { rejectWithValue }) => {
    try {
      return await voteApi.history();
    } catch (error) {
      return rejectWithValue(toMessage(error));
    }
  },
);

const voteSlice = createSlice({
  name: 'votes',
  initialState,
  reducers: {
    voteStateReset(state) {
      state.isVoted = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncCastVote.pending, (state) => {
        state.isVoting = true;
        state.isVoted = false;
        state.error = null;
      })
      .addCase(asyncCastVote.fulfilled, (state) => {
        state.isVoting = false;
        state.isVoted = true;
      })
      .addCase(asyncCastVote.rejected, (state, action) => {
        state.isVoting = false;
        state.error = action.payload;
      })
      .addCase(asyncFetchVoteHistory.pending, (state) => {
        state.isHistory = true;
        state.error = null;
      })
      .addCase(asyncFetchVoteHistory.fulfilled, (state, action) => {
        state.isHistory = false;
        state.history = action.payload;
      })
      .addCase(asyncFetchVoteHistory.rejected, (state, action) => {
        state.isHistory = false;
        state.error = action.payload;
      });
  },
});

export const { voteStateReset } = voteSlice.actions;

export const selectVoteHistory = (state) => state.votes.history;
export const selectVoteError = (state) => state.votes.error;

export default voteSlice.reducer;
