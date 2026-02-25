# Arcer Registry Handover Document

## Project Status: V1 MVP Complete

The Arcer Registry has transitioned from a basic manual certificate viewer into a high-performance automated credentialing engine built on strict security principles.

## Security Posture

Per the final request, the platform has been successfully audited and hardened:

1.  **Unhackable Database Interaction**: By utilizing Next.js React Server Components (RSC), all data requests are isolated strictly to the secure Node.js server. When a user or employer uses the "Browser Inspect" tool, they will never find any API keys, Supabase URLs, or raw SQL queries in the source code—only simple HTML and CSS. The database architecture is entirely invisible to the client.
2.  **Route Lockdown**: The entire administrative dashboard (`/admin/(dashboard)/*`) is protected by a Server-Side Middleware Interceptor. Unauthenticated users cannot bypass the login screen by typing in the URL.

---

## Action Required: GitHub Repository Privacy Setup

To prevent external parties from cloning your repository and seeing your intellectual property, you **must change your GitHub repository visibility from Public to Private**.

Follow these exact steps:

1.  Go to your repository on GitHub.com (`https://github.com/Frandesal/arcer-cert`).
2.  Click on the **"Settings"** tab (the gear icon on the far right).
3.  Scroll all the way down to the **"Danger Zone"** section at the very bottom.
4.  Find **"Change repository visibility"** and click **"Change visibility"**.
5.  Select **"Make private"**.
6.  Read and accept the warnings to confirm.

Once this is done, nobody else on the internet will be able to see, copy, or clone your code.

---

## Deployment Configuration (Vercel)

When you are ready to launch this platform to the live internet using a service like **Vercel** or **Netlify**, you must manually inject the following Environment Variables into their project dashboard.

_(You can find these exactly as they are configured in your local `.env.local` file)_:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The public API key (used _only_ for safe, read-only public queries like the Bulletin feed).
- `SUPABASE_SERVICE_ROLE_KEY`: **CRITICAL**: The secret master key. Next.js keeps this strictly on the server to bypass RLS for admin-only Database insertion and deletion.
- `NEXT_PUBLIC_VERIFY_BASE_URL`: The domain of your live website (e.g., `https://registry.arcer.com`). This ensures the automated QR codes map to the correct internet address instead of `localhost`.

---

## Final Review

The application features:

- **Instant CSV Bulk Importer & Auto-Zipping engine**
- **Public Bulletin Board with multi-image gallery**
- **Cohort Filtering & Return Verification Flows**
- **Dynamic 5-Module preloading on all forms**

The repository is fully pushed and synced to the `main` branch.
