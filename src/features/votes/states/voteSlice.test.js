import { describe, expect, it, vi, afterEach } from 'vitest';
import voteReducer, {
  asyncCastVote,
  asyncFetchVoteHistory,
  selectVoteHistory,
  voteStateReset,
} from './voteSlice.js';
import { voteApi } from '../api/voteApi.js';

const initialState = () => voteReducer(undefined, { type: '@@INIT' });

describe('voteSlice', () => {
  afterEach(() => vi.restoreAllMocks());

  it('menandai suara terkirim setelah berhasil', () => {
    const pending = voteReducer(initialState(), { type: asyncCastVote.pending.type });
    expect(pending.isVoteSubmitting).toBe(true);

    const state = voteReducer(pending, { type: asyncCastVote.fulfilled.type });
    expect(state.isVoteSubmitting).toBe(false);
    expect(state.isVoted).toBe(true);
  });

  it('menyimpan pesan kesalahan suara ganda dan dapat direset', () => {
    const failed = voteReducer(initialState(), {
      type: asyncCastVote.rejected.type,
      payload: 'Anda sudah memberikan suara pada pemilihan ini.',
    });
    expect(failed.error).toMatch(/sudah memberikan suara/);

    expect(voteReducer(failed, voteStateReset()).error).toBeNull();
  });

  it('menyimpan riwayat partisipasi tanpa membocorkan kandidat', () => {
    const history = [{ electionId: 1, title: 'Pemilihan Ketua BEM', votedAt: '2026-10-10T00:00:00.000Z' }];

    const state = voteReducer(initialState(), {
      type: asyncFetchVoteHistory.fulfilled.type,
      payload: history,
    });

    expect(selectVoteHistory({ votes: state })).toEqual(history);
    expect(state.history[0].candidateId).toBeUndefined();
  });

  it('meneruskan pemilihan dan kandidat ke API saat memilih', async () => {
    const cast = vi.spyOn(voteApi, 'cast').mockResolvedValue({ electionId: 1 });

    await asyncCastVote({ electionId: 1, candidateId: 7 })(vi.fn(), () => ({}), undefined);

    expect(cast).toHaveBeenCalledWith(1, 7);
  });
});
