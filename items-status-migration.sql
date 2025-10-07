-- Add status and sold_at columns to items table
ALTER TABLE items
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available',
ADD COLUMN IF NOT EXISTS sold_at TIMESTAMP WITH TIME ZONE;

-- Add index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);

-- Update existing items to have 'available' status if they don't have one
UPDATE items SET status = 'available' WHERE status IS NULL;
