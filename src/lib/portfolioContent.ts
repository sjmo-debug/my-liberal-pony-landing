/**
 * Editable wording for the /theSJMO portfolio pages.
 *
 * Every field's `default` is EXACTLY the text that was hardcoded on the live site
 * before it became editable, so an empty database changes nothing.
 *
 * Storage: only values the owner has changed are saved, inside the existing
 * `artist_info` JSON under the key `content` (a plain key -> text map).
 * A blank value means "use the standard wording", so clearing a box is a safe undo.
 */

export type PortfolioContentGroup = 'home' | 'menu' | 'about' | 'contact';
export type PortfolioContentKind = 'text' | 'textarea' | 'projectType';

export interface PortfolioContentField {
  key: string;
  label: string;
  default: string;
  group: PortfolioContentGroup;
  /** Sub-heading shown above the field inside its tab */
  section: string;
  kind?: PortfolioContentKind;
  hint?: string;
}

const f = <K extends string>(field: PortfolioContentField & { key: K }) => field;

const SERVICE_DEFAULTS = [
  { type: 'visuals', title: 'Live Visuals', description: 'Bespoke audio-reactive visual identities for bands and events, via Iridiphore. 100+ performances delivered.' },
  { type: 'sound', title: 'Live Sound & Stage', description: 'Front-of-house engineering, stage management and logistics for gigs and multi-stage festivals.' },
  { type: 'production', title: 'Recording & Production', description: 'Tracking, production and engineering for singles and EPs, from DIY sessions to full studio builds.' },
  { type: 'performance', title: 'Performance & Session', description: 'Double bass, bass, guitar, drums and vocals for live shows, dep work and studio sessions.' },
  { type: 'consultation', title: 'Consultation', description: 'Event planning, accessible and inclusive programming, and guidance for artists building a live show.' },
] as const;

const serviceFields = SERVICE_DEFAULTS.flatMap((s, i) => {
  const n = i + 1;
  const section = `Card ${n} of 5`;
  return [
    f({ key: `service${n}Title`, label: 'Title', default: s.title, group: 'home', section }),
    f({ key: `service${n}Description`, label: 'Description', default: s.description, kind: 'textarea', group: 'home', section }),
    f({ key: `service${n}Type`, label: 'Opens the contact form as', default: s.type, kind: 'projectType', group: 'home', section, hint: 'Which project type is pre-selected when someone taps this card.' }),
  ];
});

