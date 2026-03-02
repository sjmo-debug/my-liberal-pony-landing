

## Update Newsletter with Real Mailchimp Credentials

### What's changing
Update `src/components/NewsletterSignup.tsx` with the actual Mailchimp form details extracted from your embedded form code.

### Details

**`src/components/NewsletterSignup.tsx`**:
- Update `MAILCHIMP_ACTION_URL` to: `https://myliberalpony.us15.list-manage.com/subscribe/post?u=74a9841949eb03e56b1133ee2&id=0eec7ce89e&f_id=001f9ce1f0`
- Add the Mailchimp honeypot field (hidden input named `b_74a9841949eb03e56b1133ee2_0eec7ce89e`) to prevent bot signups -- this is required by Mailchimp
- Everything else stays the same: custom styling, theme support, hidden iframe submission

### No other files change
The component is already wired up correctly in `Index.tsx`.

