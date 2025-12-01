# InMotion landing — Supabase waitlist integration

This small static site includes a waitlist form wired to Supabase. Follow the steps below to configure and test.

1) Create a Supabase project

- Go to https://app.supabase.com and create a new project.
- Create a table called `subscribers` with at least the following columns:
  - `id` (primary key, uuid or serial)
  - `email` (text)
  - `created_at` (timestamptz, default: now())

Example SQL to create a simple table:

```sql
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz default now()
);
```

2) Configure the frontend

- Copy `supabase-config.example.js` to `supabase-config.js` in the project root:

```bash
cp supabase-config.example.js supabase-config.js
```

- Edit `supabase-config.js` and fill `url` and `anonKey` with your project's values (find them in the Supabase project settings -> API).

3) (Important) Security notes

- The anon key is required for client-side usage but is visible to anyone who views your site. Protect your database with Row Level Security (RLS) and fine-grained policies. Only allow the actions the anonymous user must perform (e.g., insert into `subscribers`).

If you shared keys by mistake

- If you've posted or shared your project's anon key (for example, in public chat or a repository), rotate the key immediately from the Supabase dashboard (Project Settings -> API -> anon/public key). Treat any key that was shared as compromised.

- After rotating, update your local `supabase-config.js` and re-deploy.

- To reduce accidental commits, `supabase-config.js` is ignored via `.gitignore` in this project. You can also restrict the file on macOS with:

```bash
chmod 600 supabase-config.js
```

4) Deploying to Netlify (recommended)

You can keep the repo public while keeping your Supabase keys secret by having Netlify write the `supabase-config.js` file at build time from environment variables.

- Add `supabase-config.js` to `.gitignore` (already done).
- In this repo there is a small helper script at `scripts/write-supabase-config.js` and a `netlify.toml` that sets up the build command.

Steps:
1. Push the repo to GitHub.
2. In Netlify, create a new site and connect your GitHub repository.
3. In Netlify site settings → Build & deploy → Environment, add two environment variables:
  - `SUPABASE_URL` — your Supabase project URL (for example `https://xyzabc.supabase.co`)
  - `SUPABASE_ANON_KEY` — your Supabase anon/public key
4. Netlify will run the build command defined in `netlify.toml` which executes `node ./scripts/write-supabase-config.js`. This writes `supabase-config.js` into the deploy directory before publish.

That way the anon key never lives in your git history — it only exists in Netlify's secure environment during the build.

Note: If you prefer not to use a build step, you can still set environment variables and use a serverless function instead, but the build-time writer is the simplest for a static site.


4) Run locally

- Since this is a static site, you can open `index.html` directly in a browser or serve it with a simple static server. For a quick local test with Python 3:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

5) Test the form

- Enter an email in the form and submit. If configured correctly the email will be inserted into the `subscribers` table.

If you prefer to proxy form submissions through a server (to fully protect keys or to add verification), create a simple server endpoint that accepts the email and inserts using a server-side Supabase key.
