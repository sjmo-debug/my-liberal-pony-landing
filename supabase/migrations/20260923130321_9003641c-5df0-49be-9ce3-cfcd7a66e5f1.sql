ALTER TABLE public.mlp_site_config ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS public.sjmo_site_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projects jsonb NOT NULL DEFAULT '[]'::jsonb,
  artist_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.sjmo_site_config TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sjmo_site_config TO authenticated;
GRANT ALL ON public.sjmo_site_config TO service_role;

ALTER TABLE public.sjmo_site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read sjmo config" ON public.sjmo_site_config FOR SELECT USING (true);
CREATE POLICY "Admins can insert sjmo config" ON public.sjmo_site_config FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update sjmo config" ON public.sjmo_site_config FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete sjmo config" ON public.sjmo_site_config FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_sjmo_site_config_updated_at BEFORE UPDATE ON public.sjmo_site_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins can read site photos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'site-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload site photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-photos' AND public.has_role(auth.uid(), 'admin'));