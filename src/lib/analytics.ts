// Lightweight Plausible tracker. Safe during SSR/prerender (window undefined).

type PlausibleProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: PlausibleProps }) => void;
  }
}

export function trackEvent(event: string, props?: PlausibleProps) {
  if (typeof window === 'undefined') return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // never let analytics break the app
  }
}

export const track = {
  spotifyClick: (context: string) => trackEvent('spotify_click', { context }),
  signupSubmit: (result: 'success' | 'error') => trackEvent('signup_submit', { result }),
  bookingClick: (context: string) => trackEvent('booking_click', { context }),
  mixcloudClick: (context: string) => trackEvent('mixcloud_click', { context }),
};

// Detects Spotify links and delegates through document click, so any anchor
// added later (embed CTAs, footer links, admin-editable buttons) is tracked
// without wiring each one manually.
export function installGlobalAnchorTracking() {
  if (typeof window === 'undefined') return;
  document.addEventListener(
    'click',
    (e) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (!href) return;
      if (/(^https?:)?\/\/(open|play)\.spotify\.com\//i.test(href)) {
        track.spotifyClick(anchor.textContent?.trim().slice(0, 60) || 'anchor');
      } else if (href.startsWith('mailto:')) {
        const subject = href.split('subject=')[1] ?? '';
        track.bookingClick(decodeURIComponent(subject).slice(0, 60) || 'mailto');
      } else if (/mixcloud\.com\//i.test(href)) {
        track.mixcloudClick(anchor.textContent?.trim().slice(0, 60) || 'anchor');
      }
    },
    { capture: true },
  );
}