-- =============================================
-- MIGRATION: Seed Data for Development
-- =============================================
-- This migration adds seed data for development and testing.
-- DO NOT run this in production!
-- 
-- The seed.sql file contains the actual data.
-- This migration file just ensures seed.sql can be run safely.

-- Note: Seed data should be inserted via seed.sql file
-- This migration file is a placeholder to track seed data in migration history

COMMENT ON TABLE public.members IS 'Üyeler tablosu - Development için seed data mevcut (seed.sql)';
COMMENT ON TABLE public.beneficiaries IS 'İhtiyaç sahipleri tablosu - Development için seed data mevcut (seed.sql)';
COMMENT ON TABLE public.donations IS 'Bağışlar tablosu - Development için seed data mevcut (seed.sql)';
COMMENT ON TABLE public.kumbaras IS 'Kumbaralar tablosu - Development için seed data mevcut (seed.sql)';
COMMENT ON TABLE public.social_aid_applications IS 'Sosyal yardım başvuruları - Development için seed data mevcut (seed.sql)';
COMMENT ON TABLE public.payments IS 'Ödemeler tablosu - Development için seed data mevcut (seed.sql)';
COMMENT ON TABLE public.documents IS 'Dokümanlar tablosu - Development için seed data mevcut (seed.sql)';
