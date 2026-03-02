

## Fix: Newsletter form not submitting to Mailchimp

### Problem
`e.preventDefault()` in the `handleSubmit` function (line 21) blocks the form's native HTML POST to the hidden iframe. The email never reaches Mailchimp -- the form just shows a fake "success" message after a timeout.

### Fix

**`src/components/NewsletterSignup.tsx`** -- modify `handleSubmit`:
- Remove `e.preventDefault()`
- Keep the email validation, but call `e.preventDefault()` only when validation fails (to block invalid submissions)
- When validation passes, let the form submit naturally and set the loading/success states via timeout

```text
Before:
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();                          <-- blocks ALL submissions
    const trimmed = email.trim();
    if (!trimmed || ...) return;
    setStatus('loading');
    setTimeout(() => { setStatus('success'); ... }, 2000);
  };

After:
  const handleSubmit = (e: FormEvent) => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      e.preventDefault();                        <-- only block invalid submissions
      return;
    }
    setStatus('loading');
    setTimeout(() => { setStatus('success'); setEmail(''); }, 2000);
    // form submits naturally to the hidden iframe
  };
```

No other files need changes.

