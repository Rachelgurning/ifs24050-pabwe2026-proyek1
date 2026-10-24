import { describe, expect, it, vi, afterEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../../../test-utils.jsx';
import { VoteForm } from './VoteForm.jsx';
import { voteApi } from '../api/voteApi.js';

const candidates = [
  { id: 1, number: 1, name: 'Kandidat Satu', vision: 'Visi satu', mission: 'Misi satu' },
  { id: 2, number: 2, name: 'Kandidat Dua', vision: 'Visi dua', mission: 'Misi dua' },
];

describe('VoteForm', () => {
  afterEach(() => vi.restoreAllMocks());

  it('mengirim suara setelah pengguna mengonfirmasi pilihan', async () => {
    const user = userEvent.setup();
    const cast = vi.spyOn(voteApi, 'cast').mockResolvedValue({ electionId: 1 });
    const onVoted = vi.fn();

    renderWithProviders(<VoteForm electionId={1} candidates={candidates} onVoted={onVoted} />);

    await user.click(screen.getAllByRole('radio')[1]);
    await user.click(screen.getByRole('button', { name: /lanjutkan/i }));

    expect(screen.getByText(/konfirmasi pilihan anda/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /ya, kirim suara/i }));

    await waitFor(() => expect(cast).toHaveBeenCalledWith(1, 2));
    await waitFor(() => expect(onVoted).toHaveBeenCalledTimes(1));
  });

  it('menampilkan pesan kesalahan ketika suara ditolak server', async () => {
    const user = userEvent.setup();
    vi.spyOn(voteApi, 'cast').mockRejectedValue(
      new Error('Anda sudah memberikan suara pada pemilihan ini.'),
    );
    const onVoted = vi.fn();

    renderWithProviders(<VoteForm electionId={1} candidates={candidates} onVoted={onVoted} />);

    await user.click(screen.getAllByRole('radio')[0]);
    await user.click(screen.getByRole('button', { name: /lanjutkan/i }));
    await user.click(screen.getByRole('button', { name: /ya, kirim suara/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/sudah memberikan suara/i);
    expect(onVoted).not.toHaveBeenCalled();
  });
});
