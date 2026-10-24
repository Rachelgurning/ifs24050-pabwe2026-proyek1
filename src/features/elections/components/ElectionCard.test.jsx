import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '../../../test-utils.jsx';
import { ElectionCard } from './ElectionCard.jsx';

const election = {
  id: 7,
  title: 'Pemilihan Ketua BEM',
  description: 'Periode 2026/2027',
  startAt: '2026-10-01T01:00:00.000Z',
  endAt: '2026-10-31T01:00:00.000Z',
  status: 'active',
  candidateCount: 3,
  totalVotes: 12,
  hasVoted: true,
};

describe('ElectionCard', () => {
  it('menampilkan judul, status, dan penanda sudah memilih', () => {
    renderWithProviders(<ElectionCard election={election} />);

    expect(screen.getByRole('link', { name: election.title })).toHaveAttribute(
      'href',
      '/pemilihan/7',
    );
    expect(screen.getByText('Berlangsung')).toBeInTheDocument();
    expect(screen.getByText('Sudah memilih')).toBeInTheDocument();
  });

  it('menampilkan ringkasan kandidat dan partisipasi', () => {
    renderWithProviders(<ElectionCard election={{ ...election, hasVoted: false }} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('12 suara')).toBeInTheDocument();
    expect(screen.queryByText('Sudah memilih')).not.toBeInTheDocument();
  });
});
