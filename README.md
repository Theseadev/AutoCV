# AIGen CV — Pro Resume Builder

Website builder CV dengan AI (Gemini), live preview A4, ATS auditor, checkout WhatsApp, dan panel admin.
Stack: **React + TypeScript (TSX) + Vite** di frontend, **Node.js + Express + TypeScript** di backend.

## Cara menjalankan (dev)

1. **Isi API key Gemini** — edit `backend/.env` (salin dari `.env.example`), isi `GEMINI_API_KEY` dari https://aistudio.google.com/apikey
2. **Jalankan backend** (terminal 1):
   ```
   cd backend && npm install && npm run dev
   ```
3. **Jalankan frontend** (terminal 2):
   ```
   cd frontend && npm install && npm run dev
   ```
4. Buka http://localhost:5173 — Vite mem-proxy `/api` ke backend :3001
5. **Atur password & nomor WA admin** — di `backend/.env`: `ADMIN_PASSWORD` (password panel admin, tersimpan hanya di server) dan `WA_ADMIN` (nomor WhatsApp tujuan checkout, tanpa +).

## Struktur

```
backend/
  src/server.ts      — API: proxy Gemini (/api/generate) + simpan/ambil order (/api/orders)
  data/orders.json   — database order (dibuat otomatis)
  .env               — GEMINI_API_KEY, GEMINI_MODEL, PORT (jangan di-commit)
frontend/
  src/App.tsx        — navbar + routing view + state global (cv)
  src/components/    — StoreView, BuilderView (editor + preview A4), AtsView, AdminView
  src/api.ts         — panggilan API (Gemini proxy, orders, login admin, config)
  src/cv.ts          — tipe data, parse skills, builder HTML kertas CV (untuk PDF)
  src/pdf.ts         — export PDF bersih via html2pdf.js (CDN)
```

## Production (opsional)

```
cd frontend && npm run build   # → frontend/dist
cd backend && npm run build && npm start   # Express melayani dist + API di :3001
```

## Fitur

- **Toko Template** — 2 produk, klik "Pakai Template" masuk ke builder
- **CV Builder** — form + live preview A4 ber-watermark (auto-scale pas layar); AI: generate profil, poles deskripsi, rekomendasi skill
- **Checkout WA** — order tersimpan ke `backend/data/orders.json`, pembeli diarahkan ke WhatsApp admin
- **AI ATS Auditor** — skor kelayakan vs deskripsi lowongan, kata kunci kurang, saran perbaikan, ringkasan teroptimasi (bisa diterapkan ke CV)
- **Panel Admin** — daftar order dari backend; "Unduh PDF Asli" merender CV tanpa watermark via html2pdf.js

## Catatan

- Model Gemini dikonfigurasi di `backend/.env` (`GEMINI_MODEL=gemini-2.0-flash`).
- Panel admin dilindungi `ADMIN_PASSWORD` di `backend/.env`; `GET /api/orders` butuh token dari `POST /api/login`.
- `/api/generate` di-rate-limit (15 permintaan/menit per IP) untuk melindungi kuota Gemini.
- Nomor WA admin dibaca dari `backend/.env` (`WA_ADMIN`) via `GET /api/config` — ganti tanpa rebuild frontend.
- Harga checkout di tombol builder hardcoded Rp 25.000; sesuaikan di `BuilderView.tsx` jika mau dinamis per template.
