import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Link, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import {
  authState,
  electionFixture,
  renderWithProviders,
  screen,
  studentUser,
} from './test-utils.jsx';
import { putAccessToken } from './helpers/apiHelper.js';
import { authApi } from './features/auth/api/authApi.js';
import { AuthLayout } from './features/auth/layouts/AuthLayout.jsx';
import LoginPage from './features/auth/pages/LoginPage.jsx';
import { CandidateForm } from './features/admin/components/CandidateForm.jsx';
import { ElectionStatusBadge } from './features/elections/components/ElectionStatusBadge.jsx';
import { MainLayout } from './features/elections/layouts/MainLayout.jsx';
import { electionApi } from './features/elections/api/electionApi.js';
import ElectionsPage from './features/elections/pages/ElectionsPage.jsx';
import ResultsPage from './features/elections/pages/ResultsPage.jsx';
import electionReducer, {
  asyncFetchElections,
  electionErrorCleared,
} from './features/elections/states/electionSlice.js';
import { voteApi } from './features/votes/api/voteApi.js';
import voteReducer, { asyncFetchVoteHistory } from './features/votes/states/voteSlice.js';
import { validateElectionForm, validateLoginForm } from './utils/validators.js';

afterEach(() => vi.restoreAllMocks());

describe('App: pemulihan sesi', () => {
  it('memverifikasi token tersimpan sebelum merender halaman', async () => {
    putAccessToken('token-tersimpan');
    const profile = vi.spyOn(authApi, 'profile').mockResolvedValue(studentUser);

    renderWithProviders(<App />, {
      route: '/',
      preloadedState: { auth: { ...authState(), isPreload: true } },
    });

    expect(screen.getByText('Memuat sesi…')).toBeInTheDocument();
    expect(await screen.findByText(studentUser.name)).toBeInTheDocument();
    expect(profile).toHaveBeenCalledTimes(1);
  });
});

describe('pengalihan setelah masuk', () => {
  const fromHistory = { pathname: '/auth/login', state: { from: '/riwayat' } };

  function renderLogin(user) {
    return renderWithProviders(
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="/riwayat" element={<p>Halaman riwayat</p>} />
      </Routes>,
      { route: fromHistory, preloadedState: { auth: authState(user) } },
    );
  }

  it('AuthLayout mengembalikan pengguna ke halaman asal', () => {
    renderLogin(studentUser);
    expect(screen.getByText('Halaman riwayat')).toBeInTheDocument();
  });

  it('LoginPage mengarahkan ke halaman asal setelah login', async () => {
    const user = userEvent.setup();
    vi.spyOn(authApi, 'login').mockResolvedValue({ token: 'token', user: studentUser });
    renderLogin(null);

    await user.type(screen.getByLabelText('NIM'), '11S24001');
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia123');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    expect(await screen.findByText('Halaman riwayat')).toBeInTheDocument();
  });
});

describe('MainLayout', () => {
  it('memindahkan fokus ke konten utama saat halaman berganti', async () => {
    const user = userEvent.setup();
    const scrollTo = vi.spyOn(globalThis, 'scrollTo').mockImplementation(() => {});
    renderWithProviders(
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Link to="/tujuan">Ke tujuan</Link>} />
          <Route path="/tujuan" element={<p>Halaman tujuan</p>} />
        </Route>
      </Routes>,
    );

    await user.click(screen.getByRole('link', { name: 'Ke tujuan' }));

    expect(await screen.findByText('Halaman tujuan')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveFocus();
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });
});

describe('halaman dengan pengguna masuk', () => {
  it('ElectionsPage memuat daftar untuk pengguna yang masuk', async () => {
    vi.spyOn(electionApi, 'list').mockResolvedValue([electionFixture()]);
    renderWithProviders(<ElectionsPage />, { preloadedState: { auth: authState(studentUser) } });

    expect(await screen.findByRole('heading', { name: 'Pemilihan Ketua BEM' })).toBeInTheDocument();
  });

  it('ResultsPage memuat hasil untuk pengguna yang masuk', async () => {
    vi.spyOn(electionApi, 'results').mockResolvedValue({
      election: electionFixture({ status: 'closed' }),
      totalVotes: 0,
      results: [],
    });
    renderWithProviders(
      <Routes>
        <Route path="/pemilihan/:id/hasil" element={<ResultsPage />} />
      </Routes>,
      { route: '/pemilihan/1/hasil', preloadedState: { auth: authState(studentUser) } },
    );

    expect(await screen.findByText('Belum ada suara yang masuk.')).toBeInTheDocument();
  });
});

describe('komponen dengan nilai bawaan', () => {
  it('CandidateForm kosong tanpa kandidat dan nomor bawaan', () => {
    renderWithProviders(<CandidateForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText('Nomor urut')).toHaveValue(null);
    expect(screen.getByRole('heading', { name: 'Tambah kandidat' })).toBeInTheDocument();
  });

  it('ElectionStatusBadge menampilkan status mentah bila label tidak dikenal', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWithProviders(<ElectionStatusBadge status="draft" />);

    expect(screen.getByText('draft')).toHaveClass('badge--draft');
  });
});

describe('slice: pesan bawaan dan reset error', () => {
  it('electionSlice memakai pesan bawaan dan dapat membersihkan error', async () => {
    vi.spyOn(electionApi, 'list').mockRejectedValue({});
    const action = await asyncFetchElections()(vi.fn(), () => ({}), undefined);
    const failed = electionReducer(undefined, action);

    expect(failed.error).toBe('Terjadi kesalahan pada server.');
    expect(electionReducer(failed, electionErrorCleared()).error).toBeNull();
  });

  it('voteSlice memakai pesan bawaan ketika error tanpa pesan', async () => {
    vi.spyOn(voteApi, 'history').mockRejectedValue({});
    const action = await asyncFetchVoteHistory()(vi.fn(), () => ({}), undefined);

    expect(voteReducer(undefined, action).error).toBe('Terjadi kesalahan pada server.');
  });
});

describe('validators: nilai kosong', () => {
  it('menangani nilai null dan undefined', () => {
    expect(validateLoginForm({ nim: null, password: undefined })).toEqual({
      nim: 'NIM wajib diisi.',
      password: 'Kata sandi wajib diisi.',
    });

    const errors = validateElectionForm({ title: null, startAt: '', endAt: '' });
    expect(errors.title).toBe('Judul wajib diisi.');
    expect(errors.description).toBeUndefined();
  });
});
