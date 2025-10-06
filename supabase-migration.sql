-- Migration script for BoxMate app
-- Run this in your Supabase SQL editor to add the new fields

-- Add new columns to the items table
ALTER TABLE items
ADD COLUMN IF NOT EXISTS lagerplats TEXT,
ADD COLUMN IF NOT EXISTS lokal TEXT,
ADD COLUMN IF NOT EXISTS hyllplats TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS subcategory TEXT,
ADD COLUMN IF NOT EXISTS condition TEXT;

-- Update existing records to have default values
-- Set default category to 'electronics' for existing items
UPDATE items
SET category = 'electronics'
WHERE category IS NULL;

-- Set default condition to 'good' for existing items
UPDATE items
SET condition = 'good'
WHERE condition IS NULL;

-- Migrate existing location data to lagerplats
-- This assumes your current 'location' column contains the main location
UPDATE items
SET lagerplats = location
WHERE lagerplats IS NULL AND location IS NOT NULL;

-- Add constraints and indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_condition ON items(condition);
CREATE INDEX IF NOT EXISTS idx_items_lagerplats ON items(lagerplats);

-- Add check constraints for category and condition values
ALTER TABLE items
ADD CONSTRAINT check_category
CHECK (category IN ('business', 'electronics', 'other'));

ALTER TABLE items
ADD CONSTRAINT check_condition
CHECK (condition IN ('new', 'excellent', 'good', 'fair', 'broken'));

-- Add check constraint for subcategory (only valid when category is 'electronics')
ALTER TABLE items
ADD CONSTRAINT check_subcategory
CHECK (
  (category = 'electronics' AND subcategory IN ('computers-gaming', 'audio-video', 'phones-accessories'))
  OR
  (category != 'electronics' AND subcategory IS NULL)
);

-- Optional: Add comments to document the new fields
COMMENT ON COLUMN items.lagerplats IS 'Main warehouse/storage location (required)';
COMMENT ON COLUMN items.lokal IS 'Room/area within the warehouse (optional)';
COMMENT ON COLUMN items.hyllplats IS 'Specific shelf position (optional)';
COMMENT ON COLUMN items.category IS 'Item category: business, electronics, or other';
COMMENT ON COLUMN items.subcategory IS 'Subcategory for electronics: computers-gaming, audio-video, phones-accessories';
COMMENT ON COLUMN items.condition IS 'Item condition: new, excellent, good, fair, broken';

-- Verify the migration
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'items'
  AND column_name IN ('lagerplats', 'lokal', 'hyllplats', 'category', 'subcategory', 'condition')
ORDER BY column_name;
