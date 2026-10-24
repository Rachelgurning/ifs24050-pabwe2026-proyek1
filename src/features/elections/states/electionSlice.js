import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { electionApi } from '../api/electionApi.js';
import { candidateApi } from '../../admin/api/candidateApi.js';

export const ELECTION_ACTION_TYPE = Object.freeze({
  FETCH_ALL: 'elections/fetchAll',
  FETCH_DETAIL: 'elections/fetchDetail',
  FETCH_RESULTS: 'elections/fetchResults',
  CREATE: 'elections/create',
  UPDATE: 'elections/update',
  DELETE: 'elections/delete',
  CANDIDATE_SAVE: 'elections/candidateSave',
  CANDIDATE_DELETE: 'elections/candidateDelete',
});

const initialState = {
  elections: [],
  election: null,
  results: null,
  isElections: false,
  isElection: false,
  isResults: false,
  isMutating: false,
  error: null,
};

const toMessage = (error) => error?.message ?? 'Terjadi kesalahan pada server.';

function createApiThunk(type, handler) {
  return createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await handler(arg);
    } catch (error) {
      return rejectWithValue(toMessage(error));
    }
  });
}

export const asyncFetchElections = createApiThunk(ELECTION_ACTION_TYPE.FETCH_ALL, () =>
  electionApi.list(),
);
export const asyncFetchElection = createApiThunk(ELECTION_ACTION_TYPE.FETCH_DETAIL, (id) =>
  electionApi.detail(id),
);
export const asyncFetchResults = createApiThunk(ELECTION_ACTION_TYPE.FETCH_RESULTS, (id) =>
  electionApi.results(id),
);
export const asyncCreateElection = createApiThunk(ELECTION_ACTION_TYPE.CREATE, (payload) =>
  electionApi.create(payload),
);
export const asyncUpdateElection = createApiThunk(ELECTION_ACTION_TYPE.UPDATE, ({ id, payload }) =>
  electionApi.update(id, payload),
);
export const asyncDeleteElection = createApiThunk(ELECTION_ACTION_TYPE.DELETE, async (id) => {
  await electionApi.remove(id);
  return id;
});
export const asyncSaveCandidate = createApiThunk(
  ELECTION_ACTION_TYPE.CANDIDATE_SAVE,
  ({ electionId, candidateId, payload }) =>
    candidateId ? candidateApi.update(candidateId, payload) : candidateApi.add(electionId, payload),
);
export const asyncDeleteCandidate = createApiThunk(
  ELECTION_ACTION_TYPE.CANDIDATE_DELETE,
  async (candidateId) => {
    await candidateApi.remove(candidateId);
    return candidateId;
  },
);

const electionSlice = createSlice({
  name: 'elections',
  initialState,
  reducers: {
    electionCleared(state) {
      state.election = null;
      state.results = null;
      state.error = null;
    },
    electionErrorCleared(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchElections.pending, (state) => {
        state.isElections = true;
        state.error = null;
      })
      .addCase(asyncFetchElections.fulfilled, (state, action) => {
        state.isElections = false;
        state.elections = action.payload;
      })
      .addCase(asyncFetchElections.rejected, (state, action) => {
        state.isElections = false;
        state.error = action.payload;
      })
      .addCase(asyncFetchElection.pending, (state) => {
        state.isElection = true;
        state.error = null;
      })
      .addCase(asyncFetchElection.fulfilled, (state, action) => {
        state.isElection = false;
        state.election = action.payload;
      })
      .addCase(asyncFetchElection.rejected, (state, action) => {
        state.isElection = false;
        state.election = null;
        state.error = action.payload;
      })
      .addCase(asyncFetchResults.pending, (state) => {
        state.isResults = true;
        state.error = null;
      })
      .addCase(asyncFetchResults.fulfilled, (state, action) => {
        state.isResults = false;
        state.results = action.payload;
      })
      .addCase(asyncFetchResults.rejected, (state, action) => {
        state.isResults = false;
        state.results = null;
        state.error = action.payload;
      })
      .addCase(asyncDeleteElection.fulfilled, (state, action) => {
        state.isMutating = false;
        state.elections = state.elections.filter((item) => item.id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.startsWith('elections/') && action.type.endsWith('/pending'),
        (state, action) => {
          if (action.type.includes('fetch')) return;
          state.isMutating = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('elections/') && action.type.endsWith('/rejected'),
        (state, action) => {
          if (action.type.includes('fetch')) return;
          state.isMutating = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('elections/') && action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (action.type.includes('fetch')) return;
          state.isMutating = false;
        },
      );
  },
});

export const { electionCleared, electionErrorCleared } = electionSlice.actions;

export const selectElections = (state) => state.elections.elections;
export const selectElection = (state) => state.elections.election;
export const selectElectionResults = (state) => state.elections.results;
export const selectElectionError = (state) => state.elections.error;

export default electionSlice.reducer;
