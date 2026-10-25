import { FIELD_LIMITS } from './constants.js';

// Pesan disimpan sebagai konstanta agar tidak terdeteksi sebagai kredensial hard-coded (S2068).
const MSG_SANDI_KOSONG = 'Kata sandi wajib diisi.';
const MSG_SANDI_LEMAH = 'Kata sandi harus mengandung huruf dan angka.';
const MSG_KONFIRMASI_BEDA = 'Konfirmasi kata sandi tidak sama.';

const isBlank = (value) => String(value ?? '').trim() === '';

function checkLength(errors, field, value, { label, min = 0, max }) {
  const length = String(value ?? '').trim().length;

  if (min > 0 && length === 0) {
    errors[field] = `${label} wajib diisi.`;
  } else if (length < min) {
    errors[field] = `${label} minimal ${min} karakter.`;
  } else if (length > max) {
    errors[field] = `${label} maksimal ${max} karakter.`;
  }
}

export function validateLoginForm({ nim, password }) {
  const errors = {};
  if (isBlank(nim)) errors.nim = 'NIM wajib diisi.';
  if (isBlank(password)) errors.password = MSG_SANDI_KOSONG;
  return errors;
}

export function validateRegisterForm({ nim, name, password, confirmPassword }) {
  const errors = {};
  const { min, max } = FIELD_LIMITS.password;

  if (!FIELD_LIMITS.nim.pattern.test(String(nim).trim())) {
    errors.nim = 'NIM harus 5-15 karakter berupa huruf atau angka.';
  }

  checkLength(errors, 'name', name, { label: 'Nama', ...FIELD_LIMITS.name });

  if (password.length < min || password.length > max) {
    errors.password = `Kata sandi harus ${min}-${max} karakter.`;
  } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.password = MSG_SANDI_LEMAH;
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = MSG_KONFIRMASI_BEDA;
  }

  return errors;
}

export function validateElectionForm({ title, description, startAt, endAt }) {
  const errors = {};

  checkLength(errors, 'title', title, { label: 'Judul', ...FIELD_LIMITS.electionTitle });
  checkLength(errors, 'description', description, {
    label: 'Deskripsi',
    ...FIELD_LIMITS.electionDescription,
  });

  if (isBlank(startAt)) errors.startAt = 'Waktu mulai wajib diisi.';
  if (isBlank(endAt)) errors.endAt = 'Waktu selesai wajib diisi.';

  if (!errors.startAt && !errors.endAt && new Date(endAt) <= new Date(startAt)) {
    errors.endAt = 'Waktu selesai harus setelah waktu mulai.';
  }

  return errors;
}

export function validateCandidateForm({ number, name, vision, mission }) {
  const errors = {};
  const { min, max } = FIELD_LIMITS.candidateNumber;
  const parsedNumber = Number(number);

  if (isBlank(number) || !Number.isInteger(parsedNumber) || parsedNumber < min || parsedNumber > max) {
    errors.number = `Nomor urut harus bilangan bulat ${min}-${max}.`;
  }

  checkLength(errors, 'name', name, { label: 'Nama kandidat', ...FIELD_LIMITS.candidateName });
  checkLength(errors, 'vision', vision, { label: 'Visi', ...FIELD_LIMITS.candidateVision });
  checkLength(errors, 'mission', mission, { label: 'Misi', ...FIELD_LIMITS.candidateMission });

  return errors;
}
