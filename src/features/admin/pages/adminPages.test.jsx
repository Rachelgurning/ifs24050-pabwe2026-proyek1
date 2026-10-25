import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Swal from 'sweetalert2';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import {
  adminUser,
  authState,
  electionFixture,
  renderWithProviders,
  screen,
  waitFor,
  within,
} from '../../../test-utils.jsx';
import { electionApi } from '../../elections/api/electionApi.js';
import { candidateApi } from '../api/candidateApi.js';
import AdminDashboardPage from './AdminDashboardPage.jsx';
import ElectionFormPage from './ElectionFormPage.jsx';

function renderAdmin(route) {
  return renderWithProviders(
    <Routes>
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/pemilihan/baru" element={<ElectionFormPage />} />
      <Route path="/admin/pemilihan/:id/ubah" element={<ElectionFormPage />} />
    </Routes>,
    { route, preloadedState: { auth: authState(adminUser) } },
  );
}

describe('AdminDashboardPage', () => {
  beforeEach(() => Swal.fire.mockResolvedValue({ isConfirmed: true }));
  afterEach(() => vi.restoreAllMocks());

  it('menampilkan tabel pemilihan dan menghapus pemilihan tanpa suara', async () => {
    const user = userEvent.setup();
    vi.spyOn(electionApi, 'list').mockResolvedValue([
      electionFixture(),
      electionFixture({ id: 2, title: 'Pemilihan Ketua HIMA', totalVotes: 5 }),
    ]);
    const remove = vi.spyOn(electionApi, 'remove').mockResolvedValue(null);
    renderAdmin('/admin');

    const table = await screen.findByRole('table');
    expect(within(table).getByText('Terkunci')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /hapus pemilihan ketua bem/i }));

    await waitFor(() => expect(remove).toHaveBeenCalledWith(1));
    await waitFor(() =>
      expect(screen.queryByRole('rowheader', { name: 'Pemilihan Ketua BEM' })).not.toBeInTheDocument(),
    );
    expect(Swal.fire).toHaveBeenLastCalledWith(expect.objectContaining({ icon: 'success' }));
  });

  it('membatalkan penghapusan bila pengguna tidak setuju', async () => {
    const user = userEvent.setup();
    vi.spyOn(electionApi, 'list').mockResolvedValue([electionFixture()]);
    const remove = vi.spyOn(electionApi, 'remove');
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    renderAdmin('/admin');

    await user.click(await screen.findByRole('button', { name: /hapus/i }));

    expect(remove).not.toHaveBeenCalled();
  });

  it('menampilkan dialog error ketika penghapusan gagal', async () => {
    const user = userEvent.setup();
    vi.spyOn(electionApi, 'list').mockResolvedValue([electionFixture()]);
    vi.spyOn(electionApi, 'remove').mockRejectedValue(new Error('Tidak dapat dihapus.'));
    renderAdmin('/admin');

    await user.click(await screen.findByRole('button', { name: /hapus/i }));

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenLastCalledWith(
        expect.objectContaining({ icon: 'error', text: 'Tidak dapat dihapus.' }),
      ),
    );
  });

  it('menampilkan keadaan kosong dan error', async () => {
    const user = userEvent.setup();
    vi.spyOn(electionApi, 'list')
      .mockRejectedValueOnce(new Error('Gagal memuat'))
      .mockResolvedValueOnce([]);
    renderAdmin('/admin');

    expect(await screen.findByRole('alert')).toHaveTextContent('Gagal memuat');
    await user.click(screen.getByRole('button', { name: 'Coba lagi' }));

    expect(await screen.findByText('Belum ada pemilihan')).toBeInTheDocument();
  });
});

