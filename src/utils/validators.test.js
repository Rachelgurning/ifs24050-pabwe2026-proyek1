import { describe, expect, it } from 'vitest';
import {
  validateCandidateForm,
  validateElectionForm,
  validateLoginForm,
  validateRegisterForm,
} from './validators.js';

describe('validateLoginForm', () => {
  it('mewajibkan NIM dan kata sandi', () => {
    expect(validateLoginForm({ nim: ' ', password: '' })).toEqual({
      nim: 'NIM wajib diisi.',
      password: 'Kata sandi wajib diisi.',
    });
  });

  it('lolos untuk data lengkap', () => {
    expect(validateLoginForm({ nim: '11S24001', password: 'rahasia' })).toEqual({});
  });
});

describe('validateRegisterForm', () => {
  const valid = { nim: '11S24050', name: 'Mahasiswa Uji', password: 'Rahasia123', confirmPassword: 'Rahasia123' };

  it('menerima data valid', () => {
    expect(validateRegisterForm(valid)).toEqual({});
  });

  it('menolak NIM tidak valid dan konfirmasi yang berbeda', () => {
    const errors = validateRegisterForm({ ...valid, nim: '1', confirmPassword: 'Lain12345' });
    expect(errors.nim).toBeDefined();
    expect(errors.confirmPassword).toBeDefined();
  });

  it('mewajibkan kombinasi huruf dan angka pada kata sandi', () => {
    const errors = validateRegisterForm({ ...valid, password: 'hanyahuruf', confirmPassword: 'hanyahuruf' });
    expect(errors.password).toMatch(/huruf dan angka/);
  });
});

describe('validateElectionForm', () => {
  const valid = {
    title: 'Pemilihan Ketua BEM',
    description: '',
    startAt: '2026-11-01T08:00',
    endAt: '2026-11-05T08:00',
  };

  it('menerima jadwal yang benar', () => {
    expect(validateElectionForm(valid)).toEqual({});
  });

  it('menolak waktu selesai sebelum waktu mulai', () => {
    expect(validateElectionForm({ ...valid, endAt: '2026-10-31T08:00' }).endAt).toBeDefined();
  });

  it('menolak judul terlalu pendek', () => {
    expect(validateElectionForm({ ...valid, title: 'abc' }).title).toMatch(/minimal 5/);
  });
});

describe('validateCandidateForm', () => {
  const valid = { number: '1', name: 'Kandidat Satu', vision: '', mission: '' };

  it('menerima kandidat valid', () => {
    expect(validateCandidateForm(valid)).toEqual({});
  });

  it('menolak nomor urut di luar rentang', () => {
    expect(validateCandidateForm({ ...valid, number: '0' }).number).toBeDefined();
    expect(validateCandidateForm({ ...valid, number: '100' }).number).toBeDefined();
    expect(validateCandidateForm({ ...valid, number: '1.5' }).number).toBeDefined();
  });
});
