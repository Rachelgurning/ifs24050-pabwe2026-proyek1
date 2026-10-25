import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import {
  adminUser,
  authState,
  renderWithProviders,
  screen,
  studentUser,
} from '../../../test-utils.jsx';
import { NavbarComponent } from './NavbarComponent.jsx';

describe('NavbarComponent', () => {
  it('menampilkan menu kelola untuk admin', () => {
    renderWithProviders(<NavbarComponent />, { preloadedState: { auth: authState(adminUser) } });

    expect(screen.getByRole('link', { name: 'Kelola' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Riwayat' })).not.toBeInTheDocument();
  });

  it('keluar dari sesi ketika tombol keluar ditekan', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<NavbarComponent />, {
      preloadedState: { auth: authState(studentUser) },
    });

    await user.click(screen.getByRole('button', { name: 'Keluar' }));

    expect(store.getState().auth.user).toBeNull();
    expect(screen.getByRole('link', { name: 'Daftar' })).toBeInTheDocument();
  });
});
