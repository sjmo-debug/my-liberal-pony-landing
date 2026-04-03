

## Add Navigation Bar Management to Admin Panel

### What's changing

The homepage navigation bar currently has two hardcoded links: "About" (internal link to `/about`) and "Instagram" (using the existing social link). We'll make these nav items fully editable from the admin panel.

### Data model

Add a `navigation` JSONB column to `mlp_site_config` storing an array of nav items:

```json
[
  { "label": "About", "url": "/about", "isExternal": false },
  { "label": "Instagram", "url": "https://instagram.com/...", "isExternal": true }
]
```

### Changes

| File | What |
|------|------|
| **Migration** | `ALTER TABLE mlp_site_config ADD COLUMN navigation jsonb` seeded with current two links |
| `src/contexts/MLPContext.tsx` | Add `MLPNavItem` interface and `navigation` field to `MLPSiteData` with defaults |
| `src/pages/Index.tsx` | Render nav items dynamically from `siteData.navigation` instead of hardcoded links |
| `src/pages/MLPAdmin.tsx` | Add a "Navigation" section (new tab or within Social & Contact) to add/remove/reorder nav items with label, URL, and internal/external toggle |

### Admin UI

Each nav item gets three fields: **Label**, **URL**, and an **External link** checkbox (opens in new tab vs internal route). Add/remove buttons for managing items.

