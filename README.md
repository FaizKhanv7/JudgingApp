# Hackathon Judging

Mobile-first live judging for an admin-configured number of shared-password judges. Scores and progress are stored only in Supabase; the browser never receives the Supabase service-role key.

## Local setup

1. Create a Supabase project, then open **SQL Editor** and run [`supabase/schema.sql`](./supabase/schema.sql).
2. Copy `.env.example` to `.env.local`, then supply the project URL, service-role key, and two separate passwords. The service-role key must never be set as a `NEXT_PUBLIC_` variable.
3. Install and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000`. Visit `/admin` to add judges and teams. Judge devices use the shared judge password, select a configured name, and receive a signed httpOnly session cookie.

## Vercel deployment

1. Push this folder to GitHub and import it in Vercel (framework: Next.js), or deploy with the Vercel CLI.
2. Under **Settings → Environment Variables**, add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JUDGE_PASSWORD`, and `ADMIN_PASSWORD` for Production (and Preview if needed).
3. Deploy. Open the production URL on each judge’s device. Updates poll every five seconds, so progress updates across phones without client-side Supabase access.

## Event notes

- Categories, their weights, and full rubrics are in the `categories` table. Changing a weight affects computed results immediately.
- Scores are an upsert constrained to one judge/team/category row; a locked judge cannot change scores or pick.
- Results reveal only once every configured judge has status `finished`. Tie-breaks use Visual Impact, then Ethical Analysis; an exact remaining tie is shown as co-winners.
- Teams are not seeded. Add the participating teams from `/admin` before the event.
