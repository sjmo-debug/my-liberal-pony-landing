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
}

export interface MLPBranding {
  siteTitle: string;
  pageSubtitle: string;
  cloudinaryLogoId: string;
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

export interface MLPSiteData {
  videos: [MLPVideo, MLPVideo];
  soundcloudEmbedUrl: string;
  contactEmail: string;
  socialLinks: MLPSocialLinks;
  branding: MLPBranding;
  spotlight: MLPSpotlight;
  press: MLPPressItem[];
}

interface MLPContextValue {
  siteData: MLPSiteData;
  isLoading: boolean;
  updateSiteData: (data: Partial<MLPSiteData>) => Promise<void>;
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
  spotlight: {
    header: 'New Single',
    title: 'Fingerprints',
    spotifyUrl: 'https://open.spotify.com/track/2MJXjtYkBRQYYLlyBTnXI0',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/2MJXjtYkBRQYYLlyBTnXI0',
    description: 'Debut single out now',
    ctaText: 'Listen on Spotify',
    pressBadgeLabel: 'As heard on',
  },
  press: [
    {
      title: 'BBC Introducing',
      url: 'https://www.bbc.co.uk/sounds/play/m002t20g',
      source: 'BBC Introducing',
      date: '2026-04-01',
    },
  ],
};

const MLPContext = createContext<MLPContextValue | undefined>(undefined);

function rowToSiteData(row: any): MLPSiteData {
  return {
    videos: row.videos as [MLPVideo, MLPVideo],
    soundcloudEmbedUrl: row.soundcloud_embed_url,
    contactEmail: row.contact_email,
    socialLinks: row.social_links as MLPSocialLinks,
    branding: row.branding as MLPBranding,
    spotlight: { ...defaultSiteData.spotlight, ...(row.spotlight || {}) } as MLPSpotlight,
    press: (row.press || defaultSiteData.press) as MLPPressItem[],
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
