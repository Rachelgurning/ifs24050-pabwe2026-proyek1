# ifs24050-pabwe2026-proyek1-frontend

Front-end **VoteDel** — sistem pemilihan suara online mahasiswa Institut Teknologi Del.
Proyek 1 matakuliah Pengembangan Aplikasi Berbasis Web (PABWE) 2026.

- Framework: **ReactJS** (Vite) + **Redux Toolkit** + React Router
- Back-end: repository & deployment **terpisah** → `ifs24050-pabwe2026-proyek1-backend`
- Pengujian: Vitest + Testing Library (jsdom)

## Menjalankan di komputer lokal

```bash
git clone <url-repo-frontend>
cd ifs24050-pabwe2026-proyek1-frontend
cp .env.example .env     # sesuaikan VITE_API_URL
bun install              # atau: npm install
bun run dev              # http://localhost:3000
```

Jalankan back-end lebih dulu (default `http://localhost:8000`) agar data tersedia.

### Variabel lingkungan

| Variabel             | Keterangan                                                                 |
| -------------------- | -------------------------------------------------------------------------- |
| `VITE_API_URL`       | Base URL REST API. Lokal `/api` (lewat proxy Vite), produksi URL HTTPS API. |
| `VITE_DEV_API_PROXY` | Target proxy saat pengembangan lokal (default `http://localhost:8000`).      |
| `VITE_BASE_PATH`     | Prefix hosting; `/` bila di root domain.                                     |
| `APP_PORT`           | Port dev server & preview (default `3000`).                                  |

## Perintah

| Perintah               | Fungsi                                  |
| ---------------------- | --------------------------------------- |
| `bun run dev`          | Dev server                              |
| `bun run build`        | Build produksi ke `dist/`               |
| `bun run preview`      | Pratinjau hasil build                   |
| `bun run lint`         | ESLint                                  |
| `bun run test`         | Seluruh pengujian                       |
| `bun run test:coverage`| Pengujian + laporan coverage (`lcov`)   |

## Struktur proyek

```
src/
├── App.jsx                     # Deklarasi rute + route guarding
├── main.jsx                    # Provider store + BrowserRouter
├── store.js                    # Single store Redux Toolkit
├── setupTests.js               # Konfigurasi Vitest + jsdom
├── test-utils.jsx              # renderWithProviders (store + router)
├── helpers/
│   ├── apiHelper.js            # Wrapper fetch + bearer token (localStorage)
│   └── toolsHelper.js          # Dialog SweetAlert2 + pemformatan tanggal/angka
├── hooks/                      # useInput, useForm, useDocumentMeta
├── components/                 # ProtectedRoute + komponen UI reusable
├── utils/                      # Konstanta rute/status + validasi formulir
└── features/
    ├── auth/                   # api · states · layouts · components · pages
    ├── elections/              # api · states · layouts · components · pages
    ├── votes/                  # api · states · components · pages
    └── admin/                  # api · components · pages
```

Setiap fitur mengikuti pola praktikum: `api/` (pemanggilan REST), `states/`
(action types, async thunk, slice reducer), `layouts/`, `components/`, `pages/`.

## Rute aplikasi

| Rute                        | Akses      | Halaman                          |
| --------------------------- | ---------- | -------------------------------- |
| `/`                         | Publik     | Beranda                          |
| `/auth/login`               | Tamu       | Masuk                            |
| `/auth/register`            | Tamu       | Daftar                           |
| `/pemilihan`                | Publik     | Daftar pemilihan + filter status |
| `/pemilihan/:id`            | Publik     | Detail & pemberian suara         |
| `/pemilihan/:id/hasil`      | Publik*    | Hasil perolehan suara            |
| `/riwayat`                  | Mahasiswa  | Riwayat partisipasi              |
| `/admin`                    | Admin      | Kelola pemilihan                 |
| `/admin/pemilihan/baru`     | Admin      | Buat pemilihan                   |
| `/admin/pemilihan/:id/ubah` | Admin      | Ubah pemilihan & kandidat        |

\* hasil hanya terbuka setelah pemilihan ditutup (admin dapat melihat kapan saja).

## CI/CD

`Jenkinsfile` menjalankan: checkout → install (bun) → test + coverage → Trivy →
SonarQube → Quality Gate → package → publish → deploy. Front-end dan back-end
memiliki pipeline serta deployment yang terpisah.
