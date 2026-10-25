const TOKEN_KEY = 'votedel.token';

/** Pembungkus localStorage yang aman bila penyimpanan diblokir peramban. */
export const tokenStorage = {
  get() {
    try {
      return globalThis.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  set(token) {
    try {
      globalThis.localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Penyimpanan tidak tersedia: sesi hanya berlaku sampai halaman dimuat ulang.
    }
  },

  clear() {
    try {
      globalThis.localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Abaikan: tidak ada yang perlu dihapus.
    }
  },
};
