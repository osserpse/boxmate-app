-- Fix for foreign key constraint issue
-- Run this in your Supabase SQL editor

-- Option 1: Create a test user in auth.users table
-- This creates a test user that matches our mock user ID
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  last_sign_in_at,
  phone,
  phone_confirmed_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'test@boxmate.local',
  '$2a$10$dummy.hash.for.test.user.only',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  NOW(),
  null,
  null,
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Option 2: Alternative - Remove foreign key constraint temporarily
-- Uncomment the lines below if you prefer to remove the constraint instead

-- ALTER TABLE company_settings DROP CONSTRAINT IF EXISTS company_settings_user_id_fkey;
-- ALTER TABLE company_settings ADD CONSTRAINT company_settings_user_id_fkey
--   FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Verify the fix worked
SELECT
  id,
  email,
  created_at
FROM auth.users
WHERE id = '00000000-0000-0000-0000-000000000000';
