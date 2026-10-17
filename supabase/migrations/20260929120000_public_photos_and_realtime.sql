-- Public bucket so visitors can load uploaded photos (writes stay admin-only).
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-photos', 'site-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Anyone can view site photos" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'site-photos');

-- Push config changes to open browser tabs.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'mlp_site_config') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.mlp_site_config;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'sjmo_site_config') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sjmo_site_config;
  END IF;
END $$;
