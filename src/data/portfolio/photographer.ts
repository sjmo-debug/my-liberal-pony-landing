import type { ArtistInfo } from '@/types/portfolio';
import { cloudinaryPresets } from '@/lib/cloudinary';

export const photographerInfo: ArtistInfo = {
  name: 'Simon Oliver',
  tagline: 'LIVE VISUALS · SOUND · PRODUCTION — READING, UK',
  heroIntroduction:
    'I build bespoke visual identities for live bands, engineer their shows, and produce their records. Eight years in the Reading and London scenes; over 100 live performances with custom visuals through Iridiphore.',
  biography: `Simon-Joseph Michael Oliver is a musician, producer and live visual artist based in Reading.

He came up through free tuition in Jersey — Trinity Grade 7 double bass — then taught himself bass guitar, electric guitar, drums, production and engineering from sixteen. A 2022 MSci in Applied Psychology from the University of Reading sits behind everything he does: he ran the Band Society, played in the UoR Big Band, and joined the UoR music team as an event organiser and live sound engineer, founding the Dairy jam nights and seeing them formalised into the University's music calendar.

Since then he has performed in, organised or engineered several hundred events across Reading and London — four consecutive years at Are You Listening? Festival with four different projects (Empires, Empires; As Loud As A Mouse; pej; MY LIBERAL PONY), including a sixty-gig year with Empires, Empires. He founded the live visual collective Iridiphore, which has delivered unique visuals for over 100 live performances, books and engineers the Vixen International Women's Day Festival at the Fox & Hounds in Caversham, and in 2026 organised Chameleon's Music for MS, a day festival that raised £1,265 for the Berkshire Multiple Sclerosis Therapy Centre.`,
  approach: `My work is driven by a belief that sound and image are inseparable. Every track I produce has a visual dimension, and every visual piece I create has a rhythm and texture drawn from music.

I approach each project as a collaboration — listening deeply, experimenting freely, and refining until the work feels inevitable.`,
  journey: `Foundational sight-reading and orchestral discipline came from tuition in Jersey, then evolved into the Reading DIY scene. Living with MS has made both a practical and a personal case for music environments that are innovative and genuinely accessible.`,
  awards: [
    'Iridiphore: bespoke live visuals for 100+ performances',
    '200+ live shows across the UK',
    '50+ independently organised events',
    'Are You Listening? Festival performer, 2022–2026 (four projects)',
    'Music for MS 2026: £1,265 raised for Berkshire MS Therapy Centre',
    'Produced Sundaughter — "Austrian" (17,000+ streams)',
  ],
  clients: [
    'UoR Music',
    'Vixen International Women\'s Day Festival',
    'Berkshire MS Therapy Centre',
    'Sundaughter',
    'South Street Arts Centre',
    'Oakford Social Club',
  ],
  sharedStages: [
    'Bob Vylan',
    'El Khat',
    'Man/Woman/Chainsaw',
    'Dan Le Sac',
    'Pan Amsterdam',
  ],
  education: 'Applied Psychology (MSci), University of Reading, 2022',
  location: 'Reading, UK',
  email: 'theSJMO@gmail.com',
  availability:
    'Booking live visuals, sound and production for 2026/27. Enquire for rates; consultation work also available.',
  socialLinks: {
    instagram: 'https://instagram.com/theSJMO',
    linkedin: 'https://www.linkedin.com/in/thesjmo/',
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
      description: 'Calm, methodical crisis management under high-stakes show conditions.',
    },
    {
      title: 'Collaborative Psych',
      description: 'Navigating complex group dynamics with empathy and clarity.',
    },
  ],
  discography: [
    {
      project: 'Sundaughter',
      release: '"Austrian" (Single)',
      role: 'Producer',
      studioLabel: 'Independent — 17,000+ streams',
    },
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
        'Consistent performer at Are You Listening? Festival, 2022–2026, across four projects.',
        'Sixty-plus gigs in a single year with Empires, Empires.',
        'Shared stages with Bob Vylan, El Khat, and Man/Woman/Chainsaw.',
      ],
    },
    {
      title: 'Event Production & Management',
      items: [
        'Organised 50+ events across Reading (South Street Arts, Oakford Social Club, Rising Sun).',
        'UoR Music (Current): Stage managing large-scale community festivals and mentoring students in event delivery.',
        'Founded the Dairy jam nights at UoR London Road campus (2022), formalised into the University music calendar.',
        'Lead booker and sound engineer, Vixen International Women\'s Day Festival, Fox & Hounds Caversham, since 2022.',
        'Organised Chameleon\'s Music for MS 2026, raising £1,265 for the Berkshire MS Therapy Centre.',
      ],
    },
    {
      title: 'Technical Projects: Iridiphore (2024–Present)',
      items: [
        'Founder of a live, audio-reactive art project creating bespoke "visual identities" for bands.',
        'Bespoke visuals delivered for over 100 live performances.',
        'Bridging live performance and multimedia art to increase artist brand awareness.',
        'Creating immersive, sensory-rich audience experiences.',
      ],
    },
  ],
};