export const PORTFOLIO_CONTENT_FIELDS = [
  // ---- Home page ----------------------------------------------------------
  f({ key: 'homeHeadline', label: 'Main headline', default: 'Simon Oliver — Live Visuals, Sound & Production', group: 'home', section: 'Top of the page', hint: 'The tagline and introduction under it are in the Bio section.' }),
  f({ key: 'homeAboutHeading', label: 'Heading', default: 'ABOUT MY WORK', group: 'home', section: 'About block' }),
  f({ key: 'homeAboutLink', label: 'Button text', default: 'Learn about the artist', group: 'home', section: 'About block' }),
  f({ key: 'homeServicesHeading', label: 'Heading', default: 'WHAT I DO', group: 'home', section: 'What I do' }),
  ...serviceFields,
  f({ key: 'homeFeaturedHeading', label: 'Heading', default: 'FEATURED', group: 'home', section: 'Featured projects' }),
  f({ key: 'homeViewAllButton', label: 'Button text', default: 'VIEW ALL PROJECTS', group: 'home', section: 'Featured projects' }),

  // ---- Menu and Projects page --------------------------------------------
  f({ key: 'navMainSite', label: 'Back to main site button', default: 'Main Site', group: 'menu', section: 'Menu' }),
  f({ key: 'navHome', label: 'Home', default: 'Home', group: 'menu', section: 'Menu' }),
  f({ key: 'navProjects', label: 'Projects', default: 'Projects', group: 'menu', section: 'Menu' }),
  f({ key: 'navAbout', label: 'About', default: 'About', group: 'menu', section: 'Menu' }),
  f({ key: 'navContact', label: 'Contact', default: 'Contact', group: 'menu', section: 'Menu' }),
  f({ key: 'projectsHeading', label: 'Page heading', default: 'PROJECTS', group: 'menu', section: 'Projects page' }),
  f({ key: 'projectsSubtitle', label: 'Subtitle', default: 'MUSIC — PRODUCTION — VISUAL ART', group: 'menu', section: 'Projects page' }),

  // ---- About page ---------------------------------------------------------
  f({ key: 'aboutPageHeading', label: 'Page heading', default: 'ABOUT', group: 'about', section: 'Headings' }),
  f({ key: 'aboutClientsHeading', label: 'Clients heading', default: 'SELECTED CLIENTS', group: 'about', section: 'Headings' }),
  f({ key: 'aboutStagesHeading', label: 'Shared stages heading', default: 'SHARED STAGES WITH', group: 'about', section: 'Headings' }),
  f({ key: 'aboutHighlightsHeading', label: 'Highlights heading', default: 'HIGHLIGHTS', group: 'about', section: 'Headings' }),
  f({ key: 'aboutExperienceHeading', label: 'Experience heading', default: 'EXPERIENCE', group: 'about', section: 'Headings' }),
  f({ key: 'aboutSkillsHeading', label: 'Skills heading', default: 'SKILLS', group: 'about', section: 'Headings' }),
  f({ key: 'aboutMethodologyHeading', label: 'Methodology heading', default: 'METHODOLOGY', group: 'about', section: 'Headings' }),
  f({ key: 'aboutMethodologySubtitle', label: 'Methodology subtitle', default: 'The Psychology Edge', group: 'about', section: 'Headings' }),
  f({ key: 'aboutDiscographyHeading', label: 'Discography heading', default: 'DISCOGRAPHY', group: 'about', section: 'Headings' }),
  f({ key: 'aboutJourneyHeading', label: 'Journey heading', default: 'THE JOURNEY', group: 'about', section: 'Headings' }),

  // ---- Contact page and form ---------------------------------------------
  f({ key: 'contactHeading', label: 'Page heading', default: 'GET IN TOUCH', group: 'contact', section: 'Top of the page' }),
  f({ key: 'contactSubtitle', label: 'Subtitle', default: "LET'S DISCUSS YOUR NEXT PROJECT", group: 'contact', section: 'Top of the page' }),
  f({ key: 'contactSendHeading', label: 'Heading', default: 'SEND A MESSAGE', group: 'contact', section: 'Message block' }),
  f({ key: 'contactSendIntro', label: 'Sentence', default: "Fill out the form below and I'll get back to you within 24-48 hours.", kind: 'textarea', group: 'contact', section: 'Message block', hint: 'The availability line from the Contact section is added after this sentence.' }),
  f({ key: 'contactInfoHeading', label: 'Heading', default: 'CONTACT INFO', group: 'contact', section: 'Contact info block' }),
  f({ key: 'contactInfoIntro', label: 'Sentence', default: "Prefer to reach out directly? Here's how.", group: 'contact', section: 'Contact info block' }),
  f({ key: 'formNameLabel', label: 'Name label', default: 'Name', group: 'contact', section: 'Form labels' }),
  f({ key: 'formNamePlaceholder', label: 'Name box hint', default: 'Your full name', group: 'contact', section: 'Form labels' }),
  f({ key: 'formEmailLabel', label: 'Email label', default: 'Email', group: 'contact', section: 'Form labels' }),
  f({ key: 'formEmailPlaceholder', label: 'Email box hint', default: 'your.email@example.com', group: 'contact', section: 'Form labels' }),
  f({ key: 'formTypeLabel', label: 'Project type label', default: 'Project Type', group: 'contact', section: 'Form labels' }),
  f({ key: 'formTypePlaceholder', label: 'Project type hint', default: 'Select project type', group: 'contact', section: 'Form labels' }),
  f({ key: 'formMessageLabel', label: 'Message label', default: 'Message', group: 'contact', section: 'Form labels' }),
  f({ key: 'formMessagePlaceholder', label: 'Message box hint', default: 'Tell me about your project...', group: 'contact', section: 'Form labels' }),
  f({ key: 'typeLabel_visuals', label: 'Visuals option', default: 'Live Visuals / Iridiphore', group: 'contact', section: 'Project type choices', hint: 'Only the words people see change. What is sent to you stays the same.' }),
  f({ key: 'typeLabel_sound', label: 'Sound option', default: 'Live Sound & Stage', group: 'contact', section: 'Project type choices' }),
  f({ key: 'typeLabel_production', label: 'Production option', default: 'Recording & Production', group: 'contact', section: 'Project type choices' }),
  f({ key: 'typeLabel_performance', label: 'Performance option', default: 'Performance / Session', group: 'contact', section: 'Project type choices' }),
  f({ key: 'typeLabel_consultation', label: 'Consultation option', default: 'Consultation', group: 'contact', section: 'Project type choices' }),
  f({ key: 'typeLabel_other', label: 'Other option', default: 'Something else', group: 'contact', section: 'Project type choices' }),
  f({ key: 'formButton', label: 'Send button', default: 'Send Message', group: 'contact', section: 'Button and messages' }),
  f({ key: 'formSending', label: 'Text while sending', default: 'Sending...', group: 'contact', section: 'Button and messages' }),
  f({ key: 'formSuccessTitle', label: 'Success title', default: 'Message Sent!', group: 'contact', section: 'Button and messages' }),
  f({ key: 'formSuccessText', label: 'Success sentence', default: "Thank you for reaching out. I'll get back to you as soon as possible.", kind: 'textarea', group: 'contact', section: 'Button and messages' }),
  f({ key: 'formError', label: 'Message if sending fails', default: 'Failed to send message. Please try again.', group: 'contact', section: 'Button and messages' }),
] as const;

