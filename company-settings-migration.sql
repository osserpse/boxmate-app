-- Migration script for Company Settings
-- Run this in your Supabase SQL editor to create the company_settings table

-- Create company_settings table
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Foreign key constraint temporarily removed for testing
  -- TODO: Add back foreign key constraint when authentication is implemented:
  -- user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Company Information
  company_description TEXT,

  -- Company Address
  company_name TEXT,
  org_number TEXT,
  street_address TEXT,
  postal_code TEXT,
  city TEXT,

  -- Contact Information
  info_phone TEXT,
  info_email TEXT,
  sales_phone TEXT,
  sales_email TEXT,
  support_phone TEXT,
  support_email TEXT,

  -- Billing Address
  billing_company_name TEXT,
  billing_org_number TEXT,
  billing_email TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to ensure one settings record per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_company_settings_user_id ON company_settings(user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_company_settings_created_at ON company_settings(created_at);
CREATE INDEX IF NOT EXISTS idx_company_settings_updated_at ON company_settings(updated_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- For now, allow public access since authentication isn't implemented yet
-- TODO: Replace with proper user-based policies when authentication is implemented
CREATE POLICY "Allow public access to company settings" ON company_settings
  FOR ALL USING (true) WITH CHECK (true);

-- Future policies (commented out until authentication is implemented):
-- Policy: Users can only see their own company settings
-- CREATE POLICY "Users can view own company settings" ON company_settings
--   FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own company settings
-- CREATE POLICY "Users can insert own company settings" ON company_settings
--   FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own company settings
-- CREATE POLICY "Users can update own company settings" ON company_settings
--   FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own company settings
-- CREATE POLICY "Users can delete own company settings" ON company_settings
--   FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_company_settings_updated_at
  BEFORE UPDATE ON company_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments to document the table structure
COMMENT ON TABLE company_settings IS 'Company settings and contact information for each user';
COMMENT ON COLUMN company_settings.user_id IS 'Reference to the user who owns these settings';
COMMENT ON COLUMN company_settings.company_description IS 'Short description of the company, shown in ads';
COMMENT ON COLUMN company_settings.company_name IS 'Official company name';
COMMENT ON COLUMN company_settings.org_number IS 'Organization number (Swedish: organisationsnummer)';
COMMENT ON COLUMN company_settings.street_address IS 'Street address for deliveries and billing';
COMMENT ON COLUMN company_settings.postal_code IS 'Postal/ZIP code';
COMMENT ON COLUMN company_settings.city IS 'City name';
COMMENT ON COLUMN company_settings.info_phone IS 'General information phone number';
COMMENT ON COLUMN company_settings.info_email IS 'General information email address';
COMMENT ON COLUMN company_settings.sales_phone IS 'Sales department phone number';
COMMENT ON COLUMN company_settings.sales_email IS 'Sales department email address';
COMMENT ON COLUMN company_settings.support_phone IS 'Support department phone number';
COMMENT ON COLUMN company_settings.support_email IS 'Support department email address';
COMMENT ON COLUMN company_settings.billing_company_name IS 'Company name for billing (if different from main company)';
COMMENT ON COLUMN company_settings.billing_org_number IS 'Organization number for billing (if different from main company)';
COMMENT ON COLUMN company_settings.billing_email IS 'Email address for receiving invoice PDFs';

-- Verify the table was created successfully
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'company_settings'
ORDER BY ordinal_position;
