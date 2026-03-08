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
  education: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    behance?: string;
    linktree?: string;
  };
  portraitImage: string;
  skills: SkillGroup[];
  methodology: MethodologyItem[];
  discography: DiscographyEntry[];
  experience: ExperienceSection[];
}

export interface ContactSubmission {
  name: string;
  email: string;
  projectType: 'performance' | 'production' | 'collaboration';
  message: string;
  timestamp: Date;
}
