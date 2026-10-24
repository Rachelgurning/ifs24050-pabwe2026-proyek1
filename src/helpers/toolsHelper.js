import Swal from 'sweetalert2';

const PERCENT_DECIMALS = 1;
const INVALID_DATE_LABEL = '-';

const dateTimeFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' });
const pad = (value) => String(value).padStart(2, '0');

/** Memformat string ISO menjadi tanggal dan jam berbahasa Indonesia. */
export function formatDate(isoString) {
  const date = new Date(isoString);
  return Number.isNaN(date.getTime()) ? INVALID_DATE_LABEL : dateTimeFormat.format(date);
}

/** Mengubah string ISO menjadi nilai untuk `<input type="datetime-local">` (waktu lokal). */
export function toDateTimeLocalValue(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';

  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Mengubah nilai `datetime-local` (waktu lokal) menjadi string ISO UTC. */
export function fromDateTimeLocalValue(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

export function formatPercentage(value) {
  return `${Number(value).toFixed(PERCENT_DECIMALS).replace('.', ',')}%`;
}

export function formatVoteCount(count) {
  return `${new Intl.NumberFormat('id-ID').format(count)} suara`;
}

/** Mengambil maksimal dua huruf awal dari nama untuk avatar kandidat. */
export function getInitials(name) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

export function showSuccessDialog({ title = 'Berhasil', text = '' } = {}) {
  return Swal.fire({ icon: 'success', title, text, confirmButtonText: 'Tutup' });
}

export function showErrorDialog({ title = 'Gagal', text = '' } = {}) {
  return Swal.fire({ icon: 'error', title, text, confirmButtonText: 'Tutup' });
}

/** Dialog konfirmasi aksi destruktif; mengembalikan true bila pengguna menyetujui. */
export async function showConfirmDialog({ title = 'Lanjutkan?', text = '' } = {}) {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Ya, lanjutkan',
    cancelButtonText: 'Batal',
  });

  return Boolean(result.isConfirmed);
}
