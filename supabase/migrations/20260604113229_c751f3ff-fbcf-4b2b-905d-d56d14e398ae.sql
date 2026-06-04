-- Create app_role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Seed existing users as admins
INSERT INTO public.user_roles (user_id, role) VALUES
  ('630165c4-929e-4dae-a651-fc165dec687c', 'admin'),
  ('7763beab-7afc-444e-9666-43ac55e985ef', 'admin')
ON CONFLICT DO NOTHING;

-- Tighten mlp_site_config write policies to admins only
DROP POLICY IF EXISTS "Authenticated users can insert config" ON public.mlp_site_config;
DROP POLICY IF EXISTS "Authenticated users can update config" ON public.mlp_site_config;
DROP POLICY IF EXISTS "Authenticated users can delete config" ON public.mlp_site_config;

CREATE POLICY "Admins can insert config"
  ON public.mlp_site_config FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update config"
  ON public.mlp_site_config FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete config"
  ON public.mlp_site_config FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));