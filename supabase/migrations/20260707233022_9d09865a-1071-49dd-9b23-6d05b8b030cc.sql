
CREATE TABLE public.releases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  cover_public_id TEXT NOT NULL DEFAULT '',
  spotify_url TEXT NOT NULL DEFAULT '',
  spotify_embed_url TEXT NOT NULL DEFAULT '',
  bandcamp_url TEXT NOT NULL DEFAULT '',
  apple_music_url TEXT NOT NULL DEFAULT '',
  youtube_url TEXT NOT NULL DEFAULT '',
  soundcloud_url TEXT NOT NULL DEFAULT '',
  lyrics TEXT NOT NULL DEFAULT '',
  credits_writing TEXT NOT NULL DEFAULT '',
  credits_production TEXT NOT NULL DEFAULT '',
  credits_mastering TEXT NOT NULL DEFAULT '',
  og_image_url TEXT NOT NULL DEFAULT '',
  released_on DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.releases TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.releases TO authenticated;
GRANT ALL ON public.releases TO service_role;

ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read releases"
  ON public.releases FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert releases"
  ON public.releases FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update releases"
  ON public.releases FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete releases"
  ON public.releases FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_releases_updated_at
  BEFORE UPDATE ON public.releases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
