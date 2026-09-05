DROP POLICY IF EXISTS "Authenticated users can view enquiries" ON public.portfolio_enquiries;
DROP POLICY IF EXISTS "Authenticated users can update enquiries" ON public.portfolio_enquiries;

CREATE POLICY "Admins can view enquiries"
  ON public.portfolio_enquiries FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update enquiries"
  ON public.portfolio_enquiries FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));