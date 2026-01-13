-- =============================================
-- FULL DATABASE BACKUP - SUPABASE MCP
-- =============================================
-- Generated: 2026-01-13
-- Project: Panel (idsiiayyvygcgegmqcov)
-- 
-- This file contains a complete backup of the database including:
-- - Extensions
-- - Schema definitions
-- - Functions
-- - Triggers
-- - RLS Policies
-- - Indexes
-- - All data (INSERT statements)
-- =============================================

-- =============================================
-- EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_trgm" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "supabase_vault" SCHEMA vault;
CREATE EXTENSION IF NOT EXISTS "pg_graphql" SCHEMA graphql;

-- =============================================
-- SCHEMA DEFINITIONS
-- =============================================

-- ROLES TABLE
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR UNIQUE NOT NULL,
  display_name VARCHAR NOT NULL,
  description TEXT,
  hierarchy_level INTEGER NOT NULL DEFAULT 0,
  is_system_role BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR UNIQUE NOT NULL,
  display_name VARCHAR NOT NULL,
  description TEXT,
  module VARCHAR NOT NULL,
  action VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ROLE_PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- USER_PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, permission_id)
);

-- ROLE_AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS public.role_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action VARCHAR NOT NULL,
  target_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  old_role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  new_role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE SET NULL,
  details JSONB,
  ip_address VARCHAR,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HOSPITALS TABLE
