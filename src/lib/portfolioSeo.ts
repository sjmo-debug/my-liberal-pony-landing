/**
 * Single source of truth for theSJMO page titles, descriptions and crawlable
 * text. Used by the browser (SEOHead) and by the build (vite.config.ts static
 * shells) so the two can never drift apart.
 *
 * Keep this file free of `@/` alias imports: vite.config.ts imports it.
 */
import type { ArtistInfo, Project } from '../types/portfolio';
import { cloudinaryPresets } from './cloudinary';

export const PORTFOLIO_BASE_PATH = '/theSJMO';

export const DEFAULT_SHARE_IMAGE = cloudinaryPresets.heroGrayscale('sjmo_portfolio/hero-live');

export type PortfolioPage =
  | { kind: 'home' }
  | { kind: 'projects' }
  | { kind: 'about' }
  | { kind: 'contact' }
  | { kind: 'project'; project: Project };

export interface PortfolioMeta {
  /** Path below the site root, no trailing slash, e.g. "/theSJMO/projects" */
  path: string;
  title: string;
  description: string;
  image: string;
  type: 'website' | 'article';
  h1: string;
  /** Paragraphs separated by a blank line */
  bodyText: string;
  links?: { href: string; text: string }[];
  jsonLd?: Record<string, unknown>;
}

export function composeTitle(info: Pick<ArtistInfo, 'name' | 'tagline'>, title?: string): string {
  return title ? `${title} | ${info.name}` : `${info.name} - ${info.tagline}`;
}

export function projectPath(slug: string): string {
  return `${PORTFOLIO_BASE_PATH}/project/${slug}`;
}

function absolute(url: string, origin: string): string {
  if (!url) return url;
  if (/^(https?:)?\/\//.test(url)) return url;
  return origin + (url.startsWith('/') ? url : '/' + url);
}

export function buildPortfolioMeta(
  info: ArtistInfo,
  projects: Project[],
  page: PortfolioPage,
  origin = '',
): PortfolioMeta {
  const name = info.name;
  const sameAs = Object.values(info.socialLinks || {}).filter(Boolean);
  const person = {
    '@type': 'Person',
    name,
    jobTitle: info.tagline,
    ...(info.email ? { email: info.email } : {}),
    ...(info.location ? { address: info.location } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };

  switch (page.kind) {
    case 'home':
      return {
        path: PORTFOLIO_BASE_PATH,
        title: composeTitle(info),
        description: info.heroIntroduction,
        image: DEFAULT_SHARE_IMAGE,
        type: 'website',
        h1: `${name} — Live Visuals, Sound & Production`,
        bodyText: [info.tagline, info.heroIntroduction].filter(Boolean).join('\n\n'),
        links: projects.map((p) => ({ href: projectPath(p.slug), text: p.title })),
        jsonLd: {
          '@context': 'https://schema.org',
          ...person,
          url: origin + PORTFOLIO_BASE_PATH,
          ...(info.portraitImage ? { image: absolute(info.portraitImage, origin) } : {}),
        },
      };
    case 'projects':
      return {
        path: `${PORTFOLIO_BASE_PATH}/projects`,
        title: composeTitle(info, 'Portfolio'),
        description: `Browse ${name}'s portfolio of music, production, visual art, and collaborative creative projects.`,
        image: DEFAULT_SHARE_IMAGE,
        type: 'website',
        h1: 'Portfolio',
        bodyText: `Selected work by ${name}: music, production, visual art and collaborations.`,
        links: projects.map((p) => ({ href: projectPath(p.slug), text: `${p.title} (${p.year})` })),
      };
    case 'about':
      return {
        path: `${PORTFOLIO_BASE_PATH}/about`,
        title: composeTitle(info, 'About'),
        description: `Learn about ${name}, ${info.tagline}.`,
        image: info.portraitImage ? absolute(info.portraitImage, origin) : DEFAULT_SHARE_IMAGE,
        type: 'website',
        h1: `About ${name}`,
        bodyText: [info.biography, info.approach].filter(Boolean).join('\n\n'),
        jsonLd: { '@context': 'https://schema.org', ...person, url: origin + `${PORTFOLIO_BASE_PATH}/about` },
      };
    case 'contact':
      return {
        path: `${PORTFOLIO_BASE_PATH}/contact`,
        title: composeTitle(info, 'Contact'),
        description: `Get in touch with ${name} for collaborations, bookings, and creative projects.`,
        image: DEFAULT_SHARE_IMAGE,
        type: 'website',
        h1: `Contact ${name}`,
        bodyText: [info.availability, info.location ? `Based in ${info.location}.` : '']
          .filter(Boolean)
          .join('\n\n'),
      };
    case 'project': {
      const p = page.project;
      const facts = [p.year, p.role, p.medium, p.location].filter(Boolean).join(' · ');
      return {
        path: projectPath(p.slug),
        title: composeTitle(info, p.title),
        description: p.description || info.heroIntroduction,
        image: p.coverImage ? absolute(p.coverImage, origin) : DEFAULT_SHARE_IMAGE,
        type: 'article',
        h1: p.title,
        bodyText: [facts, p.description].filter(Boolean).join('\n\n'),
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: p.title,
          description: p.description,
          dateCreated: p.year,
          ...(p.coverImage ? { image: absolute(p.coverImage, origin) } : {}),
          creator: person,
          url: origin + projectPath(p.slug),
        },
      };
    }
  }
}
