# Quick Setup Guide

## 1. Run the database migration

The "Could not find the table 'public.students'" error means the database tables haven't been created yet.

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. Go to **SQL Editor**
3. Click **New query**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the editor and click **Run**
6. You should see "Success. No rows returned"

## 2. Add your first admin

1. In Supabase, go to **Authentication** → **Users** → **Add user**
2. Create a user with your admin email and password
3. Go back to **SQL Editor** and run:

```sql
INSERT INTO admin_users (id, email)
SELECT id, email FROM auth.users WHERE email = 'your@admin.email';
```

Replace `your@admin.email` with the email you used.

## 3. Restart the app

If the dev server is running, restart it and refresh the page.
