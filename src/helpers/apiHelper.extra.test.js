import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchApi, getAccessToken, putAccessToken, removeAccessToken } from './apiHelper.js';

describe('apiHelper: kondisi tepi', () => {
  afterEach(() => vi.restoreAllMocks());

  it('tetap aman ketika localStorage diblokir peramban', () => {
    const blocked = () => {
      throw new Error('blocked');
    };
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked);
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(blocked);

    expect(getAccessToken()).toBeNull();
    expect(() => putAccessToken('token')).not.toThrow();
    expect(() => removeAccessToken()).not.toThrow();
  });

  it('memakai pesan bawaan ketika respons error bukan JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new SyntaxError('bukan JSON');
      },
    });

    await expect(fetchApi('/elections')).rejects.toMatchObject({
      message: 'Terjadi kesalahan pada server.',
      status: 500,
    });
  });

  it('meneruskan AbortError tanpa diubah', async () => {
    const abort = new DOMException('Dibatalkan', 'AbortError');
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(abort);

    await expect(fetchApi('/elections')).rejects.toBe(abort);
  });
});
