-- =============================================
-- MIGRATION: Add Role-Based RLS Policies
-- =============================================
-- This migration replaces simple authenticated policies with
-- detailed role-based access control (admin, moderator, user)

-- =============================================
-- HELPER FUNCTION: Get User Role
-- =============================================
-- Helper function to get user role from users table
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.users 
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =============================================
-- HELPER FUNCTION: Check if User is Admin or Moderator
-- =============================================
CREATE OR REPLACE FUNCTION is_admin_or_moderator(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id 
    AND role IN ('admin', 'moderator', 'muhasebe')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =============================================
-- HELPER FUNCTION: Check if User is Admin
-- =============================================
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =============================================
-- DROP EXISTING POLICIES
-- =============================================
-- Drop old simple authenticated policies to replace with role-based ones

-- Members
DROP POLICY IF EXISTS "Authenticated users can view members" ON public.members;
DROP POLICY IF EXISTS "Authenticated users can manage members" ON public.members;

-- Donations
DROP POLICY IF EXISTS "Authenticated users can manage donations" ON public.donations;

-- Beneficiaries
DROP POLICY IF EXISTS "Authenticated users can manage beneficiaries" ON public.beneficiaries;

-- Kumbaras
DROP POLICY IF EXISTS "Authenticated users can manage kumbaras" ON public.kumbaras;

-- Applications
DROP POLICY IF EXISTS "Authenticated users can manage applications" ON public.social_aid_applications;

-- Payments
DROP POLICY IF EXISTS "Authenticated users can manage payments" ON public.payments;

-- Documents
DROP POLICY IF EXISTS "Authenticated users can manage documents" ON public.documents;

-- =============================================
-- MEMBERS TABLE POLICIES
-- =============================================
-- View: All authenticated users can view
CREATE POLICY "authenticated_users_view_members" ON public.members
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert/Update/Delete: Only admins and moderators
CREATE POLICY "admins_mods_manage_members" ON public.members
  FOR ALL
  USING (is_admin_or_moderator(auth.uid()))
  WITH CHECK (is_admin_or_moderator(auth.uid()));

-- =============================================
-- DONATIONS TABLE POLICIES
-- =============================================
-- View: All authenticated users can view
CREATE POLICY "authenticated_users_view_donations" ON public.donations
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert: All authenticated users can create donations
CREATE POLICY "authenticated_users_create_donations" ON public.donations
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Update/Delete: Only admins and moderators
CREATE POLICY "admins_mods_manage_donations" ON public.donations
  FOR UPDATE
  USING (is_admin_or_moderator(auth.uid()))
  WITH CHECK (is_admin_or_moderator(auth.uid()));

CREATE POLICY "admins_mods_delete_donations" ON public.donations
  FOR DELETE
  USING (is_admin_or_moderator(auth.uid()));

-- =============================================
-- BENEFICIARIES TABLE POLICIES
-- =============================================
-- View: All authenticated users can view
CREATE POLICY "authenticated_users_view_beneficiaries" ON public.beneficiaries
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert/Update/Delete: Only admins and moderators
CREATE POLICY "admins_mods_manage_beneficiaries" ON public.beneficiaries
  FOR ALL
  USING (is_admin_or_moderator(auth.uid()))
  WITH CHECK (is_admin_or_moderator(auth.uid()));

-- =============================================
-- SOCIAL AID APPLICATIONS TABLE POLICIES
-- =============================================
-- View: All authenticated users can view
CREATE POLICY "authenticated_users_view_applications" ON public.social_aid_applications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert: All authenticated users can create applications
CREATE POLICY "authenticated_users_create_applications" ON public.social_aid_applications
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Update: Only admins and moderators can update (approve/reject)
CREATE POLICY "admins_mods_update_applications" ON public.social_aid_applications
  FOR UPDATE
  USING (is_admin_or_moderator(auth.uid()))
  WITH CHECK (is_admin_or_moderator(auth.uid()));

-- Delete: Only admins
CREATE POLICY "admins_delete_applications" ON public.social_aid_applications
  FOR DELETE
  USING (is_admin(auth.uid()));

-- =============================================
-- PAYMENTS TABLE POLICIES
-- =============================================
-- View: Admins and moderators can view
CREATE POLICY "admins_mods_view_payments" ON public.payments
  FOR SELECT
  USING (is_admin_or_moderator(auth.uid()));

-- Insert/Update/Delete: Only admins and moderators (muhasebe role included)
CREATE POLICY "admins_mods_manage_payments" ON public.payments
  FOR ALL
  USING (is_admin_or_moderator(auth.uid()))
  WITH CHECK (is_admin_or_moderator(auth.uid()));

-- =============================================
-- KUMBARAS TABLE POLICIES
-- =============================================
-- View: All authenticated users can view
CREATE POLICY "authenticated_users_view_kumbaras" ON public.kumbaras
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert/Update/Delete: Only admins and moderators
CREATE POLICY "admins_mods_manage_kumbaras" ON public.kumbaras
  FOR ALL
  USING (is_admin_or_moderator(auth.uid()))
  WITH CHECK (is_admin_or_moderator(auth.uid()));

-- =============================================
-- DOCUMENTS TABLE POLICIES
-- =============================================
-- View: All authenticated users can view
CREATE POLICY "authenticated_users_view_documents" ON public.documents
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert: All authenticated users can upload documents
CREATE POLICY "authenticated_users_upload_documents" ON public.documents
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Update: Only admins and moderators (for verification)
CREATE POLICY "admins_mods_update_documents" ON public.documents
  FOR UPDATE
  USING (is_admin_or_moderator(auth.uid()))
  WITH CHECK (is_admin_or_moderator(auth.uid()));

-- Delete: Only admins and moderators
CREATE POLICY "admins_mods_delete_documents" ON public.documents
  FOR DELETE
  USING (is_admin_or_moderator(auth.uid()));

-- =============================================
-- USERS TABLE POLICIES (Enhanced)
-- =============================================
-- Keep existing policies but add update policy for role changes
-- Users can view their own profile (existing policy)
-- Admins can view all users (existing policy)

-- Update: Users can update their own profile (except role)
-- Admins can update any user (including role)
CREATE POLICY "users_update_own_profile" ON public.users
  FOR UPDATE
  USING (
    auth.uid() = id 
    AND NOT (OLD.role IS DISTINCT FROM NEW.role)
  )
  WITH CHECK (
    auth.uid() = id 
    AND NOT (OLD.role IS DISTINCT FROM NEW.role)
  );

CREATE POLICY "admins_update_users" ON public.users
  FOR UPDATE
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- =============================================
-- AUDIT LOGS TABLE POLICIES (Enhanced)
-- =============================================
-- Only admins can view audit logs (existing policy)
-- Add insert policy for trigger function
CREATE POLICY "system_insert_audit_logs" ON public.audit_logs
  FOR INSERT
  WITH CHECK (true); -- Allow trigger function to insert

-- =============================================
-- COMMENT
-- =============================================
COMMENT ON FUNCTION get_user_role(UUID) IS 'Helper function to get user role for RLS policies';
COMMENT ON FUNCTION is_admin_or_moderator(UUID) IS 'Helper function to check if user is admin, moderator, or muhasebe';
COMMENT ON FUNCTION is_admin(UUID) IS 'Helper function to check if user is admin';
