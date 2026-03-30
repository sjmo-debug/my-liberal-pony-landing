

## MLP Admin Panel

### What it manages

The main MLP site has a mix of content sources:
- **Already editable via Google Sheets**: gigs, about page text, background text/video pairs
- **Hardcoded in source files**: YouTube video embeds, SoundCloud embed, social links, contact email, page titles

The admin panel would cover the hardcoded content — the stuff you currently need to ask me to change.

### Same model as SJMO admin

Like the SJMO admin, this would be **local-only** (changes reset on refresh) and serve as a preview/staging tool. The actual values live in source code, so after previewing changes you'd still commit them here in chat. This is a client-side app limitation — there's no database to persist to without adding Supabase.

### Proposed route and structure

**Route**: `/admin` (password-protected, same SHA-256 approach as SJMO)

**Tabs**:

| Tab | Editable fields |
|-----|----------------|
| **Videos** | Video 1 YouTube URL/ID + title, Video 2 YouTube URL/ID + title, SoundCloud embed URL |
| **Social & Contact** | Email address, Instagram URL, SoundCloud URL, Bandcamp URL, YouTube URL |
| **Branding** | Site title, page subtitle text, Cloudinary logo ID |

### Files

| File | Change |
|------|--------|
| `src/pages/MLPAdmin.tsx` | New file — admin panel component with password gate, tabs, and edit forms |
| `src/contexts/MLPContext.tsx` | New file — React Context to hold editable MLP site data, with defaults pulled from current hardcoded values |
| `src/App.tsx` | Add `/admin` route wrapped in the new context provider; wrap Index/About/etc. in the provider |
| `src/pages/Index.tsx` | Read video URLs, social links, contact email from context instead of hardcoded values |

### Design

Matches the MLP aesthetic (not the SJMO brutalist style) — dark background, the same font and border styling used on the main site, uppercase tracking. Clean and minimal.

### Limitation

Same as SJMO: client-side only, changes are local. For persistent editing without code changes, you'd need a backend (Supabase or similar) — happy to plan that as a follow-up if you want.

