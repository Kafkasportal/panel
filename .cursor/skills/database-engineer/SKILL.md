---
name: database-engineer
description: Database schema, migrations ve data integrity için kullanılır. Supabase, PostgreSQL, migration yönetimi ve query optimization konularında uzman.
---

# Database Engineer Skill

Database schema, migrations ve data integrity.

## When to Use

- Database schema tasarımı yaparken
- Migration yazarken veya düzenlerken
- Database optimization yaparken
- Data integrity constraints eklerken
- Backup ve restore stratejileri oluştururken
- Data seeding yaparken
- Query optimization yaparken
- Supabase RLS policies yazarken

## Instructions

### Görevler
- Database schema design
- Migration management (raw SQL)
- Database optimization
- Data integrity constraints
- Backup ve restore strategies
- Data seeding
- Query optimization
- Supabase RLS policies

### Kurallar
- Database changes migration ile
- Foreign key constraints kullan
- Indexing slow query'ler için
- Data validation database level
- Backup strategy automated
- Migration rollback plan
- RLS policies tüm tablolar için

### Dosya Yapısı

```
supabase/
├── migrations/
│   ├── 20251222_add_beneficiary_relations.sql
│   ├── 20251224_add_documents_table.sql
│   ├── 20251225_change_ids_to_bigint.sql
│   └── ...
├── schema.sql
└── seed.sql
```

### Migration Example

```sql
-- Migration: Add audit logging triggers
-- Created: 2026-01-13

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id BIGINT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_audit_logs_table_record 
  ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created_at 
  ON audit_logs(created_at DESC);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, record_id, action, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), auth.uid());
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply triggers to tables
CREATE TRIGGER members_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON members
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
```

### RLS Policy Example

```sql
-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all members
CREATE POLICY "Members are viewable by authenticated users"
  ON members FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only admins can insert
CREATE POLICY "Only admins can insert members"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Policy: Only admins can update
CREATE POLICY "Only admins can update members"
  ON members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Policy: Only admins can delete
CREATE POLICY "Only admins can delete members"
  ON members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
```

### Query Optimization Example

```sql
-- Before: Slow query without index
SELECT * FROM donations 
WHERE member_id = 123 
ORDER BY created_at DESC;

-- Add index for optimization
CREATE INDEX idx_donations_member_created 
  ON donations(member_id, created_at DESC);

-- Use EXPLAIN ANALYZE to verify
EXPLAIN ANALYZE
SELECT * FROM donations 
WHERE member_id = 123 
ORDER BY created_at DESC;
```

### Seed Data Example

```sql
-- Seed initial data
INSERT INTO settings (key, value, description) VALUES
  ('organization_name', 'KafkasDer', 'Organizasyon adı'),
  ('currency', 'TRY', 'Para birimi'),
  ('timezone', 'Europe/Istanbul', 'Zaman dilimi'),
  ('default_language', 'tr', 'Varsayılan dil')
ON CONFLICT (key) DO NOTHING;

-- Seed sample members for development
INSERT INTO members (name, email, phone, status) VALUES
  ('Ahmet Yılmaz', 'ahmet@example.com', '+905551234567', 'active'),
  ('Mehmet Kaya', 'mehmet@example.com', '+905557654321', 'active'),
  ('Ayşe Demir', 'ayse@example.com', '+905559876543', 'active')
ON CONFLICT DO NOTHING;
```
