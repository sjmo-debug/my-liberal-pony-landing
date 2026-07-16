# MY LIBERAL PONY — myliberalpony.co.uk

Website for MY LIBERAL PONY (experimental freak pop, UK), plus the `/theSJMO` portfolio section.

Single-page React app, hosted on **GitHub Pages** and deployed automatically by GitHub Actions on every push to `main`. The backend (site config, releases, newsletter signups, admin auth) is a self-owned **Supabase** project.

## Stack

- Vite 5 + React 18 + TypeScript, Tailwind CSS, shadcn/ui (Radix), React Router (`BrowserRouter`)
- Supabase (`@supabase/supabase-js`) for data + auth, secured with Row-Level Security
- Plausible analytics (cookieless)
- GitHub Actions → GitHub Pages for CI/CD

## Editing the site

Everything flows through Git:

```sh
npm ci          # install exact dependencies
npm run dev     # local dev server on http://localhost:8080
npm run build   # production build into dist/ (also writes SEO shells + 404.html)
npm run preview # serve the production build locally
npm run lint    # eslint (informational; not a deploy gate)
```

Push to `main` (or merge a PR) and `.github/workflows/deploy.yml` builds and publishes to GitHub Pages automatically. No other publishing step exists.

Content stored in the database (spotlight release, videos, social links, branding) is edited live at `/login` → `/admin` with an admin account — no deploy needed for those changes.

## Backend (Supabase)

- Connection values live in the committed `.env` (`VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`). The publishable/anon key is public by design; all access control is enforced by RLS policies.
- The schema is fully described by `supabase/migrations/`. To rebuild the backend from scratch: create a Supabase project, `npx supabase link --project-ref <ref>`, `npx supabase db push`.
- Tables: `mlp_site_config` (single-row site config), `releases`, `newsletter_subscribers`, `user_roles` (drives admin RLS checks).
- Admin access: create a user in Supabase Dashboard → Authentication, then insert a row into `public.user_roles` with `role = 'admin'`.

## Hosting / DNS

- GitHub Pages serves `dist/` via the Actions workflow; `public/CNAME` pins the custom domain.
- DNS: apex `A` records → 185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153, `www` `CNAME` → `sjmo-debug.github.io`.
- SPA routing: the build emits static SEO shells for `/`, `/about`, `/listen`, `/oumuamua` (see `prerenderPlugin` in `vite.config.ts`) and a `404.html` fallback so deep links to client-side routes work on Pages.

## History

Originally built with Lovable; migrated fully to GitHub-based editing/hosting and a self-owned Supabase backend in July 2026. No Lovable services or packages are used anymore.
