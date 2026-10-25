import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import {
  authState,
  renderWithProviders,
  screen,
  studentUser,
  waitFor,
} from '../../../test-utils.jsx';
import { authApi } from '../api/authApi.js';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';

function renderAuth(route, preloadedState) {
  return renderWithProviders(
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route path="/pemilihan" element={<p>Daftar pemilihan</p>} />
    </Routes>,
    { route, preloadedState },
  );
}

describe('halaman autentikasi', () => {
  afterEach(() => vi.restoreAllMocks());

  it('login berhasil mengarahkan ke daftar pemilihan', async () => {
    const user = userEvent.setup();
    const login = vi
      .spyOn(authApi, 'login')
      .mockResolvedValue({ token: 'token-uji', user: studentUser });
    renderAuth('/auth/login');

    await user.type(screen.getByLabelText('NIM'), '11S24001');
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia123');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    expect(await screen.findByText('Daftar pemilihan')).toBeInTheDocument();
    expect(login).toHaveBeenCalledWith({ nim: '11S24001', password: 'rahasia123' });
  });

  it('login gagal menampilkan pesan dari server', async () => {
    const user = userEvent.setup();
    vi.spyOn(authApi, 'login').mockRejectedValue(new Error('NIM atau kata sandi salah.'));
    renderAuth('/auth/login');

    await user.type(screen.getByLabelText('NIM'), '11S24001');
    await user.type(screen.getByLabelText('Kata sandi'), 'salah123');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('NIM atau kata sandi salah.');
  });

  it('register memvalidasi input sebelum dikirim', async () => {
    const user = userEvent.setup();
    const register = vi.spyOn(authApi, 'register');
    renderAuth('/auth/register');

    await user.click(screen.getByRole('button', { name: 'Daftar' }));

    expect(screen.getByText('NIM harus 5-15 karakter berupa huruf atau angka.')).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  it('register berhasil mengarahkan ke daftar pemilihan', async () => {
    const user = userEvent.setup();
    const register = vi
      .spyOn(authApi, 'register')
      .mockResolvedValue({ token: 'token-uji', user: studentUser });
    renderAuth('/auth/register');

    await user.type(screen.getByLabelText('NIM'), '11S24001');
    await user.type(screen.getByLabelText('Nama lengkap'), 'Mahasiswa Uji');
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia123');
    await user.type(screen.getByLabelText('Konfirmasi kata sandi'), 'rahasia123');
    await user.click(screen.getByRole('button', { name: 'Daftar' }));

    expect(await screen.findByText('Daftar pemilihan')).toBeInTheDocument();
    expect(register).toHaveBeenCalledWith({
      nim: '11S24001',
      name: 'Mahasiswa Uji',
      password: 'rahasia123',
    });
  });

  it('register gagal menampilkan pesan dari server', async () => {
    const user = userEvent.setup();
    vi.spyOn(authApi, 'register').mockRejectedValue(new Error('NIM sudah terdaftar.'));
    renderAuth('/auth/register');

    await user.type(screen.getByLabelText('NIM'), '11S24001');
    await user.type(screen.getByLabelText('Nama lengkap'), 'Mahasiswa Uji');
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia123');
    await user.type(screen.getByLabelText('Konfirmasi kata sandi'), 'rahasia123');
    await user.click(screen.getByRole('button', { name: 'Daftar' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('NIM sudah terdaftar.'),
    );
  });

  it('pengguna yang sudah masuk dialihkan dari halaman autentikasi', () => {
    renderAuth('/auth/login', { auth: authState(studentUser) });

    expect(screen.getByText('Daftar pemilihan')).toBeInTheDocument();
  });
});
