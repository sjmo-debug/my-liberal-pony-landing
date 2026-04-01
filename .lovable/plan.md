

## Persistent MLP Admin with Lovable Cloud

### Goal
Replace the in-memory React context with a Lovable Cloud database table so admin changes survive page refreshes and deploys.

### Database

**Table: `mlp_site_config`**
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Single row |
| `videos` | jsonb | Array of `{youtubeId, title}` |
| `soundcloud_embed_url` | text | |
| `contact_email` | text | |
| `social_links` | jsonb | `{instagram, soundcloud, bandcamp, youtube}` |
| `branding` | jsonb | `{siteTitle, pageSubtitle, cloudinaryLogoId}` |
| `updated_at` | timestamptz | Auto-updated |

RLS: public read (no auth needed to display site), write restricted to authenticated admin.

### Authentication

Add a simple Lovable Cloud auth gate for the admin page instead of the current client-side SHA-256 password check. This provides real security — the current hash approach is visible in source code.

### Changes

| File | What |
|------|------|
| **Migration** | Create `mlp_site_config` table with a seed row containing current defaults |
| `src/contexts/MLPContext.tsx` | Fetch config from Supabase on mount; `updateSiteData` writes to DB via upsert |
| `src/pages/MLPAdmin.tsx` | Remove client-side password gate → use Supabase auth session check; Save button calls the context's `updateSiteData` which persists to DB |
| `src/pages/Index.tsx` | No change needed — already reads from context |

### How it works

1. On site load, `MLPContext` fetches the single config row from `mlp_site_config`
2. Falls back to hardcoded defaults if the row doesn't exist yet
3. Admin page authenticates via Supabase, edits the draft, hits Save
4. Save upserts the row → context updates → site reflects changes immediately
5. On next page load, the saved config is fetched from the database

### What stays the same
- The admin UI layout and tabs
- The context API (`useMLP()` hook)
- Google Sheets integration for gigs/about/background (unchanged)

