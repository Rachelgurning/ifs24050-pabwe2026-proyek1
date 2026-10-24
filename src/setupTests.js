import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// SweetAlert2 tidak dirender pada lingkungan jsdom; dialog cukup diverifikasi lewat mock.
vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  globalThis.localStorage?.clear();
});
