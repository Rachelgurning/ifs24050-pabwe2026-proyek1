import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../../../test-utils.jsx';
import { voteApi } from '../api/voteApi.js';
import HistoryPage from './HistoryPage.jsx';

describe('HistoryPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('menampilkan daftar riwayat partisipasi', async () => {
    vi.spyOn(voteApi, 'history').mockResolvedValue([
      { electionId: 3, title: 'Pemilihan Ketua HIMA', votedAt: '2026-10-02T03:00:00.000Z' },
    ]);
    renderWithProviders(<HistoryPage />);

    expect(await screen.findByRole('link', { name: 'Pemilihan Ketua HIMA' })).toHaveAttribute(
      'href',
      '/pemilihan/3',
    );
  });

  it('menampilkan keadaan kosong', async () => {
    vi.spyOn(voteApi, 'history').mockResolvedValue([]);
    renderWithProviders(<HistoryPage />);

    expect(await screen.findByText('Belum ada riwayat')).toBeInTheDocument();
  });

  it('menampilkan error dan dapat memuat ulang', async () => {
    const user = userEvent.setup();
    const history = vi
      .spyOn(voteApi, 'history')
      .mockRejectedValueOnce(new Error('Gagal memuat riwayat'))
      .mockResolvedValueOnce([]);
    renderWithProviders(<HistoryPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Gagal memuat riwayat');
    await user.click(screen.getByRole('button', { name: 'Coba lagi' }));

    expect(await screen.findByText('Belum ada riwayat')).toBeInTheDocument();
    expect(history).toHaveBeenCalledTimes(2);
  });
});
