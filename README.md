# Arcer Certificate Verification

A professional certificate verification system for private tutoring. Graduates receive certificates with unique QR codes that link to a public verification page. Admins can manage students and generate downloadable QR codes for certificates.

## Features

- **Public pages**: Browse graduates, view full profiles, verify certificates via QR scan
- **Admin dashboard**: Add, edit, and manage students
- **Unique QR codes**: Each student gets a unique verification URL; QR is downloadable for certificates
- **Secure**: Supabase Auth + Row Level Security (RLS), admin-only mutations
- **Professional UI**: shadcn/ui with green theme, responsive design

## Tech Stack

- Next.js 14 (App Router)
- Supabase (PostgreSQL + Auth)
- TypeScript
- Tailwind CSS
- shadcn/ui components

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In the SQL Editor, run the migration at `supabase/migrations/001_initial_schema.sql`.
3. Add your first admin:
   - Sign up via Supabase Auth (Authentication → Users → Add user)
   - Copy the user ID, then run:
   ```sql
   INSERT INTO admin_users (id, email)
   VALUES ('your-user-uuid', 'your@admin.email');
   ```

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in.

**Important:** Use the **API Keys** tab in Supabase (Project Settings → API), **not** the Connection String or Session pooler tab.

- **Connection String / Session pooler** = for direct Postgres connections (Prisma, Drizzle, etc.)
- **API Keys** = for the Supabase JavaScript client (what this app uses)

From the API Keys tab, copy:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (e.g. `https://xxxxx.supabase.co`)
- **anon** key or **Publishable** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_VERIFY_BASE_URL=http://localhost:3000
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin pages (login, dashboard, add/edit students)
│   ├── api/             # API routes (QR download)
│   ├── students/        # Public graduate list and profiles
│   └── verify/          # QR verification page
├── components/
│   ├── ui/              # shadcn components
│   └── qr-code-display.tsx
├── lib/
│   ├── supabase/        # Supabase client (browser, server, middleware)
│   ├── admin.ts         # Admin check helper
│   └── utils.ts
└── types/
```

## Security

- **Row Level Security**: Students are readable by everyone; only admins can insert/update/delete.
- **Admin check**: Admin routes verify `auth.uid()` exists in `admin_users`.
- **No secrets in client**: Supabase anon key is safe for client use; RLS enforces server-side rules.
- **Input validation**: Form data is validated; Supabase enforces schema constraints.

## Version Control

- `.gitignore` excludes `node_modules`, `.env`, `.next`, and other build artifacts.
- Never commit `.env.local` or any file containing secrets.
- Use `next-env.d.ts` and keep `tsconfig.json` in version control.

## Deployment (Vercel)

1. **Push to GitHub** and import the project in [Vercel](https://vercel.com).
2. **Add environment variables** in Vercel → Project Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_VERIFY_BASE_URL` — **Critical for QR codes**

3. **Set `NEXT_PUBLIC_VERIFY_BASE_URL`** to your production URL:
   - Example: `https://your-app.vercel.app` or `https://certificates.arcer.com`
   - This is the base URL that gets encoded into QR codes. If it points to localhost, scanned QR codes will only work on your machine.
   - After deployment, update this to your live URL and redeploy.

4. **Deploy** — Vercel will build and deploy automatically.

### QR Code Behavior

- **Local dev**: Set `NEXT_PUBLIC_VERIFY_BASE_URL=http://localhost:3000` — QR codes will only work when scanned on the same machine.
- **Production**: Set `NEXT_PUBLIC_VERIFY_BASE_URL=https://your-live-domain.com` — QR codes will work when scanned by anyone.

## License

Private. All rights reserved.
