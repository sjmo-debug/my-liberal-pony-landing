import type { ArtistInfo } from '@/types/portfolio';
import { cloudinaryPresets } from '@/lib/cloudinary';

export const photographerInfo: ArtistInfo = {
  name: 'Simon Oliver',
  tagline: 'Multi-Instrumentalist | Event Producer | Live Visual Artist',
  heroIntroduction: 'Bridging a decade of DIY music production with a professional background in Applied Psychology — delivering an empathetic, highly organised approach to live performance and sound engineering.',
  biography: `Reading-based multi-instrumentalist and founder of Iridiphore, bridging a decade of DIY music production with a professional background in Applied Psychology and the NHS. I leverage this unique dual-perspective to deliver an empathetic, highly organised approach to live performance and sound engineering.

My creative output spans original compositions, live performances, event production, and immersive audio-reactive visual installations. Whether on stage, behind the desk, or curating a line-up, I bring a unified artistic vision to everything I create.`,
  approach: `My work is driven by a belief that sound and image are inseparable. Every track I produce has a visual dimension, and every visual piece I create has a rhythm and texture drawn from music.

I approach each project as a collaboration — listening deeply, experimenting freely, and refining until the work feels inevitable.`,
  journey: `Developed foundational sight-reading and orchestral discipline through free tuition in Jersey. Evolved into the Reading DIY scene while managing a career in Mental Health and living with MS. This trajectory has fostered a unique resilience and a deep-seated commitment to making music environments both innovative and accessible.`,
  awards: [
    '200+ live shows across the UK',
    '50+ independently organised events',
    'Are You Listening? Festival performer (2022–Present)',
    'Key supports: Bob Vylan, El Khat, Man/Woman/Chainsaw',
  ],
  clients: [
    'Bob Vylan',
    'El Khat',
    'Man/Woman/Chainsaw',
    'UoR Music',
    'South Street Arts Centre',
    'Oakford Social Club',
  ],
  education: 'Applied Psychology (BSc)',
  location: 'Reading, UK',
  email: 'hello@simonoliver.com',
  phone: '+44 (0) 000 000 0000',
  availability: 'Currently booking for 2025 projects',
  socialLinks: {
    instagram: 'https://instagram.com/simonoliver',
    linkedin: 'https://linkedin.com/in/simonoliver',
    linktree: 'https://linktr.ee/simonoliver',
  },
  portraitImage: cloudinaryPresets.portrait('portfolio/simon-portrait'),
  skills: [
    {
      label: 'Performance',
      items: ['Double Bass', 'Bass', 'Guitar', 'Vocals', 'Drums'],
    },
    {
      label: 'Technical',
      items: ['DIY Engineering', 'Live Sound', 'Audio-Reactive Visuals'],
    },
    {
      label: 'Management',
      items: ['Logistics', 'Stage Management', 'Artist Liaison'],
    },
  ],
  methodology: [
    {
      title: 'Inclusive Curation',
      description: 'Prioritising safety and accessibility in every event and performance.',
    },
    {
      title: 'Resilient Logistics',
      description: 'High-stakes crisis management drawn from NHS experience.',
    },
    {
      title: 'Collaborative Psych',
      description: 'Navigating complex group dynamics with empathy and clarity.',
    },
  ],
  discography: [
    {
      project: 'Empires, Empires',
      release: 'The Same',
      role: 'Bass / Co-Producer',
      studioLabel: 'Shuta Shinoda',
    },
    {
      project: 'ALAAM',
      release: 'EP',
      role: 'Multi-Inst / Engineer',
      studioLabel: 'Big Richard Records',
    },
    {
      project: 'Pej',
      release: 'Singles',
      role: 'Bass / Vocals',
      studioLabel: 'Independent',
    },
  ],
  experience: [
    {
      title: 'Performance & Artistry',
      items: [
        'Delivered 200+ shows across the UK with original projects (Music for Animals, Empires Empires, ALAAM).',
        'Consistent performer at Are You Listening? Festival (2022–Present).',
        'Shared stages with Bob Vylan, El Khat, and Man/Woman/Chainsaw.',
      ],
    },
    {
      title: 'Event Production & Management',
      items: [
        'Organised 50+ events across Reading (South Street Arts, Oakford Social Club, Rising Sun).',
        'UoR Music (Current): Stage managing large-scale community festivals and mentoring students in event delivery.',
        'Lead booker/promoter for the Vixens (International Women\'s Day).',
      ],
    },
    {
      title: 'Technical Projects: Iridiphore (2024–Present)',
      items: [
        'Founder of a live, audio-reactive art project creating bespoke "visual identities" for bands.',
        'Bridging live performance and multimedia art to increase artist brand awareness.',
        'Creating immersive, sensory-rich audience experiences.',
      ],
    },
  ],
};
