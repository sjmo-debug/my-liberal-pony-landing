import { createContext, useContext, useState, ReactNode } from 'react';

export interface MLPVideo {
  youtubeId: string;
  title: string;
}

export interface MLPSocialLinks {
  instagram: string;
  soundcloud: string;
  bandcamp: string;
  youtube: string;
}

export interface MLPBranding {
  siteTitle: string;
  pageSubtitle: string;
  cloudinaryLogoId: string;
}

export interface MLPSiteData {
  videos: [MLPVideo, MLPVideo];
  soundcloudEmbedUrl: string;
  contactEmail: string;
  socialLinks: MLPSocialLinks;
  branding: MLPBranding;
}

interface MLPContextValue {
  siteData: MLPSiteData;
  updateSiteData: (data: Partial<MLPSiteData>) => void;
}

const defaultSiteData: MLPSiteData = {
  videos: [
    { youtubeId: 'FRDczkLqBes', title: 'MY LIBERAL PONY - Fingerprints' },
    { youtubeId: 'jTpvijP76g8', title: 'MY LIBERAL PONY - Video 2' },
  ],
  soundcloudEmbedUrl:
    'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/myliberalpony&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
  contactEmail: 'myliberalpony@gmail.com',
  socialLinks: {
    instagram: 'https://instagram.com/myliberalpony',
    soundcloud: 'https://soundcloud.com/myliberalpony',
    bandcamp: 'https://myliberalpony.bandcamp.com/',
    youtube: 'https://www.youtube.com/@MYLIBERALPONY',
  },
  branding: {
    siteTitle: 'MY LIBERAL PONY',
    pageSubtitle: 'Watch & Listen - Upcoming Gigs',
    cloudinaryLogoId: '',
  },
};

const MLPContext = createContext<MLPContextValue | undefined>(undefined);

export function MLPProvider({ children }: { children: ReactNode }) {
  const [siteData, setSiteData] = useState<MLPSiteData>(defaultSiteData);

  const updateSiteData = (data: Partial<MLPSiteData>) => {
    setSiteData((prev) => ({ ...prev, ...data }));
  };

  return (
    <MLPContext.Provider value={{ siteData, updateSiteData }}>
      {children}
    </MLPContext.Provider>
  );
}

export function useMLP() {
  const ctx = useContext(MLPContext);
  if (!ctx) throw new Error('useMLP must be used within MLPProvider');
  return ctx;
}
