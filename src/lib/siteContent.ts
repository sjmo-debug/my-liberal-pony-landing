/**
 * Editable page text and links.
 *
 * Every field's `default` is EXACTLY the text that was hardcoded on the live site
 * before it became editable, so merging with an empty database changes nothing.
 *
 * Storage: only values the owner has changed are saved, inside the existing
 * `branding` JSON column of `mlp_site_config` under the key `content`. A blank
 * value means "use the standard text", so clearing a field is always a safe undo.
 */

export const DEFAULT_SEO_TITLE = 'OUMUAMUA - DEBUT SINGLE OUT NOW ON ALL STREAMING PLATFORMS';
export const DEFAULT_SEO_DESCRIPTION =
  'Listen to OUMUAMUA - the debut single from MY LIBERAL PONY as heard on BBC Introducing & The Hello Goodbye Show. Visit for more information on live events.';

export type ContentGroup = 'home' | 'about' | 'pages' | 'oumuamua' | 'seo';
export type ContentKind = 'text' | 'textarea' | 'url' | 'image';

export interface ContentField {
  key: string;
  label: string;
  default: string;
  group: ContentGroup;
  /** Sub-heading shown above the field inside its tab */
  section: string;
  kind?: ContentKind;
  hint?: string;
}

const f = <K extends string>(field: ContentField & { key: K }) => field;

