
ALTER TABLE public.aforge_memories_v2 ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.aforge_memories_v2 FROM anon, authenticated;
GRANT ALL ON public.aforge_memories_v2 TO service_role;
DROP POLICY IF EXISTS aforge_memories_v2_service_only ON public.aforge_memories_v2;
CREATE POLICY aforge_memories_v2_service_only ON public.aforge_memories_v2
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS leads_auth_all ON public.leads;
DROP POLICY IF EXISTS leads_admin_all ON public.leads;
CREATE POLICY leads_admin_all ON public.leads
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS quotes_auth_all ON public.quotes;
DROP POLICY IF EXISTS quotes_admin_all ON public.quotes;
CREATE POLICY quotes_admin_all ON public.quotes
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS inspections_auth_all ON public.inspections;
DROP POLICY IF EXISTS inspections_admin_all ON public.inspections;
CREATE POLICY inspections_admin_all ON public.inspections
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS inspection_reports_inspector_view ON public.inspection_reports;
DROP POLICY IF EXISTS inspection_reports_inspector_insert ON public.inspection_reports;
DROP POLICY IF EXISTS inspection_reports_inspector_update ON public.inspection_reports;
DROP POLICY IF EXISTS inspection_reports_inspector_delete ON public.inspection_reports;
DROP POLICY IF EXISTS inspection_reports_admin_all ON public.inspection_reports;
CREATE POLICY inspection_reports_admin_all ON public.inspection_reports
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS invoices_inspector_all ON public.invoices;
DROP POLICY IF EXISTS invoices_admin_all ON public.invoices;
CREATE POLICY invoices_admin_all ON public.invoices
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS jobs_inspector_view ON public.jobs;
DROP POLICY IF EXISTS jobs_inspector_insert ON public.jobs;
DROP POLICY IF EXISTS jobs_inspector_update ON public.jobs;
DROP POLICY IF EXISTS jobs_inspector_delete ON public.jobs;
DROP POLICY IF EXISTS jobs_admin_all ON public.jobs;
CREATE POLICY jobs_admin_all ON public.jobs
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS calendar_events_auth_all ON public.calendar_events;
DROP POLICY IF EXISTS calendar_events_admin_all ON public.calendar_events;
CREATE POLICY calendar_events_admin_all ON public.calendar_events
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Allow all for authenticated" ON public.document_versions;
DROP POLICY IF EXISTS document_versions_admin_all ON public.document_versions;
CREATE POLICY document_versions_admin_all ON public.document_versions
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS app_comms_log_select_authenticated ON public.comms_log;
DROP POLICY IF EXISTS app_comms_log_insert_authenticated ON public.comms_log;
DROP POLICY IF EXISTS app_comms_log_update_authenticated ON public.comms_log;
DROP POLICY IF EXISTS app_comms_log_delete_authenticated ON public.comms_log;
DROP POLICY IF EXISTS comms_log_org_scoped ON public.comms_log;
DROP POLICY IF EXISTS comms_log_admin_all ON public.comms_log;
CREATE POLICY comms_log_admin_all ON public.comms_log
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS app_user_preferences_select_authenticated ON public.user_preferences;
DROP POLICY IF EXISTS app_user_preferences_insert_authenticated ON public.user_preferences;
DROP POLICY IF EXISTS app_user_preferences_update_authenticated ON public.user_preferences;
DROP POLICY IF EXISTS app_user_preferences_delete_authenticated ON public.user_preferences;
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS user_preferences_own_only ON public.user_preferences;
CREATE POLICY user_preferences_own_only ON public.user_preferences
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users see task_backlog via run" ON public.task_backlog;
DROP POLICY IF EXISTS task_backlog_admin_all ON public.task_backlog;
CREATE POLICY task_backlog_admin_all ON public.task_backlog
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Users see known_issues via run" ON public.known_issues;
DROP POLICY IF EXISTS known_issues_admin_all ON public.known_issues;
CREATE POLICY known_issues_admin_all ON public.known_issues
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS quote_item_catalogue_org_scoped ON public.quote_item_catalogue;
DROP POLICY IF EXISTS quote_item_catalogue_read ON public.quote_item_catalogue;
DROP POLICY IF EXISTS quote_item_catalogue_write ON public.quote_item_catalogue;
CREATE POLICY quote_item_catalogue_admin_all ON public.quote_item_catalogue
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS device_tokens_org_scoped ON public.device_tokens;
DROP POLICY IF EXISTS device_tokens_own ON public.device_tokens;
CREATE POLICY device_tokens_own ON public.device_tokens
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.is_admin_user(auth.uid()))
  WITH CHECK (user_id = auth.uid() OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "System can insert security logs" ON public.security_logs;
DROP POLICY IF EXISTS security_logs_insert ON public.security_logs;
CREATE POLICY security_logs_insert ON public.security_logs
  FOR INSERT TO authenticated, service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS ckr_storage_admin_read ON storage.objects;
DROP POLICY IF EXISTS ckr_storage_admin_write ON storage.objects;
DROP POLICY IF EXISTS ckr_storage_admin_update ON storage.objects;
DROP POLICY IF EXISTS ckr_storage_admin_delete ON storage.objects;
CREATE POLICY ckr_storage_admin_read ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id IN ('inspections','quotes','lead-pdfs') AND public.is_admin_user(auth.uid()));
CREATE POLICY ckr_storage_admin_write ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('inspections','quotes','lead-pdfs') AND public.is_admin_user(auth.uid()));
CREATE POLICY ckr_storage_admin_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('inspections','quotes','lead-pdfs') AND public.is_admin_user(auth.uid()))
  WITH CHECK (bucket_id IN ('inspections','quotes','lead-pdfs') AND public.is_admin_user(auth.uid()));
CREATE POLICY ckr_storage_admin_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('inspections','quotes','lead-pdfs') AND public.is_admin_user(auth.uid()));

ALTER FUNCTION public.is_admin_user(uuid) SET search_path = public;
ALTER FUNCTION public.is_inspector(uuid) SET search_path = public;
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = public;
