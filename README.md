# AutoCV - Frontend Only (Supabase + Vercel)

## Arsitektur
- **Frontend**: React + Vite → Deploy ke Vercel (gratis)
- **Database & Auth**: Supabase Free Tier (500MB DB, 2GB bandwidth, Edge Functions)
- **AI Proxy**: Supabase Edge Functions (Gemini API key aman di server)
- **Admin Panel**: Stateless token via Edge Function

## Setup Supabase (Sekali Saja)

1. Buat project di [supabase.com](https://supabase.com) (Free tier)
2. Buka **SQL Editor** → Jalankan isi `supabase/migrations/20241201_initial_schema.sql`
3. Buka **Project Settings > API** → Copy `Project URL` dan `anon public key`
4. Buka **Project Settings > Edge Functions** → Set secrets:
   - `GEMINI_API_KEY` = API key dari [Google AI Studio](https://aistudio.google.com/apikey)
   - `GEMINI_MODEL` = `gemini-2.0-flash` (opsional)
   - `ADMIN_PASSWORD` = password panel admin (hash SHA-256 dipakai untuk token)
   - `SUPABASE_SERVICE_ROLE_KEY` = `service_role` key dari Settings > API (untuk admin-orders)
5. (Opsional) Update `wa_admin` di tabel `config` via Table Editor

## Development Lokal

```bash
cd frontend
cp .env.example .env
# Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY dari Supabase project Anda
npm install
npm run dev
```

Atau pakai Supabase CLI untuk full local dev:
```bash
npx supabase start
npx supabase functions serve --env-file=.env.local
# VITE_SUPABASE_URL=http://localhost:54321
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Deploy ke Vercel

1. Push repo ke GitHub
2. Import project di Vercel → Framework: Vite
3. Environment Variables:
   - `VITE_SUPABASE_URL` = URL project Supabase
   - `VITE_SUPABASE_ANON_KEY` = anon key Supabase
4. Deploy → Done! Domain custom gratis di Vercel.

## Struktur Edge Functions

```
supabase/functions/
├── gemini-proxy/    # Proxy ke Gemini API (API key aman)
├── admin-login/     # Verifikasi password admin → return token
└── admin-orders/    # Ambil orders (butuh token admin + service role)
```

Deploy functions:
```bash
npx supabase functions deploy gemini-proxy
npx supabase functions deploy admin-login
npx supabase functions deploy admin-orders
```

## Catatan Penting

- **Tidak ada backend server** — semua API lewat Supabase
- **Gemini API key tidak pernah bocor ke browser** — hanya di Edge Function secrets
- **Admin panel** pakai token stateless (hash password). Ganti password = semua token hangus.
- **Rate limit** — Supabase Edge Functions punya limit gratis 500k invocations/bulan
- **File upload (foto CV)** — masih pakai base64 di localStorage. Kalau butuh persistent, tambah Supabase Storage.

## Migrasi dari Backend Lama

Yang dihapus:
- `backend/` folder (Express server, JSON file storage)
- Vite proxy config (`/api` → localhost:3001)
- In-memory rate limit, file-based orders

Yang baru:
- Supabase client di `src/lib/supabase.ts`
- API calls di `src/api.ts` → Supabase + Edge Functions
- SQL schema di `supabase/migrations/`
- Edge Functions di `supabase/functions/`