export const CONTENT_FIELDS = [
  // ---- Home page ----------------------------------------------------------
  f({ key: 'homeHeadline', label: 'Main headline (big title at the top)', default: 'MY\u00a0LIBERAL PONY', group: 'home', section: 'Top of the page', hint: 'The tagline under it is in the Branding tab.' }),
  f({ key: 'spotlightLinkText', label: 'Link under the Listen button', default: 'OUMUAMUA →', group: 'home', section: 'Featured release' }),
  f({ key: 'watchTitle', label: 'Video section title', default: 'Watch', group: 'home', section: 'Video' }),
  f({ key: 'gigsUpcomingTitle', label: 'Upcoming gigs title', default: 'UPCOMING GIGS', group: 'home', section: 'Gigs', hint: 'The gig list itself comes from the Google Sheet (see the Gigs tab).' }),
  f({ key: 'gigsMerchLine', label: 'Line under upcoming gigs', default: 'Merch — At Shows Only.', group: 'home', section: 'Gigs' }),
  f({ key: 'gigsPreviouslyTitle', label: 'Past gigs title', default: 'Previously', group: 'home', section: 'Gigs' }),
  f({ key: 'contactTitle', label: 'Contact section title', default: 'Get in Touch', group: 'home', section: 'Contact' }),
  f({ key: 'contactBookingsLabel', label: 'First email label', default: 'Bookings', group: 'home', section: 'Contact' }),
  f({ key: 'contactOtherLabel', label: 'Second email label', default: 'Everything Else', group: 'home', section: 'Contact' }),
  f({ key: 'supportText', label: 'Support line above the coffee button', default: 'Support the music', group: 'home', section: 'Contact' }),
  f({ key: 'coffeeButton', label: 'Coffee button text', default: '☕ Buy Me a Coffee', group: 'home', section: 'Contact' }),
  f({ key: 'newsletterTitle', label: 'Sign-up title', default: 'Get the next one first', group: 'home', section: 'Newsletter sign-up' }),
  f({ key: 'newsletterBlurb', label: 'Sign-up sentence', default: 'New releases and gigs, before anywhere else. No spam.', group: 'home', section: 'Newsletter sign-up' }),
  f({ key: 'newsletterPlaceholder', label: 'Email box hint', default: 'YOUR EMAIL ADDRESS', group: 'home', section: 'Newsletter sign-up' }),
  f({ key: 'newsletterButton', label: 'Sign-up button', default: 'Sign Up', group: 'home', section: 'Newsletter sign-up' }),
  f({ key: 'newsletterSuccess', label: 'Message after signing up', default: "You're in.", group: 'home', section: 'Newsletter sign-up' }),
  f({ key: 'newsletterError', label: 'Message if sign-up fails', default: "That email didn't work — try again.", group: 'home', section: 'Newsletter sign-up' }),
  f({ key: 'spotifyArtistUrl', label: 'Spotify link (bottom of page)', default: 'https://open.spotify.com/artist/2BgfhrMJ3h63DMazpBwQwE', kind: 'url', group: 'home', section: 'Bottom links', hint: 'Instagram, SoundCloud, Bandcamp and YouTube links are in the Social tab.' }),
  f({ key: 'appleMusicUrl', label: 'Apple Music link (bottom of page)', default: 'https://music.apple.com/gb/artist/my-liberal-pony/1887096161', kind: 'url', group: 'home', section: 'Bottom links' }),

  // ---- About page ---------------------------------------------------------
  f({ key: 'aboutTitle', label: 'Page title', default: 'About the Artist', group: 'about', section: 'Headings and buttons' }),
  f({ key: 'aboutBackButton', label: 'Back button', default: 'BACK TO HOME', group: 'about', section: 'Headings and buttons' }),
  f({ key: 'aboutPortfolioButton', label: 'Portfolio button', default: 'CREATIVE PORTFOLIO', group: 'about', section: 'Headings and buttons' }),
  f({ key: 'pressTitle', label: 'Press list title', default: 'Press', group: 'about', section: 'Headings and buttons' }),

  // ---- Listen and Gallery pages ------------------------------------------
  f({ key: 'listenTitle', label: 'Listen page title', default: 'Listen', group: 'pages', section: 'Listen page' }),
  f({ key: 'listenSoundcloudTitle', label: 'SoundCloud section title', default: 'On SoundCloud', group: 'pages', section: 'Listen page' }),
  f({ key: 'listenBandcampTitle', label: 'Bandcamp section title', default: 'On Bandcamp', group: 'pages', section: 'Listen page' }),
  f({ key: 'listenBandcampButton', label: 'Bandcamp button', default: 'Open Bandcamp', group: 'pages', section: 'Listen page' }),
  f({ key: 'galleryTitle', label: 'Gallery page title', default: 'Gallery', group: 'pages', section: 'Gallery page' }),

  // ---- Oumuamua page ------------------------------------------------------
  f({ key: 'oumTitle', label: 'Release title', default: 'OUMUAMUA', group: 'oumuamua', section: 'Release' }),
  f({ key: 'oumLabel', label: 'Record label', default: 'Hot Earth Records', group: 'oumuamua', section: 'Release' }),
  f({ key: 'oumCover', label: 'Cover art', default: 'mlp/oumuamua-cover', kind: 'image', group: 'oumuamua', section: 'Release', hint: 'Leave blank to keep the current cover.' }),
  f({ key: 'oumListenTitle', label: 'Streaming links title', default: 'Listen everywhere', group: 'oumuamua', section: 'Streaming links' }),
  f({ key: 'oumSpotifyUrl', label: 'Spotify', default: 'https://open.spotify.com/artist/2BgfhrMJ3h63DMazpBwQwE', kind: 'url', group: 'oumuamua', section: 'Streaming links' }),
  f({ key: 'oumBandcampUrl', label: 'Bandcamp', default: 'https://myliberalpony.bandcamp.com/', kind: 'url', group: 'oumuamua', section: 'Streaming links' }),
  f({ key: 'oumAppleMusicUrl', label: 'Apple Music', default: 'https://music.apple.com/gb/artist/my-liberal-pony/1887096161', kind: 'url', group: 'oumuamua', section: 'Streaming links' }),
  f({ key: 'oumYoutubeUrl', label: 'YouTube', default: 'https://www.youtube.com/@MYLIBERALPONY', kind: 'url', group: 'oumuamua', section: 'Streaming links' }),
  f({ key: 'oumSoundcloudUrl', label: 'SoundCloud', default: 'https://soundcloud.com/myliberalpony', kind: 'url', group: 'oumuamua', section: 'Streaming links' }),
  f({ key: 'oumLyricsTitle', label: 'Lyrics heading', default: 'Lyrics', group: 'oumuamua', section: 'Lyrics and credits' }),
  f({ key: 'oumLyrics', label: 'Lyrics', default: '[Lyrics coming soon]', kind: 'textarea', group: 'oumuamua', section: 'Lyrics and credits' }),
  f({ key: 'oumCreditsTitle', label: 'Credits heading', default: 'Credits', group: 'oumuamua', section: 'Lyrics and credits' }),
  f({ key: 'oumCreditsWriting', label: 'Writing credit', default: 'Written by MY LIBERAL PONY', group: 'oumuamua', section: 'Lyrics and credits' }),
  f({ key: 'oumCreditsProduction', label: 'Production credit', default: 'Produced by MY LIBERAL PONY', group: 'oumuamua', section: 'Lyrics and credits' }),
  f({ key: 'oumCreditsMastering', label: 'Mastering credit', default: 'Mastered by [ENGINEER]', group: 'oumuamua', section: 'Lyrics and credits' }),

  // ---- Search engines and browser tab ------------------------------------
  f({ key: 'seoTitle', label: 'Browser tab / Google title', default: DEFAULT_SEO_TITLE, group: 'seo', section: 'Browser tab and Google', hint: 'Sub-pages add " - About", " - Listen" etc. after this.' }),
  f({ key: 'seoDescription', label: 'Google description', default: DEFAULT_SEO_DESCRIPTION, kind: 'textarea', group: 'seo', section: 'Browser tab and Google', hint: 'Aim for under about 160 characters.' }),
] as const;

export type ContentKey = (typeof CONTENT_FIELDS)[number]['key'];
export type MLPContent = Record<ContentKey, string>;

export const DEFAULT_CONTENT = Object.fromEntries(
  CONTENT_FIELDS.map((field) => [field.key, field.default]),
) as MLPContent;

/** Standard text overlaid with the owner's saved changes. Blank values fall back to the standard text. */
export function mergeContent(overrides: unknown): MLPContent {
  const out: MLPContent = { ...DEFAULT_CONTENT };
  if (overrides && typeof overrides === 'object') {
    for (const key of Object.keys(DEFAULT_CONTENT) as ContentKey[]) {
      const v = (overrides as Record<string, unknown>)[key];
      if (typeof v === 'string' && v.trim() !== '') out[key] = v;
    }
  }
  return out;
}

/** Only the fields that differ from the standard text (what actually gets saved). */
export function contentOverrides(content: MLPContent): Partial<MLPContent> {
  const out: Partial<MLPContent> = {};
  for (const key of Object.keys(DEFAULT_CONTENT) as ContentKey[]) {
    const v = content[key];
    if (typeof v === 'string' && v.trim() !== '' && v !== DEFAULT_CONTENT[key]) out[key] = v;
  }
  return out;
}
