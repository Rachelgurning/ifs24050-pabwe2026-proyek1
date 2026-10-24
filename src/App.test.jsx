import { describe, expect, it } from 'vitest';
import App from './App.jsx';
import { renderWithProviders, screen } from './test-utils.jsx';

const student = { id: 1, nim: '11S24001', name: 'Mahasiswa Uji', role: 'student' };

describe('App', () => {
  it('menampilkan beranda beserta navigasi utama', async () => {
    renderWithProviders(<App />, { route: '/' });

    expect(await screen.findByRole('heading', { name: /suaramu menentukan arah kampus/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /masuk/i })).toBeInTheDocument();
  });

  it('menampilkan halaman 404 untuk alamat yang tidak dikenal', async () => {
    renderWithProviders(<App />, { route: '/alamat-tidak-ada' });

    expect(await screen.findByRole('heading', { name: /halaman tidak ditemukan/i })).toBeInTheDocument();
  });

  it('mengalihkan pengguna tamu dari halaman riwayat ke halaman masuk', async () => {
    renderWithProviders(<App />, { route: '/riwayat' });

    expect(await screen.findByRole('heading', { name: /^masuk$/i })).toBeInTheDocument();
  });

  it('menampilkan nama pengguna yang sudah masuk pada navigasi', async () => {
    renderWithProviders(<App />, {
      route: '/',
      preloadedState: {
        auth: { user: student, isPreload: false, isAuthLogin: false, isAuthRegister: false, error: null },
      },
    });

    expect(await screen.findByText(student.name)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /riwayat/i })).toBeInTheDocument();
  });
});
