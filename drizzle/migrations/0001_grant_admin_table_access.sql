-- The Data API grants no default privileges on public, so every table needs
-- explicit GRANTs before the admin console can read or write through RLS.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accounts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.loans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cards TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_logs TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.accounts TO service_role;
GRANT ALL ON public.transactions TO service_role;
GRANT ALL ON public.loans TO service_role;
GRANT ALL ON public.cards TO service_role;
GRANT ALL ON public.notifications TO service_role;
GRANT ALL ON public.support_tickets TO service_role;
GRANT ALL ON public.audit_logs TO service_role;
GRANT ALL ON public.user_roles TO service_role;

-- No anon access: every policy on these tables is admin-scoped.
REVOKE ALL ON public.customers FROM anon;
REVOKE ALL ON public.accounts FROM anon;
REVOKE ALL ON public.transactions FROM anon;
REVOKE ALL ON public.loans FROM anon;
REVOKE ALL ON public.cards FROM anon;
REVOKE ALL ON public.notifications FROM anon;
REVOKE ALL ON public.support_tickets FROM anon;
REVOKE ALL ON public.audit_logs FROM anon;
REVOKE ALL ON public.user_roles FROM anon;