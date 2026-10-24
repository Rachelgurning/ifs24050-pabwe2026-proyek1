# Checklist Vercel

- Repo yang diimport: frontend repo ini, bukan monorepo lama.
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables (Production): `VITE_API_URL=https://URL-BACKEND-ANDA/api`, `VITE_BASE_PATH=/`
- Pastikan URL backend HTTPS benar dan endpoint API dapat diakses dari browser.
- Karena `VITE_API_URL` adalah build-time variable, klik Redeploy setelah mengubahnya.
