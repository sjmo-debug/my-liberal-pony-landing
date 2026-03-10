

## Password-Protect & Hide the Admin Page

Simple client-side approach: remove "Admin" from the nav, and gate the admin page behind a password prompt stored in React state (session only).

### Changes

**1. `src/components/portfolio/PortfolioLayout.tsx`**
- Remove the Admin link from `navLinks` array
- Admin is only accessible by navigating directly to `/theSJMO/admin`

**2. `src/pages/portfolio/PortfolioAdmin.tsx`**
- Add a `useState` boolean `isAuthenticated` (defaults `false`)
- When not authenticated, render a brutalist-styled password form instead of the admin content
- Hardcode the password check against a constant (e.g. `"sjmo2024"`) — or store it in an environment variable via Lovable secrets
- On correct password, set `isAuthenticated = true` for the session
- On wrong password, show an error message

No database or auth service needed — this is a simple client-side gate. The password is only meant to keep casual visitors out, not provide real security.

