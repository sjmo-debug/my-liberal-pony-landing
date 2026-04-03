
ALTER TABLE public.mlp_site_config
  ADD COLUMN spotlight jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN press jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Seed the existing row with the Spotify single and BBC Introducing data
UPDATE public.mlp_site_config
SET
  spotlight = '{"title": "Fingerprints", "spotifyUrl": "https://open.spotify.com/track/2MJXjtYkBRQYYLlyBTnXI0", "spotifyEmbedUrl": "https://open.spotify.com/embed/track/2MJXjtYkBRQYYLlyBTnXI0", "description": "Debut single out now"}'::jsonb,
  press = '[{"title": "BBC Introducing", "url": "https://www.bbc.co.uk/sounds/play/m002t20g", "source": "BBC Introducing", "date": "2026-04-01"}]'::jsonb;
