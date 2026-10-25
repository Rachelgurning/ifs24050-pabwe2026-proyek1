import { describe, expect, it } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import {
  adminUser,
  authState,
  renderWithProviders,
  screen,
  studentUser,
} from '../test-utils.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

function renderGuard(user, requireAdmin = false) {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<p>Beranda</p>} />
      <Route path="/auth/login" element={<p>Halaman masuk</p>} />
      <Route
        path="/rahasia"
        element={
          <ProtectedRoute requireAdmin={requireAdmin}>
            <p>Konten rahasia</p>
          </ProtectedRoute>
        }
      />
    </Routes>,
    { route: '/rahasia', preloadedState: { auth: authState(user) } },
  );
}

describe('ProtectedRoute', () => {
  it('mengalihkan tamu ke halaman masuk', () => {
    renderGuard(null);
    expect(screen.getByText('Halaman masuk')).toBeInTheDocument();
  });

  it('mengalihkan mahasiswa dari halaman khusus admin', () => {
    renderGuard(studentUser, true);
    expect(screen.getByText('Beranda')).toBeInTheDocument();
  });

  it('menampilkan konten untuk admin', () => {
    renderGuard(adminUser, true);
    expect(screen.getByText('Konten rahasia')).toBeInTheDocument();
  });
});
