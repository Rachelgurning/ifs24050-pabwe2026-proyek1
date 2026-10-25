import { describe, expect, it } from 'vitest';
import { validateCandidateForm, validateLoginForm } from './validators.js';

describe('validators: batas maksimal', () => {
  it('menolak visi yang melebihi batas karakter', () => {
    const errors = validateCandidateForm({
      number: '1',
      name: 'Kandidat Satu',
      vision: 'a'.repeat(501),
      mission: '',
    });

    expect(errors.vision).toBe('Visi maksimal 500 karakter.');
  });

  it('mewajibkan NIM dan kata sandi saat masuk', () => {
    expect(Object.keys(validateLoginForm({ nim: ' ', password: '' }))).toEqual(['nim', 'password']);
  });
});
