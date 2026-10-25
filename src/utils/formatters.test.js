import { describe, expect, it } from 'vitest';
import {
  formatDateTime,
  formatPercentage,
  fromDateTimeLocalValue,
  getInitials,
  toDateTimeLocalValue,
} from './formatters.js';

describe('formatters', () => {
  it('mengembalikan tanda strip untuk tanggal tidak valid', () => {
    expect(formatDateTime('bukan-tanggal')).toBe('-');
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

  it('mengambil inisial maksimal dua huruf', () => {
    expect(getInitials('daniel pasaribu')).toBe('DP');
    expect(getInitials('Maria')).toBe('M');
    expect(getInitials('  ')).toBe('');
  });
});
