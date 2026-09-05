CREATE TABLE public.portfolio_enquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  project_type text NOT NULL,
  message text NOT NULL,
  handled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.portfolio_enquiries TO anon;
GRANT SELECT, INSERT, UPDATE ON public.portfolio_enquiries TO authenticated;
GRANT ALL ON public.portfolio_enquiries TO service_role;

ALTER TABLE public.portfolio_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an enquiry"
  ON public.portfolio_enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(email) <= 255
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND char_length(message) BETWEEN 1 AND 2000
    AND char_length(project_type) <= 50
  );

CREATE POLICY "Authenticated users can view enquiries"
  ON public.portfolio_enquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update enquiries"
  ON public.portfolio_enquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);