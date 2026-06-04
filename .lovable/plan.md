## Add Buy Me a Coffee link & remove Press section

### Changes

**1. Buy Me a Coffee (https://buymeacoffee.com/myliberalpony)**
- Add `buyMeACoffeeUrl` field to `socialLinks` in `MLPContext` defaults and types.
- Render a "Buy Me a Coffee" button in the Bookings & Enquiries section on `Index.tsx`, below the email button.
- Add an editable field for the URL in the admin's "Social & Contact" tab in `MLPAdmin.tsx`.

**2. Remove Press**
- Remove the `<PressSection>` render and import from `Index.tsx`.
- Remove the "As heard on / BBC Introducing" badge block from `SpotlightSection.tsx` (and the unused `press` prop).
- Remove the "Press" tab and its editor UI from `MLPAdmin.tsx`.
- Clear the existing press item from the database so the badge no longer appears.

### Files
- `src/contexts/MLPContext.tsx` — extend `MLPSocialLinks` with `buyMeACoffee`, add default value.
- `src/pages/Index.tsx` — render new button in bookings section; remove PressSection.
- `src/components/SpotlightSection.tsx` — remove press badge block + prop.
- `src/pages/MLPAdmin.tsx` — add field in Social tab, drop Press tab.
- Database: update `mlp_site_config.press` to `[]`.

Press data structure stays in the schema (not deleted) in case you want it back later — it's just hidden from the UI and admin.