export type PortfolioContentKey = (typeof PORTFOLIO_CONTENT_FIELDS)[number]['key'];
export type PortfolioContent = Record<PortfolioContentKey, string>;

export const DEFAULT_PORTFOLIO_CONTENT = Object.fromEntries(
  PORTFOLIO_CONTENT_FIELDS.map((field) => [field.key, field.default]),
) as PortfolioContent;

const PROJECT_TYPE_VALUES = ['visuals', 'sound', 'production', 'performance', 'consultation', 'other'];

/** Standard wording overlaid with the owner's saved changes. Blank values fall back to the standard wording. */
export function mergePortfolioContent(overrides: unknown): PortfolioContent {
  const out: PortfolioContent = { ...DEFAULT_PORTFOLIO_CONTENT };
  if (overrides && typeof overrides === 'object') {
    for (const field of PORTFOLIO_CONTENT_FIELDS) {
      const v = (overrides as Record<string, unknown>)[field.key];
      if (typeof v !== 'string' || v.trim() === '') continue;
      if (field.kind === 'projectType' && !PROJECT_TYPE_VALUES.includes(v)) continue;
      out[field.key] = v;
    }
  }
  return out;
}

/** Returns the saved overrides with one value changed. Blank or unchanged values are dropped so only real changes are stored. */
export function setPortfolioContentValue(
  overrides: Record<string, string> | undefined,
  key: PortfolioContentKey,
  value: string,
): Record<string, string> | undefined {
  const next = { ...(overrides ?? {}) };
  if (value.trim() === '' || value === DEFAULT_PORTFOLIO_CONTENT[key]) delete next[key];
  else next[key] = value;
  return Object.keys(next).length ? next : undefined;
}
