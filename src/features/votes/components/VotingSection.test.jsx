import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen } from '../../../test-utils.jsx';
import { VotingSection } from './VotingSection.jsx';

const candidates = [
  { id: 1, number: 1, name: 'Kandidat Satu', vision: 'Visi satu', mission: 'Misi satu' },
  { id: 2, number: 2, name: 'Kandidat Dua', vision: 'Visi dua', mission: 'Misi dua' },
];

const election = (overrides = {}) => ({
  id: 1,
  status: 'active',
  hasVoted: false,
  candidates,
  ...overrides,
});

const student = { id: 1, role: 'student' };

describe('VotingSection', () => {
  it('meminta pengguna masuk ketika belum terautentikasi', () => {
    renderWithProviders(<VotingSection election={election()} user={null} onVoted={vi.fn()} />);

    expect(screen.getByRole('link', { name: /masuk ke akun/i })).toBeInTheDocument();
  });

  it('memberi tahu bahwa pemilihan belum dibuka', () => {
    renderWithProviders(
      <VotingSection election={election({ status: 'upcoming' })} user={student} onVoted={vi.fn()} />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(/belum dibuka/i);
  });

  it('menawarkan halaman hasil ketika pemilihan telah selesai', () => {
    renderWithProviders(
      <VotingSection election={election({ status: 'closed' })} user={student} onVoted={vi.fn()} />,
    );

    expect(screen.getByRole('link', { name: /lihat hasil pemilihan/i })).toBeInTheDocument();
  });

  it('melarang administrator memberikan suara', () => {
    renderWithProviders(
      <VotingSection election={election()} user={{ id: 9, role: 'admin' }} onVoted={vi.fn()} />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(/administrator tidak dapat/i);
  });

  it('mengonfirmasi suara yang sudah tercatat', () => {
    renderWithProviders(
      <VotingSection election={election({ hasVoted: true })} user={student} onVoted={vi.fn()} />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(/sudah tercatat/i);
  });

  it('menampilkan formulir pemilihan kandidat untuk mahasiswa', () => {
    renderWithProviders(<VotingSection election={election()} user={student} onVoted={vi.fn()} />);

    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /lanjutkan/i })).toBeDisabled();
  });
});
