import type { Project } from '@/types/portfolio';
import { cloudinaryPresets } from '@/lib/cloudinary';

export const projects: Project[] = [
  {
    id: '1',
    title: 'Are You Listening? 2024',
    category: 'music',
    year: '2024',
    coverImage: cloudinaryPresets.card('portfolio/ayl-2024-cover'),
    images: [
      {
        id: '1-1',
        src: cloudinaryPresets.hero('portfolio/ayl-2024-stage'),
        alt: 'On stage at Are You Listening? Festival 2024',
        aspectRatio: 'landscape',
      },
      {
        id: '1-2',
        src: cloudinaryPresets.hero('portfolio/ayl-2024-crowd'),
        alt: 'Crowd shot at Are You Listening? 2024',
        aspectRatio: 'landscape',
      },
    ],
    description:
      'Returning to the Are You Listening? Festival stage — a multi-venue, one-day music festival celebrating Reading\'s vibrant independent music scene.',
    role: 'Performer',
    location: 'Reading, UK',
    medium: 'Live Performance',
    slug: 'ayl-2024',
  },
  {
    id: '2',
    title: 'Iridiphore – Audio-Reactive Visuals',
    category: 'visual-art',
    year: '2024',
    coverImage: cloudinaryPresets.card('portfolio/iridiphore-cover'),
    images: [
      {
        id: '2-1',
        src: cloudinaryPresets.hero('portfolio/iridiphore-live'),
        alt: 'Iridiphore live audio-reactive projection',
        aspectRatio: 'landscape',
      },
      {
        id: '2-2',
        src: cloudinaryPresets.hero('portfolio/iridiphore-detail'),
        alt: 'Close-up of audio-reactive visual patterns',
        aspectRatio: 'square',
      },
    ],
    description:
      'Bespoke audio-reactive visual identities for live bands — bridging performance and multimedia art to create immersive, sensory-rich audience experiences.',
    role: 'Founder / Visual Artist',
    location: 'Reading, UK',
    medium: 'Audio-Reactive Projection',
    slug: 'iridiphore',
  },
  {
    id: '3',
    title: 'Bob Vylan Support',
    category: 'music',
    year: '2023',
    coverImage: cloudinaryPresets.card('portfolio/bob-vylan-cover'),
    images: [
      {
        id: '3-1',
        src: cloudinaryPresets.hero('portfolio/bob-vylan-stage'),
        alt: 'Supporting Bob Vylan on stage',
        aspectRatio: 'landscape',
      },
    ],
    description:
      'Opening set for Bob Vylan — bringing high-energy, bass-driven performance to a packed venue.',
    role: 'Support Act',
    location: 'Reading, UK',
    medium: 'Live Performance',
    slug: 'bob-vylan-support',
  },
  {
    id: '4',
    title: 'South Street Showcase',
    category: 'production',
    year: '2023',
    coverImage: cloudinaryPresets.card('portfolio/south-street-cover'),
    images: [
      {
        id: '4-1',
        src: cloudinaryPresets.hero('portfolio/south-street-event'),
        alt: 'Event production at South Street Arts Centre',
        aspectRatio: 'landscape',
      },
      {
        id: '4-2',
        src: cloudinaryPresets.hero('portfolio/south-street-setup'),
        alt: 'Stage setup at South Street',
        aspectRatio: 'landscape',
      },
    ],
    description:
      'Curated and produced a multi-act showcase at South Street Arts Centre, managing artist liaison, sound, and stage logistics.',
    role: 'Producer / Promoter',
    location: 'Reading, UK',
    medium: 'Event Production',
    slug: 'south-street-showcase',
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug);
};

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'all') return projects;
  return projects.filter((project) => project.category === category);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.slice(0, 4);
};

export const getAdjacentProjects = (
  currentSlug: string,
): { prev: Project | null; next: Project | null } => {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
    next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null,
  };
};
