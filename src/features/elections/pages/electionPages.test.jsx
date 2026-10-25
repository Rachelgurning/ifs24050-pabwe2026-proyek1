import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import {
  adminUser,
  authState,
  electionFixture,
  renderWithProviders,
  screen,
  studentUser,
} from '../../../test-utils.jsx';
import { electionApi } from '../api/electionApi.js';
import DetailPage from './DetailPage.jsx';
import ElectionsPage from './ElectionsPage.jsx';
import ResultsPage from './ResultsPage.jsx';

function renderAt(path, element, route, user = null) {
  return renderWithProviders(
    <Routes>
      <Route path={path} element={element} />
    </Routes>,
    { route, preloadedState: { auth: authState(user) } },
  );
}

describe('ElectionsPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('menampilkan dan memfilter daftar pemilihan', async () => {
    const user = userEvent.setup();
    vi.spyOn(electionApi, 'list').mockResolvedValue([
      electionFixture(),
      electionFixture({ id: 2, title: 'Pemilihan Ketua HIMA', status: 'closed' }),
    ]);
    renderAt('/pemilihan', <ElectionsPage />, '/pemilihan');

    expect(await screen.findByRole('heading', { name: 'Pemilihan Ketua BEM' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pemilihan Ketua HIMA' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Selesai' }));
    expect(screen.getByRole('button', { name: 'Selesai' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('heading', { name: 'Pemilihan Ketua BEM' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Akan datang' }));
    expect(screen.getByText('Tidak ada pemilihan pada kategori ini.')).toBeInTheDocument();
  });

  it('menampilkan error dan dapat mencoba lagi', async () => {
    const user = userEvent.setup();
    const list = vi
      .spyOn(electionApi, 'list')
      .mockRejectedValueOnce(new Error('Server tidak tersedia'))
      .mockResolvedValueOnce([]);
    renderAt('/pemilihan', <ElectionsPage />, '/pemilihan');

    expect(await screen.findByRole('alert')).toHaveTextContent('Server tidak tersedia');
    await user.click(screen.getByRole('button', { name: 'Coba lagi' }));

    expect(await screen.findByText('Belum ada pemilihan')).toBeInTheDocument();
    expect(list).toHaveBeenCalledTimes(2);
  });
});

describe('DetailPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('menampilkan formulir suara untuk mahasiswa pada pemilihan aktif', async () => {
    vi.spyOn(electionApi, 'detail').mockResolvedValue(electionFixture());
    renderAt('/pemilihan/:id', <DetailPage />, '/pemilihan/1', studentUser);

    expect(await screen.findByRole('heading', { name: 'Berikan suara' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.queryByRole('heading', { name: 'Kandidat' })).not.toBeInTheDocument();
  });

  it('menampilkan daftar kandidat dan tautan hasil untuk pemilihan selesai', async () => {
    vi.spyOn(electionApi, 'detail').mockResolvedValue(
      electionFixture({ status: 'closed', description: '' }),
    );
    renderAt('/pemilihan/:id', <DetailPage />, '/pemilihan/1');

    expect(await screen.findByRole('heading', { name: 'Status pemilihan' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Kandidat' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Lihat hasil pemilihan' })).toHaveAttribute(
      'href',
      '/pemilihan/1/hasil',
    );
  });

  it('menampilkan error ketika pemilihan tidak ditemukan', async () => {
    const user = userEvent.setup();
    const detail = vi
      .spyOn(electionApi, 'detail')
      .mockRejectedValue(new Error('Pemilihan tidak ditemukan.'));
    renderAt('/pemilihan/:id', <DetailPage />, '/pemilihan/99', adminUser);

    expect(await screen.findByRole('alert')).toHaveTextContent('Pemilihan tidak ditemukan.');
    await user.click(screen.getByRole('button', { name: 'Coba lagi' }));
    expect(detail).toHaveBeenCalledTimes(2);
  });
});

describe('ResultsPage', () => {
  afterEach(() => vi.restoreAllMocks());

  const resultData = (totalVotes) => ({
    election: electionFixture({ status: 'closed' }),
    totalVotes,
    results: [
      { candidateId: 11, number: 1, name: 'Kandidat Satu', votes: 3, percentage: 75, isLeading: true },
      { candidateId: 12, number: 2, name: 'Kandidat Dua', votes: 1, percentage: 25, isLeading: false },
    ],
  });

  it('menampilkan grafik perolehan suara', async () => {
    vi.spyOn(electionApi, 'results').mockResolvedValue(resultData(4));
    renderAt('/pemilihan/:id/hasil', <ResultsPage />, '/pemilihan/1/hasil');

    expect(await screen.findByRole('heading', { name: /hasil: pemilihan ketua bem/i })).toBeInTheDocument();
    expect(screen.getByText('Unggul')).toBeInTheDocument();
    expect(screen.getByText('3 suara · 75,0%')).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar')).toHaveLength(2);
  });

  it('menampilkan pesan bila belum ada suara', async () => {
    vi.spyOn(electionApi, 'results').mockResolvedValue(resultData(0));
    renderAt('/pemilihan/:id/hasil', <ResultsPage />, '/pemilihan/1/hasil');

    expect(await screen.findByText('Belum ada suara yang masuk.')).toBeInTheDocument();
  });

  it('menampilkan error ketika hasil belum dibuka', async () => {
    vi.spyOn(electionApi, 'results').mockRejectedValue(new Error('Hasil belum tersedia.'));
    renderAt('/pemilihan/:id/hasil', <ResultsPage />, '/pemilihan/1/hasil');

    expect(await screen.findByRole('alert')).toHaveTextContent('Hasil belum tersedia.');
    expect(screen.getByRole('link', { name: 'Kembali ke detail pemilihan' })).toHaveAttribute(
      'href',
      '/pemilihan/1',
    );
  });
});
