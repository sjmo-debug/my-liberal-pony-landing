/**
 * Core TypeScript interfaces for the Portfolio subpage
 */

export type ProjectCategory = 'music' | 'production' | 'visual-art' | 'collaborations';

export type AspectRatio = 'portrait' | 'landscape' | 'square';

export interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  aspectRatio: AspectRatio;
  caption?: string;
  /** Photographer credit shown beneath / over the image */
  credit?: string;
}


export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  year: string;
  coverImage: string;
  images: ProjectImage[];
  description: string;
  client?: string;
  medium?: string;
  role?: string;
  location?: string;
  slug: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface MethodologyItem {
  title: string;
  description: string;
}

export interface DiscographyEntry {
  project: string;
  release: string;
  role: string;
  studioLabel: string;
}

export interface ExperienceSection {
  title: string;
  items: string[];
}

export interface ArtistInfo {
  name: string;
  tagline: string;
  heroIntroduction: string;
  biography: string;
  approach: string;
  journey: string;
  awards: string[];
  clients: string[];
  sharedStages?: string[];
  education: string;
  location: string;
  email: string;
  phone?: string;
  availability: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    behance?: string;
  };
  portraitImage: string;
  /** Photo credit rendered beneath the About portrait */
  portraitCredit?: string;
  /** Photo credit rendered over the home hero image */
  heroCredit?: string;

  skills: SkillGroup[];
  methodology: MethodologyItem[];
  discography: DiscographyEntry[];
  experience: ExperienceSection[];
}

export type PortfolioProjectType =
  | 'visuals'
  | 'sound'
  | 'production'
  | 'performance'
  | 'consultation'
  | 'other';

export const portfolioProjectTypes: { value: PortfolioProjectType; label: string }[] = [
  { value: 'visuals', label: 'Live Visuals / Iridiphore' },
  { value: 'sound', label: 'Live Sound & Stage' },
  { value: 'production', label: 'Recording & Production' },
  { value: 'performance', label: 'Performance / Session' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'other', label: 'Something else' },
];

export interface ContactSubmission {
  name: string;
  email: string;
  projectType: PortfolioProjectType;
  message: string;
  timestamp: Date;
}