describe('ElectionFormPage', () => {
  beforeEach(() => Swal.fire.mockResolvedValue({ isConfirmed: true }));
  afterEach(() => vi.restoreAllMocks());

  async function fillElectionForm(user) {
    await user.type(screen.getByLabelText('Judul pemilihan'), 'Pemilihan Ketua BEM');
    await user.type(screen.getByLabelText('Deskripsi'), 'Periode baru');
    await user.type(screen.getByLabelText('Waktu mulai'), '2026-11-01T08:00');
    await user.type(screen.getByLabelText('Waktu selesai'), '2026-11-02T08:00');
  }

  it('membuat pemilihan baru lalu membuka halaman ubah', async () => {
    const user = userEvent.setup();
    const create = vi.spyOn(electionApi, 'create').mockResolvedValue({ id: 1 });
    vi.spyOn(electionApi, 'detail').mockResolvedValue(electionFixture({ candidates: [] }));
    renderAdmin('/admin/pemilihan/baru');

    await fillElectionForm(user);
    await user.click(screen.getByRole('button', { name: 'Simpan pemilihan' }));

    expect(await screen.findByRole('heading', { name: 'Ubah pemilihan' })).toBeInTheDocument();
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Pemilihan Ketua BEM', description: 'Periode baru' }),
    );
    expect(screen.getByText(/belum ada kandidat/i)).toBeInTheDocument();
  });

  it('menampilkan error validasi dan error server saat membuat pemilihan', async () => {
    const user = userEvent.setup();
    vi.spyOn(electionApi, 'create').mockRejectedValue(new Error('Judul sudah dipakai.'));
    renderAdmin('/admin/pemilihan/baru');

    await user.click(screen.getByRole('button', { name: 'Simpan pemilihan' }));
    expect(screen.getByText('Judul wajib diisi.')).toBeInTheDocument();

    await fillElectionForm(user);
    await user.click(screen.getByRole('button', { name: 'Simpan pemilihan' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Judul sudah dipakai.');
  });

  it('memperbarui pemilihan yang sudah ada', async () => {
    const user = userEvent.setup();
    vi.spyOn(electionApi, 'detail').mockResolvedValue(electionFixture());
    const update = vi.spyOn(electionApi, 'update').mockResolvedValue(electionFixture());
    renderAdmin('/admin/pemilihan/1/ubah');

    const title = await screen.findByLabelText('Judul pemilihan');
    await user.clear(title);
    await user.type(title, 'Pemilihan Ketua BEM 2027');
    await user.click(screen.getByRole('button', { name: 'Simpan perubahan' }));

    await waitFor(() =>
      expect(update).toHaveBeenCalledWith(1, expect.objectContaining({ title: 'Pemilihan Ketua BEM 2027' })),
    );
    expect(await screen.findByText('Perubahan berhasil disimpan.')).toBeInTheDocument();
  });

  it('menampilkan error update dari server', async () => {
    const user = userEvent.setup();
    vi.spyOn(electionApi, 'detail').mockResolvedValue(electionFixture());
    vi.spyOn(electionApi, 'update').mockRejectedValue(new Error('Pemilihan terkunci.'));
    renderAdmin('/admin/pemilihan/1/ubah');

    await screen.findByLabelText('Judul pemilihan');
    await user.click(screen.getByRole('button', { name: 'Simpan perubahan' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Pemilihan terkunci.');
  });

  it('mengunci formulir bila pemilihan sudah memiliki suara', async () => {
    vi.spyOn(electionApi, 'detail').mockResolvedValue(electionFixture({ totalVotes: 3 }));
    renderAdmin('/admin/pemilihan/1/ubah');

    expect(await screen.findByText(/sudah memiliki suara sehingga/i)).toBeInTheDocument();
    expect(screen.getByText(/kandidat dikunci/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Tambah kandidat' })).not.toBeInTheDocument();
  });

  it('menampilkan error ketika data pemilihan gagal dimuat', async () => {
    vi.spyOn(electionApi, 'detail').mockRejectedValue(new Error('Pemilihan tidak ditemukan.'));
    renderAdmin('/admin/pemilihan/7/ubah');

    expect(await screen.findByRole('alert')).toHaveTextContent('Pemilihan tidak ditemukan.');
  });
});

describe('CandidateManager', () => {
  beforeEach(() => Swal.fire.mockResolvedValue({ isConfirmed: true }));
  afterEach(() => vi.restoreAllMocks());

  it('menambah kandidat baru', async () => {
    const user = userEvent.setup();
    vi.spyOn(electionApi, 'detail').mockResolvedValue(electionFixture());
    const add = vi.spyOn(candidateApi, 'add').mockResolvedValue({ id: 13 });
    renderAdmin('/admin/pemilihan/1/ubah');

    await user.click(await screen.findByRole('button', { name: 'Tambah kandidat' }));
    expect(screen.getByLabelText('Nomor urut')).toHaveValue(3);

    await user.type(screen.getByLabelText('Nama kandidat'), 'Kandidat Tiga');
    await user.click(screen.getByRole('button', { name: 'Simpan kandidat' }));

    await waitFor(() =>
      expect(add).toHaveBeenCalledWith(1, {
        number: 3,
        name: 'Kandidat Tiga',
        vision: '',
        mission: '',
      }),
    );
  });

  it('mengubah kandidat dan menampilkan error dari server', async () => {
    const user = userEvent.setup();
    vi.spyOn(electionApi, 'detail').mockResolvedValue(electionFixture());
    const update = vi.spyOn(candidateApi, 'update').mockRejectedValue(new Error('Nomor sudah dipakai.'));
    renderAdmin('/admin/pemilihan/1/ubah');

    await user.click(await screen.findByRole('button', { name: /ubah kandidat satu/i }));
    expect(screen.getByRole('heading', { name: 'Ubah kandidat' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Simpan kandidat' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Nomor sudah dipakai.');
    expect(update).toHaveBeenCalledWith(11, expect.objectContaining({ name: 'Kandidat Satu' }));

    await user.click(screen.getByRole('button', { name: 'Batal' }));
    expect(screen.queryByRole('heading', { name: 'Ubah kandidat' })).not.toBeInTheDocument();
  });

  it('menghapus kandidat dan menangani kegagalan', async () => {
    const user = userEvent.setup();
    vi.spyOn(electionApi, 'detail').mockResolvedValue(electionFixture());
    const remove = vi
      .spyOn(candidateApi, 'remove')
      .mockResolvedValueOnce(null)
      .mockRejectedValueOnce(new Error('Kandidat tidak dapat dihapus.'));
    renderAdmin('/admin/pemilihan/1/ubah');

    await user.click(await screen.findByRole('button', { name: /hapus kandidat satu/i }));
    await waitFor(() => expect(remove).toHaveBeenCalledWith(11));

    await user.click(await screen.findByRole('button', { name: /hapus kandidat dua/i }));
    await waitFor(() =>
      expect(Swal.fire).toHaveBeenLastCalledWith(
        expect.objectContaining({ icon: 'error', text: 'Kandidat tidak dapat dihapus.' }),
      ),
    );
  });

  it('tidak menghapus kandidat bila dibatalkan', async () => {
    const user = userEvent.setup();
    vi.spyOn(electionApi, 'detail').mockResolvedValue(electionFixture());
    const remove = vi.spyOn(candidateApi, 'remove');
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    renderAdmin('/admin/pemilihan/1/ubah');

    await user.click(await screen.findByRole('button', { name: /hapus kandidat satu/i }));

    expect(remove).not.toHaveBeenCalled();
  });
});
