-- =============================================
-- MIGRATION: Add Audit Logging Triggers
-- =============================================
-- This migration adds automatic audit logging for all CRUD operations
-- on critical tables. All changes are logged to audit_logs table.

-- Ensure audit_logs table has TEXT record_id (already done in previous migration)
-- But we'll ensure it's correct
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'audit_logs' 
    AND column_name = 'record_id' 
    AND data_type != 'text'
  ) THEN
    ALTER TABLE public.audit_logs ALTER COLUMN record_id TYPE TEXT;
  END IF;
END $$;

-- Add ip_address column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'audit_logs' 
    AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE public.audit_logs ADD COLUMN ip_address TEXT;
  END IF;
END $$;

-- =============================================
-- AUDIT LOGGING FUNCTION
-- =============================================
-- Generic function to log all changes to audit_logs table
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_record_id TEXT;
  v_old_data JSONB;
  v_new_data JSONB;
  v_action TEXT;
BEGIN
  -- Get current user ID from auth context
  v_user_id := auth.uid();
  
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    v_action := 'INSERT';
    v_record_id := COALESCE(NEW.id::TEXT, 'unknown');
    v_old_data := NULL;
    v_new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'UPDATE';
    v_record_id := COALESCE(NEW.id::TEXT, OLD.id::TEXT, 'unknown');
    v_old_data := to_jsonb(OLD);
    v_new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'DELETE';
    v_record_id := COALESCE(OLD.id::TEXT, 'unknown');
    v_old_data := to_jsonb(OLD);
    v_new_data := NULL;
  END IF;
  
  -- Insert audit log entry
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    ip_address,
    created_at
  ) VALUES (
    v_user_id,
    v_action,
    TG_TABLE_NAME,
    v_record_id,
    v_old_data,
    v_new_data,
    NULL, -- IP address would need to be passed via session variable or function parameter
    NOW()
  );
  
  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS FOR CRITICAL TABLES
-- =============================================

-- Members table triggers
DROP TRIGGER IF EXISTS audit_members_insert ON public.members;
CREATE TRIGGER audit_members_insert
  AFTER INSERT ON public.members
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_members_update ON public.members;
CREATE TRIGGER audit_members_update
  AFTER UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_members_delete ON public.members;
CREATE TRIGGER audit_members_delete
  AFTER DELETE ON public.members
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Donations table triggers
DROP TRIGGER IF EXISTS audit_donations_insert ON public.donations;
CREATE TRIGGER audit_donations_insert
  AFTER INSERT ON public.donations
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_donations_update ON public.donations;
CREATE TRIGGER audit_donations_update
  AFTER UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_donations_delete ON public.donations;
CREATE TRIGGER audit_donations_delete
  AFTER DELETE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Beneficiaries table triggers
DROP TRIGGER IF EXISTS audit_beneficiaries_insert ON public.beneficiaries;
CREATE TRIGGER audit_beneficiaries_insert
  AFTER INSERT ON public.beneficiaries
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_beneficiaries_update ON public.beneficiaries;
CREATE TRIGGER audit_beneficiaries_update
  AFTER UPDATE ON public.beneficiaries
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_beneficiaries_delete ON public.beneficiaries;
CREATE TRIGGER audit_beneficiaries_delete
  AFTER DELETE ON public.beneficiaries
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Social aid applications table triggers
DROP TRIGGER IF EXISTS audit_applications_insert ON public.social_aid_applications;
CREATE TRIGGER audit_applications_insert
  AFTER INSERT ON public.social_aid_applications
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_applications_update ON public.social_aid_applications;
CREATE TRIGGER audit_applications_update
  AFTER UPDATE ON public.social_aid_applications
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_applications_delete ON public.social_aid_applications;
CREATE TRIGGER audit_applications_delete
  AFTER DELETE ON public.social_aid_applications
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Payments table triggers
DROP TRIGGER IF EXISTS audit_payments_insert ON public.payments;
CREATE TRIGGER audit_payments_insert
  AFTER INSERT ON public.payments
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_payments_update ON public.payments;
CREATE TRIGGER audit_payments_update
  AFTER UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_payments_delete ON public.payments;
CREATE TRIGGER audit_payments_delete
  AFTER DELETE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Kumbaras table triggers
DROP TRIGGER IF EXISTS audit_kumbaras_insert ON public.kumbaras;
CREATE TRIGGER audit_kumbaras_insert
  AFTER INSERT ON public.kumbaras
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_kumbaras_update ON public.kumbaras;
CREATE TRIGGER audit_kumbaras_update
  AFTER UPDATE ON public.kumbaras
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_kumbaras_delete ON public.kumbaras;
CREATE TRIGGER audit_kumbaras_delete
  AFTER DELETE ON public.kumbaras
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Documents table triggers
DROP TRIGGER IF EXISTS audit_documents_insert ON public.documents;
CREATE TRIGGER audit_documents_insert
  AFTER INSERT ON public.documents
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_documents_update ON public.documents;
CREATE TRIGGER audit_documents_update
  AFTER UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_documents_delete ON public.documents;
CREATE TRIGGER audit_documents_delete
  AFTER DELETE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Users table triggers (for role changes and profile updates)
DROP TRIGGER IF EXISTS audit_users_insert ON public.users;
CREATE TRIGGER audit_users_insert
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_users_update ON public.users;
CREATE TRIGGER audit_users_update
  AFTER UPDATE ON public.users
  FOR EACH ROW 
  WHEN (OLD.role IS DISTINCT FROM NEW.role OR OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION log_audit_event();

DROP TRIGGER IF EXISTS audit_users_delete ON public.users;
CREATE TRIGGER audit_users_delete
  AFTER DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
-- Additional indexes for audit_logs table to improve query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_table ON public.audit_logs(user_id, table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON public.audit_logs(table_name, record_id);

-- =============================================
-- COMMENT
-- =============================================
COMMENT ON FUNCTION log_audit_event() IS 'Automatically logs all INSERT, UPDATE, and DELETE operations on critical tables to audit_logs table. Captures user_id, action type, table name, record_id, and old/new data as JSONB.';
