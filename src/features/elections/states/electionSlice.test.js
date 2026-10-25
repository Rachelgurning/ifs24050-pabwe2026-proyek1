import { describe, expect, it, vi, afterEach } from 'vitest';
import electionReducer, {
  asyncDeleteElection,
  asyncFetchElection,
  asyncFetchElections,
  asyncFetchResults,
  electionCleared,
  selectElections,
} from './electionSlice.js';
import { electionApi } from '../api/electionApi.js';

const election = {
  id: 1,
  title: 'Pemilihan Ketua BEM',
  description: 'Periode 2026/2027',
  startAt: '2026-10-01T00:00:00.000Z',
  endAt: '2026-10-31T00:00:00.000Z',
  status: 'active',
  candidateCount: 2,
  totalVotes: 0,
};

const initialState = () => electionReducer(undefined, { type: '@@INIT' });

describe('electionSlice: reducer', () => {
  it('menyimpan daftar pemilihan', () => {
    const state = electionReducer(initialState(), {
      type: asyncFetchElections.fulfilled.type,
      payload: [election],
    });

    expect(selectElections({ elections: state })).toHaveLength(1);
    expect(state.isElections).toBe(false);
  });

  it('menyimpan detail dan membersihkannya kembali', () => {
    const loaded = electionReducer(initialState(), {
      type: asyncFetchElection.fulfilled.type,
      payload: { ...election, candidates: [] },
    });
    expect(loaded.election.id).toBe(1);

    expect(electionReducer(loaded, electionCleared()).election).toBeNull();
  });

  it('menyimpan pesan kesalahan ketika hasil belum boleh dilihat', () => {
    const state = electionReducer(initialState(), {
      type: asyncFetchResults.rejected.type,
      payload: 'Hasil pemilihan baru dapat dilihat setelah pemilihan ditutup.',
    });

    expect(state.results).toBeNull();
    expect(state.error).toMatch(/ditutup/);
  });

  it('menghapus pemilihan dari daftar setelah dihapus', () => {
    const loaded = electionReducer(initialState(), {
      type: asyncFetchElections.fulfilled.type,
      payload: [election, { ...election, id: 2 }],
    });

    const state = electionReducer(loaded, { type: asyncDeleteElection.fulfilled.type, payload: 1 });

    expect(state.elections.map((item) => item.id)).toEqual([2]);
  });
});

describe('electionSlice: async thunk', () => {
  afterEach(() => vi.restoreAllMocks());

  it('mengambil daftar pemilihan dari API', async () => {
    vi.spyOn(electionApi, 'list').mockResolvedValue([election]);

    const result = await asyncFetchElections()(vi.fn(), () => ({}), undefined);

    expect(result.payload).toEqual([election]);
  });

  it('mengembalikan pesan kesalahan ketika API gagal', async () => {
    vi.spyOn(electionApi, 'detail').mockRejectedValue(new Error('Pemilihan tidak ditemukan.'));

    const result = await asyncFetchElection('99')(vi.fn(), () => ({}), undefined);

    expect(result.payload).toBe('Pemilihan tidak ditemukan.');
  });
});
