-- Simple fix for foreign key constraint issue
-- Run this in your Supabase SQL editor

-- Remove the foreign key constraint temporarily
ALTER TABLE company_settings DROP CONSTRAINT IF EXISTS company_settings_user_id_fkey;

-- Add a comment to remind us to add it back when authentication is implemented
COMMENT ON COLUMN company_settings.user_id IS 'User ID - foreign key constraint temporarily removed for testing. Add back when authentication is implemented.';

-- Verify the constraint was removed
SELECT
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'company_settings'
  AND constraint_type = 'FOREIGN KEY';