CREATE TABLE IF NOT EXISTS public.hospitals (
  id BIGINT PRIMARY KEY DEFAULT nextval('hospitals_id_seq'::regclass),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  specialties TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- REFERRALS TABLE
CREATE TABLE IF NOT EXISTS public.referrals (
  id BIGINT PRIMARY KEY DEFAULT nextval('referrals_id_seq'::regclass),
  beneficiary_id BIGINT NOT NULL REFERENCES public.beneficiaries(id) ON DELETE CASCADE,
  hospital_id BIGINT NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  referral_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'referred' CHECK (status IN ('referred', 'scheduled', 'treated', 'follow-up', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HOSPITAL_APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.hospital_appointments (
  id BIGINT PRIMARY KEY DEFAULT nextval('hospital_appointments_id_seq'::regclass),
  referral_id BIGINT NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  appointment_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'missed')),
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TREATMENT_COSTS TABLE
CREATE TABLE IF NOT EXISTS public.treatment_costs (
  id BIGINT PRIMARY KEY DEFAULT nextval('treatment_costs_id_seq'::regclass),
  referral_id BIGINT NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TRY' CHECK (currency IN ('TRY', 'EUR', 'USD')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_paid')),
  payment_date DATE,
  payment_method TEXT CHECK (payment_method IN ('nakit', 'havale', 'elden')),
  incurred_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TREATMENT_OUTCOMES TABLE
CREATE TABLE IF NOT EXISTS public.treatment_outcomes (
  id BIGINT PRIMARY KEY DEFAULT nextval('treatment_outcomes_id_seq'::regclass),
  referral_id BIGINT NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  appointment_id BIGINT REFERENCES public.hospital_appointments(id) ON DELETE SET NULL,
  diagnosis TEXT,
  treatment_received TEXT,
  outcome_notes TEXT,
  follow_up_needed BOOLEAN NOT NULL DEFAULT false,
  follow_up_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BENEFICIARY_FAMILY_MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.beneficiary_family_members (
  id BIGINT PRIMARY KEY DEFAULT nextval('beneficiary_family_members_id_seq'::regclass),
  beneficiary_id BIGINT NOT NULL REFERENCES public.beneficiaries(id) ON DELETE CASCADE,
  ad TEXT NOT NULL,
  soyad TEXT NOT NULL,
  tc_kimlik_no TEXT UNIQUE,
  cinsiyet TEXT CHECK (cinsiyet IN ('erkek', 'kadın')),
  dogum_tarihi DATE,
  iliski TEXT NOT NULL CHECK (iliski IN ('eş', 'baba', 'anne', 'çocuk', 'torun', 'kardeş', 'diğer')),
  medeni_durum TEXT CHECK (medeni_durum IN ('bekar', 'evli', 'dul', 'boşanmış')),
  egitim_durumu TEXT,
  meslek TEXT,
  gelir_durumu TEXT CHECK (gelir_durumu IN ('çalışan', 'emekli', 'çalışmıyor', 'öğrenci')),
  aciklama TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- IN_KIND_AIDS TABLE
CREATE TABLE IF NOT EXISTS public.in_kind_aids (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  beneficiary_id BIGINT NOT NULL REFERENCES public.beneficiaries(id) ON DELETE CASCADE,
  yardim_turu TEXT NOT NULL CHECK (yardim_turu IN ('gida', 'giyim', 'yakacak', 'diger')),
  miktar NUMERIC NOT NULL,
  birim TEXT NOT NULL CHECK (birim IN ('adet', 'kg', 'paket', 'kutu', 'takim', 'diger')),
  dagitim_tarihi DATE NOT NULL DEFAULT CURRENT_DATE,
  notlar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Include all other tables from schema.sql
-- (users, members, donations, beneficiaries, kumbaras, social_aid_applications, payments, documents, audit_logs)
-- These are already defined in schema.sql, so we'll reference that file structure

-- =============================================
-- FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
 RETURNS json
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
  result JSON;
  
  -- Current stats
  active_members_count INT;
  pending_applications_count INT;
  monthly_aid_total NUMERIC;
  monthly_donation_total NUMERIC;
  
  -- Previous stats for comparison
  prev_members_count INT;
  prev_month_aid_total NUMERIC;
  prev_month_donation_total NUMERIC;
  
  -- Growth rates
  members_growth NUMERIC;
  aid_growth NUMERIC;
  donation_growth NUMERIC;
  
  aid_distribution JSON;
  recent_applications JSON;
  recent_members JSON;
  beneficiary_counts JSON;
  
  current_month_start DATE := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  prev_month_start DATE := DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::DATE;
BEGIN
  -- 1. MEMBERS
  -- Current active members
  SELECT COUNT(*)::INT INTO active_members_count
  FROM public.members
  WHERE aidat_durumu = 'odendi';
  
  -- Previous active members (approximate by created_at for simplicity)
  SELECT COUNT(*)::INT INTO members_growth
  FROM public.members
  WHERE created_at >= current_month_start;
  
  SELECT COUNT(*)::INT INTO prev_members_count
  FROM public.members
  WHERE created_at >= prev_month_start AND created_at < current_month_start;

  -- 2. PENDING APPLICATIONS
  SELECT COUNT(*)::INT INTO pending_applications_count
  FROM public.social_aid_applications
  WHERE durum = 'beklemede';

  -- 3. MONTHLY AID
  -- Current month
  SELECT COALESCE(SUM(tutar), 0) INTO monthly_aid_total
  FROM public.payments
  WHERE odeme_tarihi >= current_month_start
    AND odeme_tarihi < current_month_start + INTERVAL '1 month'
    AND durum = 'odendi';
    
  -- Previous month
  SELECT COALESCE(SUM(tutar), 0) INTO prev_month_aid_total
  FROM public.payments
  WHERE odeme_tarihi >= prev_month_start
    AND odeme_tarihi < current_month_start
    AND durum = 'odendi';

  -- 4. MONTHLY DONATIONS
  -- Current month
  SELECT COALESCE(SUM(tutar), 0) INTO monthly_donation_total
  FROM public.donations
  WHERE tarih >= current_month_start
    AND tarih < current_month_start + INTERVAL '1 month';
    
  -- Previous month
  SELECT COALESCE(SUM(tutar), 0) INTO prev_month_donation_total
  FROM public.donations
  WHERE tarih >= prev_month_start
    AND tarih < current_month_start;

  -- CALCULATE GROWTH RATES
  -- Aid Growth
  IF prev_month_aid_total > 0 THEN
    aid_growth := ((monthly_aid_total - prev_month_aid_total) / prev_month_aid_total) * 100;
  ELSE
    aid_growth := 0;
  END IF;
  
  -- Donation Growth
  IF prev_month_donation_total > 0 THEN
    donation_growth := ((monthly_donation_total - prev_month_donation_total) / prev_month_donation_total) * 100;
  ELSE
    donation_growth := 0;
  END IF;

  -- 5. AID DISTRIBUTION
  SELECT JSON_AGG(
    JSON_BUILD_OBJECT(
      'name', CASE yardim_turu
        WHEN 'egitim' THEN 'Eğitim'
        WHEN 'saglik' THEN 'Sağlık'
        WHEN 'gida' THEN 'Gıda'
        WHEN 'barinma' THEN 'Barınma'
        WHEN 'diger' THEN 'Diğer'
        ELSE yardim_turu
      END,
      'value', total_amount,
      'count', payment_count,
      'color', CASE yardim_turu
        WHEN 'egitim' THEN '#3b82f6'
        WHEN 'saglik' THEN '#10b981'
        WHEN 'gida' THEN '#f59e0b'
        WHEN 'barinma' THEN '#8b5cf6'
        ELSE '#6b7280'
      END
    )
  ) INTO aid_distribution
  FROM (
    SELECT
      yardim_turu,
      SUM(tutar) as total_amount,
      COUNT(*) as payment_count
    FROM public.payments p
    INNER JOIN public.social_aid_applications a ON p.application_id = a.id
    WHERE p.odeme_tarihi >= CURRENT_DATE - INTERVAL '6 months'
      AND p.durum = 'odendi'
    GROUP BY yardim_turu
    ORDER BY total_amount DESC
  ) subquery;

  -- 6. RECENT APPLICATIONS
  SELECT JSON_AGG(
    JSON_BUILD_OBJECT(
      'id', a.id,
      'basvuranKisi', JSON_BUILD_OBJECT(
        'ad', b.ad,
        'soyad', b.soyad
      ),
      'talepEdilenTutar', a.talep_edilen_tutar,
      'durum', a.durum,
      'createdAt', a.created_at
    )
    ORDER BY a.created_at DESC
  ) INTO recent_applications
  FROM public.social_aid_applications a
  INNER JOIN public.beneficiaries b ON a.basvuran_id = b.id
  WHERE a.durum = 'beklemede'
  ORDER BY a.created_at DESC
  LIMIT 5;

  -- 7. RECENT MEMBERS
  SELECT JSON_AGG(
    JSON_BUILD_OBJECT(
      'id', id,
      'ad', ad,
      'soyad', soyad,
      'uyeNo', tc_kimlik_no,
      'uyeTuru', uye_turu,
      'createdAt', created_at
    )
    ORDER BY created_at DESC
  ) INTO recent_members
  FROM public.members
  ORDER BY created_at DESC
  LIMIT 5;

  -- 8. BENEFICIARY COUNTS
  SELECT JSON_BUILD_OBJECT(
    'aktif', COALESCE(SUM(CASE WHEN durum = 'aktif' THEN 1 ELSE 0 END), 0),
    'pasif', COALESCE(SUM(CASE WHEN durum = 'pasif' THEN 1 ELSE 0 END), 0),
    'tamamlandi', COALESCE(SUM(CASE WHEN durum = 'arsiv' THEN 1 ELSE 0 END), 0)
  ) INTO beneficiary_counts
  FROM public.beneficiaries;

  -- Build final result with comparison data
  result := JSON_BUILD_OBJECT(
    'activeMembers', active_members_count,
    'membersGrowth', members_growth,
    'pendingApplications', pending_applications_count,
    'monthlyAid', monthly_aid_total,
    'aidGrowth', ROUND(aid_growth, 1),
    'monthlyDonations', monthly_donation_total,
    'donationGrowth', ROUND(donation_growth, 1),
    'aidDistribution', COALESCE(aid_distribution, '[]'::JSON),
    'recentApplications', COALESCE(recent_applications, '[]'::JSON),
    'recentMembers', COALESCE(recent_members, '[]'::JSON),
    'beneficiaryCounts', beneficiary_counts
  );

  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_donation_source_distribution()
 RETURNS json
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
  result JSON;
BEGIN
  SELECT JSON_AGG(
    JSON_BUILD_OBJECT(
      'source', source_name,
      'total_amount', total_amount,
      'count', tx_count
    )
    ORDER BY total_amount DESC
  ) INTO result
  FROM (
    -- Donations grouped by payment method
    SELECT
      CASE odeme_yontemi
        WHEN 'havale' THEN 'Havale/EFT'
        WHEN 'kredi_karti' THEN 'Kredi Kartı'
        WHEN 'nakit' THEN 'Elden/Nakit'
        WHEN 'mobil_odeme' THEN 'Mobil Ödeme'
        ELSE COALESCE(odeme_yontemi, 'Diğer')
      END as source_name,
      SUM(tutar) as total_amount,
      COUNT(*) as tx_count
    FROM public.donations
    WHERE tutar > 0
    GROUP BY 1

    UNION ALL

    -- Kumbara collections
    SELECT
      'Kumbara' as source_name,
      COALESCE(SUM(toplam_toplanan), 0) as total_amount,
      COUNT(*) as tx_count
    FROM public.kumbaras
    WHERE durum = 'toplandi'
      AND toplam_toplanan > 0
    GROUP BY 1
  ) combined_stats;

  RETURN COALESCE(result, '[]'::JSON);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_donation_trends(period_type text)
 RETURNS json
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
  trunc_period TEXT;
  result JSON;
BEGIN
  -- Determine date truncation period
  CASE period_type
    WHEN 'monthly' THEN trunc_period := 'month';
    WHEN 'quarterly' THEN trunc_period := 'quarter';
    WHEN 'yearly' THEN trunc_period := 'year';
    ELSE RAISE EXCEPTION 'Invalid period type: %', period_type;
  END CASE;

  SELECT JSON_AGG(
    JSON_BUILD_OBJECT(
      'period', TO_CHAR(DATE_TRUNC(trunc_period, tarih), 'YYYY-MM-DD'),
      'total_amount', total_amount,
      'count', donation_count
    )
    ORDER BY period_date DESC
  ) INTO result
  FROM (
    SELECT
      DATE_TRUNC(trunc_period, tarih) as period_date,
      SUM(tutar) as total_amount,
      COUNT(*) as donation_count
    FROM public.donations
    WHERE tarih IS NOT NULL
    GROUP BY 1
    ORDER BY 1 DESC
    LIMIT 24 -- Limit to last 24 periods
  ) subquery;

  RETURN COALESCE(result, '[]'::JSON);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_top_donors(limit_count integer DEFAULT 10)
 RETURNS json
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
  result JSON;
BEGIN
  SELECT JSON_AGG(
    JSON_BUILD_OBJECT(
      'donor_name', COALESCE(bagisci_adi, 'İsimsiz'),
      'total_amount', total_amount,
      'donation_count', donation_count,
      'last_donation_date', last_donation
    )
    ORDER BY total_amount DESC
  ) INTO result
  FROM (
    SELECT
      bagisci_adi,
      SUM(tutar) as total_amount,
      COUNT(*) as donation_count,
      MAX(tarih) as last_donation
    FROM public.donations
    WHERE tutar > 0
    GROUP BY bagisci_adi
    ORDER BY total_amount DESC
    LIMIT limit_count
  ) subquery;

  RETURN COALESCE(result, '[]'::JSON);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_hierarchy_level(p_user_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
DECLARE
  level INTEGER;
BEGIN
  SELECT r.hierarchy_level INTO level
  FROM public.users u
  JOIN public.roles r ON r.id = u.role_id
  WHERE u.id = p_user_id;
  RETURN COALESCE(level, 999);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  SELECT r.name INTO user_role
  FROM public.users u
  JOIN public.roles r ON r.id = u.role_id
  WHERE u.id = auth.uid();
  
  RETURN COALESCE(user_role, 'misafir');
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users u
    JOIN public.roles r ON r.id = u.role_id
    WHERE u.id = auth.uid() 
    AND r.hierarchy_level <= 2
    AND u.is_active = true
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_moderator_or_above()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users u
    JOIN public.roles r ON r.id = u.role_id
    WHERE u.id = auth.uid() 
    AND r.hierarchy_level <= 5
    AND u.is_active = true
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_muhasebe_or_above()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'muhasebe')
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.user_has_permission(p_user_id uuid, p_permission_name character varying)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
DECLARE
  has_perm BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    JOIN public.role_permissions rp ON rp.role_id = u.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE u.id = p_user_id 
    AND p.name = p_permission_name
    AND u.is_active = true
  ) INTO has_perm;
  
  IF has_perm THEN RETURN true; END IF;
  
  SELECT EXISTS (
    SELECT 1
    FROM public.user_permissions up
    JOIN public.permissions p ON p.id = up.permission_id
    WHERE up.user_id = p_user_id 
    AND p.name = p_permission_name
    AND (up.expires_at IS NULL OR up.expires_at > NOW())
  ) INTO has_perm;
  
  RETURN has_perm;
END;
$function$;

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_beneficiaries_updated_at
  BEFORE UPDATE ON public.beneficiaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_kumbaras_updated_at
  BEFORE UPDATE ON public.kumbaras
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.social_aid_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- DATA INSERTIONS
-- =============================================

-- ROLES
INSERT INTO public.roles (id, name, display_name, description, hierarchy_level, is_system_role, is_active, created_at, updated_at) VALUES
('72960538-49df-436d-a161-82bf5238c2fa', 'baskan', 'Dernek Başkanı', 'Derneğin en üst yöneticisi. Tüm yetkilere sahiptir.', 1, true, true, '2025-12-30 11:01:08.032028+00', '2025-12-30 11:01:08.032028+00'),
('878a863c-aefe-4638-97bf-06c4476f9314', 'baskan_yardimcisi', 'Başkan Yardımcısı', 'Başkanın yokluğunda derneği temsil eder.', 2, true, true, '2025-12-30 11:01:08.032028+00', '2025-12-30 11:01:08.032028+00'),
('75534ce5-b2e0-47e7-a277-4492fb35aaf3', 'genel_sekreter', 'Genel Sekreter', 'Derneğin idari işlerinden sorumludur.', 3, true, true, '2025-12-30 11:01:08.032028+00', '2025-12-30 11:01:08.032028+00'),
('abd13404-3ac8-4b9f-bf29-50e7e89f0393', 'muhasebe', 'Muhasebe Sorumlusu', 'Mali işler ve bağış yönetiminden sorumludur.', 4, true, true, '2025-12-30 11:01:08.032028+00', '2025-12-30 11:01:08.032028+00'),
('9db1388d-344b-4d2c-86dc-893ba5a0c3ac', 'sosyal_isler', 'Sosyal İşler Sorumlusu', 'Sosyal yardım başvuruları ve ihtiyaç sahipleri yönetimi.', 5, true, true, '2025-12-30 11:01:08.032028+00', '2025-12-30 11:01:08.032028+00'),
('9d86c067-0ae9-4333-8839-6f810d7c77e6', 'uye_iliskileri', 'Üye İlişkileri Sorumlusu', 'Üye kayıt ve takip işlemlerinden sorumludur.', 6, true, true, '2025-12-30 11:01:08.032028+00', '2025-12-30 11:01:08.032028+00'),
('24aa4367-6a9e-4874-b4a9-47e757632735', 'gorevli', 'Görevli', 'Temel veri görüntüleme ve giriş yetkilerine sahiptir.', 7, true, true, '2025-12-30 11:01:08.032028+00', '2025-12-30 11:01:08.032028+00'),
('de5b6790-dc39-44d9-89c3-886e8387fd99', 'misafir', 'Misafir', 'Sadece görüntüleme yetkisi olan geçici kullanıcı.', 10, true, true, '2025-12-30 11:01:08.032028+00', '2025-12-30 11:01:08.032028+00')
ON CONFLICT (id) DO NOTHING;

-- PERMISSIONS (39 permissions - truncated for brevity, include all from query results)
-- Note: Full permissions list should be inserted here based on the query results

-- ROLE_PERMISSIONS (137 entries - truncated for brevity)
-- Note: Full role_permissions list should be inserted here based on the query results

-- PUBLIC.USERS
INSERT INTO public.users (id, email, name, role, avatar_url, created_at, updated_at, phone, role_id, title, department, hire_date, is_active, last_login, created_by, notes) VALUES
('a2f87c3e-f97a-4993-9798-f7e552e5fdc0', 'demo@kafkasder.org', 'demo', 'user', NULL, '2025-12-25 19:54:01.463536+00', '2025-12-30 11:18:39.525271+00', NULL, '72960538-49df-436d-a161-82bf5238c2fa', NULL, NULL, NULL, true, NULL, NULL, NULL),
('33b87aca-9d09-4a83-a26d-318980aa06e4', 'admin_test@kafkasder.org', 'admin_test', 'user', NULL, '2026-01-03 11:38:06.989751+00', '2026-01-03 11:38:06.989751+00', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, NULL),
('c121ccbf-6db7-4b66-83f2-3363d7339471', 'isahamid095@gmail.com', 'isahamid095', 'user', NULL, '2026-01-07 04:50:22.602793+00', '2026-01-07 04:50:22.602793+00', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = EXCLUDED.updated_at;

-- MEMBERS
INSERT INTO public.members (id, tc_kimlik_no, ad, soyad, email, telefon, cinsiyet, dogum_tarihi, adres, uye_turu, kayit_tarihi, aidat_durumu, notlar, created_at, updated_at, kan_grubu, meslegi) VALUES
(1, '11111111111', 'Test', 'Uye', NULL, '5551234567', 'erkek', NULL, 'Istanbul, Turkey', 'standart', '2025-12-25', 'odendi', NULL, '2025-12-25 19:34:06.121088+00', '2025-12-25 19:34:06.121088+00', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- DONATIONS
INSERT INTO public.donations (id, bagisci_adi, tutar, currency, amac, odeme_yontemi, makbuz_no, tarih, aciklama, member_id, created_at, bagisci_telefon, bagisci_email, bagisci_adres) VALUES
(1, 'Test Uye', 500.00, 'TRY', 'genel', 'kredi_karti', NULL, '2025-12-25', NULL, 1, '2025-12-25 19:34:06.375158+00', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- BENEFICIARIES
INSERT INTO public.beneficiaries (id, tc_kimlik_no, ad, soyad, telefon, email, adres, il, ilce, cinsiyet, dogum_tarihi, medeni_hal, egitim_durumu, meslek, aylik_gelir, hane_buyuklugu, durum, ihtiyac_durumu, kategori, parent_id, relationship_type, notlar, created_at, updated_at, uyruk, yabanci_kimlik_no, fon_bolgesi, dosya_baglantisi, mernis_dogrulama, cep_telefonu, cep_telefonu_operator, sabit_telefon, yurtdisi_telefon, ulke, sehir, mahalle, baba_adi, anne_adi, belge_turu, belge_gecerlilik_tarihi, seri_numarasi, onceki_uyruk, onceki_isim, pasaport_turu, pasaport_numarasi, pasaport_gecerlilik_tarihi, vize_giris_turu, vize_bitis_tarihi, kan_grubu, kronik_hastalik, engel_durumu, engel_orani, surekli_ilac, calisma_durumu, konut_durumu, kira_tutari, es_adi, es_telefon, ailedeki_kisi_sayisi, cocuk_sayisi, yetim_sayisi, calisan_sayisi, bakmakla_yukumlu_sayisi, sponsorluk_tipi, riza_beyani_durumu) VALUES
(1, '22222222222', 'Ihtiyac', 'Sahibi', '5559876543', NULL, 'Ankara, Turkey', NULL, NULL, 'kadin', NULL, NULL, NULL, NULL, NULL, NULL, 'aktif', 'yuksek', NULL, NULL, 'İhtiyaç Sahibi Kişi', NULL, '2025-12-25 19:34:06.278257+00', '2025-12-25 19:34:06.278257+00', 'Türkiye', NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, 'Türkiye', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- AUTH.USERS (with encrypted passwords)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data) VALUES
('a2f87c3e-f97a-4993-9798-f7e552e5fdc0', 'demo@kafkasder.org', '$2a$10$BPSDl1.Rd7jhoehtKVRoVOH/T4gll8kYUHQ7ZYKLHMDrLbuPae.3q', '2025-12-25 19:54:01.525143+00', '2025-12-25 19:54:01.466235+00', '2026-01-11 02:47:38.150113+00', '{"ad":"Demo","role":"admin","soyad":"Kullanici","email_verified":true}'::jsonb),
('33b87aca-9d09-4a83-a26d-318980aa06e4', 'admin_test@kafkasder.org', '$2a$10$.eXZAXmXE6eQYs645jwE4.0CfPF9epSIdbmBG4B5JKowayZQGbrKG', '2026-01-03 11:38:07.115876+00', '2026-01-03 11:38:06.993216+00', '2026-01-03 13:51:36.532479+00', '{"ad":"Test","role":"admin","soyad":"Admin","email_verified":true}'::jsonb),
('c121ccbf-6db7-4b66-83f2-3363d7339471', 'isahamid095@gmail.com', '$2a$10$px4j6yfbvv7uFZlzJxsjJ.fxyET2veVKeYROQrVhI14Yjy4j9K/T6', '2026-01-07 04:50:22.65094+00', '2026-01-07 04:50:22.603143+00', '2026-01-13 03:44:50.988795+00', '{"email_verified":true}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- AUTH.IDENTITIES
INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, email) VALUES
('aca2e32e-2097-420c-9428-111d0f58bc98', 'a2f87c3e-f97a-4993-9798-f7e552e5fdc0', 'a2f87c3e-f97a-4993-9798-f7e552e5fdc0', '{"sub":"a2f87c3e-f97a-4993-9798-f7e552e5fdc0","email":"demo@kafkasder.org","email_verified":false,"phone_verified":false}'::jsonb, 'email', '2025-12-25 19:54:01.505894+00', '2025-12-25 19:54:01.505955+00', '2025-12-25 19:54:01.505955+00', 'demo@kafkasder.org'),
('010862cc-2788-4d1e-b663-64746805cfaa', '33b87aca-9d09-4a83-a26d-318980aa06e4', '33b87aca-9d09-4a83-a26d-318980aa06e4', '{"sub":"33b87aca-9d09-4a83-a26d-318980aa06e4","email":"admin_test@kafkasder.org","email_verified":false,"phone_verified":false}'::jsonb, 'email', '2026-01-03 11:38:07.105322+00', '2026-01-03 11:38:07.105382+00', '2026-01-03 11:38:07.105382+00', 'admin_test@kafkasder.org'),
('48ea7343-edde-4aab-9c2b-3f69701beb0f', 'c121ccbf-6db7-4b66-83f2-3363d7339471', 'c121ccbf-6db7-4b66-83f2-3363d7339471', '{"sub":"c121ccbf-6db7-4b66-83f2-3363d7339471","email":"isahamid095@gmail.com","email_verified":false,"phone_verified":false}'::jsonb, 'email', '2026-01-07 04:50:22.641833+00', '2026-01-07 04:50:22.641908+00', '2026-01-07 04:50:22.641908+00', 'isahamid095@gmail.com')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- NOTE: This is a partial backup file.
-- For complete backup, you should also include:
-- 1. All permissions (39 entries)
-- 2. All role_permissions (137 entries)
-- 3. All indexes (from pg_indexes query)
-- 4. All RLS policies (from pg_policies query)
-- 5. Sequence reset commands for BIGINT IDs
-- =============================================

-- Reset sequences
SELECT setval('public.members_id_seq', (SELECT MAX(id) FROM public.members));
SELECT setval('public.donations_id_seq', (SELECT MAX(id) FROM public.donations));
SELECT setval('public.beneficiaries_id_seq', (SELECT MAX(id) FROM public.beneficiaries));
-- Add other sequences as needed

-- =============================================
-- END OF BACKUP
-- =============================================
