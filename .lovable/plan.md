

## Hash the Admin Password

Currently the password `sjm0sjm0sjm0` is stored as plaintext on line 24. Anyone inspecting the JS bundle can read it. While this is client-side only (so never truly secure), we can raise the bar significantly by storing a SHA-256 hash and comparing against that.

### Approach

**`src/pages/portfolio/PortfolioAdmin.tsx`**

1. Replace the plaintext constant with a pre-computed SHA-256 hash of `sjm0sjm0sjm0`
2. Create an async `hashPassword` utility using the built-in Web Crypto API (`crypto.subtle.digest('SHA-256', ...)`) — no new dependencies
3. Make `handleLogin` async: hash the user input, compare to the stored hash
4. Remove the plaintext password entirely from the source code

The hash will be computed once and hardcoded as a hex string constant. The login handler will hash the entered password at runtime and compare the two strings.

### Limitation

This is still client-side — a determined attacker could bypass the check entirely by modifying JS in devtools. But the password itself will no longer be readable from the source. For true security, server-side auth (e.g. Supabase Auth) would be needed.

