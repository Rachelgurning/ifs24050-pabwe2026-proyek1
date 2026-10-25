import { tokenStorage } from '../utils/tokenStorage.js';

const BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');
const NETWORK_ERROR_MESSAGE = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
const SERVER_ERROR_MESSAGE = 'Terjadi kesalahan pada server.';
const HTTP_UNAUTHORIZED = 401;

export class ApiError extends Error {
  constructor(message, { status = 0, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

let unauthorizedHandler = null;

/** Mendaftarkan callback yang dipanggil ketika token ditolak server (HTTP 401). */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function buildHeaders({ hasBody, token }) {
  return {
    Accept: 'application/json',
    ...(hasBody && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function sendRequest(url, options) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError(NETWORK_ERROR_MESSAGE);
  }
}

/**
 * Pemanggilan API terpusat: menambahkan token, menormalkan error, dan mengembalikan `data`.
 * @returns {Promise<*>} isi properti `data` dari respons, atau null untuk 204.
 */
export async function request(path, { method = 'GET', body, signal } = {}) {
  const token = tokenStorage.get();
  const hasBody = body !== undefined;

  const response = await sendRequest(`${BASE_URL}${path}`, {
    method,
    signal,
    headers: buildHeaders({ hasBody, token }),
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  const payload = response.status === 204 ? null : await parseJson(response);

  if (!response.ok) {
    if (response.status === HTTP_UNAUTHORIZED && token) unauthorizedHandler?.();
    throw new ApiError(payload?.error?.message ?? SERVER_ERROR_MESSAGE, {
      status: response.status,
      details: payload?.error?.details,
    });
  }

  return payload?.data ?? null;
}
