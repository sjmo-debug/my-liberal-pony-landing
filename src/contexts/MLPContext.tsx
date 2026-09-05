import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MLPVideo {
  youtubeId: string;
  title: string;
}

export interface MLPSocialLinks {
  instagram: string;
  soundcloud: string;
  bandcamp: string;
  youtube: string;
  buyMeACoffee: string;
}

export interface MLPBranding {
  siteTitle: string;
  pageSubtitle: string;
  cloudinaryLogoId: string;
  tagline: string;
  photoCredit: string;
}

export interface MLPSpotlight {
  header: string;
  title: string;
  spotifyUrl: string;
  spotifyEmbedUrl: string;
  description: string;
  ctaText: string;
  pressBadgeLabel: string;
}

export interface MLPPressItem {
  title: string;
  url: string;
  source: string;
  date: string;
}

export interface MLPNavItem {
  label: string;
  url: string;
  isExternal: boolean;
}

export interface MLPSiteData {
  videos: [MLPVideo, MLPVideo];
  soundcloudEmbedUrl: string;
  contactEmail: string;
  socialLinks: MLPSocialLinks;
  branding: MLPBranding;
  spotlight: MLPSpotlight;
  press: MLPPressItem[];
  navigation: MLPNavItem[];
}

interface MLPContextValue {
  siteData: MLPSiteData;
  isLoading: boolean;
  updateSiteData: (data: Partial<MLPSiteData>) => Promise<void>;
}

const defaultSiteData: MLPSiteData = {
  videos: [
    { youtubeId: 'FRDczkLqBes', title: 'MY LIBERAL PONY - OUMUAMUA' },
    { youtubeId: 'jTpvijP76g8', title: 'MY LIBERAL PONY — Live' },
  ],
  soundcloudEmbedUrl:
    'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/myliberalpony&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
  contactEmail: 'myliberalpony@gmail.com',
  socialLinks: {
    instagram: 'https://instagram.com/myliberalpony',
    soundcloud: 'https://soundcloud.com/myliberalpony',
    bandcamp: 'https://myliberalpony.bandcamp.com/',
    youtube: 'https://www.youtube.com/@MYLIBERALPONY',
    buyMeACoffee: 'https://buymeacoffee.com/myliberalpony',
  },
  branding: {
    siteTitle: 'MY LIBERAL PONY',
    pageSubtitle: 'Watch & Listen - Upcoming Gigs',
    cloudinaryLogoId: '',
    tagline: 'EXPERIMENTAL FREAK POP. LOUDER IN PERSON.',
    photoCredit: '[PHOTOGRAPHER NAME]',
  },
  spotlight: {
    header: 'New Single',
    title: 'OUMUAMUA',
    spotifyUrl: 'https://open.spotify.com/artist/2BgfhrMJ3h63DMazpBwQwE',
    spotifyEmbedUrl: '',
    description: 'Listen to OUMUAMUA - the debut single from MY LIBERAL PONY as heard on BBC Introducing & The Hello Goodbye Show. Visit for more information on live events.',
    ctaText: 'Listen on Spotify',
    pressBadgeLabel: 'As heard on',
  },
  press: [
    {
      title: 'The Hello Goodbye Show',
      source: 'Resonance FM',
      url: 'https://www.mixcloud.com/Resonance/the-hello-goodbye-show-4th-july-2026/',
      date: '2026-07-04',
    },
    {
      title: 'BBC Introducing',
      source: 'BBC Introducing',
      url: '',
      date: '2026-04-01',
    },
  ],
  navigation: [
    { label: 'Listen', url: '/listen', isExternal: false },
    { label: 'Watch', url: '#watch-section', isExternal: false },
    { label: 'Live', url: '#gigs-section', isExternal: false },
    { label: 'About', url: '/about', isExternal: false },
    { label: 'Sign Up', url: '#newsletter-section', isExternal: false },
  ],
};

const MLPContext = createContext<MLPContextValue | undefined>(undefined);

function rowToSiteData(row: any): MLPSiteData {
  return {
    videos: row.videos as [MLPVideo, MLPVideo],
    soundcloudEmbedUrl: row.soundcloud_embed_url,
    contactEmail: row.contact_email,
    socialLinks: { ...defaultSiteData.socialLinks, ...(row.social_links || {}) } as MLPSocialLinks,
    branding: { ...defaultSiteData.branding, ...(row.branding || {}) } as MLPBranding,
    spotlight: { ...defaultSiteData.spotlight, ...(row.spotlight || {}) } as MLPSpotlight,
    press: (row.press || defaultSiteData.press) as MLPPressItem[],
    navigation: (row.navigation || defaultSiteData.navigation) as MLPNavItem[],
  };
}

export function MLPProvider({ children }: { children: ReactNode }) {
  const [siteData, setSiteData] = useState<MLPSiteData>(defaultSiteData);
  const [isLoading, setIsLoading] = useState(true);
  const [configId, setConfigId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const { data, error } = await supabase
          .from('mlp_site_config')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Failed to fetch MLP config:', error);
        } else if (data) {
          setSiteData(rowToSiteData(data));
          setConfigId(data.id);
        }
      } catch (err) {
        console.error('Failed to fetch MLP config:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const updateSiteData = async (data: Partial<MLPSiteData>) => {
    const merged = { ...siteData, ...data };
    setSiteData(merged);

    const row: any = {
      videos: merged.videos,
      soundcloud_embed_url: merged.soundcloudEmbedUrl,
      contact_email: merged.contactEmail,
      social_links: merged.socialLinks,
      branding: merged.branding,
      spotlight: merged.spotlight,
      press: merged.press,
      navigation: merged.navigation,
    };

    if (configId) {
      const { error } = await supabase
        .from('mlp_site_config')
        .update(row)
        .eq('id', configId);
      if (error) throw error;
    } else {
      const { data: inserted, error } = await supabase
        .from('mlp_site_config')
        .insert(row)
        .select('id')
        .single();
      if (error) throw error;
      if (inserted) setConfigId(inserted.id);
    }
  };

  return (
    <MLPContext.Provider value={{ siteData, isLoading, updateSiteData }}>
      {children}
    </MLPContext.Provider>
  );
}

export function useMLP() {
  const ctx = useContext(MLPContext);
  if (!ctx) throw new Error('useMLP must be used within MLPProvider');
  return ctx;
}
