import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../../test-utils.jsx';
import { Alert } from './Alert.jsx';
import { Button } from './Button.jsx';
import { EmptyState } from './EmptyState.jsx';
import { ErrorState } from './ErrorState.jsx';
import { FormField } from './FormField.jsx';
import { LoadingState } from './LoadingState.jsx';
import { PageHeader } from './PageHeader.jsx';

describe('komponen UI', () => {
  it('EmptyState menampilkan judul, deskripsi, dan konten tambahan', () => {
    renderWithProviders(
      <EmptyState title="Kosong" description="Belum ada data.">
        <span>Aksi</span>
      </EmptyState>,
    );

    expect(screen.getByRole('heading', { name: 'Kosong' })).toBeInTheDocument();
    expect(screen.getByText('Belum ada data.')).toBeInTheDocument();
    expect(screen.getByText('Aksi')).toBeInTheDocument();
  });

  it('EmptyState tanpa deskripsi hanya menampilkan judul', () => {
    const { container } = renderWithProviders(<EmptyState title="Kosong" />);

    expect(container.querySelector('p')).toBeNull();
  });

  it('ErrorState memakai pesan bawaan dan memanggil onRetry', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    renderWithProviders(<ErrorState onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Terjadi kesalahan tak terduga.');
    await user.click(screen.getByRole('button', { name: 'Coba lagi' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('ErrorState tanpa onRetry tidak menampilkan tombol', () => {
    renderWithProviders(<ErrorState error={{ message: 'Gagal memuat' }} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Gagal memuat');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('FormField menghubungkan petunjuk dan error ke kontrol', () => {
    renderWithProviders(
      <FormField id="bio" label="Bio" as="textarea" hint="Maks 10 kata" error="Wajib diisi" />,
    );

    const control = screen.getByLabelText('Bio');
    expect(control.tagName).toBe('TEXTAREA');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control).toHaveAttribute('aria-describedby', 'bio-hint bio-error');
    expect(control).toHaveClass('field__control--invalid');
  });

  it('FormField tanpa petunjuk dan error tetap valid', () => {
    renderWithProviders(<FormField id="nama" label="Nama" />);

    const control = screen.getByLabelText('Nama');
    expect(control).not.toHaveAttribute('aria-invalid');
    expect(control).not.toHaveAttribute('aria-describedby');
  });

  it('PageHeader menampilkan subjudul dan aksi bila tersedia', () => {
    renderWithProviders(<PageHeader title="Judul" subtitle="Sub" actions={<span>Aksi</span>} />);

    expect(screen.getByText('Sub')).toBeInTheDocument();
    expect(screen.getByText('Aksi')).toBeInTheDocument();
  });

  it('Button menampilkan teks loading dan menonaktifkan tombol', () => {
    renderWithProviders(
      <Button loading className="extra">
        Simpan
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Memproses…' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('btn', 'btn--primary', 'extra');
  });

  it('LoadingState dan Alert memakai label bawaan', () => {
    renderWithProviders(
      <>
        <LoadingState />
        <Alert variant="success">Tersimpan</Alert>
      </>,
    );

    expect(screen.getByText('Memuat data…')).toBeInTheDocument();
    expect(screen.getByText('Tersimpan')).toHaveClass('alert--success');
  });
});
