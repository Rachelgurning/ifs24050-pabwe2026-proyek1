import { describe, expect, it, vi } from 'vitest';
import Swal from 'sweetalert2';

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));
import {
  formatDate,
  formatPercentage,
  formatVoteCount,
  fromDateTimeLocalValue,
  getInitials,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
  toDateTimeLocalValue,
} from './toolsHelper.js';

describe('toolsHelper: pemformatan', () => {
  it('mengembalikan tanda strip untuk tanggal tidak valid', () => {
    expect(formatDate('bukan-tanggal')).toBe('-');
  });

  it('mengubah nilai datetime-local bolak-balik tanpa kehilangan menit', () => {
    const local = '2026-11-01T08:30';
    expect(toDateTimeLocalValue(fromDateTimeLocalValue(local))).toBe(local);
  });

  it('mengembalikan string kosong untuk nilai tanggal tidak valid', () => {
    expect(toDateTimeLocalValue('xx')).toBe('');
    expect(fromDateTimeLocalValue('')).toBe('');
  });

  it('memformat persentase dengan koma desimal', () => {
    expect(formatPercentage(66.666)).toBe('66,7%');
    expect(formatPercentage(0)).toBe('0,0%');
  });

  it('memformat jumlah suara', () => {
    expect(formatVoteCount(1500)).toContain('suara');
  });

  it('mengambil inisial maksimal dua huruf', () => {
    expect(getInitials('budi santoso wijaya')).toBe('BS');
    expect(getInitials('tunggal')).toBe('T');
  });
});

describe('toolsHelper: dialog', () => {
  it('menampilkan dialog sukses dan gagal', async () => {
    await showSuccessDialog({ title: 'Berhasil', text: 'Tersimpan' });
    await showErrorDialog({ title: 'Gagal', text: 'Server error' });

    expect(Swal.fire).toHaveBeenCalledTimes(2);
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success' }));
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'error' }));
  });

  it('mengembalikan true hanya ketika konfirmasi disetujui', async () => {
    expect(await showConfirmDialog({ title: 'Hapus?' })).toBe(true);

    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirmDialog({ title: 'Hapus?' })).toBe(false);
  });

  it('memakai teks tombol bawaan', async () => {
    vi.clearAllMocks();
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    await showConfirmDialog();
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ showCancelButton: true }));
  });
});
