import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ApiError,
  createRequestId,
  fetchApi,
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  setUnauthorizedHandler,
} from './apiHelper.js';

function mockResponse({ status = 200, body = null } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe('apiHelper: token', () => {
  afterEach(() => removeAccessToken());

  it('menyimpan, membaca, dan menghapus access token', () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken('token-123');
    expect(getAccessToken()).toBe('token-123');
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });
});

describe('apiHelper: createRequestId', () => {
  it('menghasilkan ID alfanumerik non-kosong yang berbeda tiap pemanggilan', () => {
    const first = createRequestId();
    const second = createRequestId();

    expect(first).toMatch(/^[a-z0-9]+$/);
    expect(first).not.toBe(second);
  });
});

describe('apiHelper: fetchApi', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    removeAccessToken();
    setUnauthorizedHandler(null);
    vi.restoreAllMocks();
  });

  it('mengembalikan properti data dari respons sukses', async () => {
    globalThis.fetch.mockResolvedValue(mockResponse({ body: { data: { id: 1 } } }));

    await expect(fetchApi('/elections')).resolves.toEqual({ id: 1 });
  });

  it('menyisipkan bearer token dan query params', async () => {
    putAccessToken('token-123');
    globalThis.fetch.mockResolvedValue(mockResponse({ body: { data: [] } }));

    await fetchApi('/elections', { params: { status: 'active' } });

    const [url, options] = globalThis.fetch.mock.calls[0];
    expect(url).toContain('/elections?status=active');
    expect(options.headers.Authorization).toBe('Bearer token-123');
    expect(options.headers['X-Request-Id']).toMatch(/^[a-z0-9]+$/);
  });

  it('mengembalikan null untuk respons 204', async () => {
    globalThis.fetch.mockResolvedValue(mockResponse({ status: 204 }));

    await expect(fetchApi('/elections/1', { method: 'DELETE' })).resolves.toBeNull();
  });

  it('melempar ApiError berisi pesan dan detail validasi server', async () => {
    globalThis.fetch.mockResolvedValue(
      mockResponse({
        status: 400,
        body: { error: { message: 'Data tidak valid.', details: { title: 'wajib diisi' } } },
      }),
    );

    await expect(fetchApi('/elections', { method: 'POST', body: {} })).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
      details: { title: 'wajib diisi' },
    });
  });

  it('memanggil unauthorized handler ketika token ditolak server', async () => {
    const handler = vi.fn();
    putAccessToken('token-kedaluwarsa');
    setUnauthorizedHandler(handler);
    globalThis.fetch.mockResolvedValue(mockResponse({ status: 401, body: null }));

    await expect(fetchApi('/auth/me')).rejects.toBeInstanceOf(ApiError);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('menerjemahkan kegagalan jaringan menjadi pesan yang ramah', async () => {
    globalThis.fetch.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(fetchApi('/elections')).rejects.toThrow(/Tidak dapat terhubung/);
  });
});