# Easy photo adding in both admin panels

Add a single reusable photo picker used everywhere an image appears in the two admin panels. For each photo you can either drag/drop or choose a file from your device, or paste a link / Cloudinary ID if the image already lives somewhere. Every photo field shows a live thumbnail so you can see what you picked before saving.

Alongside this, theSJMO portfolio edits (currently lost on refresh) start saving permanently, so uploaded photos actually stick.

## Photo picker

One control, used in every photo slot:

- Upload from device (drag/drop or file browse), with progress and error messages
- Or paste an image link / existing Cloudinary ID
- Live thumbnail preview, plus a Remove button
- Accepts JPG, PNG, WebP, GIF up to 10 MB

Uploaded files go to a new public image store in the backend and get a permanent link.

## MY LIBERAL PONY admin (/admin)

Photo slots added to the existing tabs:

- Branding: logo image
- Spotlight: release artwork
- Press items: optional thumbnail per item
- Gallery: a managed list of gallery photos, each with caption and alt text, add / remove / reorder

Gallery currently shows two hardcoded images; it will read from the admin list instead, falling back to today's images while the list is empty.

## theSJMO admin (/theSJMO/admin)

Photo slots added:

- Bio: portrait photo, plus the home hero photo (currently only settable in code)
- Projects: cover photo per project, and the image list inside each project (add / remove / reorder, each with alt text, caption and optional credit)

## Permanent saving for theSJMO

Projects and artist info move from in-memory defaults to the database, matching how the MLP admin already works: public read, admin-only write, with the current file defaults used as the seed and as fallback if nothing is saved yet.

## Technical notes

- New storage bucket `site-photos` (public, 10 MB limit) with RLS on `storage.objects`: public read; insert/update/delete restricted to `has_role(auth.uid(), 'admin')`.
- New component `src/components/admin/PhotoField.tsx` — upload via `supabase.storage.from('site-photos').upload()`, public URL back, plus manual URL/Cloudinary ID entry. Resolution helper: full URL used as-is, bare ID passed through the existing `cloudinaryImage` helper.
- New table `public.sjmo_site_config` (single row: `projects jsonb`, `artist_info jsonb`, `updated_at`), GRANT select to anon/authenticated, all to service_role, admin-only write policies via `has_role`; `updated_at` trigger reused.
- `PortfolioContext` fetches that row on mount and writes on save, mirroring `MLPContext`; defaults in `src/data/portfolio/*` stay as the seed/fallback.
- MLP gallery list stored as a new `gallery` jsonb key on `mlp_site_config`; `MLPContext` types and `rowToSiteData` extended, `Gallery.tsx` reads from context.
- `ProjectImage.credit`, `ArtistInfo.portraitCredit`/`heroCredit` already exist and are reused.
- Existing broken-image fallbacks stay in place.
