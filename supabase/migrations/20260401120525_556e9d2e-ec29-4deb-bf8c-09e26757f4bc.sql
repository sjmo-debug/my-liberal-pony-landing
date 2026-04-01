
-- Create the MLP site config table
CREATE TABLE public.mlp_site_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  videos JSONB NOT NULL DEFAULT '[]'::jsonb,
  soundcloud_embed_url TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  branding JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mlp_site_config ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can read site config"
  ON public.mlp_site_config
  FOR SELECT
  USING (true);

-- Authenticated write
CREATE POLICY "Authenticated users can insert config"
  ON public.mlp_site_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update config"
  ON public.mlp_site_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete config"
  ON public.mlp_site_config
  FOR DELETE
  TO authenticated
  USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_mlp_site_config_updated_at
  BEFORE UPDATE ON public.mlp_site_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with default values
INSERT INTO public.mlp_site_config (videos, soundcloud_embed_url, contact_email, social_links, branding)
VALUES (
  '[{"youtubeId": "FRDczkLqBes", "title": "MY LIBERAL PONY - Fingerprints"}, {"youtubeId": "jTpvijP76g8", "title": "MY LIBERAL PONY - Video 2"}]'::jsonb,
  'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/myliberalpony&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
  'myliberalpony@gmail.com',
  '{"instagram": "https://instagram.com/myliberalpony", "soundcloud": "https://soundcloud.com/myliberalpony", "bandcamp": "https://myliberalpony.bandcamp.com/", "youtube": "https://www.youtube.com/@MYLIBERALPONY"}'::jsonb,
  '{"siteTitle": "MY LIBERAL PONY", "pageSubtitle": "Watch & Listen - Upcoming Gigs", "cloudinaryLogoId": ""}'::jsonb
);
