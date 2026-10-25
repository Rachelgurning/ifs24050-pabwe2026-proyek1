const ACCESS_TOKEN_KEY = 'votedel.token';
const NETWORK_ERROR_MESSAGE = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
const SERVER_ERROR_MESSAGE = 'Terjadi kesalahan pada server.';
const HTTP_UNAUTHORIZED = 401;
const HTTP_NO_CONTENT = 204;

/** Base URL REST API VoteDel, di-inject Vite melalui `define` pada vite.config.js. */
export const BASE_URL = String(VOTEDEL_BASEURL).replace(/\/$/, '');

/** Error terstandardisasi dari lapisan API (status HTTP + detail validasi per field). */
export class ApiError extends Error {
  constructor(message, { status = 0, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function getAccessToken() {
  try {
    return globalThis.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function putAccessToken(token) {
  try {
    globalThis.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // Penyimpanan diblokir peramban: sesi hanya berlaku sampai halaman dimuat ulang.
  }
}

export function removeAccessToken() {
  try {
    globalThis.localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // Tidak ada yang perlu dihapus.
  }
}

let unauthorizedHandler = null;

/** Mendaftarkan callback yang dipanggil ketika token ditolak server (HTTP 401). */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

function buildUrl(path, params) {
  const query = new URLSearchParams(
    Object.entries(params ?? {}).filter(([, value]) => value !== undefined && value !== null),
  ).toString();

  const search = query ? '?' + query : '';
  return BASE_URL + path + search;
}

/**
 * ID korelasi permintaan untuk keperluan pelacakan log (bukan nilai rahasia).
 * Math.random() aman di sini: ID tidak dipakai untuk autentikasi, token, atau kriptografi.
 */
export function createRequestId() {
  return Math.random().toString(36).slice(2, 12);
}

function buildHeaders({ hasBody, token }) {
  return {
    Accept: 'application/json',
    'X-Request-Id': createRequestId(),
    ...(hasBody && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Pembungkus fetch terpusat: menyisipkan bearer token, menormalkan error,
 * dan mengembalikan isi properti `data` dari respons API.
 * @returns {Promise<*>} data respons, atau null untuk HTTP 204.
 */
export async function fetchApi(path, { method = 'GET', body, params, signal } = {}) {
  const token = getAccessToken();
  const hasBody = body !== undefined;

  let response;
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      signal,
      headers: buildHeaders({ hasBody, token }),
      body: hasBody ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError(NETWORK_ERROR_MESSAGE);
  }

  const payload = response.status === HTTP_NO_CONTENT ? null : await parseJson(response);

  if (!response.ok) {
    if (response.status === HTTP_UNAUTHORIZED && token) unauthorizedHandler?.();
    throw new ApiError(payload?.error?.message ?? SERVER_ERROR_MESSAGE, {
      status: response.status,
      details: payload?.error?.details,
    });
  }

  return payload?.data ?? null;
}